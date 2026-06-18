import api from "@/lib/axios";
import { SuccessResponse } from "@/types";
import { Listing } from "@/features/listing/components/ListingCard";

/**
 * Sends a POST request to create a new listing.
 * Since listings contain uploaded images, we send a FormData object.
 * @param formData - The listing form data containing fields and files.
 * @returns The created listing data.
 */
export const createListingApi = async (formData: FormData): Promise<SuccessResponse<Listing>> => {
  const response = await api.post<SuccessResponse<Listing>>("/listings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getListingByIdApi = async (id: string): Promise<SuccessResponse<Listing>> => {
  const response = await api.get<SuccessResponse<Listing>>(`/listings/${id}`);
  return response.data;
};

export const updateListingApi = async (id: string, formData: FormData): Promise<SuccessResponse<Listing>> => {
  const response = await api.put<SuccessResponse<Listing>>(`/listings/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
