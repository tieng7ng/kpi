from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.connection import get_db
from database.models import RawImport, UnifiedKPI, TransportEntry, User
from auth.auth_service import get_current_user
from ingestion import process_transport_file
import shutil
import os
from datetime import datetime
import pandas as pd
import io

router = APIRouter()

@router.get("/health")
def read_root():
    return {"status": "ok", "engine": "KPI Analyzer Python Core"}

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
        status="PROCESSED"
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    try:
        # --- Détection de Format ---
        # On lit les premières lignes pour voir les entêtes
        is_transport_file = False
        try:
            # Décodage rapide pour check
            preview = content.decode('utf-8-sig', errors='ignore')[:1000]
            if "Num. de bordereau" in preview and "Incoterm" in preview:
                is_transport_file = True
        except:
            pass

        if is_transport_file:
            print(f"🚛 Fichier Transport détecté : {file.filename}")
            process_transport_file(content, file.filename, db, db_file)
            return {"filename": file.filename, "id": db_file.id, "status": "Imported (Transport Mode)"}
            
        # --- Fallback ETL Générique (Legacy) ---
        # (Code existant pour les fichiers JSON/Excel simples)
        import json
        df = None

        if file.filename.endswith('.csv'):
            content_str = content.decode('utf-8')
            for sep in [';', ',', '\t', '|']:
                try:
                    df = pd.read_csv(io.StringIO(content_str), sep=sep)
                    if len(df.columns) > 1:
                        break
                except:
                    continue

        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(content))

        elif file.filename.endswith('.json'):
            json_data = json.loads(content.decode('utf-8'))
            if isinstance(json_data, list):
                df = pd.DataFrame(json_data)
            elif isinstance(json_data, dict):
                df = pd.DataFrame([json_data])

        if df is not None:
             # (Logique Legacy UnifiedKPI - on la garde pour rétro-compatibilité)
             # ... [Code legacy inchangé si possible ou simplifié]
             # Pour faire court, je remets le bout de code legacy ici
             kpi_entries = []
             df.columns = df.columns.str.lower().str.strip()
             date_col = None
             for col in ['date', 'datetime', 'timestamp', 'jour']:
                if col in df.columns:
                    date_col = col
                    break
             
             if date_col:
                for idx, row in df.iterrows():
                    try:
                        row_date = pd.to_datetime(row[date_col])
                        for col in df.columns:
                            if col == date_col: continue
                            try:
                                val = float(row[col])
                                category = 'Global'
                                for cat_col in ['region', 'category', 'categorie', 'cat']:
                                    if cat_col in df.columns: category = str(row.get(cat_col, 'Global')); break
                                kpi_entries.append(UnifiedKPI(date=row_date, kpi_name=col, category=category, value=val, source_file_id=db_file.id))
                            except: pass
                    except: pass
                if kpi_entries:
                    db.bulk_save_objects(kpi_entries)
                    db.commit()

    except Exception as e:
        print(f"❌ ETL Error: {e}")
        import traceback
        traceback.print_exc()
        db_file.status = "ERROR"
        db.commit()
    
    return {"filename": file.filename, "id": db_file.id, "status": "Imported"}

@router.get("/kpi/summary")
def get_kpi_summary(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    kpis = db.query(UnifiedKPI).all()
    
    # Si des KPIs "Generic" existent, on les renvoie normalement
    if kpis:
        return kpis

    # Sinon, on regarde si on a des données Transport et on les convertit à la volée
    # pour que le Dashboard "Générique" puisse quand même afficher des graphs
    count_transport = db.query(TransportEntry).count()
    if count_transport > 0:
        # On agrège par jour pour ne pas exploser la réponse
        # On expose: Revenue, Marge, Tonnage
        results = db.query(
            TransportEntry.date_recepisse.label('date'),
            func.sum(TransportEntry.montant_net_ht).label('revenue'),
            func.sum(TransportEntry.marge_brute).label('margin'),
            func.sum(TransportEntry.poids_kg).label('poids')
        ).group_by(TransportEntry.date_recepisse).all()
        
        converted = []
        for r in results:
            if not r.date: continue
            # Revenue
            converted.append({
                "date": r.date,
                "kpi_name": "revenue",
                "category": "Global",
                "value": r.revenue or 0,
                "source_file_id": "transport_auto"
            })
            # Margin
            converted.append({
                "date": r.date,
                "kpi_name": "margin",
                "category": "Global",
                "value": r.margin or 0,
                "source_file_id": "transport_auto"
            })
             # Tonnage
            converted.append({
                "date": r.date,
                "kpi_name": "tonnage",
                "category": "Global",
                # On convertit en Tonnes pour que ce soit lisible
                "value": (r.poids or 0) / 1000.0,
                "source_file_id": "transport_auto"
            })
            
        return converted
         
    return []

@router.get("/upload/files")
def list_uploaded_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    files = db.query(RawImport).order_by(RawImport.import_date.desc()).all()
    return [{
        "id": f.id, "filename": f.filename, "import_date": f.import_date, "status": f.status, "checksum": f.checksum
    } for f in files]

@router.post("/reset")
def reset_all_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        db.query(UnifiedKPI).delete()
        db.query(TransportEntry).delete() # Nouveau
        db.query(RawImport).delete()
        db.commit()
        return {"status": "success", "message": "Toutes les données (Unified + Transport) ont été réinitialisées"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# --- Transport Specific Endpoints ---

def apply_filters(query, start_date=None, end_date=None, clients=None):
    if start_date:
        # Assuming date string format YYYY-MM-DD
        query = query.filter(TransportEntry.date_recepisse >= datetime.strptime(start_date, "%Y-%m-%d"))
    if end_date:
        query = query.filter(TransportEntry.date_recepisse <= datetime.strptime(end_date, "%Y-%m-%d"))
    if clients:
        client_list = [c.strip() for c in clients.split(',')]
        if client_list:
            query = query.filter(TransportEntry.donneur_ordre.in_(client_list))
    return query

@router.get("/transport/stats")
def get_transport_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    clients: Optional[str] = Query(None)
):
    """Retourne les KPIs globaux pour le Header Transport"""
    try:
        # Base query
        query = db.query(
            func.sum(TransportEntry.montant_net_ht).label('ca_total'),
            func.sum(TransportEntry.marge_brute).label('marge_total'),
            func.sum(TransportEntry.poids_kg).label('poids_total'),
            func.count(TransportEntry.id).label('nb_envois')
        )
        
        # Apply filters
        query = apply_filters(query, start_date, end_date, clients)
        
        stats = query.first()
        
        # Count total rows matching filters
        count_query = db.query(TransportEntry)
        count_query = apply_filters(count_query, start_date, end_date, clients)
        total_rows = count_query.count()

        if total_rows == 0:
             return {
                "count": 0,
                "revenue": 0,
                "margin": 0,
                "tonnage": 0,
                "shipments": 0,
                "margin_rate": 0
             }
        
        return {
            "count": total_rows,
            "revenue": stats.ca_total or 0,
            "margin": stats.marge_total or 0,
            "tonnage": (stats.poids_total or 0) / 1000.0, # En tonnes
            "shipments": stats.nb_envois or 0,
            "margin_rate": ((stats.marge_total or 0) / (stats.ca_total or 1)) * 100
        }
    except Exception as e:
        print(f"Error stats: {e}")
        return {"error": str(e)}

@router.get("/transport/graph/revenue")
def get_transport_revenue_graph(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    clients: Optional[str] = Query(None)
):
    """Evolution Mensuelle CA vs Marge - avec remplissage des mois manquants"""
    try:
        # Base query
        query = db.query(
            func.strftime('%Y-%m', TransportEntry.date_recepisse).label('month'),
            func.sum(TransportEntry.montant_net_ht).label('revenue'),
            func.sum(TransportEntry.marge_brute).label('margin')
        )
        
        # Apply filters BEFORE grouping
        query = apply_filters(query, start_date, end_date, clients)
        
        results = query.group_by('month').order_by('month').all()
        
        # Convert to dictionary for easy lookup
        data_map = {r.month: {"revenue": r.revenue or 0, "margin": r.margin or 0} for r in results if r.month}
        
        # Determine strict range
        # If filters provided, use them. Else use min/max from data (or defaults)
        from datetime import  timedelta

        if start_date and end_date:
            min_date = datetime.strptime(start_date, "%Y-%m-%d")
            max_date = datetime.strptime(end_date, "%Y-%m-%d")
        else:
            # Fallback to data boundaries or current year if no data
            # Helper to get full range from DB if needed, but let's rely on results for now if no filter
             if not results:
                 return []
             min_date = datetime.strptime(results[0].month + "-01", "%Y-%m-%d")
             max_date = datetime.strptime(results[-1].month + "-01", "%Y-%m-%d")

        # Generate all months in range
        final_data = []
        current = min_date.replace(day=1)
        end_limit = max_date.replace(day=1) # Ensure we cover the full end month
        
        while current <= end_limit:
            month_str = current.strftime("%Y-%m")
            stats = data_map.get(month_str, {"revenue": 0, "margin": 0})
            final_data.append({
                "name": month_str,
                "revenue": stats["revenue"],
                "margin": stats["margin"]
            })
            # Next month
            if current.month == 12:
                current = current.replace(year=current.year + 1, month=1)
            else:
                current = current.replace(month=current.month + 1)
                
        return final_data

    except Exception as e:
        print(f"Error graph revenue: {e}")
        import traceback
        traceback.print_exc()
        return []

@router.get("/transport/graph/distribution")
def get_transport_distribution_graph(
    type: str = "client", 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    clients: Optional[str] = Query(None)
):
    """
    Distribution par :
    - client (donneur_ordre)
    - country (pays_depart)
    """
    try:
        field = TransportEntry.donneur_ordre
        if type == "country":
            field = TransportEntry.pays_depart
            
        # Base query
        query = db.query(
            field.label('name'),
            func.sum(TransportEntry.montant_net_ht).label('value')
        )
        
        # Apply filters
        query = apply_filters(query, start_date, end_date, clients)
            
        results = query.group_by(field).order_by(func.sum(TransportEntry.montant_net_ht).desc()).limit(10).all()
        
        return [
             {"name": r.name or "Inconnu", "value": r.value or 0}
             for r in results
        ]
    except Exception as e:
        print(f"Error graph distribution: {e}")
        return []

@router.get("/transport/clients")
def get_transport_clients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        results = db.query(
            TransportEntry.donneur_ordre.label('name'),
            func.sum(TransportEntry.montant_net_ht).label('ca_total'),
            func.count(TransportEntry.id).label('nb_envois')
        ).filter(
            TransportEntry.donneur_ordre.isnot(None)
        ).group_by(
            TransportEntry.donneur_ordre
        ).order_by(
            func.sum(TransportEntry.montant_net_ht).desc()
        ).all()

        return {
            "clients": [{"name": r.name, "ca_total": r.ca_total, "nb_envois": r.nb_envois} for r in results],
            "total_clients": len(results)
        }
    except Exception as e:
        return {"error": str(e), "clients": []}
@router.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
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
        status="PROCESSED"
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    try:
        # --- Détection de Format ---
        # On lit les premières lignes pour voir les entêtes
        is_transport_file = False
        try:
            # Décodage rapide pour check
            preview = content.decode('utf-8-sig', errors='ignore')[:1000]
            if "Num. de bordereau" in preview and "Incoterm" in preview:
                is_transport_file = True
        except:
            pass

        if is_transport_file:
            print(f"🚛 Fichier Transport détecté : {file.filename}")
            process_transport_file(content, file.filename, db, db_file)
            return {"filename": file.filename, "id": db_file.id, "status": "Imported (Transport Mode)"}
            
        # --- Fallback ETL Générique (Legacy) ---
        # (Code existant pour les fichiers JSON/Excel simples)
        import json
        df = None

        if file.filename.endswith('.csv'):
            content_str = content.decode('utf-8')
            for sep in [';', ',', '\t', '|']:
                try:
                    df = pd.read_csv(io.StringIO(content_str), sep=sep)
                    if len(df.columns) > 1:
                        break
                except:
                    continue

        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(content))

        elif file.filename.endswith('.json'):
            json_data = json.loads(content.decode('utf-8'))
            if isinstance(json_data, list):
                df = pd.DataFrame(json_data)
            elif isinstance(json_data, dict):
                df = pd.DataFrame([json_data])

        if df is not None:
             # (Logique Legacy UnifiedKPI - on la garde pour rétro-compatibilité)
             # ... [Code legacy inchangé si possible ou simplifié]
             # Pour faire court, je remets le bout de code legacy ici
             kpi_entries = []
             df.columns = df.columns.str.lower().str.strip()
             date_col = None
             for col in ['date', 'datetime', 'timestamp', 'jour']:
                if col in df.columns:
                    date_col = col
                    break
             
             if date_col:
                for idx, row in df.iterrows():
                    try:
                        row_date = pd.to_datetime(row[date_col])
                        for col in df.columns:
                            if col == date_col: continue
                            try:
                                val = float(row[col])
                                category = 'Global'
                                for cat_col in ['region', 'category', 'categorie', 'cat']:
                                    if cat_col in df.columns: category = str(row.get(cat_col, 'Global')); break
                                kpi_entries.append(UnifiedKPI(date=row_date, kpi_name=col, category=category, value=val, source_file_id=db_file.id))
                            except: pass
                    except: pass
                if kpi_entries:
                    db.bulk_save_objects(kpi_entries)
                    db.commit()

    except Exception as e:
        print(f"❌ ETL Error: {e}")
        import traceback
        traceback.print_exc()
        db_file.status = "ERROR"
        db.commit()
    
    return {"filename": file.filename, "id": db_file.id, "status": "Imported"}

@router.get("/kpi/summary")
@router.get("/kpi/summary")
def get_kpi_summary(db: Session = Depends(get_db)):
    kpis = db.query(UnifiedKPI).all()
    
    # Si des KPIs "Generic" existent, on les renvoie normalement
    if kpis:
        return kpis

    # Sinon, on regarde si on a des données Transport et on les convertit à la volée
    # pour que le Dashboard "Générique" puisse quand même afficher des graphs
    count_transport = db.query(TransportEntry).count()
    if count_transport > 0:
        # On agrège par jour pour ne pas exploser la réponse
        # On expose: Revenue, Marge, Tonnage
        results = db.query(
            TransportEntry.date_recepisse.label('date'),
            func.sum(TransportEntry.montant_net_ht).label('revenue'),
            func.sum(TransportEntry.marge_brute).label('margin'),
            func.sum(TransportEntry.poids_kg).label('poids')
        ).group_by(TransportEntry.date_recepisse).all()
        
        converted = []
        for r in results:
            if not r.date: continue
            # Revenue
            converted.append({
                "date": r.date,
                "kpi_name": "revenue",
                "category": "Global",
                "value": r.revenue or 0,
                "source_file_id": "transport_auto"
            })
            # Margin
            converted.append({
                "date": r.date,
                "kpi_name": "margin",
                "category": "Global",
                "value": r.margin or 0,
                "source_file_id": "transport_auto"
            })
             # Tonnage
            converted.append({
                "date": r.date,
                "kpi_name": "tonnage",
                "category": "Global",
                # On convertit en Tonnes pour que ce soit lisible
                "value": (r.poids or 0) / 1000.0,
                "source_file_id": "transport_auto"
            })
            
        return converted
         
    return []

@router.get("/upload/files")
def list_uploaded_files(db: Session = Depends(get_db)):
    files = db.query(RawImport).order_by(RawImport.import_date.desc()).all()
    return [{
        "id": f.id, "filename": f.filename, "import_date": f.import_date, "status": f.status, "checksum": f.checksum
    } for f in files]

@router.post("/reset")
def reset_all_data(db: Session = Depends(get_db)):
    try:
        db.query(UnifiedKPI).delete()
        db.query(TransportEntry).delete() # Nouveau
        db.query(RawImport).delete()
        db.commit()
        return {"status": "success", "message": "Toutes les données (Unified + Transport) ont été réinitialisées"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# --- Transport Specific Endpoints ---

@router.get("/transport/stats")
def get_transport_stats(db: Session = Depends(get_db)):
    """Retourne les KPIs globaux pour le Header Transport"""
    try:
        total_rows = db.query(TransportEntry).count()
        if total_rows == 0:
             return {"count": 0}
        
        # Agrégats globaux
        stats = db.query(
            func.sum(TransportEntry.montant_net_ht).label('ca_total'),
            func.sum(TransportEntry.marge_brute).label('marge_total'),
            func.sum(TransportEntry.poids_kg).label('poids_total'),
            func.count(TransportEntry.id).label('nb_envois')
        ).first()
        
        return {
            "count": total_rows,
            "revenue": stats.ca_total or 0,
            "margin": stats.marge_total or 0,
            "tonnage": (stats.poids_total or 0) / 1000.0, # En tonnes
            "shipments": stats.nb_envois or 0,
            "margin_rate": ((stats.marge_total or 0) / (stats.ca_total or 1)) * 100
        }
    except Exception as e:
        print(f"Error stats: {e}")
        return {"error": str(e)}

@router.get("/transport/graph/revenue")
def get_transport_revenue_graph(db: Session = Depends(get_db)):
    """Evolution Mensuelle CA vs Marge"""
    try:
        # Group by Month (using SQLite strftime)
        # We use date_recepisse as reference
        results = db.query(
            func.strftime('%Y-%m', TransportEntry.date_recepisse).label('month'),
            func.sum(TransportEntry.montant_net_ht).label('revenue'),
            func.sum(TransportEntry.marge_brute).label('margin')
        ).group_by('month').order_by('month').all()
        
        return [
            {
                "name": r.month, # Format YYYY-MM
                "revenue": r.revenue or 0,
                "margin": r.margin or 0
            }
            for r in results if r.month is not None
        ]
    except Exception as e:
        print(f"Error graph revenue: {e}")
        return []

@router.get("/transport/graph/distribution")
def get_transport_distribution_graph(type: str = "client", db: Session = Depends(get_db)):
    """
    Distribution par :
    - client (donneur_ordre)
    - country (pays_depart)
    """
    try:
        field = TransportEntry.donneur_ordre
        if type == "country":
            field = TransportEntry.pays_depart
            
        results = db.query(
            field.label('name'),
            func.sum(TransportEntry.montant_net_ht).label('value')
        ).group_by(field).order_by(func.sum(TransportEntry.montant_net_ht).desc()).limit(10).all()
        
        return [
             {"name": r.name or "Inconnu", "value": r.value or 0}
             for r in results
        ]
    except Exception as e:
        print(f"Error graph distribution: {e}")
        return []
