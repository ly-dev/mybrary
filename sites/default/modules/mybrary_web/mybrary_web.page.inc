<?php

/**
 * Page callback for /welcome.
 */
function mybrary_web_welcome_page ()
{
    global $user;
    
    if ($user->uid && fboauth_fbid_load($user->uid)) {
        drupal_goto('/app');
    }
    
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/welcome.tpl.php', array());
}

/**
 * Page callback for app.
 */
function mybrary_web_app() {
    global $base_url;
    
    angularjs_init_application('app_mybrary');
    
    // Add CSRF token and base url required by service api.
    $js_settings = array(
            'mybrary_web' => array(
                    'csrf_token' => drupal_get_token('services'),
                    'service_base_url' =>  $base_url
            )
    );
    drupal_add_js($js_settings, 'setting');
    
    // css
    drupal_add_css(drupal_get_path('module', 'mybrary_web') . '/lib/angular-image-crop/image-crop-styles.css');
    
    // use ui-route
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/lib/angular-ui-router/release/angular-ui-router.min.js');
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/lib/angular-image-crop/image-crop.js');

    
    // app
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/js/mybrary_web_app.js');
    
    // services
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/js/mybrary_web.service.log.js');
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/js/mybrary_web.service.helper.js');
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/js/mybrary_web.service.api.js');
    
    // sub-app
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/js/mybrary_web_dashboard.js');
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/js/mybrary_web_connection.js');
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/js/mybrary_web_inventory.js');
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/js/mybrary_web_search.js');
    

    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_app.tpl.php', array());
}

/**
 * Page callback for dashboard.
 */
function mybrary_web_dashboard() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_dashboard.tpl.php', array());
}

/**
 * Page callback for connection.
 */
function mybrary_web_connection() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_connection.tpl.php', array());
}

/**
 * Page callback for inventory.
 */
function mybrary_web_inventory() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_inventory.tpl.php', array());
}

/**
 * Page callback for search.
 */
function mybrary_web_share() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_search.tpl.php', array());
}


