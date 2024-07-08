import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Adjust the path based on your folder structure

const store = configureStore({
  reducer: rootReducer,
});

export default store;
