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

@app.get("/test")
async def test():
    return {"message": "API is working"}


@app.post("/step1")
async def step1(image: UploadFile = File(...)):
    print("Step1 endpoint called")  # Add this line
    print(f"Image filename: {image.filename}")  # And this
    print(f"Image content type: {image.content_type}")  # And this
    content = await image.read()
    print(f"Image content length: {len(content)}")  # And this
    result = predict_image(content)
    print(f"Prediction result: {result}")  # And this
    return {"success": result}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8005)