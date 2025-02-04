import { configureStore } from "@reduxjs/toolkit";
import agencyReducer from './slices/agencySlice'
import userReducer from './slices/userSlice'
import clientReducer from './slices/clientSlice'
import portalReducer from './slices/portal.slice'

const store = configureStore({
    reducer: {
        agency: agencyReducer,
          user: userReducer,
        client: clientReducer,
        portal: portalReducer,
    }
})


export default store;
