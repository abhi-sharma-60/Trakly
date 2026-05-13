// src/store/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leetcodeHandle: null,
  codeforcesHandle: null,
  leetcodeData: null,
  codeforcesData: null,
  analysis: null,        // NEW: Stores AI analysis text/object
  recommendations: [],   // NEW: Stores AI problem recommendations
  isSyncing: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setInitialSyncData: (state, action) => {
      if (action.payload.leetcode) {
        state.leetcodeData = action.payload.leetcode;
      }
      if (action.payload.codeforces) {
        state.codeforcesData = action.payload.codeforces;
      }
    },
    updateCodeforcesData: (state, action) => {
      state.codeforcesData = action.payload;
    },
    setSyncingStatus: (state, action) => {
      state.isSyncing = action.payload;
    },
    setLeetcodeHandle: (state, action) => {
      state.leetcodeHandle = action.payload;
    },
    setCodeforcesHandle: (state, action) => {
      state.codeforcesHandle = action.payload;
    },
    // NEW: Reducer to store AI results
    setUserAnalysisData: (state, action) => {
      state.analysis = action.payload.analysis;
      state.recommendations = action.payload.recommendations;
    },
    unlinkLeetcode: (state) => {
      state.leetcodeHandle = null;
      state.leetcodeData = null;
    },
    unlinkCodeforces: (state) => {
      state.codeforcesHandle = null;
      state.codeforcesData = null;
    },
    updateLeetcodeData: (state, action) => {
      state.leetcodeData = action.payload;
    },
  },
});

export const { 
  setInitialSyncData, 
  updateCodeforcesData, 
  setSyncingStatus,
  setLeetcodeHandle,
  setCodeforcesHandle,
  setUserAnalysisData, // NEW
  unlinkLeetcode,     // <-- export the new action
  unlinkCodeforces,    // <-- export the new action
  updateLeetcodeData
} = profileSlice.actions;

export default profileSlice.reducer;