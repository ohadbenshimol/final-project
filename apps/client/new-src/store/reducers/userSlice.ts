import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../Store';

export interface UserState {
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  pictureUrl?: string;
}
// Define the initial state using that type
const initialState: UserState = {};

export const userSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUser: (state, action: PayloadAction<UserState>) => {
      const { firstName, email, fullName, lastName, pictureUrl } =
        action.payload;
      state.email = email;
      state.fullName = fullName;
      state.firstName = firstName;
      state.lastName = lastName;
      state.pictureUrl = pictureUrl;
    },
  },
});

export const { setUser } = userSlice.actions;

export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;
