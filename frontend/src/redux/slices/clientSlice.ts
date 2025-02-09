import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IClient {
    id: string;
    orgId: string;
    name: string;
    email: string;
    facebookAccessToken: string,
    facebookUsername:string,
    instagramAccessToken:string,
    instagramUsername:string,
    services:any
}

const initialState: IClient = {
    id: "",
    orgId: "",
    name: "",
    email: "",
    facebookAccessToken: "",
    facebookUsername:"",
    instagramAccessToken:"",
    instagramUsername:"",
    services:{}
};


const ClientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        setClient: (state, action: PayloadAction<Partial<IClient>>) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
  }) 


  export const { setClient } = ClientSlice.actions;
  export default ClientSlice.reducer;