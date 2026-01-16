from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import RawImport, UnifiedKPI
import shutil
import os
from datetime import datetime

router = APIRouter()

@router.get("/health")
def read_root():
    return {"status": "ok", "engine": "KPI Analyzer Python Core"}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Save raw file content to DB for traceability
    # Note: In a real app we might stream this or just save path if files are huge
    # For now, we save blob as per architecture doc
    
    content = await file.read()
    
    # Calculate SHA256 checksum
    import hashlib
    sha256_hash = hashlib.sha256(content).hexdigest()
    
    # Check if file already exists
    existing_file = db.query(RawImport).filter(RawImport.checksum == sha256_hash).first()
    if existing_file:
         return {"filename": file.filename, "id": existing_file.id, "status": "Already exists", "info": "File skipped (duplicate)"}

    db_file = RawImport(
        filename=file.filename,
        checksum=sha256_hash,
        content_blob=content,
        import_date=datetime.utcnow(),
        status="PROCESSED" # Mocking processing for now
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    # --- ETL Process (Multi-format support: CSV, Excel, JSON) ---
    try:
        import pandas as pd
        import io
        import json

        df = None

        # Détection du format de fichier
        if file.filename.endswith('.csv'):
            # CSV : détection automatique du séparateur
            content_str = content.decode('utf-8')
            # Essayer différents séparateurs
            for sep in [';', ',', '\t', '|']:
                try:
                    df = pd.read_csv(io.StringIO(content_str), sep=sep)
                    if len(df.columns) > 1:  # Si plus d'une colonne, c'est bon
                        break
                except:
                    continue

        elif file.filename.endswith(('.xlsx', '.xls')):
            # Excel
            df = pd.read_excel(io.BytesIO(content))

        elif file.filename.endswith('.json'):
            # JSON
            json_data = json.loads(content.decode('utf-8'))

            # Si c'est une liste d'objets
            if isinstance(json_data, list):
                df = pd.DataFrame(json_data)
            # Si c'est un objet unique
            elif isinstance(json_data, dict):
                df = pd.DataFrame([json_data])
            else:
                raise ValueError("Format JSON non supporté (doit être liste ou objet)")

        else:
            print(f"⚠️ Format non supporté: {file.filename}")

        # Traitement des KPIs (commun à tous les formats)
        if df is not None:
            kpi_entries = []

            # Normaliser les noms de colonnes (minuscules, sans espaces)
            df.columns = df.columns.str.lower().str.strip()

            # Identifier la colonne de date
            date_col = None
            for col in ['date', 'datetime', 'timestamp', 'jour']:
                if col in df.columns:
                    date_col = col
                    break

            if date_col is None:
                raise ValueError("Aucune colonne 'date' trouvée dans le fichier")

            # Parcourir chaque ligne
            for idx, row in df.iterrows():
                try:
                    row_date = pd.to_datetime(row[date_col])
                except:
                    print(f"⚠️ Ligne {idx}: date invalide, ignorée")
                    continue

                # Pour chaque colonne numérique, créer un KPI
                for col in df.columns:
                    if col == date_col:
                        continue

                    # Vérifier si c'est une valeur numérique
                    try:
                        value = float(row[col])

                        # Détecter la catégorie (region, category, ou 'Global')
                        category = 'Global'
                        for cat_col in ['region', 'category', 'categorie', 'cat']:
                            if cat_col in df.columns and cat_col != col:
                                category = str(row.get(cat_col, 'Global'))
                                break

                        # Créer le KPI
                        kpi_entries.append(UnifiedKPI(
                            date=row_date,
                            kpi_name=col,
                            category=category,
                            value=value,
                            source_file_id=db_file.id
                        ))
                    except (ValueError, TypeError):
                        # Cette colonne n'est pas numérique, on l'ignore
                        pass

            # Sauvegarder les KPIs en base
            if kpi_entries:
                db.bulk_save_objects(kpi_entries)
                db.commit()
                print(f"✅ {len(kpi_entries)} KPIs créés depuis {file.filename}")
            else:
                print(f"⚠️ Aucun KPI créé depuis {file.filename} (aucune colonne numérique trouvée)")

    except Exception as e:
        print(f"❌ ETL Error: {e}")
        import traceback
        traceback.print_exc()
        # We don't fail the upload, just log error for MVP
    
    return {"filename": file.filename, "id": db_file.id, "status": "Imported & Processed"}

@router.get("/kpi/summary")
def get_kpi_summary(db: Session = Depends(get_db)):
    # Mock data return if table is empty, or query DB
    kpis = db.query(UnifiedKPI).all()
    if not kpis:
        return {
            "message": "No data yet",
            "count": 0
        }
    return kpis

@router.get("/upload/files")
def list_uploaded_files(db: Session = Depends(get_db)):
    """Retourne la liste des fichiers importés"""
    files = db.query(RawImport).order_by(RawImport.import_date.desc()).all()
    return [
        {
            "id": f.id,
            "filename": f.filename,
            "import_date": f.import_date,
            "status": f.status,
            "checksum": f.checksum
        }
        for f in files
    ]

# TODO: Add specific KPI query endpoints
