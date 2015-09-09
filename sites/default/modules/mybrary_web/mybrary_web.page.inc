<?php

/**
 * Page callback for /welcome.
 */
function mybrary_web_welcome_page ()
{
    global $user;
    
    if ($user->uid && fboauth_fbid_load($user->uid)) {
        drupal_goto('/dashboard');
    }
    
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/welcome.tpl.php', array());
}
