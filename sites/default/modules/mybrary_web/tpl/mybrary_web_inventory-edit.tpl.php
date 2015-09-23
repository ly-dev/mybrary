<div class="container">
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <a class="btn btn-link" role="button" ui-sref="inventory-list"><i class="glyphicon glyphicon-menu-left"></i> My Inventory</a>
        </div>
    </div>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                <div ng-show="imageCrop.step == 1">
                    <form enctype="multipart/form-data" id="image-upload-form" action="<?php print url('ajax/image-upload'); ?>" method="post">
                		<input type="file" name="image-upload-form-file" id="image-upload-form-file" onchange="angular.element(this).scope().fileUpload(event)">
                		<div id="image-upload-form-file-status"></div>
                    </form>
                </div>
                
				<form>
					<div class="form-group" ng-class="{'has-error has-feedback' : formItemErrors['field_image']}">
						<span class="help-block" ng-show="formItemErrors['field_image']">{{formItemErrors['field_image']}}</span>
						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formItemErrors['field_image']"></span>
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
				
    			<div class="btn-group" role="group" aria-label="">
    				<button type="button" class="btn btn-primary" ng-click="saveItem()" ng-disabled="!validFormItem()">Save</button>
    				<a class="btn btn-default" role="button" ui-sref="inventory-list">Cancel</a>
    			</div>
		</div>
	</div>
</div>