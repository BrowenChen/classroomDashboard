// for(var i = 0 ; i < 10 ; i ++){
//	console.log('bla');	
//	printi(i);
// }


// function printi(i){
//	console.log('printing i : ' + i );
//	console.log('printing i : ' + i );
//	console.log('printing i : ' + i );
//	console.log('printing i : ' + i );
//	console.log('printing i : ' + i );


// }




var allTasks = [ '.', 'algo', 'debugging', 'Logic', 'Loops', 'math', 'science', 'Loops', 'math', 'Loops', 'math','science']

var stdTaskData = [
{task: 'algo', user: 'John', percentage: 80},
{task: 'algo', user: 'Mary', percentage: 99},
{task: 'debugging', user: 'Mike', percentage: 21}
];

var students = ['John', 'Mary', 'Mike'];


var findByUserAndActivity = function(userId, activity, data){
	var result = null;
	for(var index in data){
		console.log("iterating");
		var item = data[index];
		console.log(item.user);
		console.log(item.task);
		if(item.user === userId & item.task === activity){
			console.log("found");
			result = item;
		}
	}
	return result;
}


var result = findByUserAndActivity('Mary', 'algo', stdTaskData);
console.log(result.percentage);