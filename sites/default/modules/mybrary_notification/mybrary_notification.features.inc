<?php
/**
 * @file
 * mybrary_notification.features.inc
 */

/**
 * Implements hook_node_info().
 */
function mybrary_notification_node_info() {
  $items = array(
    'notification' => array(
      'name' => t('notification'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
