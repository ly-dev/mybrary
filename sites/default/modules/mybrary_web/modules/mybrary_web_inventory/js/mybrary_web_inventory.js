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
            }],
            inventoryListPromise:  ['AppApi', function(AppApi) {
               return AppApi.inventoryList();
            }]
        }
    });
}])

.controller('InventoryController', ['AppLog', 'AppHelper', 'AppApi', '$scope', 'termListPromise', 'inventoryListPromise', function(AppLog, AppHelper, AppApi, $scope, termListPromise, inventoryListPromise) {
    AppLog.debug("InventoryController");

    $scope.cateogories = AppApi.prepareTermOptionsByType(termListPromise, 'categories');
	$scope.items = inventoryListPromise;
	
	$scope.modalItem = {
			title: "my modal",
	}
	
	$scope.formItem = {
			data: {
				'title': "New tool",
				'category' : null,
				'model': "",
				'image': {},
				'body': ""
			},
			errors: {
				'title': null,
				'category': null,
				'model': null,
				'image': "Please choose an image.",
				'body': null
			}
	};
	
	$scope.validFormItem = function() {
		var result = true;
		
		if (_.isEmpty($scope.formItem.data['title'] )) {
			$scope.formItem.errors['title'] = "Please give a name.";
			result = false;
		} else {
			$scope.formItem.errors['title'] = null;
		}
		
		if (_.isEmpty($scope.formItem.data['category'] )) {
			$scope.formItem.errors['category'] = "Please choose a category.";
			result = false;
		} else {
			$scope.formItem.errors['category'] = null;
		}

		if ($scope.formItem.errors['image'] != null) {
			result = false;
		}
		
		return result;
	};
	
	$scope.imageCrop = {};
	$scope.fileChanged = function(e) {			
		var files = e.target.files;
	
 		var fileReader = new FileReader();
 		$scope.imageCrop.filename = files[0];
		fileReader.readAsDataURL(files[0]);		
		
		fileReader.onload = function(e) {
			$scope.imageCrop.raw = this.result;
			$scope.formItem.errors['image'] = null
			$scope.$apply();
		};
		
	};
	
	 var $imageFileElement = angular.element(document.getElementById('form-item-image'));
     $scope.clearImage = function() {
		 $scope.imageCrop.step = 1;
		 
		 $imageFileElement.replaceWith($imageFileElement.clone());
		 
		 delete $scope.imageCrop.filename;
		 delete $scope.imageCrop.raw;
		 delete $scope.imageCrop.result;
		 delete $scope.imageCrop.resultBlob;
		 $scope.formItem.errors['image'] = "Please choose an image."; 
	};	
	
}]);

