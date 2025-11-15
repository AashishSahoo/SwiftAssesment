import { configureStore } from "@reduxjs/toolkit";
import dashboardSlice from "./slices/dashboardSlice";
import profileSlice from "./slices/profileSlice";

const store = configureStore({
  reducer: {
    dashboard: dashboardSlice,
    profile: profileSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
