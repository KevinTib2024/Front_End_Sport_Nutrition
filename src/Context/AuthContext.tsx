import React, { createContext, useContext, useReducer } from "react";

// Definir el estado del contexto, incluyendo el tipo de usuario
interface Authstate {
  user: { email: string; userType: number } | null;  
  error: string | null;
}

const userLocal = localStorage.getItem("user")
  ? (JSON.parse(localStorage.getItem("user") ?? "") as { email: string; userType: number })
  : null;

const initialState: Authstate = {
  user: userLocal,
  error: null,
};

type AuthAction =
  | { type: "SET_USER"; payload: { email: string; userType: number } }  
  | { type: "SET_ERROR"; payload: string }
  | { type: "LOGOUT" };

const authReducer = (state: Authstate, action: AuthAction): Authstate => {
  switch (action.type) {
    case "SET_USER":
      return { user: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "LOGOUT":
      return { ...state, user: null, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: Authstate;
  login: (user: { email: string; userType: number }) => void;  
  logOut: () => void;
} | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user: { email: string; userType: number }) => {

    console.log("Usuario logueado:", user);

    dispatch({ type: "SET_USER", payload: user });
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logOut = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.setItem("user", "");
  };

  return <AuthContext.Provider value={{ state, login, logOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
