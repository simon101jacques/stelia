# Stelia Utility Monitor

An AI-powered dashboard that analyzes utility logs using Google Gemini and visualizes them in a React interface.

## Project Structure
- **Root**: Python environment for AI data processing.
- **dashboard/**: React + Vite frontend for visualization.

---

## Getting Started

### 1. Process Data (Python)
First, run the AI script to analyze your logs and generate the dashboard data.
```bash
# Ensure your .venv is active
source .venv/bin/activate

# Run the analyzer
python main.py


# Navigate to dashboard folder
cd dashboard

# Start the dev server
yarn dev

#Tech Stack
AI: Google Gemini (Generative AI SDK)
Backend: Python 3.12 (venv)
Frontend: React 18, Vite 5, Tailwind CSS