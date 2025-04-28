import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi
} from '@api';
import { TRegisterData, TLoginData } from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export interface UserState {
  isLoading: boolean;
  user: TUser | null;
  isAuthorized: boolean;
  error: string | null;
}

const initialState: UserState = {
  isLoading: false,
  user: null,
  isAuthorized: false,
  error: null
};

export const loginUserThunk = createAsyncThunk(
  'user/login',
  (loginData: TLoginData) => loginUserApi(loginData)
);

export const registerUserThunk = createAsyncThunk(
  'user/register',
  (registerData: TRegisterData) => registerUserApi(registerData)
);

export const logoutUserThunk = createAsyncThunk('user/logout', logoutApi);

export const updateUserThunk = createAsyncThunk(
  'user/update',
  (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  (data: { email: string }) => forgotPasswordApi(data)
);

export const resetPasswordThunk = createAsyncThunk(
  'user/resetPassword',
  (data: { password: string; token: string }) => resetPasswordApi(data)
);

export const getUserThunk = createAsyncThunk('user/get', getUserApi);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    selectUserState: (state) => state,
    selectUser: (state) => state.user,
    selectIsAuthorized: (state) => state.isAuthorized,
    selectUserError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, handlePending)
      .addCase(loginUserThunk.rejected, handleRejected)
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        handleSuccessAuth(state, payload);
      })

      .addCase(registerUserThunk.pending, handlePending)
      .addCase(registerUserThunk.rejected, handleRejected)
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        handleSuccessAuth(state, payload);
      })

      .addCase(logoutUserThunk.pending, handlePending)
      .addCase(logoutUserThunk.rejected, handleRejected)
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthorized = false;
        state.error = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })

      .addCase(updateUserThunk.pending, handlePending)
      .addCase(updateUserThunk.rejected, handleRejected)
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.isAuthorized = true;
      })

      .addCase(forgotPasswordThunk.pending, handlePending)
      .addCase(forgotPasswordThunk.rejected, handleRejected)
      .addCase(forgotPasswordThunk.fulfilled, handleSimpleSuccess)

      .addCase(resetPasswordThunk.pending, handlePending)
      .addCase(resetPasswordThunk.rejected, handleRejected)
      .addCase(resetPasswordThunk.fulfilled, handleSimpleSuccess)

      .addCase(getUserThunk.pending, handlePending)
      .addCase(getUserThunk.rejected, handleRejected)
      .addCase(getUserThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.error = null;
        state.user = payload.user;
        state.isAuthorized = true;
      });
  }
});

function handlePending(state: UserState) {
  state.isLoading = true;
  state.error = null;
}

function handleRejected(state: UserState, action: any) {
  state.isLoading = false;
  state.error = action.error?.message || 'Ошибка авторизации';
}

function handleSuccessAuth(state: UserState, payload: any) {
  state.isLoading = false;
  state.error = null;
  state.user = payload.user;
  state.isAuthorized = true;
  setCookie('accessToken', payload.accessToken);
  localStorage.setItem('refreshToken', payload.refreshToken);
}

function handleSimpleSuccess(state: UserState) {
  state.isLoading = false;
  state.error = null;
}

export { initialState as userInitialState };
export const { clearUserError } = userSlice.actions;
export const {
  selectUserState,
  selectUser,
  selectIsAuthorized,
  selectUserError
} = userSlice.selectors;
export default userSlice.reducer;
