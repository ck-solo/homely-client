import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  toggleFavoriteApi,
  getSavedPropertiesApi,
  FavoriteItem,
  ToggleFavoriteResponse,
  GetFavoritesResponse,
} from "@/api/favorite/favorite.api";
import { ApiErrorResponse } from "@/types";

interface FavoriteState {
  favorites: FavoriteItem[];
  favoriteIds: string[]; // listing IDs for quick lookup
  isLoading: boolean;
  isToggling: string | null; // listingId currently being toggled
  error: string | null;
  hasFetched: boolean;
}

const initialState: FavoriteState = {
  favorites: [],
  favoriteIds: [],
  isLoading: false,
  isToggling: null,
  error: null,
  hasFetched: false,
};

// ─── Async Thunks ────────────────────────────────────────

export const fetchFavorites = createAsyncThunk<
  GetFavoritesResponse,
  void,
  { rejectValue: string }
>("favorite/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await getSavedPropertiesApi();
  } catch (error: unknown) {
    const apiError = error as ApiErrorResponse;
    return rejectWithValue(
      apiError.response?.data?.message || "Failed to load saved listings."
    );
  }
});

export const toggleFavorite = createAsyncThunk<
  ToggleFavoriteResponse & { listingId: string },
  string,
  { rejectValue: string & { listingId: string } }
>("favorite/toggle", async (listingId, { rejectWithValue }) => {
  try {
    const response = await toggleFavoriteApi(listingId);
    return { ...response, listingId };
  } catch (error: unknown) {
    const apiError = error as ApiErrorResponse;
    const message =
      apiError.response?.data?.message || "Failed to update favorite.";
    return rejectWithValue(message as string & { listingId: string });
  }
});

// ─── Slice ───────────────────────────────────────────────

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    clearFavoriteError: (state) => {
      state.error = null;
    },
    resetFavorites: (state) => {
      state.favorites = [];
      state.favoriteIds = [];
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch all favorites
    builder.addCase(fetchFavorites.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchFavorites.fulfilled,
      (state, action: PayloadAction<GetFavoritesResponse>) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.favorites = action.payload.data;
        state.favoriteIds = action.payload.data.map(
          (fav) => fav.listingId?._id || ""
        ).filter(Boolean);
      }
    );
    builder.addCase(fetchFavorites.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });

    // Toggle favorite (optimistic update)
    builder.addCase(toggleFavorite.pending, (state, action) => {
      const listingId = action.meta.arg;
      state.isToggling = listingId;
      state.error = null;

      // Optimistic: toggle the ID in favoriteIds
      if (state.favoriteIds.includes(listingId)) {
        state.favoriteIds = state.favoriteIds.filter((id) => id !== listingId);
        state.favorites = state.favorites.filter(
          (fav) => fav.listingId?._id !== listingId
        );
      } else {
        state.favoriteIds.push(listingId);
      }
    });
    builder.addCase(toggleFavorite.fulfilled, (state, action) => {
      state.isToggling = null;
      const { isFavorited, favorite } = action.payload.data;
      const listingId = action.payload.listingId;

      if (isFavorited && favorite) {
        // Ensure it's in the list
        if (!state.favoriteIds.includes(listingId)) {
          state.favoriteIds.push(listingId);
        }
        // Add the full favorite item if not already present
        if (!state.favorites.find((f) => f.listingId?._id === listingId)) {
          state.favorites.push(favorite);
        }
      } else {
        // Ensure it's removed
        state.favoriteIds = state.favoriteIds.filter((id) => id !== listingId);
        state.favorites = state.favorites.filter(
          (fav) => fav.listingId?._id !== listingId
        );
      }
    });
    builder.addCase(toggleFavorite.rejected, (state, action) => {
      state.isToggling = null;
      state.error = (action.payload as string) || "Failed to toggle favorite";

      // Rollback optimistic update: re-fetch is the safest option,
      // but for simplicity we just mark that a re-fetch is needed
      state.hasFetched = false;
    });
  },
});

export const { clearFavoriteError, resetFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
