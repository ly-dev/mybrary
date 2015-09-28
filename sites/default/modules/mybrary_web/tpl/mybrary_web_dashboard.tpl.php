<div class="container">
	<div class="row">
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
			<div class="list-group">
				<a class="list-group-item" ui-sref="connection-list"><span>My Friends ({{frdsMeta.count}})</span></a>
				<div class="list-group-item" ng-show="frdsMeta.count < 1">Oops! Nothing found.</div>
				<button type="button" class="list-group-item" ng-repeat="frd in frds | orderBy:'name' | limitTo : 3" ng-click="viewConnection(frd)">
					<img ng-src="{{frd.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-small">
					<span>{{frd.name}}</span>
				</button>
			</div>
			<div class="list-group">
				<a class="list-group-item" ui-sref="connection-list"><span>Friends of Friends ({{fofsMeta.count}})</span></a>
				<div class="list-group-item" ng-show="fofsMeta.count < 1">Oops! Nothing found.</div>
				<button type="button" class="list-group-item" ng-repeat="fof in fofs | orderBy:'name' | limitTo : 3"  ng-click="viewConnection(fof)">
					<img ng-src="{{fof.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-small">
					<span>{{fof.name}}</span>
					<span ng-if="fof.req_status == 3">(already requested)</span>
					<span ng-if="fof.res_status == 3">(wait to response)</span>
				</button>
			</div>
		</div>
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
			<div class="list-group">
				<a class="list-group-item" ui-sref="inventory-list"><span>My Inventory ({{itemsMeta.count}})</span><div class="pull-right" style="font-size:75%"><i class="fa fa-user"></i> Not shared <i class="fa fa-cloud-upload"></i> Shared</div></a>
				<div class="list-group-item" ng-show="itemsMeta.count < 1">Oops! Nothing found.</div>
				<button type="button" class="list-group-item" ng-repeat="item in items | orderBy:'-changed' | limitTo : 3" ng-click="editInventory(item)">
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
				<a class="list-group-item" ui-sref="transaction-list"><span>My Transactions ({{transactionsMeta.count}})</span></a>

				<div class="list-group-item list-group-item-info">As Owner ({{transactionsMeta.countAsOwner}})</div>
				<div class="list-group-item" ng-show="transactionsMeta.countAsOwner < 1">Oops! Nothing found.</div>
				<button type="button"  class="list-group-item" ng-repeat="transaction in transactions['owner'] | orderBy:'-update_timestamp' | limitTo : 3" style="height: 64px;" ng-click="openTransaction(transaction)">
					<div class="pull-right">
            			<img ng-src="{{transaction.borrower.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-tiny">
            			<span class="app-text app-text-tiny">{{transaction.borrower.name}}</span>
					</div>
					<div class="pull-left">
						<img ng-src="{{transaction.item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar-small">
					</div>
					<div class="pull-left" style="padding-left: 1em;">
            			<span class="app-text app-text-tiny">{{transaction.update_timestamp * 1000 | date : 'short'}}</span>
    					<span class="app-text app-text-tiny">{{transaction.status_label}}</span><br/>
    					<span>{{transaction.item.title}}</span>
					</div>
				</button>
				
				<div class="list-group-item list-group-item-info">As Borrower ({{transactionsMeta.countAsBorrower}})</div>
				<div class="list-group-item" ng-show="transactionsMeta.countAsBorrower < 1">Oops! Nothing found.</div>
				<button type="button"  class="list-group-item" ng-repeat="transaction in transactions['borrower'] | orderBy:'-update_timestamp' | limitTo : 3" style="height: 64px;" ng-click="openTransaction(transaction)">
					<div class="pull-right">
            			<img ng-src="{{transaction.owner.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-tiny">
            			<span class="app-text app-text-tiny">{{transaction.owner.name}}</span>
					</div>
					<div class="pull-left">
						<img ng-src="{{transaction.item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar-small">
					</div>
					<div class="pull-left" style="padding-left: 1em;">
            			<span class="app-text app-text-tiny">{{transaction.update_timestamp * 1000 | date : 'short'}}</span>
    					<span class="app-text app-text-tiny">{{transaction.status_label}}</span><br/>
    					<span>{{transaction.item.title}}</span>
					</div>
				</button>
			</div>
		</div>
	</div>
</div>