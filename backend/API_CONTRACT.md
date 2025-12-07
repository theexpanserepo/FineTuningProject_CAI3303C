# API Contract

**Version:** 1.2  
**Status:** Stable  
**Last Updated:** 2025-12-05

This document defines the strict communication rules between the frontend and backend of the Student Schedule Planner.  
All backend development must comply with these request and response schemas.  
All frontend requests must match these specifications exactly.

Backend is stateless.  
Frontend holds all state.

## 1. Base URL

- Local development: http://localhost:8000
- Deployment placeholder: https://api.whatever.app

## 2. Endpoints Overview

- POST /schedule/generate — Deterministic schedule generation
- POST /llm/explain — Convert schedule into advisor-style natural language
- GET /health — Health check

## 3. POST /schedule/generate

### Request Body

{
"selectedCourses": ["MAC1105", "ENC1101", "STA2023"],
"lockedCourses": ["MAC1105"],
"constraintText": "Avoid mornings and avoid Fridays. Prefer Tue/Thu if possible."
}

### Successful Response

{
"success": true,
"schedule": [...],
"fail_reason": null,
"constraints": {}
}

### Failure Response

{
"success": false,
"schedule": null,
"fail_reason": "No evening section exists for ENC1101 on Tue Thu",
"constraints": {}
}

## 4. POST /llm/explain

### Request Body

{
"userMessage": "Prefer Tue/Thu evenings and avoid mornings.",
"schedule": [...],
"fail_reason": null
}

### Response

{
"explanation": "Advisor-style explanation..."
}

## 5. GET /health

{"status": "ok"}

## 6. Constraint JSON Schema (T5 Output)

{
"avoid_mornings": true,
"avoid_evenings": false,
"avoid_fridays": true,
"preferred_days": ["Tue", "Thu"],
"time_window": {
"earliest": "11:00",
"latest": "20:00"
}
}

## 7. Frontend → Backend State Model

- selectedCourses
- lockedCourses
- constraintText
- userMessage

## 8. Scheduler Output Schema

### Success

{
"schedule": [...],
"fail_reason": null
}

### Failure

{
"schedule": null,
"fail_reason": "No valid evening section exists for ENC1101"
}

## 9. Error Codes

400 — Bad Request  
422 — Unprocessable Entity  
500 — Internal Server Error  
503 — Service Unavailable

## 10. CSV Data Handling

- Load CSVs at startup
- Cache all data in RAM for deterministic runtime

## 11. End-to-End Example

### Request

{
"selectedCourses": ["MAC1105", "ENC1101", "STA2023"],
"lockedCourses": ["MAC1105"],
"constraintText": "Avoid mornings. Avoid Fridays. Prefer Tue/Thu evenings."
}

### Response

{
"success": true,
"schedule": [...],
"fail_reason": null,
"constraints": {}
}
