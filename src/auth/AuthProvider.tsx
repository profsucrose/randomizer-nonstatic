import React, {
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";

// Firebase
import app from "./base";
import { getAuth, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// user is either a Firebase User or null
type User = FirebaseUser | null;

interface AuthProviderProps {
  children: React.ReactNode;
}

export enum UserExistenceState {
  Initializing = 0, // loading state
  DoesNotExist = -1, // user does not exist
  Exists = 1, // user exists
}

interface AuthContextInterface {
  currentUser: User;
  userAlreadyExists: UserExistenceState;
  setUserAlreadyExists: Dispatch<SetStateAction<UserExistenceState>>;
  hasAuth?: boolean | null;
  logOut: Function;
}
const contextConfig: AuthContextInterface = {
  currentUser: null,
  userAlreadyExists: UserExistenceState.Initializing,
  setUserAlreadyExists: () => {},
  hasAuth: false,
  logOut: () => {},
};

export const AuthContext = createContext(contextConfig);

// init Firebase
const auth = getAuth(app);
const firestore = getFirestore(app);

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User>({} as User);
  const [userAlreadyExists, setUserAlreadyExists] = useState(
    UserExistenceState.Initializing
  );

  useEffect(() => {
    try {
      auth.onAuthStateChanged(async (user) => {
        setCurrentUser(user);
        if (user) {
          // assuming user exists
          try {
            let userDoc =
              // await firestore.collection("users").doc(user.uid).get()
              (await getDoc(doc(firestore, "users", user.uid))).data();
            if (!userDoc) {
              setUserAlreadyExists(UserExistenceState.DoesNotExist);
              return;
            }
            setUserAlreadyExists(UserExistenceState.Exists);
          } catch (e: any) {
            // error handling
            alert(`Auth Error: ${e?.message || "unknown"}`);
          }
        } else {
          // user is not logged in
          // keep this ready for the next user:
          setUserAlreadyExists(UserExistenceState.Initializing);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userAlreadyExists,
        setUserAlreadyExists,
        hasAuth: !isEmptyUser(currentUser),
        logOut: auth.signOut.bind(auth),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const isEmptyUser = (userObj: User | null) => {
  const user = userObj || {};
  return Object.keys(user).length === 0 && user.constructor === Object;
};
