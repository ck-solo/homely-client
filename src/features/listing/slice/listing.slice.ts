import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createListingApi, getListingByIdApi, updateListingApi } from "@/api/listing/listing.api";
import { Listing } from "@/features/listing/components/ListingCard";
import { ApiErrorResponse, SuccessResponse } from "@/types";

interface ListingState {
  currentListing: Listing | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ListingState = {
  currentListing: null,
  isLoading: false,
  error: null,
  success: false,
};

export const createListingAction = createAsyncThunk<
  SuccessResponse<Listing>,
  FormData,
  { rejectValue: string }
>("listing/create", async (formData, { rejectWithValue }) => {
  try {
    const data = await createListingApi(formData);
    return data;
  } catch (error: unknown) {
    const apiError = error as ApiErrorResponse;
    return rejectWithValue(
      apiError.response?.data?.message || "Failed to create listing. Please try again."
    );
  }
});

export const getListingByIdAction = createAsyncThunk<
  SuccessResponse<Listing>,
  string,
  { rejectValue: string }
>("listing/getById", async (id, { rejectWithValue }) => {
  try {
    const data = await getListingByIdApi(id);
    return data;
  } catch (error: unknown) {
    const apiError = error as ApiErrorResponse;
    return rejectWithValue(
      apiError.response?.data?.message || "Failed to fetch listing."
    );
  }
});

export const updateListingAction = createAsyncThunk<
  SuccessResponse<Listing>,
  { id: string; formData: FormData },
  { rejectValue: string }
>("listing/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const data = await updateListingApi(id, formData);
    return data;
  } catch (error: unknown) {
    const apiError = error as ApiErrorResponse;
    return rejectWithValue(
      apiError.response?.data?.message || "Failed to update listing. Please try again."
    );
  }
});

const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    clearListingState: (state) => {
      state.error = null;
      state.success = false;
      state.currentListing = null;
    },
    clearListingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createListingAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(
      createListingAction.fulfilled,
      (state, action: PayloadAction<SuccessResponse<Listing>>) => {
        state.isLoading = false;
        state.success = true;
        state.currentListing = action.payload.data;
      }
    );
    builder.addCase(createListingAction.rejected, (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.payload || "Unknown error";
    });

    // Get Listing By ID
    builder.addCase(getListingByIdAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      getListingByIdAction.fulfilled,
      (state, action: PayloadAction<SuccessResponse<Listing>>) => {
        state.isLoading = false;
        state.currentListing = action.payload.data;
      }
    );
    builder.addCase(getListingByIdAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Unknown error";
    });

    // Update Listing
    builder.addCase(updateListingAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(
      updateListingAction.fulfilled,
      (state, action: PayloadAction<SuccessResponse<Listing>>) => {
        state.isLoading = false;
        state.success = true;
        state.currentListing = action.payload.data;
      }
    );
    builder.addCase(updateListingAction.rejected, (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.payload || "Unknown error";
    });
  },
});

export const { clearListingState, clearListingError } = listingSlice.actions;
export default listingSlice.reducer;
