/**
 * AUTHENTICATION MODULE QUICK REFERENCE
 * 
 * This file provides a visual guide to the authentication module structure
 * and how each component connects in the authentication flow.
 */

// ============================================================================
// FILE STRUCTURE
// ============================================================================

/*
homely-client/
├── .env.local                                    # Environment variables
├── AUTH_MODULE.md                                # Detailed documentation
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                           # ROOT: AuthInitializer runs here
│   │   ├── globals.css                          # Global styles
│   │   │
│   │   ├── (auth)/                              # Auth route group
│   │   │   ├── layout.tsx                       # Centered container layout
│   │   │   ├── login/page.tsx                   # PUBLIC: /login
│   │   │   └── register/page.tsx                # PUBLIC: /register
│   │   │
│   │   └── dashboard/
│   │       ├── layout.tsx                       # PROTECTED: Auth check happens here
│   │       └── page.tsx                         # PROTECTED: /dashboard
│   │
│   ├── config/
│   │   └── axios.ts                             # Axios instance (withCredentials: true)
│   │
│   ├── api/
│   │   └── auth/
│   │       ├── login.ts                         # POST /api/v1/auth/login
│   │       ├── register.ts                      # POST /api/v1/auth/register
│   │       ├── logout.ts                        # POST /api/v1/auth/logout
│   │       └── me.ts                            # GET /api/v1/auth/me
│   │
│   ├── features/
│   │   └── auth/
│   │       ├── store/
│   │       │   └── authStore.ts                 # ZUSTAND: Global auth state
│   │       │
│   │       ├── hooks/
│   │       │   └── useAuthApi.ts                # Custom hook: login, register, logout
│   │       │
│   │       └── components/
│   │           ├── LoginForm.tsx                # Login form with Zod validation
│   │           └── RegisterForm.tsx             # Register form with Zod validation
│   │
│   └── types/
│       └── auth.ts                              # TypeScript interfaces
*/

// ============================================================================
// AUTHENTICATION FLOW - STEP BY STEP
// ============================================================================

/*
STEP 1: APP STARTUP
-------------------
1. App loads
2. src/app/layout.tsx (RootLayout) renders
3. AuthInitializer useEffect runs
4. Calls: authStore.fetchCurrentUser()
5. Calls: getMeApi() → GET /api/v1/auth/me
6. If session exists: User is restored from cookies
7. If session doesn't exist: User remains null

STEP 2: USER LOGS IN (Example)
------------------------------
1. User navigates to /login
2. src/app/(auth)/login/page.tsx renders
3. LoginForm component displays form
4. User enters email & password
5. Form validates using Zod schema
6. On submit:
   └─> LoginForm calls: useAuthApi.login(data)
       └─> useAuthApi calls: loginApi(data)
           └─> loginApi calls: apiClient.post('/api/v1/auth/login', data)
               └─> Axios sends POST with withCredentials: true
                   └─> Backend validates & sets httpOnly session cookie
                       └─> Returns user data
                           └─> useAuthApi calls: authStore.setUser(user)
                               └─> Store updates: user, isAuthenticated = true
                                   └─> useRouter.push('/dashboard')

STEP 3: ACCESSING PROTECTED ROUTE
---------------------------------
1. User navigates to /dashboard
2. src/app/dashboard/layout.tsx mounts (DashboardLayout)
3. useEffect calls: authStore.fetchCurrentUser()
4. Calls: getMeApi() → GET /api/v1/auth/me with cookies
5. If authenticated:
   └─> Returns user data
       └─> Store updates
           └─> Renders dashboard content
6. If NOT authenticated:
   └─> Returns 401 error
       └─> catch block redirects to /login

STEP 4: USER LOGS OUT
--------------------
1. User clicks "Logout" button
2. Button onClick calls: authStore.logout()
3. logout() calls: logoutApi()
   └─> logoutApi calls: apiClient.post('/api/v1/auth/logout')
       └─> Axios sends POST with withCredentials: true
           └─> Backend clears session cookie
               └─> authStore clears user state
                   └─> useRouter.push('/login')
*/

// ============================================================================
// KEY CONCEPTS
// ============================================================================

/*
WITHCREDENTIALS: TRUE
---------------------
axios.create({ withCredentials: true })

This is CRITICAL for cookie-based authentication:
- Axios automatically includes session cookies with EVERY request
- Without it, cookies won't be sent and backend won't recognize user
- Backend must have CORS enabled for your frontend URL

ZONED VALIDATION
----------------
Uses zod schema to validate form inputs:
- Email format validation
- Password length validation
- Password confirmation matching
- Happens BEFORE submitting to backend
- Provides instant user feedback

ZUSTAND STORE
-------------
Global state management:
- Single source of truth for user data
- Available in any component via useAuthStore()
- Persists auth state across page navigations
- Components re-render automatically when state changes

PROTECTED ROUTES
----------------
DashboardLayout checks authentication:
- Runs fetchCurrentUser() on mount
- If authenticated: Shows page
- If not authenticated: Redirects to /login
- Users cannot access /dashboard without valid session

SESSION PERSISTENCE
-------------------
With httpOnly cookies:
1. User logs in → Backend sets httpOnly session cookie
2. Cookie stored in browser (invisible to JavaScript)
3. Axios automatically sends cookie with every request
4. Page refresh → AuthInitializer restores session from cookies
5. User stays logged in across browser restarts
*/

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
USE AUTH STATE IN COMPONENTS
-----------------------------
'use client';
import { useAuthStore } from '@/features/auth/store/authStore';

export function Header() {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <div>Welcome, {user?.firstName}!</div>;
  }
  return <div>Please log in</div>;
}

USE AUTH API HOOK IN COMPONENTS
-------------------------------
'use client';
import { useAuthApi } from '@/features/auth/hooks/useAuthApi';

export function LoginButton() {
  const { login, isLoading, error } = useAuthApi();

  const handleClick = async () => {
    try {
      await login({ 
        email: 'user@example.com', 
        password: 'password123' 
      });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </>
  );
}
*/

// ============================================================================
// INTEGRATION CHECKLIST
// ============================================================================

/*
[ ] npm install (install all dependencies)
[ ] Update .env.local with backend API URL
[ ] Ensure backend has CORS enabled for frontend URL
[ ] Ensure backend endpoints return correct response format
[ ] Test /login page
[ ] Test /register page
[ ] Test /dashboard redirect when not authenticated
[ ] Test logout functionality
[ ] Test session persistence (refresh page while logged in)
[ ] Test cookie-based authentication in browser DevTools
*/

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

/*
.env.local
----------
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

This should point to your Express backend.
*/

// ============================================================================
// DEPENDENCIES ADDED
// ============================================================================

/*
@hookform/resolvers: ^3.3.4       - Zod integration for react-hook-form
axios: ^1.7.7                      - HTTP client for API calls
react-hook-form: ^7.52.0           - Form state management
zod: ^3.23.8                       - Schema validation
zustand: ^4.5.0                    - State management
*/

export {}; // This file is for documentation only
