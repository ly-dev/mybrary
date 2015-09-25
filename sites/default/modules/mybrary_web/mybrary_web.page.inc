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
    global $user;
    global $base_url;
    
    angularjs_init_application('app_mybrary');
    
    // Add CSRF token and base url required by service api.
    $js_settings = array(
            'mybrary_web' => array(
                    'csrf_token' => drupal_get_token('services'),
                    'service_base_url' =>  $base_url,
                    'user' => array(
                        'uid' => $user->uid
                    )
            )
    );
    drupal_add_js($js_settings, 'setting');
    
    // datepicker
    drupal_add_css(drupal_get_path('module', 'mybrary_web') . '/lib/angularjs-datepicker/dist/angular-datepicker.min.css');
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/lib/angularjs-datepicker/dist/angular-datepicker.min.js');
    
    // image crop
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/lib/angular-img-cropper/dist/angular-img-cropper.min.js');
    
    // ui-route
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/lib/angular-ui-router/release/angular-ui-router.min.js');
    
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
    drupal_add_js(drupal_get_path('module', 'mybrary_web') . '/js/mybrary_web_transaction.js');
    

    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_app.tpl.php', array());
}

/**
 * Page callback for dashboard.
 */
function mybrary_web_dashboard() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_dashboard.tpl.php', array());
}

/**
 * Page callback for connection list.
 */
function mybrary_web_connection_list() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_connection-list.tpl.php', array());
}

/**
 * Page callback for connection view.
 */
function mybrary_web_connection_view() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_connection-view.tpl.php', array());
}

/**
 * Page callback for inventory edit.
 */
function mybrary_web_inventory_edit() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_inventory-edit.tpl.php', array());
}

/**
 * Page callback for inventory list.
 */
function mybrary_web_inventory_list() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_inventory-list.tpl.php', array());
}

/**
 * Page callback for search.
 */
function mybrary_web_search() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_search.tpl.php', array());
}

/**
 * Page callback for transaction.
 */
function mybrary_web_transaction() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_transaction.tpl.php', array());
}

/**
 * Page callback for transaction list.
 */
function mybrary_web_transaction_list() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/tpl/mybrary_web_transaction-list.tpl.php', array());
}


/**
 * Implement ajax delivery call back
 */
function mybrary_web_ajax_delivery_callback ($page_callback_result)
{

    // Emit a Content-Type HTTP header if none has been added by the page
    // callback or by a wrapping delivery callback.
    if (is_null(drupal_get_http_header('Content-Type'))) {
        drupal_add_http_header('Content-Type',
                'application/json; charset=utf-8');
    }

    // just export the page callback result
    print $page_callback_result;
}

/**
 * Page callback for transaction list.
 */
function mybrary_web_ajax_image_upload() {
    $response = array(
        'status' => 'error',
        'message' => t('Oops! Something goes wrong')
    );
    
    if (!empty($_FILES) && !empty($_FILES['image-upload-form-file'])) {
        $fileMeta = $_FILES['image-upload-form-file'];
        if (empty($fileMeta['error'])) {
            if (in_array($fileMeta['type'], array('image/jpeg', 'image/png'))) {
                try {
                    $response = array(
                            'status' => 'success',
                            'message' => t('success'),
                            'data' => 'data:'. $fileMeta['type'] . ';base64,'. base64_encode(file_get_contents($fileMeta['tmp_name']))
                    );
                } catch (Exception $e) {
                    $response['message'] = $e->getMessage();
                }
            } else {
                $response['message'] = t('Invalid tmage data type: !type.', array('!type' => $fileMeta['type']));
            }
        } else {
            $response['message'] = t('Image data uploaded with error: !error.', array('!error' => $fileMeta['error']));
        }
    } else {
        $response['message'] = t('No image data uploaded.');
    }
    
    return json_encode($response);
}

