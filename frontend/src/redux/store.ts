import { configureStore } from "@reduxjs/toolkit";
import agencyReducer from './slices/agency.slice'
import userReducer from './slices/user.slice'
import clientReducer from './slices/client.slice'
import portalReducer from './slices/portal.slice'
import uiReducer from './slices/ui.slice'

const store = configureStore({
    reducer: {
        agency: agencyReducer,
          user: userReducer,
        client: clientReducer,
        portal: portalReducer,
            ui: uiReducer,
    }
})


export default store;
