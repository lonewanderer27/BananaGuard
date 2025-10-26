from io import BytesIO
from keras.preprocessing import image
from keras.applications.efficientnet import preprocess_input
import numpy as np

def preprocess_image(img_bytes: bytes, target_size=(224, 224)):
    photo = image.load_img(BytesIO(img_bytes), target_size=target_size)
    img_array = image.img_to_array(photo)
    img_array = np.expand_dims(img_array, axis=0) # Add batch dimension

    # Preprocess the image for EfficientNetB0
    # This is the same preprocessing used during training
    img_array = preprocess_input(img_array)

    return img_array

    