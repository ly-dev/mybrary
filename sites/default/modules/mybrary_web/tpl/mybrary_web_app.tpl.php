<?php
global $user;

$activeApp = 'dashboard';

$items = array (
    'dashboard' => array(
            'label' => t('Dashboard'),
            'state' => 'dashboard',
    ),
    'connection-list' => array(
            'label' => t('Connection'),
            'state' => 'connection-list',
    ),
    'inventory-list' => array(
            'label' => t('Inventory'),
            'state' => 'inventory-list',
    ),
    'transaction-list' => array(
            'label' => t('Transaction'),
            'state' => 'transaction-list',
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
<div class="container" style="padding-top: 50px">
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div id="app-alert-container"></div>
		</div>
    </div>
</div>
<div class="container" ng-controller="SearchBarController as searchBar">
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="input-group">
				<input type="text" class="form-control" id="form-search-key" name="form-search-key" placeholder="Search for ..." ng-model="searchBar.searchParams.key">
				<span class="input-group-btn"><button class="btn btn-default" type="button" ng-click="searchBar.goSearch()"><i class="glyphicon glyphicon-search"></i> Search</button></span>
			</div>
		</div>
	</div>
	<p></p>
</div>
<div ui-view></div>
