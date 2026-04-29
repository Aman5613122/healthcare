import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { User, Patient, NotificationInterface } from "../types";
import { MOCK_PATIENTS } from "../utils/mockData";
import { SAMPLE_NOTIFICATIONS } from "../services/notificationService";
import { onAuthChange } from "../services/authService";

interface AppState {
  user: User | null;
  isLoading: boolean;
  patients: Patient[];
  notifications: NotificationInterface[];
  viewMode: "grid" | "list";
  sidebarOpen: boolean;
  searchQuery: string;
  selectedFilter: string;
}

type Action =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PATIENTS"; payload: Patient[] }
  | { type: "ADD_NOTIFICATION"; payload: NotificationInterface }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "MARK_ALL_READ" }
  | { type: "TOGGLE_VIEW_MODE" }
  | { type: "SET_VIEW_MODE"; payload: "grid" | "list" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_FILTER"; payload: string };

const initialState: AppState = {
  user: null,
  isLoading: true,
  patients: MOCK_PATIENTS,
  notifications: SAMPLE_NOTIFICATIONS,
  viewMode: "grid",
  sidebarOpen: true,
  searchQuery: "",
  selectedFilter: "All",
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_PATIENTS":
      return { ...state, patients: action.payload };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n,
        ),
      };
    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case "TOGGLE_VIEW_MODE":
      return {
        ...state,
        viewMode: state.viewMode === "grid" ? "list" : "grid",
      };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_FILTER":
      return { ...state, selectedFilter: action.payload };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Check for demo session
    const demoUser = sessionStorage.getItem("demoUser");
    if (demoUser) {
      dispatch({ type: "SET_USER", payload: JSON.parse(demoUser) });
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        dispatch({
          type: "SET_USER",
          payload: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          },
        });
      } else {
        dispatch({ type: "SET_USER", payload: null });
      }
      dispatch({ type: "SET_LOADING", payload: false });
    });

    return () => unsubscribe();
  }, []);

  // Simulate real-time notifications
  useEffect(() => {
    if (!state.user) return;

    const timer = setInterval(() => {
      const alerts = [
        {
          title: "Vitals Alert",
          message: "Heart rate spike detected in Ward 3B",
          type: "warning" as const,
        },
        {
          title: "Staff Update",
          message: "Dr. Sharma shift ends in 15 minutes",
          type: "info" as const,
        },
        {
          title: "Lab Ready",
          message: "CBC results for P004 are ready",
          type: "success" as const,
        },
      ];
      const alert = alerts[Math.floor(Math.random() * alerts.length)];
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: `live-${Date.now()}`,
          ...alert,
          timestamp: new Date(),
          read: false,
        },
      });
    }, 45000);

    return () => clearInterval(timer);
  }, [state.user]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
