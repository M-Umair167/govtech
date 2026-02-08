# Specification: Assessment Terminal (Home)

## Overview
The **Assessment Terminal** is the entry point for users to configure and start their MCQ examinations.

## UI/UX Principles
1.  **Immersive Design**: Dark theme (`#091220`) with Electric Blue (`#007BFF`) accents.
2.  **Grid Layout**: Subjects displayed in a responsive grid.
3.  **Interaction**:
    -   **Hover Effects**: Cards should scale and glow on hover.
    -   **Selection State**: Selected card must have a distinct border/glow and checkmark icon.
4.  **Feedback**:
    -   **Start Button**: Must indicate readiness (disabled state vs active state).
    -   **Loading**: Skeleton loaders or spinners during data fetch.

## Functional Rules
1.  **Subject Selection**:
    -   User **MUST** select a subject before starting.
    -   Single selection only.
2.  **Configuration**:
    -   **Difficulty**: Default to "Medium". Options: Low, Medium, Hard, Mix.
    -   **Question Count**: Slider input. Min: 5, Max: 50, Step: 5. Default: 10.
3.  **Data Fetching**:
    -   Fetch `GET /api/v1/assessment/overview` on mount to get question counts per subject.
    -   Map backend `subject` codes (e.g., `fp`) to frontend names/icons.
4.  **Navigation**:
    -   On "Start Assessment" click -> Navigate to `/assessment/test` with query params:
        -   `subject`: selected subject ID
        -   `difficulty`: selected level
        -   `limit`: selected count

## Edge Cases
-   **API Failure**: Display default question counts if API fails.
-   **No Subjects**: Handle empty state gracefully (though unlikely with static list).
