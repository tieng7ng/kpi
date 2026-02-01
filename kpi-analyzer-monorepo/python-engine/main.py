import os
import sys
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import init_db
from api import endpoints, auth_endpoints

# Création de l'application FastAPI
app = FastAPI(
    title="KPI Analyzer API",
    description="API pour l'analyse des KPIs de transport",
    version="1.0.0"
)

# Configuration CORS
origins_str = os.getenv("ALLOWED_ORIGINS", "")
origins = [origin.strip() for origin in origins_str.split(",") if origin.strip()]

# Fallback pour le développement local
if not origins:
    origins = ["http://localhost:5173", "http://localhost:8000", "http://localhost:80", "http://localhost"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation de la base de données au démarrage
@app.on_event("startup")
def startup_event():
    init_db()

# Inclusion des routers
app.include_router(endpoints.router, prefix="/api")
app.include_router(auth_endpoints.router, prefix="/api")

if __name__ == "__main__":
    port = 8000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])

    print(f"Starting engine on port {port}")

    from database.connection import DATA_DIR
    print(f"DATABASE PATH: {DATA_DIR}")

    uvicorn.run(app, host="127.0.0.1", port=port)
