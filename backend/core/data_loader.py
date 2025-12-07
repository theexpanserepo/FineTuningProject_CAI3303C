# core/data_loader.py

import csv
from pathlib import Path

# Project root: .../FineTuningFinalProject/
PROJECT_ROOT = Path(__file__).resolve().parents[2]

CLASSES_CSV = PROJECT_ROOT / "data" / "scheduler" / "classes.csv"


def load_classes_csv():
    records = []
    with open(CLASSES_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(dict(row))
    return records


CLASSES_DATA = load_classes_csv()
