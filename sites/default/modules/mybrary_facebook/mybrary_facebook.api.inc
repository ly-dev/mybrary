<?php

function mybrary_facebook_ajax_delivery_callback ($page_callback_result)
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

function mybrary_facebook_ajax_page_callback ($action = null)
{
    $result = array(
            'status' => 'error',
            'data' => t('Unknown error in ajax call.')
    );
    
    switch ($action) {
        case 'render_block':
            if ($_GET['view'] && $_GET['block']) {
                $view_name = $_GET['view'];
                $block_name = $_GET['block'];
                $action_params = $_GET['params'];
                
                // get view following views_embed_view() way;
                $view = views_get_view($view_name);
                if (! $view || ! $view->access($block_name)) {
                    return;
                }
                
                $content = $view->preview($block_name, 
                        array(
                                $action_params
                        ));
                
                // to get current title, must after preview.
                $title = $view->get_title();
                
                $result = array(
                        'status' => 'success',
                        'data' => render($content)
                );
            }
            break;
        default:
            $result['data'] = t('Unsupported ajax action: :action.', 
                    array(
                            ':action' => $action
                    ));
            break;
    }
    
    return json_encode($result);
}