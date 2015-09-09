<div class="container">
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <a class="btn btn-link" href="<?php print url('dashboard'); ?>" role="button"><i class="glyphicon glyphicon-chevron-left"></i> Dashboard</a>
            <a class="btn btn-link" href="#" role="button"><i class="glyphicon glyphicon-plus"></i> new item</a>
        </div>
    </div>
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="list-group friend-group">
				<div class="list-group-item">My Inventory</div>
				<button type="button" class="list-group-item friend-item" ng-repeat="friend in friends">
					<img ng-src="https://graph.facebook.com/v2.4/{{friend.externalId}}/picture?height=64&width=64" alt="{{friend.externalName}}">
					<span>{{friend.externalName}}</span>
				</button>
			</div>
		</div>
	</div>
</div>