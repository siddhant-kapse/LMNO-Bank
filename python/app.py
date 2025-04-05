from fastapi import FastAPI, File, UploadFile, HTTPException
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import boto3
from botocore.exceptions import NoCredentialsError
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Load the pre-trained model from the models directory
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'model.h5')
model = load_model(MODEL_PATH)

# AWS S3 Configuration
S3_BUCKET = os.getenv('S3_BUCKET')  # Get S3 bucket name from environment variables
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

@app.post("/verify-image")
async def verify_image(file: UploadFile = File(...)):
    # Read the image file
    contents = await file.read()
    img = Image.open(io.BytesIO(contents))

    # Ensure the image has 3 color channels (RGB)
    img = img.convert('RGB')

    # Resize the image to (150, 150)
    img = img.resize((150, 150))

    # Convert the image to a NumPy array
    img_array = np.array(img)

    # Normalize the pixel values (0-1 range)
    img_array = img_array / 255.0

    # Reshape the array to (1, 150, 150, 3) for model input
    img_array = img_array.reshape(1, 150, 150, 3)

    # Make a prediction
    prediction = model.predict(img_array)[0][0]  # Get the prediction probability

    # Interpret the prediction
    if prediction >= 0.5:
        # Upload image to S3
        try:
            s3_client.upload_fileobj(io.BytesIO(contents), S3_BUCKET, file.filename)
            s3_link = f"https://{S3_BUCKET}.s3.amazonaws.com/{file.filename}"
            return {"status": "success", "message": "The image is verified as a human.", "s3_link": s3_link}
        except NoCredentialsError:
            raise HTTPException(status_code=500, detail="AWS credentials not available")
    else:
        return {"status": "failure", "message": "The image is not a human. Please upload a valid image."}