import { createSlice } from "@reduxjs/toolkit";


interface IUI {
    createContentModalOpen: boolean;
}

const initialState: IUI = {
    createContentModalOpen: false,
};


const UiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openCreateContentModal: (state) => {
            state.createContentModalOpen = true;
        },
        closeCreateContentModal: (state) => {
            state.createContentModalOpen = false;
        },
        toggleCreateContentModal: (state) => {
            state.createContentModalOpen = !state.createContentModalOpen;
        }
    }
})


export const { 
    openCreateContentModal, 
    closeCreateContentModal, 
    toggleCreateContentModal  
} = UiSlice.actions;

export default UiSlice.reducer; 