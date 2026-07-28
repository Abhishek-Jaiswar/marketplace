import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface OnboardingState {
  currentStep: number;
  isWelcomeView: boolean;
}

const initialState: OnboardingState = {
  currentStep: 1,
  isWelcomeView: true,
};

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setOnboardingStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setWelcomeView: (state, action: PayloadAction<boolean>) => {
      state.isWelcomeView = action.payload;
    },
    startOnboarding: (state) => {
      state.isWelcomeView = false;
      if (state.currentStep < 1) {
        state.currentStep = 1;
      }
    },
    resetOnboardingState: (state) => {
      state.currentStep = 1;
      state.isWelcomeView = true;
    },
  },
});

export const {
  setOnboardingStep,
  setWelcomeView,
  startOnboarding,
  resetOnboardingState,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
