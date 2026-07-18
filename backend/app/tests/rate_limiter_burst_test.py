import requests
import time


def test_burst():
    """Send 15 rapid requests to trigger the rate limit."""
    url = "http://localhost:8000/test"
    results = []

    for i in range(15):
        response = requests.get(url)
        remaining = response.headers.get("X-RateLimit-Remaining", "N/A")
        results.append((i + 1, response.status_code, remaining))
        print(f"Request {i+1:2d} | Status: {response.status_code} | Remaining: {remaining}")

    print()

    allowed = sum(1 for _, status, _ in results if status == 200)
    blocked = sum(1 for _, status, _ in results if status == 429)
    print(f"Allowed: {allowed}, Blocked: {blocked}")


def test_refill():
    """Exhaust tokens, wait for a refill, then confirm requests succeed again."""
    url = "http://127.0.0.1:8000/test"

    print("\n--- Exhausting tokens ---")
    for i in range(12):
        response = requests.get(url)
        print(f"Request {i+1:2d} | Status: {response.status_code}")

    print("\n--- Waiting 3 seconds for refill ---")
    time.sleep(3)

    print("\n--- Sending requests after refill ---")
    for i in range(5):
        response = requests.get(url)
        remaining = response.headers.get("X-RateLimit-Remaining", "N/A")
        print(f"Request {i+1:2d} | Status: {response.status_code} | Remaining: {remaining}")


if __name__ == "__main__":
    print("=== Burst Test ===")
    test_burst()

    # Allow bucket to refill before next test
    time.sleep(6)

    print("\n=== Refill Test ===")
    test_refill()