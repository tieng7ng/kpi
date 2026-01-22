# DEVIS - Développement Application KPI Analyzer

---

**Client :** [Nom du client]
**Date :** 22 Janvier 2026
**Référence :** DEV-2026-001
**Validité :** 30 jours

---

## 1. Contexte du Projet

Développement d'une application desktop d'analyse de KPIs pour le secteur Transport & Logistique, permettant l'import de données CSV et la visualisation de tableaux de bord interactifs.

**Stack technique :**
- Frontend : Electron + React + TypeScript + Tailwind CSS
- Backend : Python + FastAPI + SQLAlchemy
- Base de données : SQLite
- Graphiques : Recharts

---

## 2. Prestations Réalisées

### 2.1 Développement Backend (Python/FastAPI)

| Réf | Description | Unité | Qté | PU HT | Total HT |
|-----|-------------|-------|-----|-------|----------|
| BE-001 | Implémentation endpoint `/api/reset` - Réinitialisation complète des données | forfait | 1 | 150 € | 150 € |
| BE-002 | Endpoint `/api/transport/stats` - Statistiques globales Transport | forfait | 1 | 200 € | 200 € |
| BE-003 | Endpoint `/api/transport/graph/revenue` - Évolution CA/Marge mensuelle | forfait | 1 | 180 € | 180 € |
| BE-004 | Endpoint `/api/transport/graph/distribution` - Top 10 clients | forfait | 1 | 150 € | 150 € |
| BE-005 | Modèle de données `TransportEntry` avec calcul automatique de marge | forfait | 1 | 200 € | 200 € |
| BE-006 | ETL d'import fichiers Transport (détection automatique, nettoyage données) | forfait | 1 | 300 € | 300 € |

**Sous-total Backend : 1 180 €**

---

### 2.2 Développement Frontend (React/Electron)

| Réf | Description | Unité | Qté | PU HT | Total HT |
|-----|-------------|-------|-----|-------|----------|
| FE-001 | Dashboard Transport - 4 cards KPIs (CA, Marge, Tonnage, Panier moyen) | forfait | 1 | 250 € | 250 € |
| FE-002 | Graphique ComposedChart - Évolution CA vs Marge (barres + ligne) | forfait | 1 | 200 € | 200 € |
| FE-003 | Graphique BarChart - Top 10 Clients | forfait | 1 | 150 € | 150 € |
| FE-004 | Composant KPIChart générique (Area, Bar, Line, Pie, Composed) | forfait | 1 | 300 € | 300 € |
| FE-005 | Page "Mes Données" - Import fichiers + liste fichiers | forfait | 1 | 200 € | 200 € |
| FE-006 | Bouton Reset avec modal de confirmation | forfait | 1 | 100 € | 100 € |
| FE-007 | Toggle vue Général / Transport dans le header | forfait | 1 | 100 € | 100 € |
| FE-008 | Correction bug affichage graphique (prop height non utilisée) | forfait | 1 | 50 € | 50 € |

**Sous-total Frontend : 1 350 €**

---

### 2.3 Analyse de Données

| Réf | Description | Unité | Qté | PU HT | Total HT |
|-----|-------------|-------|-----|-------|----------|
| DA-001 | Analyse fichier IMPORT - Structure 25 colonnes, 109 542 lignes | forfait | 1 | 200 € | 200 € |
| DA-002 | Analyse fichier EXPORT - Structure 26 colonnes, détection doublons | forfait | 1 | 200 € | 200 € |
| DA-003 | Script déduplication EXPORT (105 386 → 12 057 lignes uniques) | forfait | 1 | 150 € | 150 € |
| DA-004 | Identification 30+ KPIs exploitables (financiers, volumétrie, géographiques) | forfait | 1 | 250 € | 250 € |

**Sous-total Analyse : 800 €**

---

### 2.4 Documentation Technique

| Réf | Description | Unité | Qté | PU HT | Total HT |
|-----|-------------|-------|-----|-------|----------|
| DOC-001 | Guide d'utilisation complet (GUIDE_UTILISATION.md) - 8 sections | forfait | 1 | 200 € | 200 € |
| DOC-002 | Documentation technique (DOCUMENTATION_TECHNIQUE.md) - Architecture, API, BDD | forfait | 1 | 250 € | 250 € |
| DOC-003 | Analyse KPI Transport IMPORT (ANALYSE_KPI_TRANSPORT_IMPORT.md) | forfait | 1 | 300 € | 300 € |
| DOC-004 | Analyse KPI Transport EXPORT (ANALYSE_KPI_TRANSPORT_EXPORT.md) | forfait | 1 | 200 € | 200 € |
| DOC-005 | Spécifications filtres configurables (7 propositions détaillées) | forfait | 1 | 250 € | 250 € |

**Sous-total Documentation : 1 200 €**

---

### 2.5 Configuration Build & Déploiement

| Réf | Description | Unité | Qté | PU HT | Total HT |
|-----|-------------|-------|-----|-------|----------|
| DEP-001 | Configuration Electron Builder (Mac + Windows) | forfait | 1 | 150 € | 150 € |
| DEP-002 | Script de build Windows (build-windows.bat) | forfait | 1 | 100 € | 100 € |
| DEP-003 | Guide de build Windows (BUILD_WINDOWS.md) | forfait | 1 | 150 € | 150 € |
| DEP-004 | Configuration GitHub Actions (workflow CI/CD) | forfait | 1 | 100 € | 100 € |
| DEP-005 | Gestion cross-platform (détection OS, chemins exécutables) | forfait | 1 | 100 € | 100 € |

**Sous-total Déploiement : 600 €**

---

## 3. Récapitulatif

| Catégorie | Montant HT |
|-----------|------------|
| Développement Backend | 1 180 € |
| Développement Frontend | 1 350 € |
| Analyse de Données | 800 € |
| Documentation Technique | 1 200 € |
| Configuration Build & Déploiement | 600 € |
| **TOTAL HT** | **5 130 €** |
| TVA (20%) | 1 026 € |
| **TOTAL TTC** | **6 156 €** |

---

## 4. Livrables

### 4.1 Code Source

| Fichier | Description |
|---------|-------------|
| `python-engine/api/endpoints.py` | Endpoints API FastAPI |
| `python-engine/database/models.py` | Modèles SQLAlchemy |
| `python-engine/ingestion.py` | ETL import données |
| `electron-app/src/components/dashboard/TransportDashboard.tsx` | Dashboard Transport |
| `electron-app/src/components/KPIChart.tsx` | Composant graphique générique |
| `electron-app/src/components/DataPage.tsx` | Page gestion des données |
| `electron-app/electron/main.ts` | Process principal Electron |
| `electron-app/package.json` | Configuration build |

### 4.2 Documentation

| Fichier | Pages | Description |
|---------|-------|-------------|
| `GUIDE_UTILISATION.md` | ~10 | Guide utilisateur complet |
| `DOCUMENTATION_TECHNIQUE.md` | ~15 | Architecture et API |
| `ANALYSE_KPI_TRANSPORT_IMPORT.md` | ~30 | Analyse données IMPORT |
| `ANALYSE_KPI_TRANSPORT_EXPORT.md` | ~10 | Analyse données EXPORT |
| `BUILD_WINDOWS.md` | ~5 | Guide compilation Windows |

### 4.3 Scripts & Fichiers de Configuration

| Fichier | Description |
|---------|-------------|
| `build-windows.bat` | Script de build automatisé Windows |
| `test_data/extract_*_CLEAN.csv` | Fichier EXPORT dédupliqué |

---

## 5. Fonctionnalités Livrées

### Dashboard Transport
- [x] 4 cards KPIs : CA Total, Marge Brute (+ taux), Tonnage (+ nb expéditions), Panier moyen
- [x] Graphique évolution mensuelle CA vs Marge (ComposedChart)
- [x] Graphique Top 10 Clients (BarChart)
- [x] Détection automatique fichiers Transport

### Gestion des Données
- [x] Import fichiers CSV/Excel/JSON
- [x] Détection et parsing automatique des formats
- [x] Réinitialisation complète des données
- [x] Déduplication des données

### API Backend
- [x] 6 endpoints REST fonctionnels
- [x] Calcul automatique des marges
- [x] Agrégations SQL optimisées

### Build & Déploiement
- [x] Configuration Electron Builder
- [x] Scripts de build Windows
- [x] Documentation de déploiement

---

## 6. Travaux Non Réalisés (Hors Périmètre)

Les éléments suivants ont été spécifiés mais non implémentés :

| Réf | Description | Estimation |
|-----|-------------|------------|
| HR-001 | Filtres configurables (période + clients) - Spécifié uniquement | 800 € |
| HR-002 | Graphique répartition géographique (PieChart pays) | 200 € |
| HR-003 | Calcul des délais de livraison | 300 € |
| HR-004 | Alertes automatiques (marge faible, etc.) | 400 € |
| HR-005 | Segmentation clients RFM | 500 € |

---

## 7. Conditions

### Modalités de paiement
- 30% à la commande
- 70% à la livraison

### Garantie
- Correction des anomalies pendant 30 jours après livraison
- Support technique par email

### Propriété intellectuelle
- Le code source est la propriété du client après paiement intégral
- Les bibliothèques tierces conservent leurs licences respectives (MIT, Apache)

---

## 8. Signatures

| | Client | Prestataire |
|---|--------|-------------|
| Nom | | |
| Date | | |
| Signature | | |

---

*Document généré le 22 Janvier 2026*
