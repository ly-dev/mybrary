<?php
/**
 * welcome.tpl.php
 */
?>
<div class="container">
	<h3>Welcome to Mybrary</h3>
</div>

<div class="container">
<p>Please login with your
<?php
    $block = module_invoke('fboauth', 'block_view');
    print render($block['content']);
?>
</p>
</div>

