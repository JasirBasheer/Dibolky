import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IPortal {
    selectedCurrency:string;
    currencySymbol:string;
}

const initialState: IPortal = {
    selectedCurrency:"USD",
    currencySymbol:"$",
};


const PortalSlice = createSlice({
    name: 'portal',
    initialState,
    reducers: {
        setCurrency: (state, action: PayloadAction<IPortal>) => {
            return {
                ...state,
                ...action.payload
            }
        }
    }
  }) 


  export const { setCurrency } = PortalSlice.actions;
  export default PortalSlice.reducer; 