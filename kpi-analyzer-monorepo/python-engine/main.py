from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database.connection import init_db
from api import endpoints
import uvicorn
import sys

app = FastAPI(title="KPI Analyzer Engine")

# CORS - Allow localhost for Electron
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev (Vite uses random ports)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on startup
@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(endpoints.router, prefix="/api")

if __name__ == "__main__":
    # Electron will spawn this process. 
    # We want a random port (port=0) but for dev now we pick 8000 or let system decide.
    # In production, we'll print the port to stdout so Electron can grab it.
    port = 8000 
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    
    print(f"Starting engine on port {port}")
    uvicorn.run(app, host="127.0.0.1", port=port)
