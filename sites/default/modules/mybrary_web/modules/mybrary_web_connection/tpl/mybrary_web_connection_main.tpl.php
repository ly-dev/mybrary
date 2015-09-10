<div class="container">
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <a class="btn btn-link" href="<?php print url('dashboard'); ?>" role="button"><i class="glyphicon glyphicon-chevron-left"></i> Dashboard</a>
            <a class="btn btn-link" href="#" role="button" data-toggle="modal" data-target="#modalInviteFriend"><i class="glyphicon glyphicon-plus"></i> invite friends</a>
        </div>
    </div>
	<p></p>
	<div class="row">
		<div id="app-alert-container" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        </div>
    </div>
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="list-group friend-group">
				<div class="list-group-item">My Connection</div>
				<button type="button" class="list-group-item friend-item" ng-repeat="friend in friends">
					<img ng-src="https://graph.facebook.com/v2.4/{{friend.externalId}}/picture?height=64&width=64" alt="{{friend.externalName}}">
					<span>{{friend.externalName}}</span>
				</button>
			</div>
		</div>
	</div>
</div>
<!-- Modal Invite -->
<div class="modal fade" id="modalInviteFriend" tabindex="-1"
	role="dialog" aria-labelledby="Invite Friend">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title">Invite my facebook friends</h4>
			</div>
			<div class="modal-body">
				<form>
					<div class="form-group" ng-class="{'has-error has-feedback' : !validPostItForm()}">
						<label for="post-message" class="control-label">Message:</label>
						<textarea class="form-control" id="post-message" name="post-message" ng-model="postItForm.message"></textarea>
						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="!validPostItForm()"></span>
						<span class="help-block" ng-show="!validPostItForm()">Please enter an invitation message.</span>
					</div>
					<div class="form-group">
						<label for=post-link class="control-label">App link: <?php print url('', array('absolute' => TRUE)); ?></label>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary" ng-click="postIt()" ng-disabled="!validPostItForm()">Post it</button>
			</div>
		</div>
	</div>
</div>
