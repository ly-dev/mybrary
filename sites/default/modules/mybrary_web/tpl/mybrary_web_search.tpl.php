<div class="container">
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="input-group">
				<input type="text" class="form-control" id="form-search-key" name="form-search-key" placeholder="Search for ..." ng-model="searchParams.key">
				<span class="input-group-btn"><button class="btn btn-primary" type="button" ng-click="goSearch()"><i class="glyphicon glyphicon-search"></i> Search</button></span>
			</div>
		</div>
	</div>
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<h3>From Friends</h3>
			<div class="pull-left" ng-show="frdItemsMeta.count < 1">Oops! Nothing found.</div>
			<div class="btn btn-link pul-left"  ng-repeat="(id, item) in frdItems">
				<div class="pull-left">
					<img ng-src="{{item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar-small">
				</div>
				<div class="pull-left" style="padding-left: 1em;">
					<span>{{item.title}}</span><br/>
					<span>{{terms[item.field_type].name}}</span>
				</div>
			</div>
		</div>
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<h3>From Friends of Friends</h3>
			<div class="pull-left" ng-show="fofItemsMeta.count < 1">Oops! Nothing found.</div>
			<div class="btn btn-link pul-left"  ng-repeat="(id, item) in fofItems">
				<div class="pull-left">
					<img ng-src="{{item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar-small">
				</div>
				<div class="pull-left" style="padding-left: 1em;">
					<span>{{item.title}}</span><br/>
					<span>{{terms[item.field_type].name}}</span>
				</div>
			</div>
		</div>
	</div>
</div>