import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';
import socketService from '../services/socketService';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SuperAdmin' | 'Admin' | 'Instructor' | 'Learner';
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: SignupData) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  hasRole: (roles: string | string[]) => boolean;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'Instructor' | 'Learner';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Demo users for development
  const demoUsers: { [key: string]: User } = {
    'admin@driveconnect.uk': {
      id: '1',
      email: 'admin@driveconnect.uk',
      firstName: 'Admin',
      lastName: 'User',
      role: 'SuperAdmin',
      isActive: true
    },
    'instructor@driveconnect.uk': {
      id: '2',
      email: 'instructor@driveconnect.uk',
      firstName: 'John',
      lastName: 'Smith',
      role: 'Instructor',
      isActive: true
    },
    'student@driveconnect.uk': {
      id: '3',
      email: 'student@driveconnect.uk',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'Learner',
      isActive: true
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // In a real app, verify token with backend
        // For demo, check if it's a valid demo token
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Connect socket with user data
          await socketService.connect(token);
          socketService.joinRoom(`user_${userData.id}`);
          socketService.joinRoom(`role_${userData.role.toLowerCase()}`);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Demo login logic - check demo users
      const demoUser = demoUsers[email.toLowerCase()];
      const demoPasswords: { [key: string]: string } = {
        'admin@driveconnect.uk': 'admin123',
        'instructor@driveconnect.uk': 'instructor123',
        'student@driveconnect.uk': 'student123'
      };

      if (demoUser && demoPasswords[email.toLowerCase()] === password) {
        // Demo login success
        const token = `demo_token_${Date.now()}`;
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        setUser(demoUser);

        // Connect socket
        await socketService.connect(token);
        socketService.joinRoom(`user_${demoUser.id}`);
        socketService.joinRoom(`role_${demoUser.role.toLowerCase()}`);

        return true;
      }

      // Try real API login
      const response = await apiService.post('/auth/login', { email, password });
      
      if (response.success && response.data) {
        const { user: userData, accessToken } = response.data as { user: User; accessToken: string };
        
        // Store auth data
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setUser(userData);

        // Connect socket
        await socketService.connect(accessToken);
        socketService.joinRoom(`user_${userData.id}`);
        socketService.joinRoom(`role_${userData.role.toLowerCase()}`);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Disconnect socket
    socketService.disconnect();
    
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Try real API signup
      const response = await apiService.post('/auth/register', userData);
      
      if (response.success) {
        // Auto-login after successful signup
        return await login(userData.email, userData.password);
      }
      
      return false;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;

      setLoading(true);
      
      // Update local state optimistically
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Try to update via API
      const response = await apiService.put(`/users/${user.id}`, userData);
      
      if (response.success) {
        return true;
      } else {
        // Revert on failure
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return false;
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      // Revert on error
      if (user) {
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    signup,
    updateProfile,
    isAuthenticated: !!user,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;