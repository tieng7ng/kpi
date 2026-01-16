from sqlalchemy import Column, Integer, String, Float, DateTime, LargeBinary, ForeignKey
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
