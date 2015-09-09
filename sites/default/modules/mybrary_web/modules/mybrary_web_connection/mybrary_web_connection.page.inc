<?php

/**
 * Page callback for connection.
 */
function mybrary_web_connection() {
  mybrary_web_init_application('app_connection');
  drupal_add_js(drupal_get_path('module', 'mybrary_web_connection') . '/js/mybrary_web_connection.js');

  return theme_render_template(drupal_get_path('module', 'mybrary_web_connection') . '/tpl/mybrary_web_connection.tpl.php', array());
}

/**
 * Page callback for connection_main.
 */
function mybrary_web_connection_main() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web_connection') . '/tpl/mybrary_web_connection_main.tpl.php', array());
}
