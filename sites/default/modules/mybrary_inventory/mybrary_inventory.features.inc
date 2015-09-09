<?php
/**
 * @file
 * mybrary_inventory.features.inc
 */

/**
 * Implements hook_node_info().
 */
function mybrary_inventory_node_info() {
  $items = array(
    'item' => array(
      'name' => t('Item'),
      'base' => 'node_content',
      'description' => t('This is an individual tool'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
