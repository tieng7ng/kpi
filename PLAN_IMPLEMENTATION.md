# Implementation Plan - KPI Analyzer MVP

**Goal:** Build the "Portable KPI Analyzer" MVP (Phase 1) within 2 weeks.
**Target:** A standalone Windows/Mac executable that allows drag-and-drop of CSV files to visualize Key Performance Indicators without admin rights.

# Technology Stack
*   **Frontend:** Electron 28, React 18, Vite, Shadcn/UI (TailwindCSS), Recharts.
*   **Backend:** Python 3.11, FastAPI (Sidecar), Pandas, SQLite + SQLCipher.
*   **Packaging:** PyInstaller (Python -> exe), Electron-Builder (App -> Portable Wrapper).

## User Review Required
> [!IMPORTANT]
> **Validation of the "Sidecar" approach:** This plan assumes we are using a local HTTP server (FastAPI) for communication effectively decoupling Frontend and Backend. This adds a slight RAM overhead (~50MB) but guarantees stability.

## Proposed Changes

### 1. Project Initialization
#### [NEW] `kpi-analyzer-monorepo/`
Establish a monorepo structure to host both JS and Python codebases separate yet linked.
*   `/electron-app`: The UI code.
*   `/python-engine`: The backend logic.
*   `/shared`: Shared types/constants if needed.

### 2. Backend Implementation (Python)
#### [NEW] `python-engine/main.py` & `api/`
*   **FastAPI App**: Setup a server on port `0` (random free port).
*   **Security Middleware**: Check for a specific headers token passed by Electron.

#### [NEW] `python-engine/database/`
*   **Schema**: Implement the 3-table structure defined in `EXPLICATION_TECHNIQUE_DONNEES.md` (`raw_imports`, `mapping_rules`, `unified_kpi`).
*   **Logic**: Use SQLAlchemy for ORM interactions.

#### [NEW] `python-engine/etl/`
*   **Ingestor**: Create a generic Pandas ingestor for CSV/Excel.
*   **Mapper**: Implement the dictionary lookup logic.

### 3. Frontend Implementation (Electron + React)
#### [NEW] `electron-app/src/components/`
*   `DropZone.tsx`: Handle file drag & drop.
*   `Dashboard.tsx`: Grid layout for charts.
*   `KPIChart.tsx`: Wrapper around Recharts for standard styling.
*   `MappingModal.tsx`: The popup to ask user for unknown columns (Phase 1.5).

#### [NEW] `electron-app/electron/main.ts`
*   **Process Manager**: Logic to spawn `engine.exe` as a child process, grab its port number from stdout, and make it available to the Renderer.

### 4. Wireframe & Logic Flow
1.  **Launch**: Electron starts -> Spawns Python -> Python reports Port X -> Electron waits for health check OK.
2.  **User Action**: Drag File -> React sends `POST http://localhost:X/upload`.
3.  **Processing**: Python saves raw -> Pandas normalizes -> SQLite inserts -> Returns OK.
4.  **Visualize**: React queries `GET http://localhost:X/kpi/revenue` -> Python runs SQL aggregation -> Returns JSON -> Recharts renders.

## Verification Plan

### Automated Tests
*   **Backend**: `pytest` for the ETL logic (feeding sample CSVs and checking SQLite output).
*   **E2E**: `Playwright` to test the Electron app launch and basic user flow.

### Manual Verification
1.  **Portable Test**: Copy the built `dist/unpacked` folder to a USB stick. Plug into a *different* PC (restricted environment). Run `.exe`.
2.  **Performance**: Load a dummy CSV with 100k lines. Measure time to graph display (< 5s).
3.  **Persistence**: Close app. Re-open. Check if data is still there.
