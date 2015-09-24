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
	
	$scope.editInventory = function (item) {
		$state.go('inventory-edit', {nid: item.nid});
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
	
	// prepare image crop 
	$scope.cropper = {
		sourceImage: null,
		croppedImage: null,
		originalCroppedImage: null,
		confirmedCroppedImage: null,
		bounds: {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		}
	};
	$scope.clearImage = function() {
		$scope.cropper.sourceImage = null;
		$scope.cropper.croppedImage = null;
		$scope.cropper.confirmedCroppedImage = null;
	};
	$scope.resetImage = function() {
		$scope.cropper.confirmedCroppedImage = $scope.cropper.originalCroppedImage;
	};
	$scope.cropImage = function() {
		$scope.cropper.confirmedCroppedImage = $scope.cropper.croppedImage;
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
			
			if (item.nid > 0 && item.field_image && item.field_image[0] && item.field_image[0].url) {
				$scope.cropper.originalCroppedImage = item.field_image[0].url;
				$scope.resetImage();
			}
			
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

		if (_.isEmpty($scope.cropper.confirmedCroppedImage)) {
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
			
			// only update image when changed
			AppLog.debug($scope.cropper);
			if ($scope.cropper.confirmedCroppedImage != $scope.cropper.originalCroppedImage) {
				data['field_image'] = {
						'data': $scope.cropper.confirmedCroppedImage
				};
			} else {
				data['field_image'] = null;
			}
			
			AppApi.inventoryUpdate(data).then(function(response) {
				$state.go('inventory-list');
				AppHelper.showAlert(response.message, response.status);
			});
		}
	}
}]);

