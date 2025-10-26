import os
import keras
import tensorflow as tf
from keras import Model
from pathlib import Path
from backend.core.logger import logger

MODEL_FILENAME = "banana_leaf_model.keras"
K = keras.backend

def focal_loss(gamma=2., alpha=.25):
    def focal_loss_fixed(y_true, y_pred):
        """Focal loss for imbalanced datasets

        Args:
            y_true: true labels (can be sparse integers)
            y_pred: predictions (probabilities)
            gamma: focusing parameter (>= 0).
            alpha: weighting factor (0-1).

        Returns:
            Calculated focal loss
        """
        epsilon = K.epsilon()
        y_pred = K.clip(y_pred, epsilon, 1. - epsilon)

        # convert sparse labels to one-hot encoding
        classes = ['bbtv', 'cordana', 'healthy', 'pestalotiopsis', 'sigatoka', 'fusarium_wilt']
        y_true_one_hot = tf.one_hot(tf.cast(y_true, tf.int32), depth=len(classes))

        #  cross-entropy
        #  y_true_one_hot for element-wise multiplication
        cross_entropy = -y_true_one_hot * K.log(y_pred)

        #  the focal loss term
        loss = alpha * K.pow(1 - y_pred, gamma) * cross_entropy

        return K.mean(K.sum(loss, axis=-1))

    return focal_loss_fixed


def resolve_model_path() -> Path:
    # Check for MODEL_PATH env var
    model_path = os.getenv('MODEL_PATH')

    if model_path and Path(model_path).exists():
        return Path(model_path)

    # build a fallback path relative to this file (three levels up -> model/<MODEL_FILENAME>)
    base = Path(__file__).resolve().parent  # src/backend/core
    fallback = base.parents[3] / 'model' / MODEL_FILENAME  # go up three levels

    if fallback.exists():
        return fallback

    raise FileNotFoundError(f"Model not found at {model_path or fallback}. Please ensure you have pulled the model from LFS")

def load_model() -> Model:
    try:
        logger.info("Loading model...")
        model_path = resolve_model_path()

        custom_objects = {
            "focal_loss": focal_loss(),
        }
        
        model = keras.models.load_model(model_path, compile=False, custom_objects=custom_objects)
        model.summary()
        
        logger.info(f"Model loaded successfully")
        return model
    except Exception as e:
        logger.exception(f"Error loading model\n{e}")
        raise