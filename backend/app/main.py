from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.endpoints.query import router as query_router
from app.endpoints.upload import router as upload_router

app = FastAPI(title="Differential Privacy API", version="0.1.0")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(query_router, tags=["Differential Privacy"])
app.include_router(upload_router, tags=["Data Upload"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Differential Privacy API!"}
