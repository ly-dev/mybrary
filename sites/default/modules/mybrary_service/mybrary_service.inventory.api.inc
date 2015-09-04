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
            return TRUE;
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
    
    $result = array();
    
    $result = services_error(t('List action has not been implemented yet.'), 404);
    
    return $result;
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

    $result = array();

    $result = services_error(t('View action has not been implemented yet.'), 404);

    return $result;
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

    $result = array();

    $result = services_error(t('Create action has not been implemented yet.'), 404);

    return $result;
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

    $result = array();

    $result = services_error(t('Update action has not been implemented yet.'), 404);

    return $result;
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

    $result = array();

    $result = services_error(t('Delete action has not been implemented yet.'), 404);

    return $result;
}