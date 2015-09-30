<?php
/**
 * Access check callback for connection resource.
 */
function mybrary_service_connection_resource_access($op = 'view', $args = array()) {
    global $user;

    switch ($op) {
        case 'invite':
        case 'request-to-add':
        case 'response-to-add':
        case 'list':
        case 'view':
        default:
            return user_is_logged_in();
    }
}

/**
 * Callback for for transaction resource.
 * Invite
 *
 * @return array
 */
function mybrary_service_connection_invite ($data)
{
    $response = array();
    
    switch ($data['channel']) {
        case 'facebook':
            $response = mybrary_service_connection_invite_facebook($data);
            break;
        case 'email':
            $response = services_error(t('Channel [@channel] is not implemented.', array('@channel'=>$data['channel'])), 404);
            break;
        default:
            $response = services_error(t('Channel [@channel] is not supported.', array('@channel'=>$data['channel'])), 404);
            break;
    }
    
    return $response;
}

function mybrary_service_connection_invite_facebook ($data)
{
    global $user;
    
    $response = array(
        'status' => 'error',
        'message' => t('Oops! Something goes wrong.')
    );
    
    $access_token = $_SESSION['fboauth']['access_token'];
    if ($access_token) {
        module_load_include('inc', 'fboauth', 'includes/fboauth.fboauth');
        
        $params = array(
            'link' => url('', array('absolute' => TRUE)),
            //@TODO replace below default picture
            'picture' => 'http://backend.global-initiative.com/sites/backend.global-initiative.com/files/field/image/Cornerstone.jpg',
            'name' => t('Join me now!'),
            'caption' => variable_get('site_name'),
            'description' => (isset($data['message']) ? $data['message']
                     : t('Just updated my personal DIY tools inventory to share among friends.')),
            'privacy' => array (
                 'value' => 'ALL_FRIENDS'
             )
        );
        
        $fbResponse = fboauth_graph_query('me/feed', $access_token, $params, 'POST');
        
        if (!empty($fbResponse)) {
            if (!empty($fbResponse->id)) {
                $response['status'] = 'success';
                $response['message'] = t('Successfully posted on facebook. Please wait for more friends to join you.');
            } elseif (!empty($fbResponse->error)) {
                $response['message'] = $fbResponse->error->message;
            }
        }
        $response['data'] = $fbResponse;
        
    } else {
        $response = services_error(t('Facebook access token is missing.'), 404);
    }
    
    return $response;
}


/**
 * Callback for for connection resource.
 * List
 *
 * @return array
 */
function mybrary_service_connection_list ($data)
{
    global $user;
    global $base_path;
    
    $response = NULL;
    
    if (empty($data)) {
        $data = array(
            'uid' => $user->uid
        ); 
    }
    
    $relationship = 'frd';
    $requestedToAdd = array();
    // convert to friends ids to get fof
    if ($data['uid'] == 'frd') {
        $a=1;
        $data['uid'] = _mybrary_user_get_friends($user->uid);
        if (empty($data['uid'])) {
            $data['uid'] = array(0);
        }
        $relationship = 'fof';
    }
    
    if (empty($data['status'])) {
        $data['status'] = array(MYBRARY_USER_RELATIONSHIP_STATUS_CONFIRMED); 
    }
    
    try {
        $query = db_select('mybrary_user_net', 'n');
        $query->join('users', 'u', 'n.uid_to = u.uid');
        $query->join('mybrary_user_ext', 'e', 'e.uid = u.uid');
        $query->leftJoin('file_managed', 'f', 'u.picture = f.fid');
        $query->fields('u', array('uid', 'name'));
        $query->addField('e', 'ext_id', 'externalId');
        $query->addField('e', 'ext_name', 'externalName');
        $query->addField('e', 'type', 'externalType');
        $query->addField('f', 'uri', 'pictureUri');
        $query->condition('n.uid_from', $data['uid']);
        $query->condition('n.status', $data['status']);
        
        if ($relationship == 'fof') {
            $query->leftjoin('mybrary_user_net', 'req', 'req.uid_from = :uid and req.uid_to = n.uid_to and req.status = :status', array(':uid'=>$user->uid, ':status'=>MYBRARY_USER_RELATIONSHIP_STATUS_REQUESTED));
            $query->leftjoin('mybrary_user_net', 'res', 'res.uid_from = n.uid_to and res.uid_to = :uid and res.status = :status', array(':uid'=>$user->uid, ':status'=>MYBRARY_USER_RELATIONSHIP_STATUS_REQUESTED));
            $query->addField('req', 'status', 'req_status');
            $query->addField('res', 'status', 'res_status');
        }
        
        $dbResult = $query->execute();
        
        $response = array();
        while ($row = $dbResult->fetchAssoc()) {
            $row['pictureUrl'] = ($row['pictureUri'] ? file_create_url($row['pictureUri'])
                        : $base_path . drupal_get_path('theme', 'mybrary') . '/images/unknown-user.png');
            $row['relationship'] = $relationship;
            if (in_array($row['uid'], $requestedToAdd)) {
                $row['requestToAdd'] = TRUE;
            }
            
            $response[$row['uid']] = $row;
        }
    } catch (Exception $e) {
        watchdog('mybrary_service_connection',
                'Connection list error  [' . $e->getCode() . '] ' .
                $e->getMessage(), NULL, WATCHDOG_ERROR);
        $response = services_error($e->getMessage(), 500);
    }
    
    return $response;
}

/**
 * Callback for for connection resource.
 * request to add
 *
 * @return array
 */
function mybrary_service_connection_request_to_add ($data)
{
    global $user;

    $response = array(
            'status' => 'error',
            'message' => t('Oops! Something goes wrong.')
    );

    // check required fields
    $errors = array();
    if (empty($data['uid'])) {
        $errors[] = t('User Id is missing');
    }
    
    if (empty($errors)) {
        // double check relationship
        $myFriends = _mybrary_user_get_friends($user->uid);
        $yourFriends = _mybrary_user_get_friends($data['uid']);
    
        if (in_array($data['uid'], $myFriends)) {
            $errors[] = t('The user has already been your friend');
        }
    
        $common = array_intersect($myFriends, $yourFriends);
        if (empty($common)) {
            $errors[] = t('No common friends between you two.');
        }
    }

    if (empty($errors)) {
        try {
            // break any existing connection or request
            $dbResult = db_delete('mybrary_user_net')
            ->condition('uid_from', $user->uid)
            ->condition('uid_to', $data['uid'])
            ->execute();
        
            $dbResult = db_delete('mybrary_user_net')
            ->condition('uid_from', $data['uid'])
            ->condition('uid_to', $user->uid)
            ->execute();
                
            // insert request
            $dbResult = db_insert('mybrary_user_net')->fields(
                    array(
                            'uid_from' => $user->uid,
                            'uid_to' => $data['uid'],
                            'status' => MYBRARY_USER_RELATIONSHIP_STATUS_REQUESTED,
                            'update_timestamp' => time()
                    ))->execute();
            
            // add notification
            $notificationUidTo = $data['uid'];
            $notificationTitle  = t('Requested to add friend');
            $notificationBody = $notificationTitle;
            $notificationUri = json_encode(array('state' =>'connection-view', 'params' => array ('uid'=>$user->uid)));
            _mybrary_notification_add ($notificationUidTo, $notificationTitle, $notificationBody, $notificationUri);

            $response = array(
                    'status' => 'success',
                    'message' => t('Request sent successfully')
            );
        } catch (Exception $e) {
            watchdog('mybrary_service_connection',
                    'Connection request to add error  [' . $e->getCode() . '] ' .
                    $e->getMessage(), NULL, WATCHDOG_ERROR);
            $response = services_error($e->getMessage(), 500);
        }

    } else {
        $response['message'] = implode("; ", $errors);
    }

    return $response;
}

/**
 * Callback for for connection resource.
 * request to add
 *
 * @return array
 */
function mybrary_service_connection_response_to_add ($data)
{
    global $user;

    $response = array(
            'status' => 'error',
            'message' => t('Oops! Something goes wrong.')
    );

    // check required fields
    $errors = array();
    if (empty($data['uid'])) {
        $errors[] = t('User Id is missing');
    }

    if (empty($data['status']) || !in_array($data['status'], array(MYBRARY_USER_RELATIONSHIP_STATUS_CONFIRMED, MYBRARY_USER_RELATIONSHIP_STATUS_REJECTED))) {
        $errors[] = t('Status is missing or invalid');
    }

    if (empty($errors)) {
        // double check relationship
        $myFriends = _mybrary_user_get_friends($user->uid);
        $yourFriends = _mybrary_user_get_friends($data['uid']);
    
        if (in_array($data['uid'], $myFriends)) {
            $errors[] = t('The user has already been your friend');
        }
    
        $common = array_intersect($myFriends, $yourFriends);
        if (empty($common)) {
            $errors[] = t('No common friends between you two.');
        }
    }

    if (empty($errors)) {
        try {
            // check existing
            $dbResult = db_select('mybrary_user_net', 'n')
            ->fields('n', array('uid_from', 'uid_to'))
            ->condition('n.uid_from', $data['uid'])
            ->condition('n.uid_to', $user->uid)
            ->condition('n.status', MYBRARY_USER_RELATIONSHIP_STATUS_REQUESTED)
            ->range(0, 1)
            ->execute()
            ->rowCount();
            
            if ($dbResult) {
                // found and update request
                $dbResult = db_update('mybrary_user_net')->fields(
                        array(
                                'status' => $data['status'],
                                'update_timestamp' => time()
                        ))
                        ->condition('uid_from', $data['uid'])
                        ->condition('uid_to', $user->uid)
                        ->condition('status', MYBRARY_USER_RELATIONSHIP_STATUS_REQUESTED)
                        ->execute();
                
                // break any existing connection or request
                $dbResult = db_delete('mybrary_user_net')
                ->condition('uid_from', $user->uid)
                ->condition('uid_to', $data['uid'])
                ->execute();
                
                // add bi-direction connection if confirmed
                if ($data['status'] == MYBRARY_USER_RELATIONSHIP_STATUS_CONFIRMED) {
                    $dbResult = db_insert('mybrary_user_net')->fields(
                            array(
                                    'uid_from' => $user->uid,
                                    'uid_to' => $data['uid'],
                                    'status' => $data['status'],
                                    'update_timestamp' => time()
                            ))->execute();
                    $response['message'] = t('Accepted request to add friend');
                } else {
                    $response['message'] = t('Rejected request to add friend');                    
                }
            } else {
                $errors[] = t('No requested to add the user as friend');
            }

            if (empty($errors)) {
                $response['status'] = 'success';
                
                // add notification
                $notificationUidTo = $data['uid'];
                $notificationTitle  = $response['message'];
                $notificationBody = $notificationTitle;
                $notificationUri = json_encode(array('state' =>'connection-view', 'params' => array ('uid'=>$user->uid)));
                _mybrary_notification_add ($notificationUidTo, $notificationTitle, $notificationBody, $notificationUri);
                
            } else {
                $response['message'] = implode("; ", $errors);
            }
        } catch (Exception $e) {
            watchdog('mybrary_service_connection',
                    'Connection request to add error  [' . $e->getCode() . '] ' .
                    $e->getMessage(), NULL, WATCHDOG_ERROR);
            $response = services_error($e->getMessage(), 500);
        }

    } else {
        $response['message'] = implode("; ", $errors);
    }

    return $response;
}

/**
 * Callback for for connection resource.
 * View
 *
 * @return array
 */
function mybrary_service_connection_view ($data)
{
    global $user;
    global $base_path;
    
    $response = NULL;
    
    if (!empty($data['uid'])) {
        try {
            $query = db_select('users', 'u');
            $query->leftJoin('file_managed', 'f', 'u.picture = f.fid');
            $query->fields('u', array('uid', 'name', 'mail', 'created'));
            $query->addField('f', 'uri', 'pictureUri');
            $query->condition('u.uid', $data['uid']);

            $query->leftjoin('mybrary_user_net', 'req', 'req.uid_from = :uid and req.uid_to = u.uid', array(':uid'=>$user->uid));
            $query->leftjoin('mybrary_user_net', 'res', 'res.uid_from = u.uid and res.uid_to = :uid', array(':uid'=>$user->uid));
            $query->addField('req', 'status', 'req_status');
            $query->addField('req', 'update_timestamp', 'req_timestamp');
            $query->addField('res', 'status', 'res_status');
            $query->addField('res', 'update_timestamp', 'res_timestamp');
            
            $dbResult = $query->execute();
            
            while ($row = $dbResult->fetchAssoc()) {
                // should only return single result
                $row['pictureUrl'] = ($row['pictureUri'] ? file_create_url($row['pictureUri'])
                            : $base_path . drupal_get_path('theme', 'mybrary') . '/images/unknown-user.png');

                // determine relationship
                $myFriends = _mybrary_user_get_friends($user->uid);
                $yourFriends = _mybrary_user_get_friends($data['uid']);
                
                $row['isFriend'] = in_array($data['uid'], $myFriends);
                $row['commonFriends'] = array_intersect($myFriends, $yourFriends);
                
                $response = $row;
            }

            // append feedback_as_borrower_summary
            if (!empty($response) && $data['feedback_as_borrower_summary']) {
                $queryStatement = 'select th.uid_borrower as uid,'
                    . ' sum(th.feedback_borrower=:negative) as negative,'
                    . ' sum(th.feedback_borrower=:neutral) as neutral,'
                    . ' sum(th.feedback_borrower=:positive) as positive'
                    . ' from mybrary_transaction_head th where th.feedback_borrower > 0 and th.uid_borrower = :uid group by th.uid_borrower';
                
                $dbResult = db_query($queryStatement, array(
                        ':negative' => MYBRARY_TRANSACTION_FEEDBACK_NEGATIVE,
                        ':neutral' => MYBRARY_TRANSACTION_FEEDBACK_NEUTRAL,
                        ':positive' => MYBRARY_TRANSACTION_FEEDBACK_POSITIVE,
                        ':uid' => $data['uid']
                ));
                
                while ($row = $dbResult->fetchAssoc()) {
                    // should only return single result
                    $response['feedback_as_borrower_summary'] = $row;
                }
            }
            
            // append feedback_as_borrower
            if (!empty($response) && $data['feedback_as_borrower']) {
                $queryStatement = 'select th.transaction_id, th.uid_borrower, it.uid as uid_owner, ti.text, ti.update_timestamp'
                    . ' from mybrary_transaction_items ti' 
                    . ' join mybrary_transaction_head th on ti.transaction_id = th.transaction_id'
                    . ' join node it on it.nid= th.entity_id'
                    . ' where ti.status = :status and th.uid_borrower = :uid';
                
                $dbResult = db_query($queryStatement, array(
                        ':status' => MYBRARY_TRANSACTION_STATUS_OWNER_FEEDBACKED,
                        ':uid' => $data['uid']
                ));
                
                while ($row = $dbResult->fetchAssoc()) {
                    // should only return single result
                    $tempFeedback = json_decode($row['text']);
                    $row['feedback_text'] = $tempFeedback->text;
                    $row['feedback_rating'] = $tempFeedback->feedback;
                    $row['feedback_label'] = _mybrary_transaction_get_feedback_label($tempFeedback->feedback);
                    $response['feedback_as_borrower'][$row[transaction_id]] = $row;
                }
            }
            
            // append feedback_as_owner_summary
            if (!empty($response) && $data['feedback_as_owner_summary']) {
                $queryStatement = 'select it.uid as uid,'
                        . ' sum(th.feedback_owner=:negative) as negative,'
                        . ' sum(th.feedback_owner=:neutral) as neutral,'
                        . ' sum(th.feedback_owner=:positive) as positive'
                        . ' from mybrary_transaction_head th join node it on it.nid = th.entity_id and it.uid = :uid where th.feedback_owner > 0 group by it.uid';
            
                $dbResult = db_query($queryStatement, array(
                        ':negative' => MYBRARY_TRANSACTION_FEEDBACK_NEGATIVE,
                        ':neutral' => MYBRARY_TRANSACTION_FEEDBACK_NEUTRAL,
                        ':positive' => MYBRARY_TRANSACTION_FEEDBACK_POSITIVE,
                        ':uid' => $data['uid']
                ));
            
                while ($row = $dbResult->fetchAssoc()) {
                    // should only return single result
                    $response['feedback_as_owner_summary'] = $row;
                }
            }
            
            // append feedback_as_owner
            if (!empty($response) && $data['feedback_as_owner']) {
                $queryStatement = 'select th.transaction_id, th.uid_borrower, it.uid as uid_owner, ti.text, ti.update_timestamp'
                    . ' from mybrary_transaction_items ti' 
                    . ' join mybrary_transaction_head th on ti.transaction_id = th.transaction_id'
                    . ' join node it on it.nid= th.entity_id'
                    . ' where ti.status = :status and it.uid = :uid';
                
                $dbResult = db_query($queryStatement, array(
                        ':status' => MYBRARY_TRANSACTION_STATUS_BORROWER_FEEDBACKED,
                        ':uid' => $data['uid']
                ));
                
                while ($row = $dbResult->fetchAssoc()) {
                    // should only return single result
                    $tempFeedback = json_decode($row['text']);
                    $row['feedback_text'] = $tempFeedback->text;
                    $row['feedback_rating'] = $tempFeedback->feedback;
                    $row['feedback_label'] = _mybrary_transaction_get_feedback_label($tempFeedback->feedback);
                    $response['feedback_as_owner'][$row[transaction_id]] = $row;
                }
            }
            
        } catch (Exception $e) {
            watchdog('mybrary_service_connection',
                    'Connection view error  [' . $e->getCode() . '] ' .
                    $e->getMessage(), NULL, WATCHDOG_ERROR);
            $response = services_error($e->getMessage(), 500);
        }
        
    }
    
    return $response;
}