<?php

/**
 * Page callback for inventory.
 */
function mybrary_web_inventory() {
  mybrary_web_init_application('app_inventory');
  
  drupal_add_css(drupal_get_path('module', 'mybrary_web_inventory') . '/lib/angular-image-crop/image-crop-styles.css');
  
  drupal_add_js(drupal_get_path('module', 'mybrary_web_inventory') . '/lib/angular-image-crop/image-crop.js');
  drupal_add_js(drupal_get_path('module', 'mybrary_web_inventory') . '/js/mybrary_web_inventory.js');
  
  return theme_render_template(drupal_get_path('module', 'mybrary_web_inventory') . '/tpl/mybrary_web_inventory.tpl.php', array());
}

/**
 * Page callback for inventory_main.
 */
function mybrary_web_inventory_main() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web_inventory') . '/tpl/mybrary_web_inventory_main.tpl.php', array());
}
