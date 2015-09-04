<?php
/**
 * Access check callback for transaction resource.
 */
function mybrary_service_transaction_resource_access($op = 'view', $args = array()) {
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
 * Callback for for transaction resource.
 * List
 *
 * @return array
 */
function mybrary_service_transaction_list ($data)
{
    global $user;
    
    $result = array();
    
    $result = services_error(t('List action has not been implemented yet.'), 404);
    
    return $result;
}

/**
 * Callback for for transaction resource.
 * View
 *
 * @return array
 */
function mybrary_service_transaction_view ($data)
{
    global $user;

    $result = array();

    $result = services_error(t('View action has not been implemented yet.'), 404);

    return $result;
}

/**
 * Callback for for transaction resource.
 * Create
 *
 * @return array
 */
function mybrary_service_transaction_create ($data)
{
    global $user;

    $result = array();

    $result = services_error(t('Create action has not been implemented yet.'), 404);

    return $result;
}

/**
 * Callback for for transaction resource.
 * Update
 *
 * @return array
 */
function mybrary_service_transaction_update ($data)
{
    global $user;

    $result = array();

    $result = services_error(t('Update action has not been implemented yet.'), 404);

    return $result;
}

/**
 * Callback for for transaction resource.
 * Delete
 *
 * @return array
 */
function mybrary_service_transaction_delete ($data)
{
    global $user;

    $result = array();

    $result = services_error(t('Delete action has not been implemented yet.'), 404);

    return $result;
}