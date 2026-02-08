# Specification: MCQ Test Page

## Overview
The **Test Page** is the core examination interface where users answer questions under timed conditions and review their results.

## UI/UX Principles
1.  **Focus Mode**: Minimal distractions. Main content is the question list.
2.  **Single View**: All questions displayed in a vertical scrollable list (no pagination).
3.  **Status Indicators**:
    -   **Timer**: Sticky header showing remaining time.
    -   **Submission**: Clear visual change (Green/Red) upon completion.

## Functional Rules
1.  **Initialization**:
    -   Fetch questions based on URL query params (`subject`, `difficulty`, `limit`).
    -   Show Loading Spinner during fetch.
    -   Show Error/Empty state if no questions returned.
2.  **Timer Logic**:
    -   Duration: `Questions Count * 60 seconds`.
    -   Auto-Submit: When timer hits 0.
3.  **Interaction**:
    -   **Answering**: Click option to select. Toggle selection (Radio behavior per question).
    -   **Changing Answers**: Allowed until submission.
4.  **Submission Logic**:
    -   Calculate Score locally.
    -   Disable all inputs.
    -   **Reveal Mode**:
        -   **Correct Answer**: Green Border + Check Icon.
        -   **Wrong Answer**: Red Border + Cross Icon.
        -   **Explanation**: Slide down panel below question.
    -   Scroll to Top of page.
    -   Show "Final Score" in header.

## Data & API
-   **Endpoint**: `GET /api/v1/assessment/questions`
-   **Schema**:
    ```json
    {
      "id": int,
      "subject": string,
      "question": string,
      "options": string[],
      "correct_answer": string,
      "explanation": string
    }
    ```

## Edge Cases
-   **Refresh**: Currently resets progress (Known Issue).
-   **Network Error on Submit**: Submission is local, so safer, but if we add backend save, need retry logic.
