import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginApi } from '@/api/auth/login';
import { registerApi } from '@/api/auth/register';
import { verifyEmailApi } from '@/api/auth/verifyEmail';
import { logoutApi } from '@/api/auth/logout';
import { getMeApi } from '@/api/auth/getMe';
import { User, AuthResponse, ApiErrorResponse, RegisterRequest, LoginRequest } from '@/types';

// Types
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false,
  isLoading: false,
  error: null,
};

// Async Thunks
export const registerUser = createAsyncThunk<AuthResponse, RegisterRequest, { rejectValue: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerApi(userData);
      return data;
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      return rejectWithValue(
        apiError.response?.data?.message || 'Failed to register. Please try again.'
      );
    }
  }
);

export const loginUser = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials);
      return data;
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      return rejectWithValue(
        apiError.response?.data?.message || 'Invalid email or password.'
      );
    }
  }
);

export const verifyEmail = createAsyncThunk<AuthResponse, string, { rejectValue: string }>(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await verifyEmailApi(token);
      return data;
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      return rejectWithValue(
        apiError.response?.data?.message || 'Verification failed.'
      );
    }
  }
);

export const logoutUser = createAsyncThunk<boolean, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (_error: unknown) {
      return rejectWithValue('Logout failed.');
    }
  }
);

export const getMe = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMeApi();
      return data;
    } catch (_error: unknown) {
      return rejectWithValue('Failed to load user profile.');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.data.user;
      state.accessToken = action.payload.data.accessToken;
      
      localStorage.setItem('accessToken', action.payload.data.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.data.user));
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Unknown error';
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.data.user;
      state.accessToken = action.payload.data.accessToken;
      
      localStorage.setItem('accessToken', action.payload.data.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.data.user));
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Unknown error';
    });

    // Verify Email
    builder.addCase(verifyEmail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyEmail.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.isLoading = false;
      if (state.user && state.user._id === action.payload.data.user._id) {
         state.user.isEmailVerified = true;
         localStorage.setItem('user', JSON.stringify(state.user));
      }
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Unknown error';
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    });

    // Get Me
    builder.addCase(getMe.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.data.user;
      localStorage.setItem('user', JSON.stringify(action.payload.data.user));
    });
    builder.addCase(getMe.rejected, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;

