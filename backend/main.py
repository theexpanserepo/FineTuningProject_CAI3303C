# backend\main.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

from core.data_loader import CLASSES_DATA
from core.scheduler import build_schedule
from core.constraints import normalize_constraints
from core.llm import explain_schedule
from core.t5_model import extract_constraints



app = FastAPI()

print(f"[BOOT] Loaded {len(CLASSES_DATA)} class records")


# ----------------------------------------------------
# Request/Response Models
# ----------------------------------------------------

class GenerateRequest(BaseModel):
    selectedCourses: List[str]
    lockedCourses: List[str]
    constraintText: str


class GenerateResponse(BaseModel):
    success: bool
    schedule: Optional[List] = None
    fail_reason: Optional[str] = None
    constraints: Optional[dict] = None


class ExplainRequest(BaseModel):
    userMessage: str
    schedule: List
    fail_reason: Optional[str] = None


class ExplainResponse(BaseModel):
    explanation: str


# ----------------------------------------------------
# Health check
# ----------------------------------------------------

@app.get("/health")
def health():
    return {"status": "ok"}


# ----------------------------------------------------
# Schedule generation
# ----------------------------------------------------

@app.post("/schedule/generate", response_model=GenerateResponse)
def generate_schedule(req: GenerateRequest):

    # Step 1 — extract structured constraints using the fine-tuned T5
    raw_constraints = extract_constraints(req.constraintText)

    # Step 2 — normalize them to guarantee stable schema
    constraints = normalize_constraints(raw_constraints)

    # Step 3 — call deterministic scheduler
    schedule, fail_reason = build_schedule(
        selected_courses=req.selectedCourses,
        locked_courses=req.lockedCourses,
        raw_constraints=constraints
    )

    return GenerateResponse(
        success=(fail_reason is None),
        schedule=schedule,
        fail_reason=fail_reason,
        constraints=constraints
    )



# ----------------------------------------------------
# Explanation endpoint
# ----------------------------------------------------

@app.post("/llm/explain", response_model=ExplainResponse)
def explain(req: ExplainRequest):

    text = explain_schedule(
        user_message=req.userMessage,
        schedule=req.schedule,
        fail_reason=req.fail_reason
    )

    return ExplainResponse(explanation=text)
