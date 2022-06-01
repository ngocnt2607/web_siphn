import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import StorageService from 'app/services/storage';
import { UserInfo } from 'shared/const/user-info.const';
import { RootState } from 'store';

interface User {
  info: UserInfo;
}

const initialState: User = {
  info: {
    username: '',
    id: '',
    role: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state: User, action: PayloadAction<User>) => {
      state.info = action.payload.info;
    },
    logout: (state: User) => {
      state.info = {
        id: '',
        role: '',
        username: '',
      };
      StorageService.clear();
    },
  },
});

export const { login, logout } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.info;
export default userSlice.reducer;
