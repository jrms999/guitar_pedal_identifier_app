from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from io import BytesIO
from PIL import Image
import numpy as np
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Result(BaseModel):
    name: str
    brand: str
    value: float

def read_imagefile(file) -> Image.Image:
    image = Image.open(BytesIO(file))
    return image.resize((224, 224))

@app.post("/identify")
async def identify_pedal(file: UploadFile = File(...)):
    contents = await file.read()
    image = read_imagefile(contents)

    dummy_results = [
        {"name": "Boss DS-1", "brand": "Boss", "value": 45.00},
        {"name": "Ibanez TS9", "brand": "Ibanez", "value": 89.99},
        {"name": "EHX Big Muff", "brand": "EHX", "value": 72.00},
    ]
    result = random.choice(dummy_results)
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
