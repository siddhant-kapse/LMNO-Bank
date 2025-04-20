# app/api/step1.py
from keras.models import load_model
import numpy as np
import cv2
import io
import os
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "model.h5")
try:
    model = load_model(MODEL_PATH)
    print(f"Model loaded successfully. Input shape: {model.input_shape}") # Check the input shape of the model
except Exception as e:
    print(f"Error loading model: {e}")
    model = None 

def predict_image(image_bytes: bytes) -> bool:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    # Resize the image to (150, 150)
    img = img.resize((150, 150))

    # Convert the image to a NumPy array
    img_array = np.array(img)

    # Normalize the pixel values (0-1 range)
    img_array = img_array / 255.0

    # Reshape the array to (1, 150, 150, 3) for model input
    img_array = img_array.reshape(1, 150, 150, 3)

    # Make a prediction
    prediction = model.predict(img_array)[0][0]
    print("Prediction value:", prediction)

    return {"result": bool(prediction > 0.5)}

