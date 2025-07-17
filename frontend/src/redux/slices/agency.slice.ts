import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IAgency {
    user_id: string;
    main_id: string;
    orgId: string;
    organizationName: string;
    ownerName: string;
    email: string;
    industry: string;
    facebookAccessToken: string;
    facebookUsername:string;
    instagramAccessToken:string;
    instagramUsername:string;
    linkedinAccessToken: string;
    xAccessToken: string;
    logo:string;
    remainingProjects: string;
    remainingClients: string;
}

const initialState: IAgency = {
    user_id:"",
    main_id: "",
    orgId: "",
    organizationName: "",
    ownerName: "",
    email: "",
    industry: "",
    facebookAccessToken: "",
    facebookUsername:"",
    instagramAccessToken:"",
    instagramUsername:"",
    linkedinAccessToken:"",
    xAccessToken:"",
    logo:"",
    remainingProjects: "",
    remainingClients: ""
};


const AgencySlice = createSlice({
    name: 'agency',
    initialState,
    reducers: {
        setAgency: (state, action: PayloadAction<Partial<IAgency>>) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
  }) 


  export const { setAgency } = AgencySlice.actions;
  export default AgencySlice.reducer;