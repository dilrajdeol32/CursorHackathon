import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "checkpoint_access_token";
const USER_KEY = "checkpoint_user";

export type AuthUser = {
  id: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signIn: (user: AuthUser, token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate auth state from secure storage on app start.
  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser) as AuthUser);
        }
      } catch {
        // If anything goes wrong reading storage, start unauthenticated.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (incomingUser: AuthUser, incomingToken: string) => {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, incomingToken),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(incomingUser)),
    ]);
    setToken(incomingToken);
    setUser(incomingUser);
  }, []);

  const signOut = useCallback(async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
