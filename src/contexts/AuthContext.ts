"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import {
  User,
  AuthContextType,
  AuthState,
  LoginCredentials,
  SignupCredentials,
  AuthError,
} from "@/types/auth";
import { authService } from "@/services/auth";

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthAction =
  | { type: "AUTH_START" }
  | {
      type: "AUTH_SUCCESS";
      payload: { user: User; token?: string; refreshToken?: string };
    }
  | { type: "AUTH_FAILURE"; payload: AuthError }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token || state.token,
        refreshToken: action.payload.refreshToken || state.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case "AUTH_LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser();

          if (storedUser) {
            dispatch({
              type: "AUTH_SUCCESS",
              payload: {
                user: storedUser,
              },
            });
          } else {
            await authService.logout();
            dispatch({ type: "AUTH_LOGOUT" });
          }
        } else {
          dispatch({ type: "AUTH_LOGOUT" });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        dispatch({ type: "AUTH_LOGOUT" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });

      const response = await authService.login(credentials);

      let user: User;
      if (response.user) {
        user = response.user;
      } else {
        user = authService.getStoredUser()!;
      }

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user,
          token: response.token,
          refreshToken: response.refreshToken,
        },
      });
    } catch (error: unknown) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : "Login failed",
      };
      dispatch({ type: "AUTH_FAILURE", payload: authError });
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });

      await authService.signup(credentials);

      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error: unknown) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : "Signup failed",
      };
      dispatch({ type: "AUTH_FAILURE", payload: authError });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: "AUTH_LOGOUT" });
    }
  };

  const clearError = (): void => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const refreshAccessToken = async (): Promise<void> => {
    try {
      await authService.refreshToken();
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    signup,
    logout,
    clearError,
    refreshAccessToken,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthContext };
export default AuthProvider;
