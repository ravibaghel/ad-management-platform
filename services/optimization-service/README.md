# optimization-service

Python 3.12 / FastAPI — CTR prediction and budget optimisation.

## Responsibilities
- Predict CTR using a pluggable model interface (starts with logistic regression)
- Generate campaign optimisation recommendations
- Consume analytics data to retrain models over time

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8082
```
