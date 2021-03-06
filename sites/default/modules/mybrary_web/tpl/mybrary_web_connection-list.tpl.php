<div class="container">
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <a class="btn btn-link" role="button" ui-sref="dashboard"><i class="glyphicon glyphicon-menu-left"></i> Dashboard</a>
            <a class="btn btn-link" href="#" role="button" data-toggle="modal" data-target="#modalInviteFriend"><i class="glyphicon glyphicon-plus"></i> invite friends</a>
        </div>
    </div>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="list-group">
				<div class="list-group-item"><span>My Friends ({{frdsMeta.count}})</span></div>
				<div class="list-group-item" ng-show="frdsMeta.count < 1">Oops! Nothing found.</div>
				<button type="button" class="list-group-item" ng-repeat="frd in frds | orderBy:'name'"  ng-click="viewConnection(frd)">
					<img ng-src="{{frd.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-small">
					<span>{{frd.name}}</span>
				</button>
			</div>
			<div class="list-group">
				<div class="list-group-item"><span>Friends of Friends ({{fofsMeta.count}})</span></div>
				<div class="list-group-item" ng-show="fofsMeta.count < 1">Oops! Nothing found.</div>
				<button type="button" class="list-group-item" ng-repeat="fof in fofs | orderBy:'name'"  ng-click="viewConnection(fof)">
					<img ng-src="{{fof.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-small">
					<span>{{fof.name}}</span>
					<span ng-if="fof.req_status == 3">(already requested)</span>
					<span ng-if="fof.res_status == 3">(wait to response)</span>
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
						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="!validPostItForm()"></span>
						<span class="help-block" ng-show="!validPostItForm()">Please enter your message.</span>
						<textarea class="form-control" id="post-message" name="post-message" placeholder="Your message" ng-model="postItForm.message"></textarea>
					</div>
					<div class="form-group">
						<label for=post-link class="control-label">Shared app link: <?php print url('', array('absolute' => TRUE)); ?></label>
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
