// reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import graphDataReducer from './graphDataSlice'; // Adjust the path based on your folder structure
import navReducer from './navSlice';

const rootReducer = combineReducers({
  graphData: graphDataReducer,
  nav: navReducer
});

export default rootReducer;
