<?php

/**
 * Page callback for /welcome.
 */
function mybrary_web_welcome_page ()
{
    return theme_render_template(drupal_get_path('module', 'mybrary_web') . '/templates/welcome.tpl.php', array());
}
