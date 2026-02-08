# Specification: Signup Page

## Overview
The **Signup Page** allows new users to register an account to track their assessment progress.

## UI/UX Principles
1.  **Consistency**: Matches Login page design.
2.  **Validation Feedback**: Real-time validation for password strength and email format.

## Functional Rules
1.  **Input Fields**:
    -   **Full Name**: Required.
    -   **Email**: Unique required.
    -   **Password**: Min 8 chars, 1 number, 1 special char.
    -   **Confirm Password**: Must match.
2.  **Actions**:
    -   **"Create Account"**: Triggers `POST /api/v1/signup`.
    -   **"Login"**: Link to Login page.
3.  **Registration Logic**:
    -   On success, auto-login or redirect to Login with "Account created" message.

## Edge Cases
-   **Email Exists**: Show "Email already registered".
-   **Weak Password**: Prevent submission.
