import { createSlice } from "@reduxjs/toolkit";


interface IUI {
    createContentModalOpen: boolean;
    planExpiredModal: boolean;
}

const initialState: IUI = {
    createContentModalOpen: false,
    planExpiredModal:false
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
        },
        openPlanExpiredModal: (state) => {
            state.planExpiredModal = true;
        },
        closePlanExpiredModal: (state) => {
            state.planExpiredModal = false;
        },
    }
})


export const { 
    openCreateContentModal, closeCreateContentModal, toggleCreateContentModal,
    openPlanExpiredModal,closePlanExpiredModal,
    
} = UiSlice.actions;

export default UiSlice.reducer; 