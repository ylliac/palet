/*
	Application using Redux (https://github.com/rackt/redux) 
	with an immutable state (https://facebook.github.io/immutable-js/).
*/

var Immutable = require('immutable');
var Redux = require('redux');
var thunkMiddleware = require('redux-thunk');

//Create an initial state
var initialState = Immutable.Map();

//Create the reducer map
var reducers = {};
reducers.dispatch = function(state, action){
	console.log('=> ' + action.type);

	var reducer = reducers[action.type];
	if(reducer){
		return reducer(state, action);
	} 
	
	return state;
};

//Create the store
var store = Redux.createStore(
	reducers.dispatch, //dispatcher
	initialState, //initial state
	Redux.applyMiddleware(
	    thunkMiddleware // async actions
	));


//Register reducer function
//TODO ACY Tester redux actions : https://github.com/acdlite/redux-actions
module.exports.registerReducer = function(reducer){
	reducers[reducer.type] = reducer.apply;
}

//Dispatch action function
module.exports.dispatch = function(action){
	return store.dispatch(action);
}
