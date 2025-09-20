interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthResult {
  user?: User;
  error?: { message: string };
}

class MockAuthService {
  private users: Map<string, { email: string; password: string; id: string; created_at: string }> = new Map();
  private currentUser: User | null = null;

  constructor() {
    this.loadFromStorage();
  }

  async signUp(email: string, password: string): Promise<AuthResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (this.users.has(email)) {
      return { error: { message: 'User already exists' } };
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      created_at: new Date().toISOString()
    };

    this.users.set(email, {
      email,
      password,
      id: user.id,
      created_at: user.created_at
    });

    this.currentUser = user;
    this.saveToStorage();

    return { user };
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userData = this.users.get(email);
    if (!userData || userData.password !== password) {
      return { error: { message: 'Invalid credentials' } };
    }

    const user: User = {
      id: userData.id,
      email: userData.email,
      created_at: userData.created_at
    };

    this.currentUser = user;
    this.saveToStorage();

    return { user };
  }

  async signOut(): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.currentUser = null;
    localStorage.removeItem('formatflex_current_user');
  }

  async getCurrentUser(): Promise<User | null> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    return Promise.resolve(this.currentUser);
  }

  private saveToStorage() {
    localStorage.setItem('formatflex_users', JSON.stringify(Array.from(this.users.entries())));
    if (this.currentUser) {
      localStorage.setItem('formatflex_current_user', JSON.stringify(this.currentUser));
    }
  }

  private loadFromStorage() {
    const usersData = localStorage.getItem('formatflex_users');
    if (usersData) {
      this.users = new Map(JSON.parse(usersData));
    }

    const currentUserData = localStorage.getItem('formatflex_current_user');
    if (currentUserData) {
      this.currentUser = JSON.parse(currentUserData);
    }
  }
}

export const authService = new MockAuthService();