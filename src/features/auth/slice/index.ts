import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'TENANT' | 'OWNER' | 'ADMIN';
  phone?: string;
  isEmailVerified: boolean;
  accountStatus: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
}

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
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to register. Please try again.'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Invalid email or password.'
      );
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Verification failed.'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      return true;
    } catch (error: any) {
      return rejectWithValue('Logout failed.');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
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
    builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.data.user;
      state.accessToken = action.payload.data.accessToken;
      
      localStorage.setItem('accessToken', action.payload.data.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.data.user));
    });
    builder.addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.data.user;
      state.accessToken = action.payload.data.accessToken;
      
      localStorage.setItem('accessToken', action.payload.data.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.data.user));
    });
    builder.addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Verify Email
    builder.addCase(verifyEmail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyEmail.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      if (state.user && state.user._id === action.payload.data.user._id) {
         state.user.isEmailVerified = true;
         localStorage.setItem('user', JSON.stringify(state.user));
      }
    });
    builder.addCase(verifyEmail.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
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
    builder.addCase(getMe.fulfilled, (state, action: PayloadAction<any>) => {
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
