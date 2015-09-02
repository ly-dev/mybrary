<?php

/**
 * Page callback for /welcome.
 */
function mybrary_facebook_welcome_page ()
{
    global $user;
    
    if (!$user->uid) {
        return theme_render_template(drupal_get_path('module', 'mybrary_facebook') . '/templates/welcome.tpl.php', array());
    }
    
    module_load_include('inc', 'fboauth', 'includes/fboauth.fboauth');
    
    $access_token = $_SESSION['fboauth']['access_token'];
    
    $fbFriends = fboauth_graph_query('me/friends', $access_token);
    
    return theme_render_template(drupal_get_path('module', 'mybrary_facebook') . '/templates/dashboard.tpl.php', array('friends'=>$fbFriends));
    
    
}
