import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export interface FeedState {
  isLoading: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
}

const initialState: FeedState = {
  isLoading: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
};

export const getFeedThunk = createAsyncThunk('feed/getFeed', getFeedsApi);
export const getOrdersThunk = createAsyncThunk(
  'feed/getProfileFeed',
  getOrdersApi
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectFeedState: (state) => state,
    selectOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedThunk.pending, handlePending)
      .addCase(getFeedThunk.rejected, handleRejected)
      .addCase(getFeedThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.orders = payload.orders;
        state.total = payload.total;
        state.totalToday = payload.totalToday;
      })
      .addCase(getOrdersThunk.pending, handlePending)
      .addCase(getOrdersThunk.rejected, handleRejected)
      .addCase(getOrdersThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.orders = payload;
      });
  }
});

function handlePending(state: FeedState) {
  state.isLoading = true;
  state.error = null;
}

function handleRejected(state: FeedState, action: any) {
  state.isLoading = false;
  state.error = action.error?.message || 'Произошла ошибка';
}

export const { selectFeedState, selectOrders } = feedSlice.selectors;
export { initialState as feedInitialState };
export default feedSlice.reducer;
