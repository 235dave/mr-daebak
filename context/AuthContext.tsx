import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { auth, db, getScopedProfilePath } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, role: UserRole, staffCode?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Use the scoped path for user profile
          const profilePath = getScopedProfilePath(firebaseUser.uid);
          const userDocRef = doc(db, profilePath);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
          } else {
            // New user without profile data yet
            setUser(null);
          }
        } catch (error: any) {
          if (error.code !== 'permission-denied') {
             console.error("Error fetching user data:", error);
          }
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole, staffCode?: string) => {
    if (role === UserRole.STAFF) {
      if (staffCode !== '1234!') {
        return { success: false, error: 'Staff code is incorrect.' };
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: User = {
        id: userCredential.user.uid,
        name,
        email,
        role,
        completedOrders: 0
      };

      // Store extended user data in the scoped Firestore path
      const profilePath = getScopedProfilePath(userCredential.user.uid);
      await setDoc(doc(db, profilePath), {
        name,
        email,
        role,
        completedOrders: 0
      });

      setUser(newUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isStaff: user?.role === UserRole.STAFF
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};