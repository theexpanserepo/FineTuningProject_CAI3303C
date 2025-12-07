# core/llm.py

# core/llm.py

import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()  # loads .env from project root / backend

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)


def explain_schedule(user_message, schedule, fail_reason=None):
    prompt = f"""
    User request: {user_message}
    Schedule: {schedule}
    Fail reason: {fail_reason}

    Provide a brief, advisor-style explanation for the student.
    """

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    return completion.choices[0].message.content
