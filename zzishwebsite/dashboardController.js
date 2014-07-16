var teacherDashboardApp = angular.module('teacherDashboardApp', []);

teacherDashboardApp.controller('StudentController', function ($scope) {

	//Dummy Data
	$scope.students =
				[{name:'John', percentage:10, currentTask:'algo'},
				 {name:'Mary', percentage:19, currentTask:'algo'},
				 {name:'Mike', percentage:21, currentTask:'debugging'},
				 {name:'Adam', percentage:45, currentTask:'debugging'},
				 {name:'Gerald', percentage:53, currentTask:'debugging'},
				 {name:'Samir', percentage:23, currentTask:'debugging'},
				 {name:'Charles', percentage:52, currentTask:'debugging'},
				 {name:'Daryl', percentage:62, currentTask:'Logic'},
				 {name:'Chris', percentage:46, currentTask:'Logic'},
				 {name:'Owen', percentage:24, currentTask:'Logic'},
				 {name:'Morgan', percentage:53, currentTask:'Logic'},
				 {name:'Owen', percentage:75, currentTask:'Logic'},
				 {name:'Chad', percentage:85, currentTask:'debugging'},
				 {name:'Joe', percentage:42, currentTask:'debugging'},
				 {name:'Yeajoon', percentage:60, currentTask:'debugging'},
				 {name:'Mark', percentage:68, currentTask:'Loops'},
				 {name:'Alex', percentage:98, currentTask:'Loops'},
				 {name:'Rory', percentage:22, currentTask:'Loops'},
				 {name:'Dan', percentage:25, currentTask:'debugging'},
				 {name:'Jessica', percentage:14, currentTask:'debugging'},
				 {name:'Anna', percentage:35, currentTask:'debugging'},
				 {name:'Nicole', percentage:75, currentTask:'debugging'},
				 {name:'Jasmine', percentage:73, currentTask:'debugging'},
				 {name:'Fatima', percentage:14, currentTask:'debugging'},
				 {name:'Adam', percentage:36, currentTask:'debugging'},
				 {name:'Julie', percentage:75, currentTask:'algo'}];

	//Initialise sorting and grade filtering
	$scope.predicate = 'name';

	$scope.minGradeR = 0;
	$scope.maxGradeR = 25;

	$scope.minGradeA = 25;
	$scope.maxGradeA = 50;

	$scope.minGradeY = 50;
	$scope.maxGradeY = 75;

	$scope.minGradeG = 75;
	$scope.maxGradeG = 100;

	//filter functions
	$scope.greenFilter = function(){
		if($scope.maxGradeG == 100){
			$scope.minGradeG = 0;
			$scope.maxGradeG = 0;
		} else {
			$scope.minGradeG = 75;
			$scope.maxGradeG = 100;
		}
	}

	$scope.yellowFilter = function(){
		if($scope.maxGradeY == 75){
			$scope.minGradeY = 0;
			$scope.maxGradeY = 0;
		} else {
			$scope.minGradeY = 50;
			$scope.maxGradeY = 75;
		}
	}

	$scope.amberFilter = function(){
		if($scope.maxGradeA == 50){
			$scope.minGradeA = 0;
			$scope.maxGradeA = 0;
		} else {
			$scope.minGradeA = 25;
			$scope.maxGradeA = 50;
		}
	}

	$scope.redFilter = function(){
		if($scope.maxGradeR == 25){
			$scope.minGradeR = 0;
			$scope.maxGradeR = 0;
		} else {
			$scope.minGradeR = 0;
			$scope.maxGradeR = 25;
		}
	}

	$scope.gradeRange = function (std) {
			return (std.percentage >= $scope.minGradeR && std.percentage <= $scope.maxGradeR) || 
					(std.percentage >= $scope.minGradeG && std.percentage <= $scope.maxGradeG) || 
					(std.percentage >= $scope.minGradeY && std.percentage <= $scope.maxGradeY) || 
					(std.percentage >= $scope.minGradeA && std.percentage <= $scope.maxGradeA);
	};

	//Setting color of all students everytime there is a score update. 
	$scope.setColor = function(){
		var redMin = 0;
		var redMax = 25;

		var amberMin = 26; 
		var amberMax = 50;

		var yellowMin = 51;
		var yellowMax = 75;

		var greenMin = 76;
		var greenMax = 100;

		for (std in this.students){
			switch(std.percentage){
				case (std.percentage >= redMin && std.percentage <= redMax):
					std.colour = "red";
					break;
				case (std.percentage >= amberMin && std.percentage <= amberMax):
					std.colour = "amber";
					break;
				case (std.percentage >= yellowMin && std.percentage <= yellowMax):
					std.colour = "yellow";
					break;					
				case (std.percentage >= greenMin && std.percentage <= greenMax):
					std.colour = "green";
					break;		
				default:
					std.colour = "none";
					break;
			}
			
		}
	}



	//toggle buttons
	$scope.isActive = true;
	$scope.isViewActive = true;

	$scope.greenIsActive = true;
	$scope.yellowIsActive = true;
	$scope.amberIsActive = true;
	$scope.redIsActive = true;

	//sorting
	$scope.TaskActive = false;
	$scope.PerActive = true;
	$scope.AbcActive = false;


	$scope.isTaskActive = function() {
		$scope.TaskActive = true;
		$scope.PerActive = false;
		$scope.AbcActive = false;	
	};

	$scope.isPerActive = function() {
		$scope.TaskActive = false;
		$scope.PerActive = true;
		$scope.AbcActive = false;
	};

	$scope.isAbcActive = function() {
		$scope.TaskActive = false;
		$scope.PerActive = false;
		$scope.AbcActive = true;
	};

	//colour highlighting
	$scope.valueRed = 'green';
	 
	//Filters

	$scope.toggleGreen = function() {
		$scope.greenIsActive = !$scope.greenIsActive;
	};


	$scope.toggleYellow = function() {
		$scope.yellowIsActive = !$scope.yellowIsActive;
	};


	$scope.toggleAmber = function() {
		$scope.amberIsActive = !$scope.amberIsActive;
	};


	$scope.toggleRed = function() {
		$scope.redIsActive = !$scope.redIsActive;
	};

	//Views

	$scope.viewActive = function(view) {
		if(view == 'pane'){
			$scope.isViewActive = true;
		} else {
			$scope.isViewActive = false;
		}
	}

});