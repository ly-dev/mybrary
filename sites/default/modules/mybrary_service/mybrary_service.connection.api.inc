<?php
/**
 * Access check callback for connection resource.
 */
function mybrary_service_connection_resource_access($op = 'view', $args = array()) {
    global $user;

    switch ($op) {
        case 'invite':
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
    
    if (empty($data['uid'])) {
        $data['uid'] = $user->uid; 
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
        $dbResult = $query->execute();
        
        $response = array();
        while ($row = $dbResult->fetchAssoc()) {
            $row['pictureUrl'] = ($row['pictureUri'] ? file_create_url($row['pictureUri'])
                        : $base_path . drupal_get_path('theme', 'mybrary') . '/images/unknown-user.png');
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
 * View
 *
 * @return array
 */
function mybrary_service_connection_view ($data)
{
    global $base_path;
    
    $response = NULL;
    
    if (!empty($data['uid'])) {
        try {
            $query = db_select('users', 'u');
            $query->leftJoin('file_managed', 'f', 'u.picture = f.fid');
            $query->fields('u', array('uid', 'name', 'mail', 'created'));
            $query->addField('f', 'uri', 'pictureUri');
            $query->condition('u.uid', $data['uid']);
            $dbResult = $query->execute();
            
            while ($row = $dbResult->fetchAssoc()) {
                $row['pictureUrl'] = ($row['pictureUri'] ? file_create_url($row['pictureUri'])
                            : $base_path . drupal_get_path('theme', 'mybrary') . '/images/unknown-user.png');
                $response = $row; // should only return single result
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