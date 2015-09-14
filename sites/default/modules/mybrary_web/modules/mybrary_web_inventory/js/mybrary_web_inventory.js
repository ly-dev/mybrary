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

		if ($scope.formItem.errors['image'] != null && $scope.formItem.data.image.step != 3) {
			result = false;
		}
		
		return result;
	};
	
	$scope.fileChanged = function(e) {			
		var files = e.target.files;
	
 		var fileReader = new FileReader();
 		$scope.formItem.data.image.file = files[0];
		fileReader.readAsDataURL(files[0]);		
		
		fileReader.onload = function(e) {
			$scope.formItem.data.image.raw = this.result;
			$scope.formItem.errors['image'] = null
			$scope.$apply();
		};
		
	};
	
     $scope.clearImage = function() {
		 $scope.formItem.data.image.step = 1;
		 delete $scope.formItem.data.image.file;
		 delete $scope.formItem.data.image.raw;
		 delete $scope.formItem.data.image.result;
		 delete $scope.formItem.data.image.resultBlob;
		 $scope.formItem.errors['image'] = "Please choose an image."; 
	};
	
	$scope.saveItem = function() {
		if ($scope.validFormItem) {
			AppHelper.showLoading();
			
			var data = {
				title: $scope.formItem.data.title,
				field_type: $scope.formItem.data.category,
				field_model: $scope.formItem.data.model,
				body:$scope.formItem.data.body
			};
			
			// only update if image changed
			if ($scope.formItem.data.image.file) {
				data['field_image'] = {
					name: $scope.formItem.data.image.file.name,
					data: $scope.formItem.data.image.result
				};
			}
			
			AppApi.inventoryUpdate(data).then(function(response) {
				AppHelper.hideLoading();

				AppHelper.showAlert(response.message, response.status);
				jQuery('#modalItem button[data-dismiss=modal]').click();
			});
		}
	}
	
}]);

