<?php
/**
 * @file
 * project_shared.features.field_instance.inc
 */

/**
 * Implements hook_field_default_field_instances().
 */
function project_shared_field_default_field_instances() {
  $field_instances = array();

  // Exported field_instance: 'taxonomy_term-manufacturer-field_tool_category'
  $field_instances['taxonomy_term-manufacturer-field_tool_category'] = array(
    'bundle' => 'manufacturer',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'taxonomy',
        'settings' => array(),
        'type' => 'taxonomy_term_reference_link',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'taxonomy_term',
    'field_name' => 'field_tool_category',
    'label' => 'Tool Category',
    'required' => 0,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_buttons',
      'weight' => 1,
    ),
  );

  // Translatables
  // Included for use with string extractors like potx.
  t('Tool Category');

  return $field_instances;
}
