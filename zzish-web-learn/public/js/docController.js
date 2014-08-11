var developerApp = angular.module('developerApp', []);

developerApp.controller('DocNavigationController', function ($scope) {
	$scope.clearNav = function() {
		$scope.productCore = false;
        $scope.productPersonal = false;
        $scope.productSocial = false;
        $scope.sdkIos = false;
        $scope.sdkAndroid = false;
        $scope.sdkRest = false;
        $scope.api = false;
    };

    $scope.isActive = function() {
        return true;
    }
});

developerApp.controller('ProductViewController', function ($scope) {
    $scope.overview = true;
    $scope.how = false;
    $scope.resources = false;

    $scope.onSwitch = function(view) {
        switch(view){
            case 'overview':
                    $scope.overview = true;
                    $scope.how = false;
                    $scope.resources = false;
                    console.log('overview');
                break;
            case 'how':
                    $scope.overview = false;
                    $scope.how = true;
                    $scope.resources = false;
                    console.log('how');
                break;
            case 'resources':
                    $scope.overview = false;
                    $scope.how = false;
                    $scope.resources = true;
                    console.log('resources');
                break;
        }
    }
});