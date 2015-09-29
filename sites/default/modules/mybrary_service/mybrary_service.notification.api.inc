<?php

/**
 * Access check callback for notification resource.
 */
function mybrary_service_notification_resource_access($op = 'view', $args = array()) {
    global $user;

    switch ($op) {
        case 'list':
        case 'update':
        default:
            return user_is_logged_in();
    }
}

/**
 * Callback for for notification resource.
 * List
 *
 * @return array
 */
function mybrary_service_notification_list ($data)
{
    global $user;
    
    $response = NULL;
    
    if (empty($data['uid_to'])) {
        $data['uid_to'] = $user->uid;
    }
    
    if (empty($data['status'])) {
        $data['status'] = MYBRARY_NOTIFICATION_STATUS_NEW;
    }
    
    $query = new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
    ->entityCondition('bundle', 'notification')
    ->propertyCondition('status', NODE_PUBLISHED)
    ->fieldCondition('field_uid_to', 'uid', $data['uid_to'])
    ->fieldCondition('field_status', 'value', $data['status'])
    ->propertyOrderBy('changed', 'DESC');

    if (!empty($data['range']) && !empty($data['range']['length'])) {
        if (!isset($data['range']['start'])) {
            $data['range']['start'] = 0;
        }
        
        $query->range($data['range']['start'], $data['range']['length']);
    }
    
    // run query
    $result = $query->execute();
    $response = array(
        'notifications' => array(),
        'users' => array()
    );
    if (isset($result['node'])) {
        $entities = entity_load('node', array_keys($result['node']));
        
        if (!empty($entities)) {
            // required fields to return and related options, 'field name'=>option array
            $filterRequiredFields = array(
                    'uid'=>array('is_property'=>TRUE),
                    'nid'=>array('is_property'=>TRUE),
                    'changed'=>array('is_property'=>TRUE),
                    'title'=>array('is_property'=>TRUE),
                    'body'=>array('values_convertor'=>'single_value'),
                    'field_uid_to'=>array('values_convertor'=>'single_value'),
                    'field_status'=>array('values_convertor'=>'single_value'),
                    'field_uri'=>array('values_convertor'=>'single_value'),
            );
            
            // all available fields
            $fieldInfo = field_info_instances('node', 'notification');
            $fieldKeys = array_keys($fieldInfo);
            
            $relatedUsers = array();
            foreach($entities as $nid=>$entity)
            {
                foreach ($filterRequiredFields as $fik => $fio) {
                    
                    if (($fio && $fio['is_property']) || in_array($fik, $fieldKeys)) {
                        $response['notifications'][$entity->nid][$fik] = _mybrary_service_get_entity_field_value($entity, $fik, $fio);
                        
                        if ($fik == 'uid') {
                            $relatedUsers[$response['notifications'][$entity->nid][$fik]] =  $response['notifications'][$entity->nid][$fik];
                        }
                    }
                }
            }
            
            module_load_include('inc', 'mybrary_service', 'mybrary_service.connection.api');
            $response['users'] =  _mybrary_user_list(array('uid' => array_keys($relatedUsers)));
        }
    }
        
    return $response;
}

/**
 * Callback for for notification resource.
 * Update
 *
 * @return array
 */
function mybrary_service_notification_update ($data)
{
    global $user;

    $response = array(
            'status' => 'error',
            'message' => t('Oops! Something goes wrong.')
    );
    
    // check required fields
    $errors = array();
    if (empty($data['nid'])) {
        $errors[] = t('Id is missing');
    }
    
    if (empty($data['field_status'])) {
        $errors[] = t('Status is missing');
    }
    
    if (empty($errors)) {
        // load item to update
        $node = node_load($data['nid']);
        
        if ($node) {
            $node->field_status[$node->language] = array(array('value' => $data['field_status']));
            
            try {
            
                node_save($node);
                
                $response = array(
                        'status' => 'success',
                        'message' => t('Successfully updated notification.')
                );
            } catch (Exception $e) {
                watchdog('mybrary_service_notification',
                        'Notification update error  [' . $e->getCode() . '] ' .
                        $e->getMessage(), NULL, WATCHDOG_ERROR);
                $response = services_error($e->getMessage(), 500);
            }
        } else {
            $response['message'] = t('Not found notification with ID: !id.', array('!id' => $data['nid']));
        }
        
    } else {
        $response['message'] = implode("; ", $errors);
    }

    return $response;
}