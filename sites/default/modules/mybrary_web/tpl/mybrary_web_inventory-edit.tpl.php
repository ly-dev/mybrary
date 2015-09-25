<div class="container">
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <a class="btn btn-link" role="button" ui-sref="inventory-list"><i class="glyphicon glyphicon-menu-left"></i> My Inventory</a>
        </div>
    </div>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<form>
					<div class="form-group" ng-class="{'has-error has-feedback' : formItemErrors['field_image']}">
						<span class="help-block" ng-show="formItemErrors['field_image']">{{formItemErrors['field_image']}}</span>
						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formItemErrors['field_image']"></span>
                		<div ng-show="cropper.confirmedCroppedImage==null">
                			<div>				
                    			<input type="file" id="form-item-image-file" name="form-item-image-file" img-cropper-fileread image="cropper.sourceImage" />
                			</div>
                            <div>
                                 <canvas width="250" height="250" id="canvas" image-cropper image="cropper.sourceImage" cropped-image="cropper.croppedImage" crop-width="200" crop-height="200" keep-aspect="true" touch-radius="30" crop-area-bounds="cropper.bounds"></canvas>
                            </div>
                            <div>
                            	<button type="button" class="btn btn-primary" ng-click="cropImage()">Crop</button>
                            	<button type="button" class="btn btn-default" ng-click="resetImage()">Reset</button>
                            </div>
                        </div>
                        <div ng-show="cropper.confirmedCroppedImage!=null">
                            <img ng-src="{{cropper.confirmedCroppedImage}}" />
                            <div>
                            	<button type="button" class="btn btn-default" ng-click="clearImage()">Change</button>
                            </div>
                        </div>
        			</div>				
					<div class="form-group" ng-class="{'has-error has-feedback' : formItemErrors['title']}">
						<span class="help-block" ng-show="formItemErrors['title']">{{formItemErrors['title']}}</span>
						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formItemErrors['title']"></span>
                        <input type="text" class="form-control" id="form-item-title" name="form-item-title" placeholder="Tool name" ng-model="formItemData['title']" maxlength="50">
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
                        <input type="text" class="form-control" id="form-item-field_model" name="form-item-field_model" placeholder="Tool model (optional)" ng-model="formItemData['field_model']" maxlength="50">
					</div>									
					<div class="form-group">
						<div>{{150-formItemData['body'].length}} characters left</div>
						<textarea class="form-control" id="form-item-body" name="form-item-body" placeholder="Tool description (optional)" ng-model="formItemData['body']" maxlength="150"></textarea>
					</div>									
				</form>
				
    			<div class="btn-group" role="group" aria-label="">
    				<button type="button" class="btn btn-primary" ng-click="saveItem()" ng-disabled="!validFormItem()">Save</button>
    				<a class="btn btn-default" role="button" ui-sref="inventory-list">Cancel</a>
    			</div>
		</div>
	</div>
</div>