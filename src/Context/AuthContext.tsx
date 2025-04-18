import React, { createContext, useContext, useReducer } from "react";

// Definir tipo de usuario con ID
export interface User {
  id?: number;
  email: string;
  userType: number;
}

interface AuthState {
  user: User | null;
  error: string | null;
}

// Leer usuario del LocalStorage (incluyendo ID)
const userLocal = localStorage.getItem("user")
  ? (JSON.parse(localStorage.getItem("user") ?? "") as User)
  : null;

const initialState: AuthState = {
  user: userLocal,
  error: null,
};

type AuthAction =
  | { type: "SET_USER"; payload: User }
  | { type: "SET_ERROR"; payload: string }
  | { type: "LOGOUT" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_USER":
      return { user: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "LOGOUT":
      return { user: null, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  login: (user: User) => void;
  logOut: () => void;
} | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user: User) => {
    dispatch({ type: "SET_USER", payload: user });
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logOut = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ state, login, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
