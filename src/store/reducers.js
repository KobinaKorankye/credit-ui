// reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import graphDataReducer from './graphDataSlice'; // Adjust the path based on your folder structure

const rootReducer = combineReducers({
  graphData: graphDataReducer,
});

export default rootReducer;
