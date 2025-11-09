export interface User {
  id: string;
  email: string;
  roles?: string[];
  profile?: UserProfile | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  roles: string[];
  userId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user?: Omit<User, 'password'>;
}

export interface RefreshTokenResponse {
  token: string;
}

export interface AuthError {
  message: string;
  field?: string;
  code?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshAccessToken: () => Promise<void>;
}