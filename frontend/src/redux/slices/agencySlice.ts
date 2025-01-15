import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IAgency {
    id: string;
    orgId: string;
    organizationName: string;
    ownerName: string;
    email: string;
    industry: string;
    logo:string;
    remainingProjects: string;
    remainingClients: string;
}

const initialState: IAgency = {
    id: "",
    orgId: "",
    organizationName: "",
    ownerName: "",
    email: "",
    industry: "",
    logo:"",
    remainingProjects: "",
    remainingClients: ""
};


const AgencySlice = createSlice({
    name: 'agency',
    initialState,
    reducers: {
        setAgency: (state, action: PayloadAction<IAgency>) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
  }) 


  export const { setAgency } = AgencySlice.actions;
  export default AgencySlice.reducer;