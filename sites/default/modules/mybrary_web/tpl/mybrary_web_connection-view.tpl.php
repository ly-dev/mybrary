<div class="container">
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <a class="btn btn-link" role="button" ui-sref="connection-list"><i class="glyphicon glyphicon-menu-left"></i> My Connections</a>
        </div>
    </div>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="panel panel-default">
				<div class="panel-body">
    				<div class="clearfix">
    					<div class="pull-left">
    						<img ng-src="{{user.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar">
						</div>
						<div class="pull-left">
    						<span>{{user.name}}</span>
							<div class="app-text app-text-tiny">Member since {{ user.created * 1000 | date:'dd/MM/yyyy'}}</div>
    					</div>
    				</div>
    				<p></p>
    				<div class="clearfix">
						<div>{{user.mail}}</div>
    				</div>
    				<p></p>
				</div>
			</div>
		</div>
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="list-group">
				<div class="list-group-item">As owner
    				<div class="pull-right">
    					<i class="fa fa-thumbs-o-up"></i>&nbsp;{{user['feedback_as_owner_summary']['positive_percent']}}%({{user['feedback_as_owner_summary']['positive']}}) 
    					<i class="fa fa-genderless"></i>&nbsp;{{user['feedback_as_owner_summary']['neutral_percent']}}%({{user['feedback_as_owner_summary']['neutral']}})
    					<i class="fa fa-thumbs-o-down"></i>&nbsp;{{user['feedback_as_owner_summary']['negative_percent']}}%({{user['feedback_as_owner_summary']['negative']}})
    				</div>
				</div>
				<div class="list-group-item" ng-repeat="feedback in user['feedback_as_owner'] | orderBy: '-update_timestamp'">
					<div class="app-text app-text-tiny">{{feedback.update_timestamp | date:'dd/MM/yyyy HH:mm:ss'}} {{feedback.feedback_label}}</div>
					<div>{{feedback.feedback_text}}</div>
				</div>
			</div>
		</div>
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="list-group">
				<div class="list-group-item">As borrower
    				<div class="pull-right">
    					<i class="fa fa-thumbs-o-up"></i>&nbsp;{{user['feedback_as_borrower_summary']['positive_percent']}}%({{user['feedback_as_borrower_summary']['positive']}}) 
    					<i class="fa fa-genderless"></i>&nbsp;{{user['feedback_as_borrower_summary']['neutral_percent']}}%({{user['feedback_as_borrower_summary']['neutral']}})
    					<i class="fa fa-thumbs-o-down"></i>&nbsp;{{user['feedback_as_borrower_summary']['negative_percent']}}%({{user['feedback_as_borrower_summary']['negative']}})
    				</div>
				</div>
				<div class="list-group-item" ng-repeat="feedback in user['feedback_as_borrower'] | orderBy: '-update_timestamp'">
					<div class="app-text app-text-tiny">{{feedback.update_timestamp | date:'dd/MM/yyyy HH:mm:ss'}} {{feedback.feedback_label}}</div>
					<div>{{feedback.feedback_text}}</div>
				</div>
			</div>
		</div>		
	</div>
</div>