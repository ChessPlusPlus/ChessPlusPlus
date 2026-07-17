import threading
import time

class TokenBucket:
    def __init__(self, max_tokens: int, refill_rate: int, refill_interval: int):
        if refill_rate <= 0:
            raise ValueError("Refill rate must be greater than 0")

        if refill_interval <= 0:
            raise ValueError("Refill interval must be greater than 0")

        if max_tokens <= 0:
            raise ValueError("Max tokens must be greater than 0")

        self.max_tokens = max_tokens
        self.refill_rate = refill_rate
        self.refill_interval = refill_interval

        self.tokens = max_tokens
        self.refilled_at = time.time()

        self.lock = threading.Lock()

    def _refill(self):
        elapsed_time = time.time() - self.refilled_at

        if elapsed_time < self.refill_interval:
            return

        num_refills = int(elapsed_time / self.refill_interval)
        self.tokens = min(self.max_tokens, self.tokens + num_refills * self.refill_rate)
        self.refilled_at += num_refills * self.refill_interval

    def is_request_allowed(self):
        with self.lock:
            self._refill()
            if self.tokens > 0:
                self.tokens -= 1
                return True
            return False

        return None

    def get_remaining_tokens(self):
        with self.lock:
            self._refill()
            return self.max_tokens - self.tokens

        return None

    def get_next_refill_time(self):
        with self.lock:
            self._refill()
            return self.refilled_at + self.refill_interval - time.time()

        return None