# core/scheduler.py

from core.constraints import normalize_constraints
from core.data_loader import CLASSES_DATA


def build_schedule(selected_courses, locked_courses, raw_constraints):
    """
    Main deterministic scheduling engine entry point.
    Returns (schedule_list, fail_reason_string)
    """

    constraints = normalize_constraints(raw_constraints)

    # ---------------------------------------------
    # STEP 1: Place locked courses first
    # ---------------------------------------------
    locked = _place_locked_courses(locked_courses)

    if locked is None:
        return None, "One or more locked courses could not be placed."

    # ---------------------------------------------
    # STEP 2: Fill remaining courses
    # ---------------------------------------------
    remaining = [
        c for c in selected_courses
        if c not in locked_courses
    ]

    schedule = dict(locked)  # course → chosen section

    for course in remaining:
        section = _choose_section(course, constraints, schedule)
        if section is None:
            return None, f"No valid section exists for {course}"
        schedule[course] = section

    # Convert dict(course → section) into list for frontend
    schedule_list = list(schedule.values())
    return schedule_list, None


# ---------------------------------------------------------
# INTERNAL HELPERS
# ---------------------------------------------------------


def _passes_constraints(row, constraints):
    """
    Returns True if this class section satisfies all constraint rules.
    """

    day = row.get("day")
    start = row.get("start_time")
    end = row.get("end_time")

    # --- Avoid morning classes ---
    if constraints.get("avoid_mornings"):
        if _is_morning(start):
            return False

    # --- Avoid evening classes ---
    if constraints.get("avoid_evenings"):
        if _is_evening(start):
            return False

    # --- Avoid Fridays ---
    if constraints.get("avoid_fridays"):
        if day == "Fri":
            return False

    # --- Preferred days ---
    preferred = constraints.get("preferred_days", [])
    if preferred:
        if day not in preferred:
            return False

    # --- Time-window constraints ---
    tw = constraints.get("time_window", {})
    earliest = tw.get("earliest")
    latest = tw.get("latest")

    if earliest and start < earliest:
        return False
    if latest and end > latest:
        return False

    return True


def _is_morning(time_str):
    """Return True if class starts before 12:00."""
    return time_str < "12:00"


def _is_evening(time_str):
    """Return True if class starts after 17:00."""
    return time_str > "17:00"


def _place_locked_courses(locked_courses):
    """
    For each locked course:
    - choose a valid section
    - ensure locked courses do not conflict with each other
    """

    placed = {}

    for course in locked_courses:
        # Get all candidate sections
        candidates = [row for row in CLASSES_DATA if row.get("course") == course]

        if not candidates:
            return None  # no such course

        # Deterministic: choose the first section
        chosen_row = candidates[0]

        # Convert to unified schedule entry
        section = _convert_row_to_section(chosen_row)

        # Conflict-check against already placed locked courses
        if not _no_time_conflict(chosen_row, placed):
            return None

        placed[course] = section

    return placed


def _choose_section(course, constraints, current_schedule):
    """
    Selects a valid section for a course after applying:
    1. Constraint filters
    2. Conflict avoidance with existing schedule
    """

    # 1 — candidate sections for this course
    candidates = [
        row for row in CLASSES_DATA
        if row.get("course") == course
    ]

    if not candidates:
        return None

    # 2 — apply constraint filters
    filtered = [
        row for row in candidates
        if _passes_constraints(row, constraints)
    ]

    if not filtered:
        return None

    # 3 — avoid conflicts with courses already placed
    no_conflicts = [
        row for row in filtered
        if _no_time_conflict(row, current_schedule)
    ]

    if not no_conflicts:
        return None

    # 4 — Deterministic selection
    chosen = no_conflicts[0]

    return _convert_row_to_section(chosen)


def _no_time_conflict(row, schedule_dict):
    """
    Checks if 'row' conflicts with any already-chosen sections.
    schedule_dict maps: course → section_dict
    """

    candidate_day = row.get("day")
    candidate_start = row.get("start_time")
    candidate_end = row.get("end_time")

    for placed_course, placed in schedule_dict.items():
        if placed["day"] != candidate_day:
            continue  # different day, no conflict

        if _times_overlap(
            candidate_start,
            candidate_end,
            placed["start_time"],
            placed["end_time"]
        ):
            return False

    return True


def _times_overlap(start1, end1, start2, end2):
    """
    Returns True if two HH:MM intervals overlap.
    """

    s1 = int(start1.replace(":", ""))
    e1 = int(end1.replace(":", ""))
    s2 = int(start2.replace(":", ""))
    e2 = int(end2.replace(":", ""))

    return not (e1 <= s2 or e2 <= s1)


def _convert_row_to_section(row):
    """
    Converts CSV row into the final schedule schema.
    Placeholder until CSV columns are finalized.
    """
    return {
        "course": row.get("course"),
        "day": row.get("day"),
        "start_time": row.get("start_time"),
        "end_time": row.get("end_time"),
        "location": row.get("location")
    }
