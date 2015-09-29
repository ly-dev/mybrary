<div class="container">
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <a class="btn btn-link" role="button" ui-sref="dashboard"><i class="glyphicon glyphicon-menu-left"></i> Dashboard</a>
        </div>
    </div>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="list-group">
				<a class="list-group-item" ui-sref="transaction-list"><span>My Transactions ({{transactionsMeta.count}})</span></a>

				<div class="list-group-item list-group-item-info">As Owner ({{transactionsMeta.countAsOwner}})</div>
				<div class="list-group-item" ng-show="transactionsMeta.countAsOwner < 1">Oops! Nothing found.</div>
				<button type="button"  class="list-group-item" ng-repeat="transaction in transactions['owner'] | orderBy : '-update_timestamp'"  style="height: 64px;" ng-click="openTransaction(transaction)">
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
				<button type="button"  class="list-group-item" ng-repeat="transaction in transactions['borrower'] | orderBy:'-update_timestamp'" style="height: 64px;" ng-click="openTransaction(transaction)">
					<div class="pull-right">
            			<img ng-src="{{transaction.owner.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-tiny">
            			<span class="app-text app-text-tiny">{{transaction.owner.name}}</span>
					</div>
					<div class="pull-left">
						<img ng-src="{{transaction.item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar-small">
					</div>
					<div class="pull-left" style="padding-left: 1em;">
            			<span class="app-text app-text-tiny">{{transaction.update_timestamp * 1000 | date : 'dd/MM/yyyy HH:mm:ss'}}</span>
    					<span class="app-text app-text-tiny">{{transaction.status_label}}</span><br/>
    					<span>{{transaction.item.title}}</span>
					</div>
				</button>
			</div>
		</div>
	</div>
</div>
