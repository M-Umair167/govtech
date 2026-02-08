# Specification: Profile Page

## Overview
The **Profile Page** displays the user's personal details and assessment history/analytics.

## UI/UX Principles
1.  **Dashboard Layout**: Sidebar navigation (optional) + Main Content Area.
2.  **Data Visualization**: Charts/Graphs for performance over time.
3.  **Card-Based Info**: User Details, Recent Activity, Weak Areas.

## Functional Rules
1.  **User Details**:
    -   Display Name, Email, Join Date.
    -   Edit Profile capability (Avatar, Name).
2.  **Assessment History**:
    -   List of recent quizzes with specific scores/subjects.
    -   "Review" button to see past answers (if stored).
3.  **Stats**:
    -   Overall Accuracy %.
    -   Strongest/Weakest Subjects.

## Edge Cases
-   **No History**: Show empty state with CTA to "Take First Assessment".
-   **Loading**: Skeleton loaders for charts.
