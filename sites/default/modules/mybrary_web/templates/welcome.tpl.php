<?php
/**
 * welcome.tpl.php
 */
?>
Welcome to Mybrary

<?php
    $block = module_invoke('fboauth', 'block_view');
    print render($block['content']);
?>