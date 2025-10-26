from pprint import pprint
from backend.services.preprocess_image import preprocess_image
from keras import Model
from backend.enums.disease_type import DiseaseType
from typing import Optional
import tensorflow as tf

def predict_disease(img_bytes: bytes, model: Model, round_to: Optional[int] = 2, sort_results: bool = False):
    """
    Predicts the disease type from an image and returns confidence scores.

    Args:
        img_bytes (bytes): Image bytes to predict.
        model (Model): Loaded Keras model.
        round_to (Optional[int], optional): Rounding precision for confidence. Defaults to 2.
        sort_results (bool, optional): Whether to sort results by confidence. Defaults to False.

    Returns:
        tuple[dict, DiseaseType, float]: 
            (results per class, predicted disease type, confidence)
    """

    # Preprocess image
    img_array = preprocess_image(img_bytes)

    # Make prediction
    predictions = model.predict(img_array)
    scores = tf.nn.softmax(predictions[0]).numpy()

    # Map class to confidence
    results = {
        class_name: round(float(prob * 100), round_to)
        for class_name, prob in zip([dt for dt in DiseaseType], scores)
    }

    # Optionally sort by confidence
    if sort_results:
        results = dict(sorted(results.items(), key=lambda item: item[1], reverse=True))

    # Determine highest confidence prediction
    predicted_disease_type = DiseaseType.from_str(max(results, key=results.get))
    confidence = results[predicted_disease_type]

    return results, predicted_disease_type, confidence
