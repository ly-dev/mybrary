<div class="container">
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <a class="btn btn-link" role="button" ui-sref="dashboard"><i class="glyphicon glyphicon-menu-left"></i> Dashboard</a>
            <a class="btn btn-link" role="button" ui-sref="inventory-edit({nid: 0})"><i class="glyphicon glyphicon-plus"></i> new item</a>
        </div>
    </div>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="list-group">
				<div class="list-group-item"><span>My Inventory ({{itemsMeta.count}})</span><div class="pull-right" style="font-size:75%"><i class="fa fa-user"></i> Not shared <i class="fa fa-cloud-upload"></i> Shared</div></div>
				<div class="list-group-item" ng-show="itemsMeta.count < 1">Oops! Nothing found.</div>
				<button type="button" class="list-group-item" ng-repeat="item in items | orderBy:'-changed'" ng-click="editInventory(item.nid)">
					<div class="pull-left">
						<img ng-src="{{item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar-small">
					</div>
					<div class="pull-left" style="padding-left: 1em;">
    					<span>{{item.title}}</span><br />
						<span>{{terms[item.field_type].name}}</span><br />
						<span>{{item.model}}</span>
					</div>
					<div class="pull-right"><i class="fa" ng-class="{'fa-user': (item.field_shared == 0), 'fa-cloud-upload': (item.field_shared == 1)}" ></i></div>
				</button>
			</div>
		</div>
	</div>
</div>