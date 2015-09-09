<?php
/**
 * Access check callback for term resource.
 */
function mybrary_service_term_resource_access($op = 'view', $args = array()) {
    global $user;

    switch ($op) {
        case 'list':
            return TRUE;
    }
}

/**
 * Callback for for term resource.
 * List
 *
 * @return array
 */
function mybrary_service_term_list ($data)
{
    global $user;
    
    $response = array();
    
    $vocabularies = array(
            "categories",
            "manufacturer"
    );
    
    foreach ($vocabularies as $vocabularyMachineName) {
        if ($vocabulary = taxonomy_vocabulary_machine_name_load(
                $vocabularyMachineName)) {
            $tree = taxonomy_get_tree($vocabulary->vid);
            foreach ($tree as $term) {
                $response[$term->tid] = array(
                	'tid' => $term->tid,
                    'type' => $vocabularyMachineName,
                    'name' => $term->name,
                    'weight' => $term->weight,
                );
                
                switch ($vocabularyMachineName) {
                	case 'manufacturer':
                	    $term = taxonomy_term_load($term->tid);
                	    if ($term->field_tool_category && $term->field_tool_category[LANGUAGE_NONE]) {
                	        foreach ($term->field_tool_category[LANGUAGE_NONE] as $item) {
                	            if (!empty($item['tid'])) {
                	                $response[$term->tid]['category'][] = $item['tid'];
                	            }
                	        }
                	    }
                	    break;   
                }
            }
        }
    }
   
    return $response;
}