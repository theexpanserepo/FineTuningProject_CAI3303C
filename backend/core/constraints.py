# backend\core\constraints.py

"""
Constraint normalization utility.
Ensures the T5 output is converted into a stable schema for the scheduler.
"""

def normalize_constraints(raw):
    if raw is None:
        raw = {}

    tw = raw.get("time_window", {}) or {}

    earliest = tw.get("earliest") or None
    latest   = tw.get("latest") or None

    return {
        "preferred_days": [],
        "time_window": {
            "earliest": earliest,
            "latest": latest
        }
    }
