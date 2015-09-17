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
    
    if ($user->uid) {
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
            $query->condition('n.uid_from', $user->uid);
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
        
    } else {
        $response = services_error(t('Access denied to anonymous user.'), 401);
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
            $query->fields('u', array('uid', 'name'));
            $query->addField('f', 'uri', 'pictureUri');
            $query->condition('u.uid', $data['uid']);
            $dbResult = $query->execute();
            
            while ($row = $dbResult->fetchAssoc()) {
                $row['pictureUrl'] = ($row['pictureUri'] ? file_create_url($row['pictureUri'])
                            : $base_path . drupal_get_path('theme', 'mybrary') . '/images/unknown-user.png');
                $response = $row; // should only return single result
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