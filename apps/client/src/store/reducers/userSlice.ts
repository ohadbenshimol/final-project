import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../Store';
import {createSlice} from '@reduxjs/toolkit';
import {useSelector} from 'react-redux';
import Cookies from 'js-cookie';

export interface UserState {
  id?: string;
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  pictureUrl?: string;
  sub?: string
}

const cookieData = Cookies.get('user');

const initialState: UserState = cookieData ? JSON.parse(cookieData) : {};

export const userSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      const {id, firstName, email, fullName, lastName, pictureUrl,sub} =
        action.payload;
      state.id = id
      state.email = email;
      state.fullName = fullName;
      state.firstName = firstName;
      state.lastName = lastName;
      state.pictureUrl = pictureUrl;
      state.sub = sub
    },
  },
});

export const {setUser} = userSlice.actions;

export const getUser = (state: RootState) => state.user;
export const getUserID = (state: RootState) => state.user.id
export const userIsLoggedIn = () => {
  const user = useSelector(getUser);
  return user?.email;
};

export default userSlice.reducer;
