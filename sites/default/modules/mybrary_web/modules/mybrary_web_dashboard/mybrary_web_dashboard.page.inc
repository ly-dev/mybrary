<?php

/**
 * Page callback for dashboard.
 */
function mybrary_web_dashboard() {
  angularjs_init_application('app_dashboard');
  drupal_add_js(drupal_get_path('module', 'mybrary_web_dashboard') . '/js/mybrary_web_dashboard.js');

  return theme_render_template(drupal_get_path('module', 'mybrary_web_dashboard') . '/tpl/mybrary_web_dashboard.tpl.php', array());
}

/**
 * Page callback for dashboard_main.
 */
function mybrary_web_dashboard_main() {
    return theme_render_template(drupal_get_path('module', 'mybrary_web_dashboard') . '/tpl/mybrary_web_dashboard_main.tpl.php', array());
}
