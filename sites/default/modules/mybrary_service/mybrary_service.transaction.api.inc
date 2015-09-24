<?php
/**
 * Access check callback for transaction resource.
 */
function mybrary_service_transaction_resource_access($op = 'view', $args = array()) {
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
 * Callback for for transaction resource.
 * List
 *
 * @return array
 */
function mybrary_service_transaction_list ($data)
{
    global $user;
    
    $response = NULL;
    
    if (empty($data['uid'])) {
        $data['uid'] = $user->uid;
    }
    
    try {
        // tricky to get transaction with latest status
        $queryStatement = 'select th.transaction_id, th.entity_id, th.uid_borrower, th.start, th.end,'
            . ' ti.instance_id, ti.status, ti.update_timestamp, ti.text from' 
        	. ' (select * from mybrary_transaction_items'
            . ' where transaction_id in' 
        	. ' (select th.transaction_id from mybrary_transaction_head th'
        	. ' join node nd on nd.nid = th.entity_id'
	        . ' where th.uid_borrower = :uid or nd.uid = :uid)'
            . ' order by transaction_id, update_timestamp desc) ti'
            . ' join mybrary_transaction_head th on th.transaction_id = ti.transaction_id'
            . ' group by ti.transaction_id';
        
        $dbResult = db_query($queryStatement, array(
                ':uid' => $data['uid']
        ));
        
        $response = array();
        $relatedItems = array();
        $relatedUsers = array();
        while ($row = $dbResult->fetchAssoc()) {
            $response['transactions'][$row['transaction_id']] = $row;
            $response['transactions'][$row['transaction_id']]['status_label'] = _mybrary_transaction_get_status_label($row['status']);
            $relatedItems[$row['entity_id']] = $row['entity_id'];
            
            // collect borrower ids
            $relatedUsers[$row['uid_borrower']] = $row['uid_borrower'];
        }
        
        module_load_include('inc', 'mybrary_service', 'mybrary_service.inventory.api');
        $response['items'] =  mybrary_service_inventory_list(array('owner'=>'*', 'nid'=>array_keys($relatedItems)));
        
        // collect owner ids
        foreach ($response['items'] as $nid=>$item) {
            $relatedUsers[$item['uid']] = $item['uid'];
        }
        
        module_load_include('inc', 'mybrary_service', 'mybrary_service.connection.api');
        $response['users'] =  mybrary_service_connection_list(array('uid' => array_keys($relatedUsers)));
    } catch (Exception $e) {
        watchdog('mybrary_service_connection',
                'Connection list error  [' . $e->getCode() . '] ' .
                $e->getMessage(), NULL, WATCHDOG_ERROR);
        $response = services_error($e->getMessage(), 500);
    }
    
    return $response;
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

    $response = NULL;
    
    if (empty($data['transaction_id'])) {
        if (empty($data['entity_id'])) {
            $errors[] = t('Item id is missing');
        }
        
        if (empty($data['uid_borrower'])) {
            $errors[] = t('Borrower user id is missing');
        }
    }

    if (empty($errors)) {
        try {
            if (empty($data['transaction_id'])) {
                // tricky to get open transaction against the entity_id, uid_borrower
                $queryStatement = 'select transaction_id, status from' 
                	. ' (select * from mybrary_transaction_items'
                    . ' where transaction_id in' 
                	. ' (select transaction_id from mybrary_transaction_head'
                	. ' where entity_id = :entity_id and uid_borrower = :uid_borrower)'
                    . ' order by transaction_id, update_timestamp desc) ti'
                    . ' group by transaction_id';
                        
                $dbResult = db_query($queryStatement, array(
                        ':entity_id' => $data['entity_id'],
                        ':uid_borrower' => $data['uid_borrower']
                ));
                
                while ($row = $dbResult->fetchAssoc()) {
                    // should only existing one open transaction
                    if ($row['status'] == MYBRARY_TRANSACTION_STATUS_REQUESTED) {
                        $data['transaction_id'] = $row['transaction_id'];
                        $data['status'] = $row['status'];
                        break;
                    }
                }
            }
            
            $response = array();
            // get existing transaction
            if (!empty($data['transaction_id'])) {
                $query = db_select('mybrary_transaction_head', 'th');
                $query->join('mybrary_transaction_items', 'ti', 'th.transaction_id = ti.transaction_id');
                $query->addField('th', 'transaction_id');
                $query->addField('th', 'entity_id');
                $query->addField('th', 'uid_borrower');
                $query->addField('th', 'start');
                $query->addField('th', 'end');
                $query->addField('th', 'feedback_owner');
                $query->addField('th', 'feedback_borrower');
                $query->addField('ti', 'instance_id');
                $query->addField('ti', 'status');
                $query->addField('ti', 'update_timestamp');
                $query->addField('ti', 'text');
                $query->condition('th.transaction_id', $data['transaction_id']);
                $query->orderBy('ti.update_timestamp', 'DESC');
                $dbResult = $query->execute();
                
                while ($row = $dbResult->fetchAssoc()) {
                    if (empty($response['transaction'])) {
                        $response['transaction'] = array(
                                'transaction_id' => $row['transaction_id'],
                                'entity_id' => $row['entity_id'],
                                'uid_borrower' => $row['uid_borrower'],
                                'start' => $row['start'],
                                'end' => $row['end'],
                                'feedback_owner'=> $row['feedback_owner'],
                                'feedback_borrower'=> $row['feedback_borrower'],
                                'status' => $row['status'],
                                'status_label' => _mybrary_transaction_get_status_label($row['status']),
                                'feedback_owner_label'=> _mybrary_transaction_get_feedback_label($row['feedback_owner']),
                                'feedback_borrower_label'=> _mybrary_transaction_get_feedback_label($row['feedback_borrower']),
                                'items' => array()
                        );
                    }

                    $response['transaction']['items'][$row['instance_id']] = array(
                            'instance_id' => $row['instance_id'],
                            'status' => $row['status'],
                            'status_label' => _mybrary_transaction_get_status_label($row['status']),
                            'update_timestamp' => $row['update_timestamp'],
                            'text' => json_decode($row['text'])
                    );
                    
                    if (isset($response['transaction']['items'][$row['instance_id']]['text']->feedback)) {
                        $response['transaction']['items'][$row['instance_id']]['text']->feedback_label = _mybrary_transaction_get_feedback_label($response['transaction']['items'][$row['instance_id']]['text']->feedback);
                    }
                }
            } else {
                // new transaction
                $start = new DateTime();
                $end = clone($start);
                $end->add(new DateInterval('P3D'));
                
                $response['transaction'] = array (
                        'transaction_id' => 0,
                        'entity_id' => $data['entity_id'],
                        'uid_borrower' => $data['uid_borrower'],
                        'start' => $start->getTimestamp(),
                        'end' => $end->getTimestamp(),
                        'feedback_owner'=> MYBRARY_TRANSACTION_FEEDBACK_UNKNOWN,
                        'feedback_borrower'=> MYBRARY_TRANSACTION_FEEDBACK_UNKNOWN,
                        'status' => MYBRARY_TRANSACTION_STATUS_UNKNOWN,
                        'status_label' => _mybrary_transaction_get_status_label(MYBRARY_TRANSACTION_STATUS_UNKNOWN),
                        'feedback_owner_label'=> _mybrary_transaction_get_feedback_label(MYBRARY_TRANSACTION_FEEDBACK_UNKNOWN),
                        'feedback_borrower_label'=> _mybrary_transaction_get_feedback_label(MYBRARY_TRANSACTION_FEEDBACK_UNKNOWN),
                        'items' => array()
                );
            }
            
            if (!empty($response['transaction'])) {
                module_load_include('inc', 'mybrary_service', 'mybrary_service.inventory.api');
                $response['item'] =  mybrary_service_inventory_view(array('nid' => $response['transaction']['entity_id']));
                
                module_load_include('inc', 'mybrary_service', 'mybrary_service.connection.api');
                $response['users'] =  mybrary_service_connection_list(array('uid' => array($response['item']['uid'], $response['transaction']['uid_borrower'])));
            }
            
        } catch (Exception $e) {
            watchdog('mybrary_service_transaction',
                    'Transaction update error  [' . $e->getCode() . '] ' .
                    $e->getMessage(), NULL, WATCHDOG_ERROR);
            $response = services_error($e->getMessage(), 500);
        }
    } else {
        $response['message'] = implode('; ', $errors);
    }
    
    return $response;
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
    
    $response = array(
            'status' => 'error',
            'message' => t('Oops! Something goes wrong.')
    );
    
    if (!isset($data['transaction_id'])) {
        $errors[] = t('Transaction id is missing');
    }
    
    if (empty($data['entity_id'])) {
        $errors[] = t('Item id is missing');
    }
    
    if (empty($data['uid_borrower'])) {
        $errors[] = t('Borrower user id is missing');
    }
    
    if (empty($data['start'])) {
        $errors[] = t('Start date is missing');
    }
    
    if (empty($data['end'])) {
        $errors[] = t('End date is missing');
    }
    
    if (!isset($data['status'])) {
        $errors[] = t('Current status is missing');
    }
    
    if (!isset($data['new_status'])) {
        $errors[] = t('New status is missing');
    } elseif ($data['new_status'] == MYBRARY_TRANSACTION_STATUS_OWNER_FEEDBACKED && !isset($data['feedback_owner'])) {
        $errors[] = t('Owner feedback is missing');
    } elseif ($data['new_status'] == MYBRARY_TRANSACTION_STATUS_BORROWER_FEEDBACKED && !isset($data['feedback_borrower'])) {
        $errors[] = t('Borrower feedback is missing');
    }
    
    if (empty($errors)) {
        try {
            if ($data['transaction_id'] > 0) {
                // tricky to get open transaction against the entity_id, uid_borrower
                // double check transaction existing
                $queryStatement = 'select transaction_id, status from' 
                	. ' (select * from mybrary_transaction_items'
                    . ' where transaction_id in' 
                	. ' (select transaction_id from mybrary_transaction_head'
                	. ' where transaction_id = :transaction_id and entity_id = :entity_id and uid_borrower = :uid_borrower)'
                    . ' order by transaction_id, update_timestamp desc) ti'
                    . ' group by transaction_id';
                        
                $dbResult = db_query($queryStatement, array(
                        ':transaction_id' => $data['transaction_id'],
                        ':entity_id' => $data['entity_id'],
                        ':uid_borrower' => $data['uid_borrower']
                ));
                
                $errors[] = t('Matched transaction could not be found');
                while ($row = $dbResult->fetchAssoc()) {
                    // should only existing one matched transaction
                    $errors = array(); // clear error
                    
                    if ($row['status'] != $data['status']) {
                        $errors[] = t('Operation cancelled due to status changed by others.');
                    }
                }
                
                // double check item availability for request
                if (($data['new_status'] == MYBRARY_TRANSACTION_STATUS_REQUESTED || $data['new_status'] == MYBRARY_TRANSACTION_STATUS_REQUEST_CHANGED)
                        && !_mybrary_transaction_is_available ($data['entity_id'], $data['start'], $data['end'])) {
                    $errors[] = t('Not available during the requested period.');
                }
                
                if (empty($errors)) {
                    // updte start and end
                    $result = db_update('mybrary_transaction_head')->fields(
                            array(
                                'start'=> $data['start'],
                                'end'=> $data['end'],
                                'feedback_owner'=> $data['feedback_owner'],
                                'feedback_borrower'=> $data['feedback_borrower'],
                            ))
                            ->condition('transaction_id', $data['transaction_id'])
                            ->execute();                    
                }
            } else {
                // insert new transaction
                $data['transaction_id'] = db_insert('mybrary_transaction_head')->fields(
                        array(
                            'entity_id' => $data['entity_id'],
                            'uid_borrower' => $data['uid_borrower'],
                            'start'=> $data['start'],
                            'end'=> $data['end'],
                            'feedback_owner'=> MYBRARY_TRANSACTION_FEEDBACK_UNKNOWN,
                            'feedback_borrower'=> MYBRARY_TRANSACTION_FEEDBACK_UNKNOWN,
                        ))->execute();
            }
        
            if (empty($errors)) {
                // insert new transaction item
                $timestamp = time();
                $item = array(
                        'transaction_id' => $data['transaction_id'],
                        'status' => $data['new_status'],
                        'text' => json_encode(array(
                            'text' => $data['text'],
                        )),
                        'update_timestamp' => $timestamp,
                );
                
                switch ($data['new_status']) {
                    case MYBRARY_TRANSACTION_STATUS_REQUESTED:
                    case MYBRARY_TRANSACTION_STATUS_CONFIRMED:
                        $item['text'] = json_encode(array(
                                'text' => $data['text'],
                                'start'=> $data['start'],
                                'end'=> $data['end'],
                        ));
                        break;
                    case MYBRARY_TRANSACTION_STATUS_OWNER_FEEDBACKED:
                        $item['text'] = json_encode(array(
                                'text' => $data['text'],
                                'feedback'=> $data['feedback_owner'],
                        ));
                        break;
                    case MYBRARY_TRANSACTION_STATUS_BORROWER_FEEDBACKED:
                        $item['text'] = json_encode(array(
                            'text' => $data['text'],
                            'feedback'=> $data['feedback_borrower'],
                        ));                     
                        break;
                }
                
                $item[] = db_insert('mybrary_transaction_items')->fields($item)->execute();
                
                $data['status'] = $data['new_status'];
                unset($data['new_status']);
                
                $response = array(
                        'status' => 'success',
                        'message' => t('Transaction updated successfully.'),
                        'data' => $data
                );
            } else {
                $response['message'] = implode('; ', $errors);
            }
        } catch (Exception $e) {
            watchdog('mybrary_service_transaction',
                    'Transaction update error  [' . $e->getCode() . '] ' .
                    $e->getMessage(), NULL, WATCHDOG_ERROR);
            $response = services_error($e->getMessage(), 500);
        }
    } else {
        $response['message'] = implode('; ', $errors);
    }
    
    return $response;
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

    $response = array();

    $response = services_error(t('Delete action has not been implemented yet.'), 404);

    return $response;
}