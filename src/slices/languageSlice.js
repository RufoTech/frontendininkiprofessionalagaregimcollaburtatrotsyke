import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    currentLang: localStorage.getItem('lang') || 'az',
  },
  reducers: {
    setLanguage: (state, action) => {
      state.currentLang = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;