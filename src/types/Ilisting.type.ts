export interface ListingImage {
  file: File;
  previewUrl: string;
}

export interface ListingForm {
  title: string;
  description: string;
  city: string;
  rentBudget: string;
  propertyType: "PG" | "Hostel" | "Flat" | "Apartment" | "House" | "";
  genderPreference: "Male" | "Female" | "Co-ed";
  amenities: string[];
  imagesList: ListingImage[];
}
