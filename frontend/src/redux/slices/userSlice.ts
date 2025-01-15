import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IUser {
    role?: string;
    planId?:string;
}

const initialState: IUser = {
    role: "",
    planId:"",
};


const UserReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
  }) 


  export const { setUser } = UserReducer.actions;
  export default UserReducer.reducer;