import { createSlice } from "@reduxjs/toolkit";

const initialState={
    balance: 0,
    transactionHistory: []
}

const TransactionSlice = createSlice({
    initialState,
    name: 'transaction',
    reducers:{
        creditTransaction: (state, action)=>{
            return {...state, balance: state.balance + +action.payload}
        },
        debitTransaction: (state, action)=>{
            return {...state, balance: state.balance - +action.payload}
        },
        addTransaction: (state, action)=>{
            return {...state, transactionHistory:[
                ...state.transactionHistory, {
                    transactionId:action.payload.transactionId,
                    transactionAmount: action.payload.transactionAmount,
                    transactionType: action.payload.transactionType,
                    transactionDate: action.payload.transactionDate
                }
            ]}
        }
    }
})

export const {creditTransaction, debitTransaction, addTransaction} = TransactionSlice.actions

export default TransactionSlice.reducer