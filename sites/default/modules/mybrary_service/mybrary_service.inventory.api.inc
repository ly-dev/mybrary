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
    
    $response = NULL;
    
    // list own inventory by default
    $uid = $user->uid;
    if ($data) {
        //@TODO check access to friend or fof
        if ($data['uid']) {
            $uid = $data['uid'];
        }
    }
    
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'item')
    ->propertyCondition('status', NODE_PUBLISHED)
    ->propertyCondition('uid', $uid);
    
    $result = $query->execute();
    
    $response = array();
    if (isset($result['node'])) {
        $entities = entity_load('node', array_keys($result['node']));
        
        if (!empty($entities)) {
            // required fields to return and related options, 'field name'=>option array
            $filterRequiredFields = array(
                    'nid'=>array('is_property'=>TRUE),
                    'title'=>array('is_property'=>TRUE),
                    'body'=>array('values_convertor'=>'single_value'),
                    'field_type'=>array('values_convertor'=>'single_value'),
                    'field_manufacturer'=>array('values_convertor'=>'single_value'),
                    'field_image'=>array('value_convertor'=>'image'),
            );
            
            // all available fields
            $fieldInfo = field_info_instances('node', 'item');
            $fieldKeys = array_keys($fieldInfo);
            
            foreach($entities as $nid=>$entity)
            {
                foreach ($filterRequiredFields as $fik => $fio) {
                    
                    if (($fio && $fio['is_property']) || in_array($fik, $fieldKeys)) {
                        $response[$entity->nid][$fik] = _mybrary_service_get_entity_field_value($entity, $fik, $fio);
                    }
                }
            }
        }
    }
    
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