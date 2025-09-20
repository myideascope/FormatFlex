@@ .. @@
 interface User {
   id: string;
   email: string;
   created_at: string;
 }
 
+interface AuthResult {
+  user?: User;
+  error?: { message: string };
+}
+
 class MockAuthService {
   private users: Map<string, { email: string; password: string; id: string; created_at: string }> = new Map();
   private currentUser: User | null = null;
@@ .. @@
     this.loadFromStorage();
   }
 
-  async signUp(email: string, password: string): Promise<{ user?: User; error?: { message: string } }> {
+  async signUp(email: string, password: string): Promise<AuthResult> {
     // Simulate network delay
     await new Promise(resolve => setTimeout(resolve, 500));
 
@@ .. @@
     return { user };
   }
 
-  async signIn(email: string, password: string): Promise<{ user?: User; error?: { message: string } }> {
+  async signIn(email: string, password: string): Promise<AuthResult> {
     // Simulate network delay
     await new Promise(resolve => setTimeout(resolve, 500));
 
@@ .. @@
     return { user };
   }
 
   async signOut(): Promise<void> {
+    // Simulate network delay
+    await new Promise(resolve => setTimeout(resolve, 200));
+    
     this.currentUser = null;
     localStorage.removeItem('formatflex_current_user');
   }
 
-  getCurrentUser(): User | null {
-    return this.currentUser;
+  async getCurrentUser(): Promise<User | null> {
+    // Simulate async operation
+    await new Promise(resolve => setTimeout(resolve, 100));
+    return Promise.resolve(this.currentUser);
   }
 
   private saveToStorage() {