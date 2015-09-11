<div class="container">
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <a class="btn btn-link" href="<?php print url('dashboard'); ?>" role="button"><i class="glyphicon glyphicon-chevron-left"></i> Dashboard</a>
            <a class="btn btn-link" href="#" role="button" data-toggle="modal" data-target="#modalItem"><i class="glyphicon glyphicon-plus"></i> new item</a>
        </div>
    </div>
	<p></p>
	<div class="row">
		<div id="app-alert-container" class="col-xs-12 col-sm-12 col-md-12 col-lg-12"/>
    </div>
	<p></p>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="list-group">
				<div class="list-group-item">My Inventory</div>
				<button type="button" class="list-group-item" ng-if="_.isEmpty(items)">Oops! Nothing found.</button>
				<button type="button" class="list-group-item" ng-repeat="(id, item) in items">
					<img ng-src="{{item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar-small">
					<span>{{item.title}}</span>
				</button>
			</div>
		</div>
	</div>
</div>
<!-- Modal Invite -->
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
					<div class="form-group" ng-class="{'has-error has-feedback' : formItem.errors['image']}">
						<span class="help-block" ng-show="formItem.errors['image']">{{formItem.errors['image']}}</span>
						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formItem.errors['image']"></span>

						<div ng-show="imageCrop.step == 1">
                        	<input type="file" id="form-item-image" name="form-item-image" placeholder="Tool name" onchange="angular.element(this).scope().fileChanged(event)">
                        </div>
                       <div ng-show="imageCrop.step == 2">
                           <image-crop			 
                             data-height="220"
                             data-width="220"
                             data-shape="square"
                             data-step="imageCrop.step"
                             src="imageCrop.raw"
                             data-result="imageCrop.result"
                             data-result-blob="imageCrop.resultBlob"
                             crop="initCrop"
                             padding="40"
                             max-size="300"
                           ></image-crop>		   
                           <button ng-click="clearImage()">Cancel</button>
                           <button ng-click="initCrop = true">Crop</button>		
                       </div>		  
                       
                       <div ng-show="imageCrop.step == 3">
                       
                         <h2>Result</h2>
                       
                         <p>The data-result-blob property is a Blob object, which is necessary in some upload libraries like <a href="https://github.com/nervgh/angular-file-upload" target="_blank">Angular File Upload</a></p>
                         <p>Image using the data uri:</p>
                         <img ng-src="{{imageCrop.result}}"></img>
                         <p>The Base64 String used in the image above:</p>         
                         <textarea class="result-datauri">{{imageCrop.result }}</textarea>
                         <button ng-click="clearImage()">Clear</button>	
                       
                      </div>                        
                        
					</div>				
					<div class="form-group" ng-class="{'has-error has-feedback' : formItem.errors['title']}">
						<span class="help-block" ng-show="formItem.errors['title']">{{formItem.errors['title']}}</span>
						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formItem.errors['title']"></span>
                        <input type="text" class="form-control" id="form-item-title" name="form-item-title" placeholder="Tool name" ng-model="formItem.data['title']">
					</div>				
					<div class="form-group" ng-class="{'has-error has-feedback' : formItem.errors['category']}">
						<span class="help-block" ng-show="formItem.errors['category']">{{formItem.errors['category']}}</span>
						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formItem.errors['category']"></span>
						<select class="form-control" id="form-item-category" name="form-item-category" ng-options="option.name for option in cateogories track by option.tid" ng-model="formItem.data['category']">
						</select>
					</div>
					<div class="form-group">
                        <input type="text" class="form-control" id="form-item-model" name="form-item-model" placeholder="Tool model (optional)" ng-model="formItem.data['model']">
					</div>									
					<div class="form-group">
						<textarea class="form-control" id="form-item-body" name="form-item-body" placeholder="Tool description (optional)" ng-model="formItem.data['body']"></textarea>
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
