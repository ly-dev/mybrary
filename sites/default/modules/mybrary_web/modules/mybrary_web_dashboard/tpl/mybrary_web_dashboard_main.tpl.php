<div class="container">
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="input-group">
				<span class="input-group-addon"><i
					class="glyphicon glyphicon-search"></i></span> <input type="text"
					class="form-control" id="inputGroupSuccess4"
					aria-describedby="inputGroupSuccess4Status">
			</div>
		</div>
	</div>
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
			<div class="list-group">
				<a class="list-group-item" href="<?php print url('connection'); ?>">My Connection &nbsp;&nbsp;&nbsp;<i class="glyphicon glyphicon-list"></i></a></a>
				<button type="button" class="list-group-item" ng-if="angular.isEmpty(friends)">Oops! Nothing found.</button>
				<button type="button" class="list-group-item" ng-repeat="(id, friend) in friends">
					<img ng-src="{{friend.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-small">
					<span>{{friend.name}}</span>
				</button>
			</div>
		</div>
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
			<div class="list-group inventory-group">
				<a class="list-group-item" href="<?php print url('inventory'); ?>">My Inventory &nbsp;&nbsp;&nbsp;<i class="glyphicon glyphicon-list"></i></a></a>
				<button type="button" class="list-group-item" ng-if="angular.isEmpty(items)">Oops! Nothing found.</button>
				<button type="button" class="list-group-item" ng-repeat="(id, item) in items">
					<img ng-src="{{item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar-small">
					<span>{{item.title}}</span>
				</button>
			</div>
		</div>
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
			<div class="list-group">
				<a class="list-group-item" href="<?php print url('transaction'); ?>">My Transaction &nbsp;&nbsp;&nbsp;<i class="glyphicon glyphicon-list"></i></a></a>
				<button type="button" class="list-group-item" ng-if="true">Oops! Nothing found.</button>
			</div>
		</div>
	</div>
</div>