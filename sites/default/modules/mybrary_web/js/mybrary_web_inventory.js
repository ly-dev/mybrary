'use strict';

angular.module('app_mybrary')

.config(['$stateProvider', function($stateProvider) {
	$stateProvider
    .state('inventory-list', {
		url: "/inventory-list",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/tpl/inventory-list',
    	controller: 'InventoryListController',
    	resolve:{
            termListPromise:  ['AppApi', function(AppApi) {
               return AppApi.getTerms();
            }]
        }
    })
    .state('inventory-edit', {
		url: "/inventory-edit/:nid",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/tpl/inventory-edit',
    	controller: 'InventoryEditController',
    	resolve:{
            termListPromise:  ['AppApi', function(AppApi) {
               return AppApi.getTerms();
            }]
        }
    });
}])

.controller('InventoryListController', ['AppLog', 'AppHelper', 'AppApi', '$state', '$scope', 'termListPromise', 
    function(AppLog, AppHelper, AppApi, $state, $scope, termListPromise) {
    AppLog.debug("InventoryListController");
    
    $scope.terms = termListPromise;
    $scope.categories = AppApi.prepareTermOptionsByType(termListPromise, 'categories');
    $scope.sharedOptions = [
        {id: 0, label: "not shared"},
        {id: 1, label: "shared"}
    ];
	
	var refreshList = function() {
		AppHelper.showLoading();

		AppApi.inventoryList().then(function(data) {
			$scope.items = _.values(data);
			$scope.itemsMeta = {
				count: $scope.items.length
			};
			
			AppHelper.hideLoading();
		});
	}
	refreshList();
	
	$scope.editInventory = function (nid) {
		$state.go('inventory-edit', {nid: nid});
	};
}])

.controller('InventoryEditController', ['AppLog', 'AppHelper', 'AppApi', '$state', '$stateParams', '$scope', 'termListPromise',
    function(AppLog, AppHelper, AppApi, $state, $stateParams, $scope, termListPromise) {
    AppLog.debug("InventoryEditController");
    
    $scope.terms = termListPromise;
    $scope.categories = AppApi.prepareTermOptionsByType(termListPromise, 'categories');
    $scope.sharedOptions = [
        {id: 0, label: "not shared"},
        {id: 1, label: "shared"}
    ];
	
    
	// image crop related functions
	$scope.imageCrop = {};
	$scope.fileUpload = function(e) {	
    	AppLog.debug('fileUpload');
    	
    	var formId = '#image-upload-form',
    		files = e.target.files;
    	
    	$scope.imageCrop.file = files[0];
    	
    	//callback handler for form submit
    	jQuery(formId).submit(function(e){
    	    var myTarget = '#image-upload-form-file-status',
    	    	formURL = jQuery(this).attr("action"),
    	    	postData = new FormData(document.getElementById('image-upload-form'));
    	    
    	    jQuery.ajax({
    	        url : formURL,
    	        type: "POST",
    	        xhr: function() {  // Custom XMLHttpRequest
    	            var myXhr = jQuery.ajaxSettings.xhr();
    	            if(myXhr.upload){ // Check if upload property exists
    	                myXhr.upload.addEventListener('progress',function(e) {
    	                	jQuery(myTarget).text(Math.round(e.loaded / e.total * 100) + '% loaded');
    	                }, false); // For handling the progress of the upload
    	            }
    	            return myXhr;
    	        },
    	        data : postData,
    	        beforeSend: function( jqXHR, settings ) {
    	        	jQuery(myTarget).text('Loading...');
                },
    	        success: function(response, textStatus, jqXHR) {
    	        	jQuery(myTarget).text(response.message);
    	        	
    	        	if (response.status == 'success') {
	    	            $scope.imageCrop.raw = response.data;
	    				$scope.$apply();
    	        	} else {
    	        		
    	        	}
    	        },
    	        error: function(jqXHR, textStatus, errorThrown){
    	        	jQuery(myTarget).text(textStatus);
    	        },
    	        //Options to tell jQuery not to process data or worry about content-type.
    	        cache: false,
    	        contentType: false,
    	        processData: false
    	    });
    	    
    	    e.preventDefault(); // STOP default action
    	});
    	 
    	jQuery(formId).submit(); //Submit the FORM    	
    };
	
     $scope.clearImage = function() {
		 $scope.imageCrop.step = 1;
		 delete $scope.imageCrop.file;
		 delete $scope.imageCrop.raw;
		 delete $scope.imageCrop.result;
		 delete $scope.imageCrop.resultBlob;
	};
	
    $scope.resetImage = function(item) {
		 delete $scope.imageCrop.file;
		 delete $scope.imageCrop.raw;
		 delete $scope.imageCrop.resultBlob;
		 
		 $scope.imageCrop.step = 3;
		 $scope.imageCrop.result = item.field_image[0].url;
	};	

	// prepare form
	$scope.formItemData = {};
	var refreshInventory = function() {
	    AppHelper.showLoading();

	    (function() {
	    	return AppApi.inventoryView({nid: $stateParams.nid});
		})().then(function(item) {
			AppLog.debug(item);
			
			$scope.item = item;
			$scope.formItemData = angular.copy($scope.item);
			
			if (item.nid > 0) {
				$scope.resetImage(item);
			}
			
			// reset image
			// $scope.resetImage(item);
			
			AppHelper.hideLoading();
		});
	};
	refreshInventory();
	
	$scope.formItemErrors = {};
	$scope.validFormItem = function() {
		var result = true;
		
		if (_.isEmpty($scope.formItemData['title'] )) {
			$scope.formItemErrors['title'] = "Please enter name.";
			result = false;
		} else {
			$scope.formItemErrors['title'] = null;
		}
		
		if (_.isEmpty($scope.formItemData['field_type'] )) {
			$scope.formItemErrors['field_type'] = "Please select category.";
			result = false;
		} else {
			$scope.formItemErrors['field_type'] = null;
		}

		if (_.isEmpty($scope.formItemData['field_shared'] )) {
			$scope.formItemErrors['field_shared'] = "Please select share status.";
			result = false;
		} else {
			$scope.formItemErrors['field_shared'] = null;
		}

		if ($scope.imageCrop.step != 3) {
			$scope.formItemErrors['field_image'] = "Please select image.";
			result = false;
		} else {
			$scope.formItemErrors['field_image'] = null;
		}
		
		return result;
	};
	
	$scope.saveItem = function() {
		if ($scope.validFormItem) {
			AppHelper.showLoading();
			
			var data = angular.copy($scope.formItemData);
			
			// only update if image changed
			if ($scope.imageCrop.file && $scope.imageCrop.step == 3) {
				data['field_image'] = {
					name: $scope.imageCrop.file.name,
					data: $scope.imageCrop.result
				};
			}
			
			AppApi.inventoryUpdate(data).then(function(response) {
				$state.go('inventory-list');
				AppHelper.showAlert(response.message, response.status);
			});
		}
	}
	
}]);

