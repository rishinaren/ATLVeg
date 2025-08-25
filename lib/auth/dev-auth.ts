// Development-only authentication system
// This bypasses Supabase when environment variables are not properly configured

interface DevUser {
  id: string;
  email: string;
  created_at: string;
}

interface DevAuthResponse {
  data: {
    user: DevUser | null;
    session: {
      access_token: string;
      user: DevUser;
    } | null;
  };
  error: {
    message: string;
  } | null;
}

class DevAuth {
  private users: Map<string, DevUser> = new Map();
  private currentUser: DevUser | null = null;

  constructor() {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('dev_auth_user');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
      const savedUsers = localStorage.getItem('dev_auth_users');
      if (savedUsers) {
        this.users = new Map(JSON.parse(savedUsers));
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      if (this.currentUser) {
        localStorage.setItem('dev_auth_user', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('dev_auth_user');
      }
      localStorage.setItem('dev_auth_users', JSON.stringify(Array.from(this.users.entries())));
    }
  }

  async signUp({ email, password }: { email: string; password: string }): Promise<DevAuthResponse> {
    // Check if user already exists
    if (this.users.has(email)) {
      return {
        data: { user: null, session: null },
        error: { message: 'User already registered' }
      };
    }

    // Create new user
    const user: DevUser = {
      id: `dev_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      created_at: new Date().toISOString()
    };

    this.users.set(email, user);
    this.currentUser = user;
    this.saveToStorage();

    return {
      data: {
        user,
        session: {
          access_token: `dev_token_${user.id}`,
          user
        }
      },
      error: null
    };
  }

  async signIn({ email, password }: { email: string; password: string }): Promise<DevAuthResponse> {
    const user = this.users.get(email);
    if (!user) {
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' }
      };
    }

    this.currentUser = user;
    this.saveToStorage();

    return {
      data: {
        user,
        session: {
          access_token: `dev_token_${user.id}`,
          user
        }
      },
      error: null
    };
  }

  async signOut(): Promise<{ error: null }> {
    this.currentUser = null;
    this.saveToStorage();
    return { error: null };
  }

  async getUser(): Promise<{ data: { user: DevUser | null }, error: null }> {
    return {
      data: { user: this.currentUser },
      error: null
    };
  }

  async getSession(): Promise<{ data: { session: any }, error: null }> {
    if (this.currentUser) {
      return {
        data: {
          session: {
            access_token: `dev_token_${this.currentUser.id}`,
            user: this.currentUser
          }
        },
        error: null
      };
    }
    return {
      data: { session: null },
      error: null
    };
  }
}

export const devAuth = new DevAuth();
