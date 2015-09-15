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
				<a class="list-group-item" ui-sref="connection"><span>My Connection ({{friendsMeta.count}})</span><div class="pull-right" style="font-size:75%"><i class="fa fa-user"></i> Not shared <i class="fa fa-cloud-upload"></i> Shared</div></a>
				<button type="button" class="list-group-item" ng-show="friendsMeta.count < 1">Oops! Nothing found.</button>
				<button type="button" class="list-group-item" ng-repeat="(id, friend) in friends">
					<img ng-src="{{friend.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-small">
					<span>{{friend.name}}</span>
				</button>
			</div>
		</div>
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
			<div class="list-group inventory-group">
				<a class="list-group-item" ui-sref="inventory"><span>My Inventory ({{itemsMeta.count}})</span></a>
				<button type="button" class="list-group-item" ng-show="itemsMeta.count < 1">Oops! Nothing found.</button>
				<button type="button" class="list-group-item" ng-repeat="(id, item) in items">
					<div class="pull-left">
						<img ng-src="{{item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar-small">
					</div>
					<div class="pull-left" style="padding-left: 1em;">
    					<span>{{item.title}}</span><br/>
    					<span>{{terms[item.field_type].name}}</span>
					</div>
					<div class="pull-right"><i class="fa" ng-class="{'fa-user': (item.field_shared == 0), 'fa-cloud-upload': (item.field_shared == 1)}" ></i></div>
				</button>
			</div>
		</div>
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
			<div class="list-group">
				<a class="list-group-item" ui-sref="transaction"><span>My Transaction ({{transactionsMeta.count}})</span></a>
				<button type="button" class="list-group-item" ng-show="transactionsMeta.count < 1">Oops! Nothing found.</button>
			</div>
		</div>
	</div>
</div>