# \backend\core\t5_model.py

# core/t5_model.py

import json
import re
from pathlib import Path

import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

MODEL_DIR = (
    Path(__file__).resolve().parents[1]
    / "models"
    / "t5"
    / "checkpoint-196"
)

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_DIR)


def _try_parse_json(text: str):
    cleaned = text.strip()

    if not cleaned.startswith("{"):
        cleaned = "{ " + cleaned
    if not cleaned.endswith("}"):
        cleaned = cleaned + " }"

    cleaned = re.sub(
        r'"time_blocks"\s*:\s*\[\s*"start"\s*:\s*"([^"]+)"\s*,\s*"end"\s*:\s*"([^"]+)"\s*\]',
        r'"time_blocks": [ {"start": "\1", "end": "\2"} ]',
        cleaned,
    )

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None


def extract_constraints(text: str) -> dict:
    inputs = tokenizer(text, return_tensors="pt")

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=128,
            num_beams=2,
        )

    raw = tokenizer.decode(outputs[0], skip_special_tokens=True)

    parsed = _try_parse_json(raw)
    if parsed is None:
        return {
            "preferred_days": [],
            "time_window": {"earliest": None, "latest": None},
        }

    earliest = None
    latest = None

    time_blocks = parsed.get("time_blocks", [])
    if isinstance(time_blocks, list) and time_blocks:
        block = time_blocks[0]
        if isinstance(block, dict):
            earliest = block.get("start") or None
            latest = block.get("end") or None

    return {
        "preferred_days": [],
        "time_window": {
            "earliest": earliest,
            "latest": latest,
        },
    }
