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
			<div class="list-group friend-group">
				<a class="list-group-item" href="<?php print url('connection'); ?>">My Connection &nbsp;&nbsp;&nbsp;<i class="glyphicon glyphicon-list"></i></a></a>
				<button type="button" class="list-group-item friend-item" ng-repeat="friend in friends">
					<img ng-src="https://graph.facebook.com/v2.4/{{friend.externalId}}/picture?height=64&width=64" alt="{{friend.externalName}}">
					<span>{{friend.externalName}}</span>
				</button>
			</div>
		</div>
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
			<div class="list-group inventory-group">
				<a class="list-group-item" href="<?php print url('inventory'); ?>">My Inventory &nbsp;&nbsp;&nbsp;<i class="glyphicon glyphicon-list"></i></a></a>
				<button type="button" class="list-group-item" ng-if="!inventoryItems">Oops! Nothing found.</button>
				<button type="button" class="list-group-item inventory-item" ng-repeat="inventoryItem in inventoryItems">
					<span>{{inventoryItem.title}}</span>
				</button>
			</div>
		</div>
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
			<div class="panel panel-default">
				<a class="list-group-item" href="<?php print url('transaction'); ?>">My Transaction &nbsp;&nbsp;&nbsp;<i class="glyphicon glyphicon-list"></i></a></a>
				<div class="panel-body"></div>
			</div>
		</div>
	</div>
</div>