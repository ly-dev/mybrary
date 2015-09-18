<div class="container">
	<div class="row">
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
			<div class="list-group">
				<a class="list-group-item" ui-sref="connection"><span>My Connection ({{friendsMeta.count}})</span></a>
				<div class="list-group-item" ng-show="friendsMeta.count < 1">Oops! Nothing found.</div>
				<div class="list-group-item" ng-repeat="(id, friend) in friends">
					<img ng-src="{{friend.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-small">
					<span>{{friend.name}}</span>
				</div>
			</div>
		</div>
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
			<div class="list-group">
				<a class="list-group-item" ui-sref="inventory"><span>My Inventory ({{itemsMeta.count}})</span><div class="pull-right" style="font-size:75%"><i class="fa fa-user"></i> Not shared <i class="fa fa-cloud-upload"></i> Shared</div></a>
				<div class="list-group-item" ng-show="itemsMeta.count < 1">Oops! Nothing found.</div>
				<div class="list-group-item" ng-repeat="(id, item) in items"  style="height: 64px;">
					<div class="pull-left">
						<img ng-src="{{item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar-small">
					</div>
					<div class="pull-left" style="padding-left: 1em;">
    					<span>{{item.title}}</span><br/>
    					<span>{{terms[item.field_type].name}}</span>
					</div>
					<div class="pull-right"><i class="fa" ng-class="{'fa-user': (item.field_shared == 0), 'fa-cloud-upload': (item.field_shared == 1)}" ></i></div>
				</div>
			</div>
		</div>
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
			<div class="list-group">
				<a class="list-group-item" ui-sref="transaction-list"><span>My Transaction ({{transactionsMeta.count}})</span></a>

				<div class="list-group-item list-group-item-info">As Owner ({{transactionsMeta.countAsOwner}})</div>
				<div class="list-group-item" ng-show="transactionsMeta.countAsOwner < 1">Oops! Nothing found.</div>
				<div class="list-group-item" ng-repeat="(id, transaction) in transactions['owner']"  style="height: 64px;">
					<div class="pull-left">
						<img ng-src="{{transaction.item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar-small">
					</div>
					<div class="pull-left" style="padding-left: 1em;">
    					<span>{{transaction.item.title}}</span><br/>
    					<span>{{transaction.status_label}}</span>
					</div>
				</div>
				
				<div class="list-group-item list-group-item-info">As Borrower ({{transactionsMeta.countAsBorrower}})</div>
				<div class="list-group-item" ng-show="transactionsMeta.countAsBorrower < 1">Oops! Nothing found.</div>
				<div class="list-group-item" ng-repeat="(id, transaction) in transactions['borrower']" style="height: 64px;">
					<div class="pull-right">
            			<img ng-src="{{transaction.owner.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-tiny">
            			<span class="app-text app-text-tiny">{{transaction.owner.name}}</span>
					</div>
					<div class="pull-left">
						<img ng-src="{{transaction.item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar-small">
					</div>
					<div class="pull-left" style="padding-left: 1em;">
    					<span>{{transaction.item.title}}</span><br/>
    					<span>{{transaction.status_label}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>