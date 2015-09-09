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
            'picture' => 'http://iphicles.global-initiative.com/chchweb/sites/default/files/logo.png',
            'name' => t('Join me now!'),
            'caption' => variable_get('site_name'),
            'description' => (isset($data['message']) ? $data['message']
                     : t('Just updated my personal DIY tools inventory to share among friends.')),
            'privacy' => array (
                 'value' => 'ALL_FRIENDS'
             )
        );
        
        $fbResponse = fboauth_graph_query('me/feed', $access_token, $params, 'POST');
        
        if (!empty($fbResponse) && !empty($fbResponse->id)) {
            $response['status'] = 'success';
            $response['message'] = t('Successfully posted a notice on facebook.');
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
    
    $response = array();
    
    if ($user->uid) {
        try {
            $query = db_select('mybrary_user_net', 'n');
            $query->join('mybrary_user_ext', 'e', 'n.uid_to = e.uid');
            $query->fields('e', array('uid', 'ext_id', 'ext_name'))
            ->condition('n.uid_from', $user->uid);
            $dbResult = $query->execute();
            
            while ($row = $dbResult->fetchAssoc()) {
                $response[] = array(
                    'uid' => $row['uid'],
                    'externalId' => $row['ext_id'],
                    'externalName' => $row['ext_name'],
                );
            }
        } catch (Exception $e) {
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
function mybrary_service_connection_view ($id, $data)
{
    global $user;

    $response = array();

    $response = services_error(t('View action has not been implemented yet.'), 404);

    return $response;
}