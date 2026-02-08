import unittest
import requests
import time

# Configuration
BASE_URL = "http://127.0.0.1:8000/api/v1/assessment"

class TestAssessmentAPI(unittest.TestCase):

    def test_1_get_overview(self):
        """Test fetching the assessment overview/stats."""
        print("\nTesting GET /overview...")
        response = requests.get(f"{BASE_URL}/overview")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        if len(data) > 0:
            print(f"  - Received stats for {len(data)} subjects.")
            self.assertIn("subject", data[0])
            self.assertIn("count", data[0])
        else:
            print("  - No data found (DB might be empty).")

    def test_2_get_questions(self):
        """Test fetching questions with filters."""
        print("\nTesting GET /questions...")
        # Check if DB has data first
        overview = requests.get(f"{BASE_URL}/overview").json()
        if not overview:
            self.skipTest("Database is empty, cannot test fetching questions.")
        
        # Pick a subject from overview
        subject_id = overview[0]['subject']
        
        params = {
            "subject": subject_id,
            "diff": "Medium",
            "count": 5
        }
        response = requests.get(f"{BASE_URL}/questions", params=params)
        self.assertEqual(response.status_code, 200)
        
        questions = response.json()
        self.assertLessEqual(len(questions), 5)
        
        if len(questions) > 0:
            q = questions[0]
            print(f"  - Fetched question: {q.get('question')[:30]}...")
            
            # Verify Schema
            self.assertIn("id", q)
            self.assertIn("question", q)
            self.assertIn("options", q)
            self.assertIn("correct_answer", q)
            self.assertIn("explanation", q)
            
            # Verify Options
            self.assertIsInstance(q['options'], list)
            self.assertEqual(len(q['options']), 4)

    def test_3_e2e_flow(self):
        """Simulate a user flow: Check stats -> Get Questions -> Verify Structure"""
        print("\nTesting E2E Flow...")
        
        # 1. User checks available subjects
        r1 = requests.get(f"{BASE_URL}/overview")
        self.assertEqual(r1.status_code, 200)
        subjects = r1.json()
        if not subjects:
             print("  - Skipping flow as DB empty.")
             return
             
        target_subject = subjects[0]['subject']
        print(f"  - User selected: {target_subject}")
        
        # 2. User starts quiz (GET questions)
        r2 = requests.get(f"{BASE_URL}/questions", params={"subject": target_subject, "count": 10})
        self.assertEqual(r2.status_code, 200)
        quiz_data = r2.json()
        print(f"  - User received {len(quiz_data)} questions.")
        
        # 3. Validation
        for q in quiz_data:
            self.assertTrue(q['correct_answer'] in q['options'], f"Correct answer {q['correct_answer']} not in options {q['options']}")

if __name__ == "__main__":
    unittest.main()
