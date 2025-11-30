export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  postCode: string;
  city: string;
  country: string;
  roles: string[];
  avatar?: string;
}

export interface UserPreference {
  language: string;
}

export interface User {
  id: string;
  email: string;
  isActive: boolean;
  profile: UserProfile;
  userPreference: UserPreference;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  address?: string;
  postCode?: string;
  city?: string;
  country?: string;
}