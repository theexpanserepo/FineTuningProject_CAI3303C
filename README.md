# Student Schedule Planner

**Status:** Minimum Viable Product (MVP)

A hybrid scheduling assistant that takes **natural-language student constraints**, converts them into structured JSON with a **fine-tuned T5 model**, passes them to a **deterministic scheduling engine** over a synthetic course catalog, and then uses an **LLM (GPT-4o-mini)** to generate an advisor-style explanation of the result.

This is an **academic demo**, not a production system. The purpose is this project is to demonstrate successful fine tuning of a model, and integration into a pipeline.

---

## 1. High-Level Overview

### What it does

- Accepts **student requests in plain English**  
  (e.g., “I work nights, avoid mornings, and need ENC1101 and MAC1105.”)
- Uses a **fine-tuned T5 model** to output constraint JSON
- Runs a **deterministic algorithm** over a synthetic course catalog
- Returns either:
  - A conflict-free schedule with all requested courses, or
  - A clear reason why no valid schedule exists
- Uses **GPT-4o-mini** to turn the schedule into a short, advisor-style explanation
- Exposes a **React + Vite + Tailwind** frontend for interactive use

### MVP status and limitations

This is a **Minimum Viable Product (MVP)**:

- Uses a **small synthetic CSV catalog** with only a limited set of course codes
- T5 is fine-tuned for **JSON syntax** output
- The scheduler is **all-or-nothing**:
  - If any requested course cannot be placed without conflicts → the entire schedule fails with an explicit `fail_reason`
- The project is intended to demonstrate:
  - Fine-tuning a model
  - Integrating it into a real backend
  - Combining it with deterministic logic and an LLM-driven explanation layer

---

## 2. Tech Stack

**Backend**

- Python 3.10
- FastAPI
- Uvicorn
- Transformers (Hugging Face)
- Torch
- OpenAI Python client
- python-dotenv

**Modeling**

- Fine-tuned T5-small:
  - Role: Convert natural-language constraints → JSON-like structure

**Frontend**

- React
- Vite
- Tailwind CSS

---

### 3.1. Prerequisites

**Python:** 3.10

- Virtual environment recommended

### 3.2. Create and activate venv

From the `backend/` folder:

```bash
cd backend

# create venv (Windows)
python -m venv venv

# activate
venv\Scriptsctivate
```

### 3.3. Install dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` is missing, it should contain:

```txt
fastapi
uvicorn[standard]
transformers
torch
openai
python-dotenv
```

### 3.4. Fine-tuned model files

The fine-tuned T5 checkpoint must exist at:

```text
backend/models/t5/checkpoint-196/
```

This folder should contain typical Hugging Face model artifacts, e.g.:

- `config.json`
- `tokenizer.json`
- `spiece.model` (if relevant)
- `pytorch_model.bin`
- etc.

### 3.5. Run the backend

From `backend/`:

```bash
uvicorn main:app --reload
```

Health check:

```bash
curl http://127.0.0.1:8000/health
# {"status":"ok"}
```

---

## 4. Frontend Setup (React + Vite)

### 4.1. Prerequisites

- Node.js (LTS) + npm

### 4.2. Install deps and run dev server

From `frontend/`:

```bash
cd ../frontend
npm install
npm run dev
```

By default, Vite runs on:

```text
http://127.0.0.1:5173/
```

## 5. Summary

This project demonstrates:

- Fine-tuning a T5 model for structured JSON output from natural language
- Building a deterministic, conflict-free scheduler over a CSV catalog
- Wrapping it with a FastAPI backend and React/Tailwind frontend
- Using GPT-4o-mini for explanation, with a clean separation of concerns

All pieces are modular, so:

- The model can be swapped,
- The data source can be replaced,
- The explanation layer can be upgraded,

without rewriting the entire system.
