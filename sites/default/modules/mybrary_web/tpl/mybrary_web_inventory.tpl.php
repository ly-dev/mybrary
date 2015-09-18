<div class="container">
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <button type="button" class="btn btn-link" ng-click="newItem(event)"><i class="glyphicon glyphicon-plus"></i> new item</button>
        </div>
    </div>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="list-group">
				<div class="list-group-item"><span>My Inventory ({{itemsMeta.count}})</span><div class="pull-right" style="font-size:75%"><i class="fa fa-user"></i> Not shared <i class="fa fa-cloud-upload"></i> Shared</div></div>
				<button type="button" class="list-group-item" ng-show="itemsMeta.count < 1">Oops! Nothing found.</button>
				<button type="button" class="list-group-item" ng-repeat="(id, item) in items track by id" ng-click="editItem(item)">
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

<!-- Modal Item -->
<div class="modal fade" id="modalItem" tabindex="-1"
	role="dialog" aria-labelledby="Inventory Item">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h4 class="modal-title">{{modalItem.title}}</h4>
			</div>
			<div class="modal-body">
				<form>
					<div class="form-group" ng-class="{'has-error has-feedback' : formItemErrors['field_image']}">
						<span class="help-block" ng-show="formItemErrors['field_image']">{{formItemErrors['field_image']}}</span>
						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formItemErrors['field_image']"></span>
						<div ng-show="imageCrop.step == 1">
                    		<input type="file" id="form-item-field_image" name="form-item-field_image" placeholder="Tool name" onchange="angular.element(this).scope().fileChanged(event)">
                    	</div>
                        <div class="panel panel-default" ng-show="imageCrop.step == 2">
                            <div class="panel-body">
		                         <div style="text-align: center;">	
									 <div class="btn-group" role="group">
                                        <button type="button" class="btn btn-primary" ng-click="initCrop = true">Crop</button>
    	                            	<button type="button" class="btn btn-default" ng-click="clearImage()">Clear</button>
        	                         </div>
    	                         </div>
                            	<div style="margin-left:-5px;">
                                <image-crop			 
                                  data-height="200"
                                  data-width="200"
                                  data-shape="square"
                                  data-step="imageCrop.step"
                                  src="imageCrop.raw"
                                  data-result="imageCrop.result"
                                  data-result-blob="imageCrop.resultBlob"
                                  crop="initCrop"
                                  padding="50"
                                  max-size="300"></image-crop>
                                  </div>
                            </div>
                        </div>		  
                        <div class="panel panel-default" ng-show="imageCrop.step == 3">
                            <div class="panel-body">
		                         <div style="text-align: center;">	
									 <div class="btn-group" role="group">
    		                         	  <button class="btn btn-default" ng-click="clearImage()">Choose new image </button>
    		                         </div>
    		                         <div>
    		                         	  <img ng-src="{{imageCrop.result}}"></img>
    		                         </div>
		                         </div>
                            </div>
                        </div>		  
        			</div>				
					<div class="form-group" ng-class="{'has-error has-feedback' : formItemErrors['title']}">
						<span class="help-block" ng-show="formItemErrors['title']">{{formItemErrors['title']}}</span>
						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formItemErrors['title']"></span>
                        <input type="text" class="form-control" id="form-item-title" name="form-item-title" placeholder="Tool name" ng-model="formItemData['title']">
					</div>				
					<div class="form-group" ng-class="{'has-error has-feedback' : formItemErrors['field_type']}">
						<span class="help-block" ng-show="formItemErrors['field_type']">{{formItemErrors['field_type']}}</span>
						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formItemErrors['field_type']"></span>
						<select class="form-control" id="form-item-field_type" name="form-item-field_type" ng-model="formItemData['field_type']">
							<option ng-repeat="category in categories track by category.tid" value="{{category.tid}}" ng-selected="formItemData['field_type'] == category.tid" >{{category.name}}</option>
						</select>
					</div>
					<div class="form-group" ng-class="{'has-error has-feedback' : formItemErrors['field_shared']}">
						<span class="help-block" ng-show="formItemErrors['field_shared']">{{formItemErrors['field_shared']}}</span>
						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formItemErrors['field_shared']"></span>
						<select class="form-control" id="form-item-field_shared" name="form-item-field_shared" ng-model="formItemData['field_shared']">
							<option ng-repeat="option in sharedOptions track by option.id" value="{{option.id}}" ng-selected="formItemData['field_shared'] == option.id" >{{option.label}}</option>
						</select>
					</div>
					<div class="form-group">
                        <input type="text" class="form-control" id="form-item-field_model" name="form-item-field_model" placeholder="Tool model (optional)" ng-model="formItemData['field_model']">
					</div>									
					<div class="form-group">
						<textarea class="form-control" id="form-item-body" name="form-item-body" placeholder="Tool description (optional)" ng-model="formItemData['body']"></textarea>
					</div>									
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary" ng-click="saveItem()" ng-disabled="!validFormItem()">Save</button>
			</div>
		</div>
	</div>
</div>
