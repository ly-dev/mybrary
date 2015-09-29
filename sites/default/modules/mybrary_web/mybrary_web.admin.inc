<?php

function mybrary_web_admin_form() {
    $form['mybrary_web_debug_mode'] = array(
            '#type' => 'select',
            '#title' => t('Debug Mode'),
            '#options' => array(
                0 => t('Off'),
                1 => t('On'),
            ),
            '#default_value' => variable_get('mybrary_web_debug_mode', 0),
            '#description' => t("The debug mode switch."),
            '#required' => TRUE,
    );

    return system_settings_form($form);
}