/*
	Application using Redux (https://github.com/rackt/redux) 
	with an immutable state (https://facebook.github.io/immutable-js/).
*/

const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const Immutable = require('immutable');
const Redux = require('redux');
const thunkMiddleware = require('redux-thunk');
const Debug = require('redux-debug');

//Create an initial state
var initialState = Immutable.Map();

//Create the reducer map
var reducers = {};
reducers.dispatch = function(state, action){
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
		thunkMiddleware, // async actions
		Debug(console.log, {collapsed: true}) // Debug
	));

//Register reducer function
//TODO ACY Tester redux actions : https://github.com/acdlite/redux-actions
module.exports.registerReducer = function(reducer){
	reducers[reducer.type] = reducer.apply;
};

//Register reducer directory
module.exports.registerReducerDirectory = function(directory){
	
	var reducerFiles = fs.readdirSync(directory);

	_.each(reducerFiles, reducerFile => {
		var reducer = require(path.join(directory, reducerFile));
		registerReducer(reducer);
	});

};

//Dispatch action function
module.exports.dispatch = function(action){
	return store.dispatch(action);
};