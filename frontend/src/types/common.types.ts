import store from "@/redux/store";
import React from "react";

export interface NavbarProps  {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
