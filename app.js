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
const createAction = require('redux-actions').createAction;

var app = {};

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

//Create async actions map
var asyncActions = {};

//Register reducer function
app.registerReducer = function(reducer){

	if(typeof reducer.action === 'function'){
		asyncActions[reducer.type] = reducer.action;
	}
	else{
		reducers[reducer.type] = reducer.apply;
	}

	//Chainable
	return app;
};

//Register reducer directory
app.registerReducerDirectory = function(directory){
	var rootDir = path.dirname(process.mainModule.filename);
	var reducerFiles = fs.readdirSync(path.join(rootDir, directory));

	_.each(reducerFiles, reducerFile => {
		var reducer = require(path.join(rootDir, directory, reducerFile));
		app.registerReducer(reducer);
	});

	//Chainable
	return app;
};

//Easy dispatch
store.do = function(actionType, payload){
	var action = createAction(actionType);
	if(payload){
		action = action(payload);
	}
	else{
		action = action();	
	}

	store.dispatch(action);

	//Chainable
	return app;
}
app.do = store.do;

//Easy dispatch async
store.doAsync = function(actionType, payload){
	var asyncAction = asyncActions[actionType];
	return store.dispatch(asyncAction(payload));
}
app.doAsync = store.doAsync;

module.exports = app;
