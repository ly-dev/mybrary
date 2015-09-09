<?php
global $user;

$apps = array (
    'app_dashboard' => array(
            'label' => t('Dashboard'),
            'link' => url('dashboard'),
    ),
    'app_connection' => array(
            'label' => t('Connection'),
            'link' => url('connection'),
    ),
    'app_inventory' => array(
            'label' => t('Inventory'),
            'link' => url('inventory'),
    ),
    'app_transaction' => array(
            'label' => t('Transaction'),
            'link' => url('transaction'),
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
            	<?php foreach($apps as $key=>$app): ?>
                <li<?php if ($key == $activeApp) print ' class="active"'; ?>><a href="<?php print $app['link']; ?>"><?php print $app['label']; ?></a></li>
                <?php endforeach;?>
                <li><a href="<?php print url('user/logout'); ?>"><?php print t('Log out @username', array('@username' => $user->name)); ?></a></li>
            </ul>
        </div><!--/.nav-collapse -->
    </div>
</nav>