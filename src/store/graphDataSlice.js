import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dbClient from "../api/dbClient";

// 1. Define an async function using createAsyncThunk
export const fetchGraphData = createAsyncThunk('data/fetchGraphData', async () => {
    const response = await dbClient.get('/users/graph-data');
    return response.data; // This will be the payload of the fulfilled action
});

// 2. Handle different states in extraReducers
const graphDataSlice = createSlice({
    name: 'graphData',
    initialState: { data: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGraphData.pending, (state) => {
                state.status = 'loading'; // Handle loading state
            })
            .addCase(fetchGraphData.fulfilled, (state, action) => {
                state.status = 'succeeded'; // Handle success state
                state.data = action.payload; // Store the fetched data
            })
            .addCase(fetchGraphData.rejected, (state) => {
                state.status = 'failed'; // Handle error state
            });
    },
});

export default graphDataSlice.reducer;
