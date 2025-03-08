import { ReduxIUser } from "@/types/user.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState: ReduxIUser = {
  user_id: "",
  role: "",
  profile:"",
  bio:"",
  planId: "",
  orgId: "",
  facebookAccessToken: "",
  instagramAccessToken: "",
  email: "",
  name: "",
  organizationName: "",
  main_id:"",
};


const UserReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<ReduxIUser>>) => {
      return {
        ...state,
        ...action.payload,
      };
    }
  }
})


export const { setUser } = UserReducer.actions;
export default UserReducer.reducer;