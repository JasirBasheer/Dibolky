import { configureStore } from "@reduxjs/toolkit";
import agencyReducer from '../redux/slices/agency.slice'
import userReducer from '../redux/slices/user.slice'
import clientReducer from '../redux/slices/client.slice'
import portalReducer from '../redux/slices/portal.slice'
import uiReducer from '../redux/slices/ui.slice'

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
