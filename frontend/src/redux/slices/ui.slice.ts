import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUI {
  createContentModalOpen: boolean;
  planExpiredModal: boolean;
  inCall: boolean;
  outgoingCall: { recipientId: string, chatId:string, callType: "audio" | "video" } | null;

}

const initialState: IUI = {
  createContentModalOpen: false,
  planExpiredModal: false,
  inCall: false,
  outgoingCall:  null

};

const UiSlice = createSlice({
  name: "ui",
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
    setInCall: (state, action: PayloadAction<boolean>) => {
      state.inCall = action.payload;
    },
    setOutgoingCall(state, action: PayloadAction<{ chatId:string; recipientId: string; callType: "audio" | "video" } | null>) {
      state.outgoingCall = action.payload;
    },
    resetCallState: () => initialState,
  },
});

export const {
  openCreateContentModal,
  closeCreateContentModal,
  toggleCreateContentModal,
  openPlanExpiredModal,
  closePlanExpiredModal,
  setInCall,
  resetCallState,
  setOutgoingCall
} = UiSlice.actions;

export default UiSlice.reducer;
