import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IClient {
    id: string;
    orgId: string;
    name: string;
    email: string;
    facebookAccessToken: string,
    facebookUsername:string,
    instagramAccessToken:string,
    linkedinAccessToken:string,
    xAccessToken:string,
    instagramUsername:string,
}

const initialState: IClient = {
    id: "",
    orgId: "",
    name: "",
    email: "",
    facebookAccessToken: "",
    facebookUsername:"",
    instagramAccessToken:"",
    linkedinAccessToken:"",
    xAccessToken:"",
    instagramUsername:"",
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