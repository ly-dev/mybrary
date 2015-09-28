<?php
/**
 * @file
 * mybrary_service.services.inc
 */

/**
 * Implements hook_default_services_endpoint().
 */
function mybrary_service_default_services_endpoint() {
  $export = array();

  $endpoint = new stdClass();
  $endpoint->disabled = FALSE; /* Edit this to true to make a default endpoint disabled initially */
  $endpoint->api_version = 3;
  $endpoint->name = 'mybrary';
  $endpoint->server = 'rest_server';
  $endpoint->path = 'api/v1';
  $endpoint->authentication = array(
    'services' => 'services',
  );
  $endpoint->server_settings = array(
    'formatters' => array(
      'json' => TRUE,
      'bencode' => FALSE,
      'jsonp' => FALSE,
      'php' => FALSE,
      'xml' => FALSE,
    ),
    'parsers' => array(
      'application/json' => TRUE,
      'application/vnd.php.serialized' => FALSE,
      'application/x-www-form-urlencoded' => FALSE,
      'application/xml' => FALSE,
      'multipart/form-data' => FALSE,
      'text/xml' => FALSE,
    ),
  );
  $endpoint->resources = array(
    'connection' => array(
      'actions' => array(
        'invite' => array(
          'enabled' => '1',
        ),
        'request-to-add' => array(
          'enabled' => '1',
        ),
        'response-to-add' => array(
          'enabled' => '1',
        ),
        'list' => array(
          'enabled' => '1',
        ),
        'view' => array(
          'enabled' => '1',
        ),
      ),
    ),
    'inventory' => array(
      'actions' => array(
        'list' => array(
          'enabled' => '1',
        ),
        'view' => array(
          'enabled' => '1',
        ),
        'update' => array(
          'enabled' => '1',
        ),
        'delete' => array(
          'enabled' => '1',
        ),
      ),
    ),
    'term' => array(
      'actions' => array(
        'list' => array(
          'enabled' => '1',
        ),
      ),
    ),
    'transaction' => array(
      'actions' => array(
        'list' => array(
          'enabled' => '1',
        ),
        'view' => array(
          'enabled' => '1',
        ),
        'update' => array(
          'enabled' => '1',
        ),
        'delete' => array(
          'enabled' => '1',
        ),
      ),
    ),
  );
  $endpoint->debug = 0;
  $export['mybrary'] = $endpoint;

  return $export;
}
