<?php
global $user;

$activeApp = 'dashboard';

$items = array (
    'dashboard' => array(
            'label' => t('Dashboard'),
            'state' => 'dashboard',
    ),
    'connection' => array(
            'label' => t('Connection'),
            'state' => 'connection',
    ),
    'inventory' => array(
            'label' => t('Inventory'),
            'state' => 'inventory',
    ),
    'transaction' => array(
            'label' => t('Transaction'),
            'state' => 'transaction',
    ),
);
?>
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only"><?php print t(''); ?>Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#"><?php print variable_get('site_name'); ?><img src="<?php print theme_get_setting('logo'); ?>" alt="<?php print variable_get('site_name'); ?>" style="display:inline-block;height: 32px" /></a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav navbar-right">
            	<?php foreach($items as $key=>$item): ?>
                <li ui-sref-active="active"><a ui-sref="<?php print $item['state']; ?>"><?php print $item['label']; ?></a></li>
                <?php endforeach;?>
                <li><a href="<?php print url('user/logout'); ?>"><?php print t('Log out @username', array('@username' => $user->name)); ?></a></li>
            </ul>
        </div><!--/.nav-collapse -->
    </div>
</nav>
<div style="padding-top: 50px" ui-view></div>
