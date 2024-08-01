import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducer.js';

const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export default store;