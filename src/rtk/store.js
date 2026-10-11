import { configureStore } from "@reduxjs/toolkit";
import TransactionReducer from './slice/TransactionSlice'
export const store = configureStore({
  reducer: {
    transaction: TransactionReducer
  }
})