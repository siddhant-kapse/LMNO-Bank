from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.api.step1 import predict_image
import uvicorn

app = FastAPI()

# CORS so Next.js can call this locally
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("✅ FastAPI is running on http://localhost:8005")


@app.post("/step1")
async def step1(image: UploadFile = File(...)):
    print("Step1 endpoint called")  # Add this line
    print(f"Image filename: {image.filename}")  # And this
    print(f"Image content type: {image.content_type}")  # And this
    content = await image.read()
    result = predict_image(content)
    print(f"Prediction result: {result}")  # And this
    return {"success": result}

@app.post("/step2")
async def check_clarity(front: UploadFile = File(...), back: UploadFile = File(...)):
    front_img = await front.read()
    back_img = await back.read()

    front_pred =  result = predict_image(front_img)
    back_pred =  result = predict_image(back_img)

    # You can use a threshold like 0.5
    # front_clear = front_pred > 0.5
    # back_clear = back_pred > 0.5

    return { "success": front_pred and back_pred,
        "details": {
            "front_clear": front_pred,
            "back_clear": back_pred
        }
    }


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8005)