import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leetcodeData: null,
  codeforcesData: null,
  isSyncing: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Used when the app first loads and fetches the initial DB state
    setInitialSyncData: (state, action) => {
      if (action.payload.leetcode) {
        state.leetcodeData = action.payload.leetcode;
      }
      if (action.payload.codeforces) {
        state.codeforcesData = action.payload.codeforces;
      }
    },
    // Used specifically when the SSE worker finishes its background job
    updateCodeforcesData: (state, action) => {
      state.codeforcesData = action.payload;
    },
    // Optional: useful if you want to show a global loading spinner
    setSyncingStatus: (state, action) => {
      state.isSyncing = action.payload;
    },
  },
});

export const { setInitialSyncData, updateCodeforcesData, setSyncingStatus } = profileSlice.actions;
export default profileSlice.reducer;