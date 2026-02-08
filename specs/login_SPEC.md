# Specification: Login Page

## Overview
The **Login Page** allows existing users to authenticate and access protected routes (Assessment, Profile).

## UI/UX Principles
1.  **Centered Card**: Clean, focused interface with a central login form.
2.  **Visuals**: Dark theme (`#091220`) with subtle background patterns or gradients.
3.  **Feedback**:
    -   **Error Messages**: specific errors (e.g., "Invalid credentials") displayed near inputs.
    -   **Success**: Redirect to Home/Dashboard upon success.

## Functional Rules
1.  **Input Fields**:
    -   **Email**: Valid email format required.
    -   **Password**: Masked input.
2.  **Actions**:
    -   **"Sign In"**: Triggers `POST /api/v1/login`.
    -   **"Forgot Password"**: Link to recovery flow (future).
    -   **"Sign Up"**: Link to Registration page.
3.  **Authentication Logic**:
    -   On success, store JWT token in `localStorage` or `cookie`.
    -   Update global User Context.
    -   Redirect to previous attempted route or Home.

## Edge Cases
-   **Network Error**: Show "Service unavailable".
-   **Account Locked**: Handle too many failed attempts (future).
-   **Already Logged In**: Redirect to Home if accessed while authenticated.
