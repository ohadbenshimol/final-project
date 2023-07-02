import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../Store';
import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

export interface UserState {
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  pictureUrl?: string;
}

const cookieData = Cookies.get('user');

const initialState: UserState = cookieData ? JSON.parse(cookieData) : {};

export const userSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
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
export const userIsLoggedIn = () => {
  const user = useSelector(getUser);
  return user?.email;
};

export default userSlice.reducer;
