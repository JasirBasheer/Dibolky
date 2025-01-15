import { configureStore } from "@reduxjs/toolkit";
import agencyReducer from './slices/agencySlice'
import userReducer from './slices/userSlice'

 const store = configureStore({
    reducer:{
        agency: agencyReducer,
        user:userReducer,
    }
})


export default store;
