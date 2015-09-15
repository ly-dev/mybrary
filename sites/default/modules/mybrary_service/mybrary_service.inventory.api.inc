<?php

/**
 * Access check callback for inventory resource.
 */
function mybrary_service_inventory_resource_access($op = 'view', $args = array()) {
    global $user;

    switch ($op) {
        case 'list':
        case 'view':
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
    if (empty($data)) {
        $data = array(
                'owner' => 'me'
        );
    }
    
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'item')
    ->propertyCondition('status', NODE_PUBLISHED);
    
    // adjust query according to data
    
    // owner
    $temp = NULL;
    switch ($data['owner']) {
        case 'me':
            $temp = $user->uid;
            break;
        case 'frd':
            $temp = _mybrary_user_get_friends($user->uid);
            $query->fieldCondition('field_shared', 'value', MYBRARY_ITEM_FIELD_SHARED_TO_FRIEND);
            break;
        case 'fof':
            $temp = _mybrary_user_get_friends_of_friends($user->uid);
            $query->fieldCondition('field_shared', 'value', MYBRARY_ITEM_FIELD_SHARED_TO_FRIEND);
            break;
    }
    if (empty($temp)) {
        $temp = "0"; // return nothing if wrong owner
    }
    $query->propertyCondition('uid', $temp);
    
    // search key
    if (!empty($data['key'])) {
        $query->propertyCondition('title', $data['key'], 'CONTAINS');
    }
    
    // run query
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
                    'field_model'=>array('values_convertor'=>'single_value'),
                    'field_image'=>array('value_convertor'=>'image'),
                    'field_shared'=>array('value_convertor'=>'single_value'),
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
 * Update
 *
 * @return array
 */
function mybrary_service_inventory_update ($data)
{
    global $user;

    $response = array(
            'status' => 'error',
            'message' => t('Oops! Something goes wrong.')
    );
    
    // check required fields
    $errors = array();
    if (empty($data['title'])) {
        $errors[] = t('Name is missing');
    }
    
    if (empty($data['field_type'])) {
        $errors[] = t('Type is missing');
    }
    
    if (empty($errors)) {
        if (isset($data['nid'])) {
            // load item to update
            $node = node_load($data['nid']);
        } else {
            // create new item
            $node = new stdClass();
            $node->type = 'item';
            node_object_prepare($node); // Sets some defaults. Invokes hook_prepare() and hook_node_prepare().
            $node->language = LANGUAGE_NONE; // Or e.g. 'en' if locale is enabled
            $node->uid = $user->uid;
            $node->status = 1; //(1 or 0): published or not

            $node = node_submit($node); // Prepare node for saving
        }
        
        if ($node) {
            $node->title = $data['title'];
            $node->field_type[$node->language] = array(array('tid' => $data['field_type']));
            $node->field_shared[$node->language] = array(array('value' => $data['field_shared']));
            $node->field_model[$node->language] = array(array('value' => $data['field_model']));
            $node->body[$node->language] = array(array('value' => $data['body']));
            
            try {
                if (!empty($data['field_image']) && !empty($data['field_image']['name']) && !empty($data['field_image']['data'])) {
                    $filename = $data['field_image']['name'];
                    $fileParts = explode(',', $data['field_image']['data']);
                    $fileContent = base64_decode($fileParts[1]);
                    $fileObject = file_save_data($fileContent, 'public://'.$filename);
                    $node->field_image[$node->language]= array((array) $fileObject);
                }
            
                node_save($node);
                
                $response = array(
                        'status' => 'success',
                        'message' => t('Successfully saved item: !name.', array('!name' => $node->title))
                );
            } catch (Exception $e) {
                $response = services_error($e->getMessage(), 500);
            }
        } else {
            $response['message'] = t('Inventory item: !id is missing.', array('!id' => $data['nid']));
        }
        
    } else {
        $response['message'] = implode("; ", $errors);
    }

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