"""
CTR prediction model — starts with a simple logistic regression baseline.
Designed to be swapped for a more sophisticated model (e.g. DeepFM) without
changing the interface.
"""
import logging
from dataclasses import dataclass
from typing import Protocol

import numpy as np

logger = logging.getLogger(__name__)


@dataclass
class CampaignFeatures:
    """Feature vector for CTR prediction."""
    objective_encoded: int       # 0=AWARENESS, 1=TRAFFIC, 2=CONVERSIONS, 3=RETARGETING
    historical_ctr: float        # Past CTR (0.0 if no history)
    budget_utilization: float    # spent / total (0.0 – 1.0)
    days_running: int            # Days since campaign launch
    hour_of_day: int             # 0–23
    day_of_week: int             # 0=Monday … 6=Sunday


class CtrPredictor(Protocol):
    def predict(self, features: CampaignFeatures) -> float: ...


class LogisticCtrPredictor:
    """
    Baseline logistic regression CTR predictor.
    In production this would be trained on historical impression/click data.
    """

    def predict(self, features: CampaignFeatures) -> float:
        # Placeholder weights — replace with trained model coefficients
        x = np.array([
            features.historical_ctr * 10,
            features.budget_utilization,
            features.days_running / 30,
            np.sin(2 * np.pi * features.hour_of_day / 24),   # time-of-day signal
            features.objective_encoded / 3,
        ])
        weights = np.array([0.4, -0.1, -0.05, 0.2, 0.15])
        logit = float(np.dot(x, weights)) - 2.5   # bias toward low CTR
        return float(1 / (1 + np.exp(-logit)))


# Default predictor — swap this to upgrade the model
default_predictor = LogisticCtrPredictor()
