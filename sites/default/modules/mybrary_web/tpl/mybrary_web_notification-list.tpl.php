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
				<div class="list-group-item"><span>My Notification ({{notificationsMeta.count}})</span><div class="pull-right" ng-click="toggleArchive()">{{isArchiveVisible() ? 'hide' : 'show'}} achived</div></div>
				<div class="list-group-item" ng-show="notificationsMeta.count < 1">Oops! Nothing found.</div>
				<div class="list-group-item" ng-repeat="notification in notifications | orderBy:'-changed'">
					<div class="pull-right" ng-if="notification.field_status != 2"><span ng-click="archive(notification)"><i class="glyphicon glyphicon-remove"></i></span></div>
					<div>
            			<img ng-src="{{users[notification.uid].pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-tiny">
            			<span class="app-text app-text-tiny" ng-class="{'app-text-strong': notification.field_status == 0}">{{users[notification.uid].name}} {{notification.changed * 1000 | date : 'dd/MM/yyyy HH:mm:ss'}}</span>
					</div>
					<div class="btn btn-link" ng-click="gotoUri(notification)" ng-bind-html="notification.body"></div>
				</div>
			</div>
		</div>
	</div>
</div>