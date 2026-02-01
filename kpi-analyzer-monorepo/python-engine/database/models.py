from sqlalchemy import Column, Integer, String, Float, DateTime, LargeBinary, ForeignKey, Boolean
from sqlalchemy.orm import DeclarativeBase, relationship
from datetime import datetime

class Base(DeclarativeBase):
    pass

class RawImport(Base):
    __tablename__ = "raw_imports"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    checksum = Column(String, unique=True, index=True, nullable=False)
    import_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="PENDING") # PENDING, PROCESSED, ERROR
    content_blob = Column(LargeBinary, nullable=True) # Binary content of the file

class MappingRule(Base):
    __tablename__ = "mapping_rules"

    id = Column(Integer, primary_key=True, index=True)
    incoming_col_name = Column(String, unique=True, index=True, nullable=False)
    target_kpi_field = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class UnifiedKPI(Base):
    __tablename__ = "unified_kpi"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, index=True, nullable=False)
    kpi_name = Column(String, index=True, nullable=False) # 'revenue', 'margin', etc.
    category = Column(String, index=True, nullable=True) # 'Nord', 'Product A', etc.
    value = Column(Float, nullable=False)
    
    source_file_id = Column(Integer, ForeignKey("raw_imports.id"))
    source_file = relationship("RawImport")

class TransportEntry(Base):
    __tablename__ = "transport_entries"

    id = Column(Integer, primary_key=True, index=True)
    
    # --- Dates & Identification ---
    # Date du bordereau / récépissé (champ 1)
    date_recepisse = Column(DateTime, index=True, nullable=True)
    # Date d'exploitation (champ 2)
    date_exploitation = Column(DateTime, nullable=True)
    # Date d'arrivage (champ 8)
    date_arrivage = Column(DateTime, nullable=True)
    # Date de départ (champ 10)
    date_depart = Column(DateTime, nullable=True)
    
    # Identifiants
    num_recepisse = Column(String, nullable=True) # champ 3
    num_bordereau = Column(String, index=True, nullable=True) # champ 9, important pour déduplication
    bordereau_edi = Column(String, nullable=True) # champ 7
    
    # --- Donneur d'Ordre & Client ---
    donneur_ordre = Column(String, index=True, nullable=True) # champ 11
    type_donneur_ordre = Column(String, nullable=True) # champ 12
    correspondant = Column(String, nullable=True) # champ 23
    
    # --- Géographie & Route ---
    pays_depart = Column(String, index=True, nullable=True) # champ 13 (Expéditeur Pays)
    pays_arrivee = Column(String, index=True, nullable=True) # champ 14 (Pays destinataire)
    pays_remettant = Column(String, nullable=True) # champ 22
    code_ligne_depart = Column(String, nullable=True) # champ 5
    code_ligne_arrivee = Column(String, nullable=True) # champ 25
    
    # --- Produit & Service ---
    libelle_produit = Column(String, nullable=True) # champ 4
    type_ligne_depart = Column(String, nullable=True) # champ 24
    incoterm = Column(String, nullable=True) # champ 21
    
    # --- Volumétrie ---
    nombre_um = Column(Float, default=0.0) # champ 15
    poids_kg = Column(Float, default=0.0) # champ 16
    
    # --- Financier (Montants) ---
    montant_net_ht = Column(Float, default=0.0) # champ 17 (CA)
    montant_achat_st = Column(Float, default=0.0) # champ 18
    montant_achat_st_hors_interne = Column(Float, default=0.0) # champ 19
    cout_interne = Column(Float, default=0.0) # champ 20
    
    # --- Champs Calculés / Dérivés (Stockés pour perf) ---
    marge_brute = Column(Float, default=0.0) # (CA - Cout ST - Cout Interne)
    taux_marge = Column(Float, default=0.0)
    
    # --- Méta ---
    source_file_id = Column(Integer, ForeignKey("raw_imports.id"), index=True)
    source_file = relationship("RawImport")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
