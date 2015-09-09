<?php
/**
 * Access check callback for inventory resource.
 */
function mybrary_service_inventory_resource_access($op = 'view', $args = array()) {
    global $user;

    switch ($op) {
        case 'list':
        case 'view':
        case 'create':
        case 'update':
        case 'delete':
        default:
            return user_is_logged_in();
    }
}

/**
 * Callback for for inventory resource.
 * List
 *
 * @return array
 */
function mybrary_service_inventory_list ($data)
{
    global $user;
    
    $response = array();
    
    $data['a'] = $data['a'] . ' successfully!'; 
    $response = $data;
    
   
    return $response;
}

/**
 * Callback for for inventory resource.
 * View
 *
 * @return array
 */
function mybrary_service_inventory_view ($data)
{
    global $user;

    $response = array();

    $response = services_error(t('View action has not been implemented yet.'), 404);

    return $response;
}

/**
 * Callback for for inventory resource.
 * Create
 *
 * @return array
 */
function mybrary_service_inventory_create ($data)
{
    global $user;

    $response = array();

    $response = services_error(t('Create action has not been implemented yet.'), 404);

    return $response;
}

/**
 * Callback for for inventory resource.
 * Update
 *
 * @return array
 */
function mybrary_service_inventory_update ($data)
{
    global $user;

    $response = array();

    $response = services_error(t('Update action has not been implemented yet.'), 404);

    return $response;
}

/**
 * Callback for for inventory resource.
 * Delete
 *
 * @return array
 */
function mybrary_service_inventory_delete ($data)
{
    global $user;

    $response = array();

    $response = services_error(t('Delete action has not been implemented yet.'), 404);

    return $response;
}