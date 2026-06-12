import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getMe, syncUser } from "./api";
import {
  getFirebaseAuth,
  googleProvider,
  isFirebaseConfigured,
} from "./firebase";
import type { LeadSummary, UserRecord } from "./types";

interface AuthState {
  firebaseUser: User | null;
  user: UserRecord | null;
  summary: LeadSummary;
  loading: boolean;
  token: string | null;
  isDemo: boolean;
  signInWithGoogle: () => Promise<void>;
  signInDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const defaultSummary: LeadSummary = { verified: 0, unverified: 0, total: 0 };
const AuthContext = createContext<AuthState | null>(null);
const DEMO_STORAGE_KEY = "infinity_runner_demo";

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserRecord | null>(null);
  const [summary, setSummary] = useState<LeadSummary>(defaultSummary);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const syncSession = useCallback(async (idToken: string) => {
    const data = await syncUser(idToken);
    setUser(data.user);
    setSummary(data.summary);
    setToken(idToken);
    setIsDemo(false);
  }, []);

  const refresh = useCallback(async () => {
    if (isDemo && user) {
      const res = await fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer demo:${user.firebase_uid}` },
      });
      const data = await res.json();
      if (res.ok) setSummary(data.summary);
      return;
    }
    if (!isFirebaseConfigured()) return;
    const auth = getFirebaseAuth();
    if (!auth.currentUser) return;
    const idToken = await auth.currentUser.getIdToken();
    const data = await getMe(idToken);
    setUser(data.user);
    setSummary(data.summary);
    setToken(idToken);
  }, [isDemo, user]);

  useEffect(() => {
    async function restoreDemo() {
      const raw = localStorage.getItem(DEMO_STORAGE_KEY);
      if (!raw) return false;
      try {
        const parsed = JSON.parse(raw) as {
          user: UserRecord;
          summary: LeadSummary;
        };
        setUser(parsed.user);
        setSummary(parsed.summary);
        setToken(`demo:${parsed.user.firebase_uid}`);
        setIsDemo(true);
        return true;
      } catch {
        localStorage.removeItem(DEMO_STORAGE_KEY);
        return false;
      }
    }

    if (!isFirebaseConfigured()) {
      restoreDemo().finally(() => setLoading(false));
      return;
    }

    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          await syncSession(idToken);
        } catch {
          setUser(null);
          setToken(null);
        }
      } else {
        const restored = await restoreDemo();
        if (!restored) {
          setUser(null);
          setToken(null);
          setSummary(defaultSummary);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, [syncSession]);

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured()) {
      throw new Error("Configure Firebase env vars in .env first.");
    }
    const auth = getFirebaseAuth();
    if (isMobile()) {
      await signInWithRedirect(auth, googleProvider);
    } else {
      await signInWithPopup(auth, googleProvider);
    }
  }, []);

  const signInDemo = useCallback(async () => {
    const res = await fetch("/api/v1/auth/demo", { method: "POST" });
    const text = await res.text();
    let data: { user?: UserRecord; summary?: LeadSummary; error?: string };
    try {
      data = JSON.parse(text) as typeof data;
    } catch {
      throw new Error(text || "Demo sign-in failed");
    }
    if (!res.ok) throw new Error(data.error ?? "Demo sign-in failed");
    if (!data.user || !data.summary) {
      throw new Error("Demo sign-in returned an invalid response");
    }
    localStorage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify({ user: data.user, summary: data.summary }),
    );
    setUser(data.user);
    setSummary(data.summary);
    setToken(`demo:${data.user.firebase_uid}`);
    setIsDemo(true);
    setFirebaseUser(null);
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setUser(null);
    setToken(null);
    setSummary(defaultSummary);
    setIsDemo(false);
    if (isFirebaseConfigured()) {
      await firebaseSignOut(getFirebaseAuth());
    }
  }, []);

  const value = useMemo(
    () => ({
      firebaseUser,
      user,
      summary,
      loading,
      token,
      isDemo,
      signInWithGoogle,
      signInDemo,
      signOut,
      refresh,
    }),
    [
      firebaseUser,
      user,
      summary,
      loading,
      token,
      isDemo,
      signInWithGoogle,
      signInDemo,
      signOut,
      refresh,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
