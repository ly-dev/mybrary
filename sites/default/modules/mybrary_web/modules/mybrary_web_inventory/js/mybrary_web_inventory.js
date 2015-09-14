'use strict';

angular.module('app_inventory', ['ui.router', 'ImageCropper', 'app_log', 'app_helper',  'app_api'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	// For any unmatched url, redirect to /
	$urlRouterProvider.otherwise("/main");
	
	// Now set up the states
	$stateProvider
    .state('main', {
		url: "/main",
		templateUrl: Drupal.settings.angularjsApp.basePath + '/inventory/main',
    	controller: 'InventoryController',
    	resolve:{
            termListPromise:  ['AppApi', function(AppApi) {
               return AppApi.termList();
            }]
        }
    });
}])

.controller('InventoryController', ['AppLog', 'AppHelper', 'AppApi', '$scope', 'termListPromise', function(AppLog, AppHelper, AppApi, $scope, termListPromise) {
    AppLog.debug("InventoryController");
    AppHelper.showLoading();
    
    $scope.terms = termListPromise;
    $scope.categories = AppApi.prepareTermOptionsByType(termListPromise, 'categories');
	
	var refreshList = function() {
		AppApi.inventoryList().then(function(data) {
			$scope.items = data;
			$scope.itemsMeta = {
				count: _.values(data).length
			};
			
			AppHelper.hideLoading();
		});
	}
	refreshList();
	
	$scope.modalItem = {
			title: "my modal",
	}

	$scope.formItemData = {};
	$scope.formItemErrors = {};
	
	// image related functions
	$scope.imageCrop = {};
	$scope.fileChanged = function(e) {			
		var files = e.target.files;
	
 		var fileReader = new FileReader();
 		$scope.imageCrop.file = files[0];
		fileReader.readAsDataURL(files[0]);		
		
		fileReader.onload = function(e) {
			$scope.imageCrop.raw = this.result;
			$scope.$apply();
		};
		
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
	
	$scope.validFormItem = function() {
		var result = true;
		
		if (_.isEmpty($scope.formItemData['title'] )) {
			$scope.formItemErrors['title'] = "Please enter name.";
			result = false;
		} else {
			$scope.formItemErrors['title'] = null;
		}
		
		if (_.isEmpty($scope.formItemData['field_type'] )) {
			$scope.formItemErrors['field_type'] = "Please choose category.";
			result = false;
		} else {
			$scope.formItemErrors['field_type'] = null;
		}

		if ($scope.imageCrop.step != 3) {
			$scope.formItemErrors['field_image'] = "Please choose image.";
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
				refreshList();
				AppHelper.showAlert(response.message, response.status);
				jQuery('#modalItem button[data-dismiss=modal]').click();
			});
		}
	}
	
	$scope.newItem = function (event) {
		$scope.formItemData = {
			'title': "New tool",
			'field_type': null,
			'field_model': "",
			'body': ""
		};
		
		$scope.clearImage();
		
		jQuery("#modalItem").modal('show');
	}
	
	$scope.editItem = function (item) {
		$scope.formItemData = angular.copy(item);
		
		$scope.resetImage(item);
		
		jQuery("#modalItem").modal('show');
	}
	
	// initialize modal
	jQuery("#modalItem").modal({show:false});
	
}]);

