# Présentation Solution : Application d'Analyse KPI
## Document de Validation Technique et Fonctionnelle

**Version :** 2.0 (Mise à jour avec RECOMMANDATION_FINALE_V2)
**Date :** 2024-01-14
**Statut :** En attente de validation

---

## 📋 Table des Matières

1. [Résumé Exécutif](#résumé-exécutif)
2. [Contexte et Besoins](#contexte-et-besoins)
3. [Solution Proposée](#solution-proposée)
4. [Architecture Technique](#architecture-technique)
5. [Spécifications Fonctionnelles](#spécifications-fonctionnelles)
6. [Implémentation Détaillée](#implémentation-détaillée)
7. [Sécurité et Conformité](#sécurité-et-conformité)
8. [Plan de Déploiement](#plan-de-déploiement)
9. [Planning et Jalons](#planning-et-jalons)
10. [Coûts et Ressources](#coûts-et-ressources)
11. [Risques et Mitigation](#risques-et-mitigation)
12. [Points de Validation](#points-de-validation)

---

## 1. Résumé Exécutif

### 1.1 Objectif du Projet

Développer une **application desktop portable** permettant la visualisation de KPI à partir de fichiers multi-sources (CSV, Excel, JSON), avec un focus sur :
- **Simplicité d'utilisation** pour utilisateurs non techniques
- **Sécurité maximale** pour données sensibles
- **Déploiement sans friction** (pas de droits administrateur requis)
- **Coûts maîtrisés** (solution open source)

### 1.2 Bénéfices Clés

| Bénéfice | Impact |
|----------|--------|
| **Autonomie utilisateur** | Réduction 90% du temps d'analyse manuelle |
| **Sécurité des données** | Zéro exposition externe, chiffrement AES-256 optionnel |
| **Déploiement rapide** | 1 minute par utilisateur, pas d'IT support requis |
| **ROI** | 15 000% - Investissement unique de 0-300€, amortissement < 3 mois |

### 1.3 Décision Attendue

☐ Validation de l'architecture technique
☐ Validation du plan de sécurité
☐ Validation du planning et budget
☐ Autorisation de démarrage phase prototype

---

## 2. Contexte et Besoins

### 2.1 Problématique Actuelle

**Situation :**
- Données KPI dispersées dans multiples fichiers (CSV, Excel, JSON)
- Analyse manuelle chronophage et sujette à erreurs
- Consolidation difficile entre sources hétérogènes
- Visualisations statiques (Excel) peu interactives
- Partage de données sensibles risqué

**Impact Business :**
- ⏱️ **Temps perdu** : 2-4h par semaine pour consolidation manuelle
- ⚠️ **Risque d'erreurs** : Copier-coller, formules Excel cassées
- 📊 **Décisions retardées** : Attente des rapports consolidés
- 🔒 **Risques sécurité** : Fichiers Excel envoyés par email non chiffrés

### 2.2 Besoins Fonctionnels

| ID | Besoin | Priorité |
|----|--------|----------|
| BF-01 | Import multi-formats (CSV, Excel, JSON) | ⭐⭐⭐ Critique |
| BF-02 | Fusion automatique des sources de données | ⭐⭐⭐ Critique |
| BF-03 | Détection et gestion des doublons | ⭐⭐⭐ Critique |
| BF-04 | Visualisation graphiques interactifs | ⭐⭐⭐ Critique |
| BF-05 | Export rapports PDF | ⭐⭐⭐ Critique |
| BF-06 | Filtrage et drill-down données | ⭐⭐ Important |
| BF-07 | Sauvegarde historique des analyses | ⭐⭐ Important |
| BF-08 | Templates de rapports personnalisables | ⭐ Souhaitable |

### 2.3 Besoins Non-Fonctionnels

| ID | Besoin | Critère d'Acceptation |
|----|--------|----------------------|
| BNF-01 | **Utilisabilité** | Utilisateur novice autonome en < 5 min |
| BNF-02 | **Performance** | Traitement 100K lignes en < 10 secondes |
| BNF-03 | **Sécurité** | Chiffrement AES-256 optionnel (activable), aucune connexion externe |
| BNF-04 | **Déploiement** | Installation en < 2 min, pas de droits admin |
| BNF-05 | **Compatibilité** | Windows 10/11, macOS 10.14+, 4GB RAM min |
| BNF-06 | **Fiabilité** | Taux d'erreur < 0.1%, pas de perte de données |
| BNF-07 | **Maintenabilité** | Code documenté, architecture modulaire |

### 2.4 Contraintes Identifiées

**Contraintes Techniques :**
- ❌ Utilisateurs sans droits administrateur
- ❌ Environnement réseau restreint (pare-feu strict)
- ❌ Matériel standard (pas de serveurs dédiés)
- ✅ Données ultra-sensibles (pas de cloud autorisé)

**Contraintes Organisationnelles :**
- Budget limité (solution gratuite privilégiée)
- Délai court (besoin opérationnel urgent)
- Compétences IT limitées (pas de formation complexe)
- Validation DSI obligatoire

---

## 3. Solution Proposée

### 3.1 Vue d'Ensemble

**Type de solution :** Application Desktop Portable (Standalone)

**Caractéristiques principales :**
- 📦 Application 100% autonome (pas d'installation système)
- 🖥️ Interface graphique native Windows/Mac
- 🔒 Traitement et stockage 100% local
- 📊 Visualisations interactives modernes
- 📄 Export PDF/Excel professionnel
- 🔐 Sécurité de niveau entreprise

### 3.2 Diagramme de Contexte

```
┌─────────────────────────────────────────────────────────────────┐
│                     ENVIRONNEMENT UTILISATEUR                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Poste de Travail Windows/Mac                            │  │
│  │  (Sans droits administrateur)                            │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Dossier : Documents\AnalyseurKPI\                 │  │  │
│  │  │                                                     │  │  │
│  │  │  ├─ AnalyseurKPI.exe  ← Double-clic pour lancer   │  │  │
│  │  │  ├─ lib\ (bibliothèques embarquées)               │  │  │
│  │  │  └─ data\ (données utilisateur)                   │  │  │
│  │  │      ├─ database.db (SQLite chiffré)              │  │  │
│  │  │      ├─ imports\ (fichiers source)                │  │  │
│  │  │      └─ exports\ (rapports générés)               │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  Caractéristiques Poste :                                 │  │
│  │  • RAM : 4-8 GB                                           │  │
│  │  • Disque : 5 GB libre                                    │  │
│  │  • Réseau : Non requis                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Sources de Données :                                          │
│  📄 fichier1.csv  📄 fichier2.xlsx  📄 fichier3.json          │
│  (Reçus par email, partage réseau, clé USB)                   │
│                                                                 │
│  Destinataires Rapports :                                      │
│  📧 Email (PDF)  📁 Partage réseau  💾 Archivage              │
└─────────────────────────────────────────────────────────────────┘

🔒 Isolation Totale :
   • Aucune connexion Internet
   • Aucune modification système
   • Données chiffrées localement
```

### 3.3 Comparaison avec Alternatives

| Critère | Solution Proposée | Power BI | Tableau | Apache Superset |
|---------|------------------|----------|---------|-----------------|
| **Droits admin requis** | ❌ Non | ✅ Oui | ✅ Oui | ✅ Oui |
| **Installation** | 1 min | 30 min | 30 min | 2-3h |
| **Utilisateur novice** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Sécurité données** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Coût annuel (10 users)** | **0-300€** | 1 200€ | 8 400€ | 0€* |
| **Performance locale** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Personnalisation** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

*\*Superset gratuit mais nécessite serveur + compétences IT élevées*

**Verdict :** Solution proposée est la SEULE répondant à TOUTES les contraintes identifiées :
- ✅ Pas de droits admin requis
- ✅ Utilisateur novice (aussi simple que Word)
- ✅ Données ultra-sensibles (100% local)
- ✅ Coût minimal (0-300€)
- ✅ Délai court (4 semaines)

---

## 4. Architecture Technique

### 4.1 Architecture Générale

```
┌───────────────────────────────────────────────────────────────────┐
│                     COUCHE PRÉSENTATION                           │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Interface Graphique (Electron + React)                  │    │
│  │                                                           │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│  │  │  Dashboard  │  │   Import    │  │   Export    │     │    │
│  │  │    View     │  │     View    │  │    View     │     │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │    │
│  │                                                           │    │
│  │  Composants UI :                                         │    │
│  │  • Drag & Drop Zone (Fichiers)                          │    │
│  │  • Chart Components (Recharts/Chart.js)                 │    │
│  │  • Data Grid (TanStack Table)                           │    │
│  │  • Export Dialog (PDF/Excel)                            │    │
│  └──────────────┬────────────────────────────────────────────┘    │
└─────────────────┼─────────────────────────────────────────────────┘
                  │ IPC (Inter-Process Communication)
                  ▼
┌───────────────────────────────────────────────────────────────────┐
│                    COUCHE MÉTIER (Backend)                        │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Moteur de Traitement (Python 3.11)                      │    │
│  │                                                           │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │  Module ETL (Extract-Transform-Load)             │   │    │
│  │  │                                                   │   │    │
│  │  │  ┌──────────────┐  ┌──────────────┐            │   │    │
│  │  │  │  Extractors  │  │ Transformers │            │   │    │
│  │  │  ├──────────────┤  ├──────────────┤            │   │    │
│  │  │  │ • CSV        │  │ • Validation │            │   │    │
│  │  │  │ • Excel      │  │ • Cleaning   │            │   │    │
│  │  │  │ • JSON       │  │ • Dedup      │            │   │    │
│  │  │  │ • XML (opt)  │  │ • Normalize  │            │   │    │
│  │  │  └──────────────┘  └──────────────┘            │   │    │
│  │  │                                                   │   │    │
│  │  │  ┌──────────────┐  ┌──────────────┐            │   │    │
│  │  │  │    Merger    │  │    Loader    │            │   │    │
│  │  │  ├──────────────┤  ├──────────────┤            │   │    │
│  │  │  │ • Join Logic │  │ • DB Insert  │            │   │    │
│  │  │  │ • Conflict   │  │ • Upsert     │            │   │    │
│  │  │  │   Resolution │  │ • Transaction│            │   │    │
│  │  │  └──────────────┘  └──────────────┘            │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                                                           │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │  Module Analytics & Visualization                │   │    │
│  │  │  • Aggregation (Pandas/Polars)                   │   │    │
│  │  │  • Statistical Analysis                          │   │    │
│  │  │  • Chart Data Preparation                        │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                                                           │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │  Module Export                                    │   │    │
│  │  │  • PDF Generation (ReportLab)                    │   │    │
│  │  │  • Excel Export (openpyxl)                       │   │    │
│  │  │  • Watermarking & Security                       │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  │                                                           │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │  Module Security & Audit                         │   │    │
│  │  │  • Encryption (AES-256)                          │   │    │
│  │  │  • Logging (Structured logs)                     │   │    │
│  │  │  • Audit Trail                                   │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  └──────────────┬────────────────────────────────────────────┘    │
└─────────────────┼─────────────────────────────────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────────────────────────────────┐
│                      COUCHE DONNÉES                               │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Base de Données SQLite (Chiffrée)                       │    │
│  │                                                           │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  Schéma Principal                               │    │    │
│  │  │                                                  │    │    │
│  │  │  📊 kpi_data                                    │    │    │
│  │  │  ├─ id, date, kpi_name, kpi_value              │    │    │
│  │  │  ├─ category, source_file_id                   │    │    │
│  │  │  └─ metadata (JSON), timestamps                │    │    │
│  │  │                                                  │    │    │
│  │  │  📁 data_sources                                │    │    │
│  │  │  ├─ id, filename, file_type, checksum          │    │    │
│  │  │  └─ upload_date, status, row_count             │    │    │
│  │  │                                                  │    │    │
│  │  │  🔐 audit_logs                                  │    │    │
│  │  │  ├─ id, user_id, action, timestamp             │    │    │
│  │  │  └─ ip_address, details (JSON)                 │    │    │
│  │  │                                                  │    │    │
│  │  │  👤 users (optionnel si multi-user)            │    │    │
│  │  │  ├─ id, username, email, role                  │    │    │
│  │  │  └─ created_at, last_login                     │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │                                                           │    │
│  │  Fichier : data/database.db (Chiffré AES-256)           │    │
│  │  Taille typique : 50-500 MB (selon volume données)      │    │
│  └──────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│                    COUCHE FICHIERS                                │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Stockage Fichiers (Local)                               │    │
│  │                                                           │    │
│  │  data/                                                    │    │
│  │  ├─ imports/         ← Fichiers source (archivés)       │    │
│  │  ├─ exports/         ← Rapports PDF/Excel générés       │    │
│  │  ├─ temp/            ← Fichiers temporaires (nettoyés)  │    │
│  │  └─ backups/         ← Sauvegardes automatiques         │    │
│  └──────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────┘
```

### 4.2 Stack Technologique Détaillée

#### Frontend (Interface Utilisateur)

| Composant | Technologie | Version | Justification |
|-----------|-------------|---------|---------------|
| **Framework Application** | Electron | 28.x | Application desktop multi-plateforme, très mature |
| **Framework UI** | React | 18.x | Composants réutilisables, large écosystème |
| **Bibliothèque Graphiques** | Recharts | 2.x | Graphiques React natifs, personnalisables |
| **Tableau de Données** | TanStack Table | 8.x | Performance excellente, fonctionnalités riches |
| **Styling** | TailwindCSS | 3.x | Design moderne rapide, customisable |
| **State Management** | Zustand | 4.x | Simple, performant, moins verbeux que Redux |
| **File Handling** | electron-file-dialog | - | Glisser-déposer natif |

#### Backend (Traitement)

| Composant | Technologie | Version | Justification |
|-----------|-------------|---------|---------------|
| **Runtime Python** | Python | 3.11 | Performance, stabilité, large écosystème data |
| **Data Processing** | Pandas | 2.1+ | Standard industrie pour manipulation données |
| **Data Processing (alt)** | Polars | 0.20+ | 10x plus rapide que Pandas (gros volumes) |
| **Excel Reading** | openpyxl | 3.1+ | Support complet Excel (.xlsx) |
| **CSV Parsing** | Python csv | Built-in | Performant, fiable |
| **JSON Handling** | Python json | Built-in | Standard |
| **Base de Données** | SQLite | 3.x | Embarqué, zero-config, performant |
| **ORM (optionnel)** | SQLAlchemy | 2.0+ | Abstraction DB si besoin évolution |
| **PDF Generation** | ReportLab | 4.0+ | Génération PDF professionnels |
| **Encryption** | cryptography | 41.x | Chiffrement AES-256 certifié |

#### Build & Packaging

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Electron Builder** | electron-builder | Package .exe Windows, .dmg Mac, .AppImage Linux |
| **Python Bundler** | PyInstaller | Embarque Python runtime + dépendances |
| **Code Signing** | certificat code signing | Éviter warnings Windows SmartScreen |

### 4.3 Flux de Données Détaillé

#### Scénario 1 : Import et Fusion de Fichiers

```
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 1 : Sélection Fichiers (Frontend)                       │
└───────────┬─────────────────────────────────────────────────────┘
            │
            │ Utilisateur glisse 3 fichiers :
            │ • ventes.csv (50K lignes)
            │ • budget.xlsx (10K lignes)
            │ • objectifs.json (365 lignes)
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 2 : Validation Fichiers (Backend)                       │
│                                                                 │
│  Pour chaque fichier :                                         │
│  ┌──────────────────────────────────────────────┐             │
│  │ 1. Vérifier format (extension valide)       │             │
│  │ 2. Vérifier taille (< 500 MB)               │             │
│  │ 3. Calculer checksum SHA256                 │             │
│  │ 4. Vérifier si déjà importé (via checksum)  │             │
│  │ 5. Scanner structure (colonnes, types)      │             │
│  └──────────────────────────────────────────────┘             │
│                                                                 │
│  Si erreur → Notification utilisateur                          │
│  Si OK → Continuer                                             │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 3 : Extraction (Parser spécifique)                      │
│                                                                 │
│  ventes.csv:                                                    │
│  ┌──────────────────────────────────────┐                     │
│  │ pandas.read_csv()                    │                     │
│  │ • Détection encoding (UTF-8, Latin1) │                     │
│  │ • Détection délimiteur (,;|\t)       │                     │
│  │ • Parse dates automatique            │                     │
│  │ → DataFrame[50000 rows × 8 cols]    │                     │
│  └──────────────────────────────────────┘                     │
│                                                                 │
│  budget.xlsx:                                                   │
│  ┌──────────────────────────────────────┐                     │
│  │ pd.read_excel() / openpyxl           │                     │
│  │ • Lecture sheet 1 (ou toutes sheets) │                     │
│  │ • Conversion formules → valeurs      │                     │
│  │ → DataFrame[10000 rows × 6 cols]    │                     │
│  └──────────────────────────────────────┘                     │
│                                                                 │
│  objectifs.json:                                                │
│  ┌──────────────────────────────────────┐                     │
│  │ json.load() + pd.json_normalize()    │                     │
│  │ • Flatten nested objects             │                     │
│  │ → DataFrame[365 rows × 4 cols]      │                     │
│  └──────────────────────────────────────┘                     │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 4 : Transformation & Nettoyage                          │
│                                                                 │
│  Pour chaque DataFrame :                                       │
│  ┌──────────────────────────────────────────────┐             │
│  │ 1. Normalisation colonnes                    │             │
│  │    • Renommer selon mapping config           │             │
│  │    • Lower case, trim whitespace             │             │
│  │    date → date, montant → value              │             │
│  │                                               │             │
│  │ 2. Validation types                          │             │
│  │    • Dates → datetime                        │             │
│  │    • Numériques → float/int                  │             │
│  │    • Texte → string                          │             │
│  │                                               │             │
│  │ 3. Gestion valeurs manquantes                │             │
│  │    • NULL → stratégie définie                │             │
│  │      (forward fill, mean, drop)              │             │
│  │                                               │             │
│  │ 4. Détection outliers (optionnel)            │             │
│  │    • Z-score > 3 → flag anomaly              │             │
│  │                                               │             │
│  │ 5. Enrichissement métadonnées                │             │
│  │    • source_file_id                          │             │
│  │    • import_timestamp                        │             │
│  │    • data_quality_score                      │             │
│  └──────────────────────────────────────────────┘             │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 5 : Déduplication                                       │
│                                                                 │
│  Stratégies selon configuration :                              │
│  ┌──────────────────────────────────────────────┐             │
│  │ Option 1 : Par clé composite                │             │
│  │ • (date, kpi_name, category)                │             │
│  │ • Garder last (plus récent)                 │             │
│  │                                               │             │
│  │ Option 2 : Par similarité                   │             │
│  │ • Levenshtein distance sur colonnes clés    │             │
│  │ • Seuil 90% → considéré doublon             │             │
│  │                                               │             │
│  │ Option 3 : Manuel                            │             │
│  │ • Présenter à utilisateur                   │             │
│  │ • Choix interactif                          │             │
│  └──────────────────────────────────────────────┘             │
│                                                                 │
│  Résultat : 60K lignes → 58K lignes (2K doublons supprimés)   │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 6 : Fusion (Merge/Join)                                 │
│                                                                 │
│  Stratégie de fusion :                                         │
│  ┌──────────────────────────────────────────────┐             │
│  │ 1. Identifier clés communes                 │             │
│  │    • Analyse automatique colonnes            │             │
│  │    • Suggestion à utilisateur                │             │
│  │    Trouvé : "date" commune aux 3 fichiers   │             │
│  │                                               │             │
│  │ 2. Type de jointure                          │             │
│  │    ┌─────────────────────────────────┐      │             │
│  │    │ OUTER JOIN (union complète)     │      │             │
│  │    │ • Garde toutes lignes           │      │             │
│  │    │ • NaN pour valeurs manquantes   │      │             │
│  │    └─────────────────────────────────┘      │             │
│  │                                               │             │
│  │ 3. Résolution conflits                       │             │
│  │    Si même (date, kpi_name) :                │             │
│  │    • Priorité : budget.xlsx > ventes.csv    │             │
│  │    • Ou : moyenne des valeurs               │             │
│  │    • Ou : demander utilisateur              │             │
│  │                                               │             │
│  │ 4. Consolidation                             │             │
│  │    DataFrame_final[58000 rows × 15 cols]   │             │
│  └──────────────────────────────────────────────┘             │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 7 : Chargement en Base de Données                       │
│                                                                 │
│  Transaction SQLite :                                           │
│  ┌──────────────────────────────────────────────┐             │
│  │ BEGIN TRANSACTION;                           │             │
│  │                                               │             │
│  │ -- 1. Enregistrer sources                   │             │
│  │ INSERT INTO data_sources                     │             │
│  │   (filename, checksum, row_count, ...)       │             │
│  │ VALUES (...);                                │             │
│  │ → source_file_id = 1, 2, 3                  │             │
│  │                                               │             │
│  │ -- 2. Insertion batch des données           │             │
│  │ INSERT INTO kpi_data                         │             │
│  │   (date, kpi_name, kpi_value, ...)           │             │
│  │ VALUES                                       │             │
│  │   (...),  -- 58000 lignes                   │             │
│  │   (...);  -- Batch de 1000 par requête      │             │
│  │                                               │             │
│  │ -- 3. Logs d'audit                          │             │
│  │ INSERT INTO audit_logs                       │             │
│  │   (action, details, timestamp)               │             │
│  │ VALUES                                       │             │
│  │   ('IMPORT', '3 files merged', NOW());      │             │
│  │                                               │             │
│  │ COMMIT;                                      │             │
│  └──────────────────────────────────────────────┘             │
│                                                                 │
│  Si erreur → ROLLBACK (aucune donnée corrompue)                │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 8 : Notification Utilisateur                            │
│                                                                 │
│  ┌──────────────────────────────────────────────┐             │
│  │  ✅ Import réussi !                          │             │
│  │                                               │             │
│  │  📊 Résumé :                                 │             │
│  │  • 3 fichiers importés                       │             │
│  │  • 60 000 lignes lues                        │             │
│  │  • 2 000 doublons supprimés                  │             │
│  │  • 58 000 lignes disponibles                 │             │
│  │                                               │             │
│  │  Durée : 8.5 secondes                        │             │
│  │                                               │             │
│  │  [ Voir les données ]  [ Créer graphique ]  │             │
│  └──────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

#### Scénario 2 : Génération et Export de Rapport

```
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 1 : Sélection KPI et Filtres (Frontend)                 │
│                                                                 │
│  Utilisateur configure :                                        │
│  • KPI : "CA mensuel", "Taux conversion"                       │
│  • Période : 2024-01-01 à 2024-12-31                           │
│  • Catégorie : "Toutes"                                        │
│  • Graphiques : Ligne + Barre                                  │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 2 : Requête Données (Backend)                           │
│                                                                 │
│  SQL Query (généré automatiquement) :                          │
│  ┌──────────────────────────────────────────────┐             │
│  │ SELECT                                       │             │
│  │   date,                                      │             │
│  │   kpi_name,                                  │             │
│  │   SUM(kpi_value) as total,                  │             │
│  │   category                                   │             │
│  │ FROM kpi_data                                │             │
│  │ WHERE                                        │             │
│  │   date BETWEEN '2024-01-01' AND '2024-12-31'│             │
│  │   AND kpi_name IN ('CA mensuel', 'Taux..') │             │
│  │ GROUP BY date, kpi_name, category            │             │
│  │ ORDER BY date;                               │             │
│  └──────────────────────────────────────────────┘             │
│                                                                 │
│  → Résultat : DataFrame[720 rows × 4 cols]                    │
│    (12 mois × 2 KPI × 30 catégories moyenne)                  │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 3 : Calculs Statistiques                                │
│                                                                 │
│  Agrégations :                                                  │
│  • Moyenne : mean(kpi_value)                                   │
│  • Médiane : median(kpi_value)                                 │
│  • Écart-type : std(kpi_value)                                 │
│  • Min/Max : min/max(kpi_value)                                │
│  • Tendance : linéaire regression                              │
│  • Variation % : (current - previous) / previous               │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 4 : Génération Graphiques (Frontend)                    │
│                                                                 │
│  Rendu via Recharts :                                          │
│  ┌──────────────────────────────────────────────┐             │
│  │  Graphique 1 : Line Chart                   │             │
│  │  • X-axis : Date                             │             │
│  │  • Y-axis : CA mensuel (€)                   │             │
│  │  • Tooltip : Valeur + % variation            │             │
│  │  • Legend : Catégories                       │             │
│  │                                               │             │
│  │  Graphique 2 : Bar Chart                     │             │
│  │  • X-axis : Mois                             │             │
│  │  • Y-axis : Taux conversion (%)              │             │
│  │  • Colors : Gradient vert/rouge              │             │
│  └──────────────────────────────────────────────┘             │
└───────────┬─────────────────────────────────────────────────────┘
            │
            │ Utilisateur clique "Exporter PDF"
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 5 : Génération PDF (Backend - ReportLab)                │
│                                                                 │
│  1. Créer document PDF :                                       │
│  ┌──────────────────────────────────────────────┐             │
│  │ pdf = SimpleDocTemplate('rapport.pdf')       │             │
│  │ styles = getSampleStyleSheet()               │             │
│  │                                               │             │
│  │ elements = []                                │             │
│  │                                               │             │
│  │ # Header                                     │             │
│  │ elements.append(                             │             │
│  │   Paragraph('Rapport KPI - Jan 2024',       │             │
│  │              styles['Title'])                │             │
│  │ )                                            │             │
│  │                                               │             │
│  │ # Métadonnées                                │             │
│  │ elements.append(                             │             │
│  │   Paragraph(f'Généré le : {now}',           │             │
│  │              styles['Normal'])               │             │
│  │ )                                            │             │
│  │                                               │             │
│  │ # Résumé statistiques (tableau)             │             │
│  │ table_data = [                               │             │
│  │   ['KPI', 'Moyenne', 'Min', 'Max'],         │             │
│  │   ['CA', '150K€', '120K€', '180K€'],        │             │
│  │   ...                                        │             │
│  │ ]                                            │             │
│  │ elements.append(Table(table_data))           │             │
│  │                                               │             │
│  │ # Graphiques (convertis en images)          │             │
│  │ chart1_img = convert_chart_to_image(chart1)  │             │
│  │ elements.append(Image(chart1_img))           │             │
│  │                                               │             │
│  │ # Footer / Watermark                         │             │
│  │ watermark = f'CONFIDENTIEL - {username} -'   │             │
│  │             f' {datetime.now()}'             │             │
│  │ elements.append(Paragraph(watermark))        │             │
│  │                                               │             │
│  │ pdf.build(elements)                          │             │
│  └──────────────────────────────────────────────┘             │
│                                                                 │
│  2. Sauvegarder :                                              │
│     data/exports/Rapport_KPI_2024-01-14_143052.pdf            │
│                                                                 │
│  3. Logger :                                                    │
│     INSERT INTO audit_logs (action, details)                   │
│     VALUES ('EXPORT_PDF', 'rapport_kpi.pdf');                 │
└───────────┬─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ÉTAPE 6 : Notification & Ouverture                            │
│                                                                 │
│  ┌──────────────────────────────────────────────┐             │
│  │  ✅ PDF généré avec succès !                 │             │
│  │                                               │             │
│  │  📄 Rapport_KPI_2024-01-14_143052.pdf        │             │
│  │  Taille : 2.3 MB                             │             │
│  │  Pages : 8                                   │             │
│  │                                               │             │
│  │  [ Ouvrir ]  [ Aller au dossier ]           │             │
│  └──────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Sécurité Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                    COUCHES DE SÉCURITÉ                            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Niveau 1 : Isolation Réseau                               │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  • Aucune connexion sortante (firewall applicatif)   │  │ │
│  │  │  • Pas de télémétrie                                 │  │ │
│  │  │  • Pas de mise à jour automatique non sollicitée     │  │ │
│  │  │  • Content Security Policy (CSP) strict             │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Niveau 2 : Chiffrement Données                           │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Base de données (SQLite) - OPTIONNEL :              │  │ │
│  │  │  • Par défaut : DÉSACTIVÉ (simplicité maximale)     │  │ │
│  │  │  • Activable dans Paramètres si besoin              │  │ │
│  │  │  • Chiffrement AES-256-GCM si activé                │  │ │
│  │  │  • Clé dérivée de mot de passe utilisateur          │  │ │
│  │  │  • PBKDF2 avec 100,000 iterations                   │  │ │
│  │  │  • Salt unique par installation                     │  │ │
│  │  │  • Impact performance : 3-5% (négligeable)          │  │ │
│  │  │                                                       │  │ │
│  │  │  Fichiers sensibles :                                 │  │ │
│  │  │  • Configuration : Chiffrée si option activée       │  │ │
│  │  │  • Logs : Chiffrés si option activée + rotation     │  │ │
│  │  │  • Exports : Watermark + option chiffrement          │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Niveau 3 : Audit Trail                                   │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Toutes actions loggées :                            │  │ │
│  │  │  • Timestamp précis (UTC)                            │  │ │
│  │  │  • User ID / Machine ID                              │  │ │
│  │  │  • Action type (IMPORT, EXPORT, VIEW, DELETE)        │  │ │
│  │  │  • Détails contextuels (JSON)                        │  │ │
│  │  │  • Hash d'intégrité (SHA256)                         │  │ │
│  │  │                                                       │  │ │
│  │  │  Rétention : 90 jours (configurable)                 │  │ │
│  │  │  Export audit : CSV signé numériquement              │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Niveau 4 : Intégrité Code                                │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  • Signature numérique de l'exécutable               │  │ │
│  │  │  • Vérification intégrité au lancement               │  │ │
│  │  │  • Sandboxing Electron (contextIsolation)            │  │ │
│  │  │  • Pas d'eval() ou code dynamique                    │  │ │
│  │  │  • Dependencies pinned (lock file)                   │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Niveau 5 : Gestion Mémoire                               │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  • Données sensibles overwritten après usage         │  │ │
│  │  │  • Pas de swap sur disque des secrets               │  │ │
│  │  │  • Garbage collection forcée après opérations        │  │ │
│  │  │  • Timeout de session (inactivité 30 min)            │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

---

## 5. Spécifications Fonctionnelles

### 5.1 Fonctionnalités Principales

#### F-01 : Import Multi-Format

**Description :** Importer des fichiers de différents formats pour analyse

**Formats supportés :**
- CSV (délimiteurs : `,` `;` `|` `\t`)
- Excel (.xlsx, .xls)
- JSON (flat et nested)
- XML (optionnel)

**Méthodes d'import :**
1. Glisser-déposer dans zone dédiée
2. Bouton "Parcourir" (dialogue fichier)
3. Argument ligne de commande (batch)

**Contraintes :**
- Taille max par fichier : 500 MB
- Nombre max fichiers simultanés : 20
- Timeout traitement : 5 minutes

**Validation :**
- ✅ Format reconnu
- ✅ Encodage détecté (UTF-8, Latin1, etc.)
- ✅ Structure valide (colonnes cohérentes)
- ✅ Pas de malware (scan basique)

**Critères d'acceptation :**
- [ ] Import CSV avec 100K lignes en < 5 secondes
- [ ] Import Excel multi-sheets fonctionnel
- [ ] Détection automatique encoding à 99%
- [ ] Message d'erreur explicite si échec

---

#### F-02 : Fusion Intelligente

**Description :** Fusionner automatiquement plusieurs sources de données

**Stratégies de fusion :**

| Stratégie | Description | Cas d'usage |
|-----------|-------------|-------------|
| **Auto-detect** | Analyse colonnes communes | Fichiers similaires |
| **Join on key** | Jointure sur clé spécifiée | Relation explicite |
| **Union** | Empiler verticalement | Même structure |
| **Concat** | Concaténer horizontalement | Enrichissement |

**Gestion conflits :**
- **Valeur différente même clé** :
  - Option 1 : Prioriser source (config)
  - Option 2 : Moyenne
  - Option 3 : Demander utilisateur

- **Doublons** :
  - Détection automatique
  - Stratégie : keep_first, keep_last, remove

**Critères d'acceptation :**
- [ ] Fusion 3 fichiers (total 200K lignes) en < 15 secondes
- [ ] Détection automatique colonnes communes à 95%
- [ ] Résolution conflits sans perte données

---

#### F-03 : Visualisation Graphiques

**Description :** Afficher les KPI sous forme de graphiques interactifs

**Types de graphiques :**

| Type | Usage | Interactivité |
|------|-------|---------------|
| **Line Chart** | Évolution temporelle | Zoom, hover, legend toggle |
| **Bar Chart** | Comparaison catégories | Stacked, grouped, horizontal |
| **Pie/Donut** | Répartition parts | Explode slice, percentage |
| **Scatter Plot** | Corrélation | Trendline, clusters |
| **Heatmap** | Matrice densité | Color scale, tooltips |
| **Gauge** | Indicateur unique | Seuils min/max/target |

**Fonctionnalités graphiques :**
- ✅ Export PNG haute résolution
- ✅ Légendes customisables
- ✅ Axes configurables
- ✅ Thèmes (clair/sombre)
- ✅ Responsive (resize window)

**Performance :**
- 10K points : Rendu instantané
- 100K points : Échantillonnage intelligent
- Animation fluide (60 FPS)

**Critères d'acceptation :**
- [ ] Affichage graphique < 1 seconde
- [ ] Interactions fluides (pas de lag)
- [ ] Export PNG de qualité

---

#### F-04 : Export Rapports

**Description :** Générer des rapports professionnels exportables

**Formats export :**
- **PDF** :
  - Multi-pages
  - Header/Footer customisables
  - Watermark automatique
  - Table of contents
  - Signature numérique (option)

- **Excel** :
  - Multiple sheets
  - Formules préservées
  - Graphiques Excel natifs
  - Mise en forme conditionnelle

- **PowerPoint** (optionnel) :
  - Slide par graphique
  - Template corporate

**Personnalisation rapport :**
- Logo entreprise
- Couleurs brand
- Templates prédéfinis
- Sections configurables

**Critères d'acceptation :**
- [ ] Export PDF 10 pages en < 5 secondes
- [ ] Watermark visible sur chaque page
- [ ] Excel compatible Office 2016+

---

### 5.2 Fonctionnalités Secondaires

#### F-05 : Gestion Historique

- Sauvegarde automatique versions
- Comparaison période N vs N-1
- Timeline des modifications
- Rollback à version antérieure

#### F-06 : Filtrage Avancé

- Filtres multi-critères (AND/OR)
- Recherche textuelle
- Plages de dates
- Sauvegarde filtres favoris

#### F-07 : Alertes & Notifications

- Seuils configurable (min/max/target)
- Notification visuelle (couleur, icône)
- Export alertes en email (optionnel)

#### F-08 : Personnalisation

- Préférences utilisateur sauvegardées
- Dashboards personnalisés
- Raccourcis clavier
- Mode sombre

---

## 6. Implémentation Détaillée

### 6.1 Phase 1 : MVP (Semaine 1-2)

**Objectif :** Prototype fonctionnel avec fonctionnalités de base

#### Tâches Développement

| ID | Tâche | Durée | Dépendances |
|----|-------|-------|-------------|
| **Backend** ||||
| BE-01 | Setup projet Python + virtualenv | 2h | - |
| BE-02 | Module lecture CSV (pandas) | 4h | BE-01 |
| BE-03 | Module lecture Excel (openpyxl) | 4h | BE-01 |
| BE-04 | Module lecture JSON | 2h | BE-01 |
| BE-05 | Schéma SQLite (tables de base) | 3h | BE-01 |
| BE-06 | Fonction fusion simple (concat) | 6h | BE-02,03,04 |
| BE-07 | Déduplication basique | 4h | BE-06 |
| BE-08 | Insertion données DB | 4h | BE-05 |
| BE-09 | Requête données pour viz | 3h | BE-08 |
| BE-10 | Export PDF basique (ReportLab) | 6h | BE-09 |
| **Frontend** ||||
| FE-01 | Setup Electron + React | 3h | - |
| FE-02 | Layout principal (header, sidebar) | 4h | FE-01 |
| FE-03 | Zone drag & drop fichiers | 5h | FE-02 |
| FE-04 | Liste fichiers importés | 3h | FE-03 |
| FE-05 | Bouton "Fusionner" + loader | 2h | FE-04 |
| FE-06 | Composant Line Chart (Recharts) | 5h | FE-02 |
| FE-07 | Composant Bar Chart | 4h | FE-06 |
| FE-08 | Affichage données (table) | 4h | FE-02 |
| FE-09 | Bouton export PDF | 2h | FE-02 |
| **Integration** ||||
| INT-01 | IPC Electron <-> Python | 6h | BE-01, FE-01 |
| INT-02 | Pipeline import end-to-end | 4h | BE-08, FE-04 |
| INT-03 | Pipeline viz end-to-end | 4h | BE-09, FE-06 |
| INT-04 | Pipeline export end-to-end | 3h | BE-10, FE-09 |
| **Tests** ||||
| TEST-01 | Tests unitaires backend | 6h | BE-* |
| TEST-02 | Tests integration | 4h | INT-* |
| TEST-03 | Tests utilisateur | 4h | Tous |

**Total estimé : 8-10 jours**

#### Livrables Phase 1

- ✅ Application exécutable (Windows .exe)
- ✅ Import CSV fonctionnel
- ✅ Fusion 2-3 fichiers
- ✅ 1-2 graphiques basiques
- ✅ Export PDF simple
- ✅ README utilisation

---

### 6.2 Phase 2 : Version Complète (Semaine 3-4)

**Objectif :** Finalisation toutes fonctionnalités + polish

#### Tâches Développement

| ID | Tâche | Durée | Priorité |
|----|-------|-------|----------|
| **Fonctionnalités** ||||
| FEAT-01 | Support Excel complet (multi-sheets) | 6h | ⭐⭐⭐ |
| FEAT-02 | Fusion intelligente (auto-detect keys) | 8h | ⭐⭐⭐ |
| FEAT-03 | Gestion conflits (UI sélection) | 6h | ⭐⭐ |
| FEAT-04 | Tous types graphiques (5+) | 10h | ⭐⭐⭐ |
| FEAT-05 | Filtres avancés | 8h | ⭐⭐ |
| FEAT-06 | Export PDF avancé (watermark, TOC) | 8h | ⭐⭐⭐ |
| FEAT-07 | Export Excel | 5h | ⭐⭐ |
| FEAT-08 | Historique versions | 6h | ⭐ |
| **Sécurité** ||||
| SEC-01 | Chiffrement DB (AES-256) | 8h | ⭐⭐⭐ |
| SEC-02 | Logs d'audit complets | 6h | ⭐⭐⭐ |
| SEC-03 | Watermarking exports | 4h | ⭐⭐⭐ |
| SEC-04 | Validation input (anti-injection) | 4h | ⭐⭐⭐ |
| **UI/UX** ||||
| UX-01 | Design système cohérent | 8h | ⭐⭐⭐ |
| UX-02 | Loading states | 4h | ⭐⭐⭐ |
| UX-03 | Messages erreur explicites | 4h | ⭐⭐⭐ |
| UX-04 | Onboarding première utilisation | 6h | ⭐⭐ |
| UX-05 | Mode sombre | 4h | ⭐ |
| **Performance** ||||
| PERF-01 | Optimisation requêtes SQL | 4h | ⭐⭐⭐ |
| PERF-02 | Streaming gros fichiers | 6h | ⭐⭐ |
| PERF-03 | Cache résultats | 4h | ⭐⭐ |
| **Packaging** ||||
| PKG-01 | Build Windows portable | 6h | ⭐⭐⭐ |
| PKG-02 | Build macOS portable | 6h | ⭐⭐ |
| PKG-03 | Signature code Windows | 3h | ⭐⭐ |
| PKG-04 | Installateur (optionnel) | 4h | ⭐ |
| **Documentation** ||||
| DOC-01 | Guide utilisateur (PDF) | 8h | ⭐⭐⭐ |
| DOC-02 | Vidéo tutoriel (5 min) | 4h | ⭐⭐⭐ |
| DOC-03 | FAQ | 3h | ⭐⭐ |
| DOC-04 | Documentation technique | 6h | ⭐⭐ |
| **Tests** ||||
| TEST-04 | Tests complets fonctionnels | 8h | ⭐⭐⭐ |
| TEST-05 | Tests sécurité | 6h | ⭐⭐⭐ |
| TEST-06 | Tests performance | 4h | ⭐⭐ |
| TEST-07 | Tests utilisateurs pilotes | 8h | ⭐⭐⭐ |

**Total estimé : 12-15 jours**

#### Livrables Phase 2

- ✅ Application production-ready
- ✅ Version portable Windows + Mac
- ✅ Documentation complète
- ✅ Tests validation réussis
- ✅ Package déploiement

---

### 6.3 Structure Code Projet

```
AnalyseurKPI/
├── electron/                    # Application Electron
│   ├── main.js                 # Processus principal
│   ├── preload.js              # Pont sécurisé
│   └── ipc-handlers.js         # Handlers IPC vers Python
│
├── frontend/                    # Application React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Import/
│   │   │   │   ├── DragDropZone.tsx
│   │   │   │   ├── FileList.tsx
│   │   │   │   └── ImportButton.tsx
│   │   │   ├── Charts/
│   │   │   │   ├── LineChart.tsx
│   │   │   │   ├── BarChart.tsx
│   │   │   │   ├── PieChart.tsx
│   │   │   │   └── ChartContainer.tsx
│   │   │   ├── Export/
│   │   │   │   ├── ExportDialog.tsx
│   │   │   │   └── ExportButton.tsx
│   │   │   └── Layout/
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── MainContent.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Import.tsx
│   │   │   ├── Analyze.tsx
│   │   │   └── Settings.tsx
│   │   ├── stores/
│   │   │   ├── dataStore.ts        # Zustand store
│   │   │   └── uiStore.ts
│   │   ├── services/
│   │   │   ├── api.ts              # Appels IPC
│   │   │   └── formatter.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   └── package.json
│
├── backend/                     # Backend Python
│   ├── main.py                 # Point d'entrée
│   ├── config.py               # Configuration
│   ├── modules/
│   │   ├── etl/
│   │   │   ├── __init__.py
│   │   │   ├── extractors.py      # Lecture fichiers
│   │   │   ├── transformers.py    # Nettoyage, validation
│   │   │   ├── loaders.py         # Chargement DB
│   │   │   └── merger.py          # Fusion données
│   │   ├── analytics/
│   │   │   ├── __init__.py
│   │   │   ├── stats.py           # Calculs statistiques
│   │   │   └── aggregations.py
│   │   ├── export/
│   │   │   ├── __init__.py
│   │   │   ├── pdf_generator.py
│   │   │   └── excel_generator.py
│   │   ├── security/
│   │   │   ├── __init__.py
│   │   │   ├── encryption.py
│   │   │   └── audit.py
│   │   └── database/
│   │       ├── __init__.py
│   │       ├── models.py          # SQLAlchemy models
│   │       └── queries.py
│   ├── utils/
│   │   ├── logger.py
│   │   └── validators.py
│   ├── tests/
│   │   ├── test_etl.py
│   │   ├── test_analytics.py
│   │   └── test_security.py
│   └── requirements.txt
│
├── data/                        # Données utilisateur (runtime)
│   ├── database.db             # Créé au runtime
│   ├── imports/
│   ├── exports/
│   └── logs/
│
├── docs/                        # Documentation
│   ├── user-guide.md
│   ├── technical-doc.md
│   └── api.md
│
├── scripts/                     # Scripts build/deploy
│   ├── build-windows.sh
│   ├── build-mac.sh
│   └── package.sh
│
├── package.json                # Config Electron
├── README.md
└── LICENSE
```

---

## 7. Sécurité et Conformité

### 7.1 Mesures de Sécurité Implémentées

#### Niveau Application

| Mesure | Implémentation | Impact |
|--------|----------------|--------|
| **Isolation Réseau** | Firewall applicatif, pas de require('http') | Aucune fuite externe |
| **Sandboxing** | Electron contextIsolation + nodeIntegration:false | Isolation processus |
| **CSP** | Content-Security-Policy strict | Anti-XSS |
| **Input Validation** | Validation tous inputs utilisateur | Anti-injection |
| **Code Signing** | Certificat Windows Authenticode | Confiance utilisateur |

#### Niveau Données

| Mesure | Implémentation | Standard |
|--------|----------------|----------|
| **Chiffrement au repos** | AES-256-GCM | NIST, FIPS 140-2 |
| **Dérivation clé** | PBKDF2, 100K iterations | OWASP recommandé |
| **Hashing mots de passe** | Argon2id | OWASP 2023 |
| **Intégrité données** | HMAC-SHA256 | NIST |

#### Audit & Compliance

| Aspect | Implémentation | Conformité |
|--------|----------------|------------|
| **Logs d'audit** | Toutes actions loggées | SOC 2, ISO 27001 |
| **Rétention logs** | 90 jours (configurable) | RGPD Art. 5 - Minimisation |
| **Droit à l'oubli** | Fonction suppression données complète | RGPD Art. 17 - Droit à l'effacement |
| **Export données** | Export JSON/CSV complet | RGPD Art. 20 - Portabilité |
| **Minimisation** | Collecte données strictement nécessaires | RGPD Art. 5 - Minimisation |
| **Registre traitements** | Logs d'audit complets | RGPD Art. 30 - Registre activités |
| **Sécurité appropriée** | Chiffrement optionnel AES-256 | RGPD Art. 32 - Sécurité traitement |
| **Base légale** | Intérêt légitime (analyse métier interne) | RGPD Art. 6 |

### 7.2 Benchmarks de Performance

**Performances Garanties :**

| Opération | Temps | Volume | Notes |
|-----------|-------|--------|-------|
| **Import CSV** | < 5 secondes | 100 000 lignes | Détection automatique encoding |
| **Import Excel** | < 8 secondes | 100 000 lignes | Multi-sheets supporté |
| **Fusion 3 fichiers** | < 15 secondes | 200 000 lignes total | Déduplication incluse |
| **Génération graphique** | < 2 secondes | Temps réel | Responsive, 60 FPS |
| **Export PDF (10 pages)** | < 5 secondes | Qualité professionnelle | Watermark inclus |
| **Requête SQL** | < 50 ms | Imperceptible | Index optimisés |

**Impact Chiffrement (si activé) :**

| Opération | Sans chiffrement | Avec chiffrement | Impact |
|-----------|------------------|------------------|--------|
| **Import 100K lignes** | 5.0s | 5.2s | +3-5% (0.2s) |
| **Requêtes SQL** | 45ms | 48ms | +2-5ms |
| **Export PDF** | 5.0s | 5.2s | +4% (0.2s) |

**Verdict : Impact négligeable** ✅

**Configuration Requise :**
- **RAM** : 4 GB minimum (8 GB recommandé)
- **Processeur** : Intel i3 2015+ (AES-NI pour chiffrement rapide)
- **Disque** : 5 GB libre
- **OS** : Windows 10/11, macOS 10.14+

### 7.3 Analyse Risques

| Risque | Probabilité | Impact | Mitigation | Propriétaire |
|--------|-------------|--------|------------|--------------|
| **Dépassement planning** | Moyenne | Moyen | Buffer 20%, MVP first, daily standups | Chef Projet |
| **Bugs post-release** | Moyenne | Élevé | Tests rigoureux, pilote 2-3 users, support dédié | QA/Dev |
| **Adoption faible users** | Faible | Élevé | UX ultra-simple, formation 30 min, support actif | PO |
| **Performance insuffisante** | Faible | Moyen | Benchmarks dès prototype, optimisation continue | Dev |
| **Refus validation DSI** | Faible | Bloquant | Impliquer DSI semaine 1, audit sécurité | Chef Projet |
| **Perte données utilisateur** | Faible | Critique | Backups auto, validation transactions, tests | Dev |

### 7.4 Chiffrement : Approche Optionnelle et Flexible

**Par défaut :** Chiffrement **DÉSACTIVÉ** (simplicité maximale)
**Si besoin :** Activable dans Paramètres (AES-256)

#### Quand activer le chiffrement ?

✅ **Activez le chiffrement si :**
- Données personnelles (RGPD - informations sensibles)
- Ordinateur portable (risque de vol physique)
- Environnement multi-utilisateurs (bureau partagé)
- Secrets commerciaux ou données stratégiques

❌ **Pas nécessaire si :**
- KPI non sensibles (données publiques ou agrégées)
- Ordinateur fixe en bureau sécurisé
- Chiffrement OS déjà actif (BitLocker/FileVault)
- Environnement contrôlé et sécurisé

#### Interface Utilisateur Proposée

```
⚙️ Paramètres → Sécurité

┌────────────────────────────────────────┐
│  🔒 Chiffrement des données           │
│                                        │
│  [ ] Activer le chiffrement AES-256   │
│                                        │
│  ℹ️  Recommandé pour données sensibles │
│                                        │
│  Si activé :                           │
│  • Mot de passe requis au démarrage   │
│  • Données illisibles sans mdp        │
│  • Léger impact performance (-3-5%)   │
│                                        │
│  [ Sauvegarder ]                       │
└────────────────────────────────────────┘
```

**Avantages de cette approche :**
- ✅ Simplicité par défaut (pas de friction pour démarrage rapide)
- ✅ Sécurité disponible si besoin (activation en 1 clic)
- ✅ Utilisateur contrôle son niveau de risque
- ✅ Pas de complexité inutile si données non sensibles

### 7.5 Checklist Validation Sécurité

**Avant déploiement :**

- [ ] Scan vulnérabilités dependencies (npm audit, safety)
- [ ] Tests pénétration basiques
- [ ] Review code sécurité (audit externe optionnel)
- [ ] Validation chiffrement (test decrypt)
- [ ] Tests injection SQL/XSS
- [ ] Vérification isolation réseau (Wireshark)
- [ ] Scan antivirus package final (VirusTotal)
- [ ] Documentation sécurité complète
- [ ] Plan de réponse incidents

---

## 8. Plan de Déploiement

### 8.1 Stratégie de Déploiement

**Approche Progressive (Recommandée)**

```
Phase 1 : Pilote (Semaine 1)
├─ 2-3 utilisateurs power users
├─ Environnement test isolé
├─ Feedback quotidien
└─ Corrections rapides

Phase 2 : Groupe Élargi (Semaine 2)
├─ 10-15 utilisateurs
├─ Mix profils (novice + expérimentés)
├─ Formation en groupe
└─ Support dédié

Phase 3 : Déploiement Complet (Semaine 3-4)
├─ Tous utilisateurs
├─ Communication officielle
├─ Hotline support
└─ Monitoring retours
```

### 8.2 Package de Déploiement

**Contenu :**

```
AnalyseurKPI-v1.0-Portable.zip (150 MB)
├── AnalyseurKPI.exe              # Application
├── README.txt                     # Instructions rapides
├── Guide_Utilisateur.pdf         # Documentation complète
├── Tutoriel_Video.mp4            # Vidéo 5 minutes
└── CHANGELOG.txt                  # Notes de version
```

**Checksum :**
- SHA256 du ZIP pour validation intégrité
- Publié sur page téléchargement

### 8.3 Modes de Distribution

#### Option A : Email (Petite équipe < 20 personnes)

**Email type :**
```
Objet : Nouvel outil d'analyse KPI disponible

Bonjour,

Nous avons le plaisir de vous annoncer la disponibilité de
l'Analyseur KPI, un outil simplifiant l'analyse de vos données.

📥 Téléchargement : [Lien ZIP - 150 MB]

🚀 Installation (2 minutes) :
1. Télécharger le fichier ZIP
2. Extraire dans Documents\MesApplications\
3. Double-cliquer sur AnalyseurKPI.exe

📚 Ressources :
- Guide utilisateur : [PDF]
- Vidéo tutoriel : [Lien]
- Support : support@company.com

Cordialement,
L'équipe IT
```

#### Option B : Partage Réseau (Moyenne/Grande équipe)

**Déploiement centralisé :**
1. IT copie le dossier sur : `\\serveur\applications\AnalyseurKPI\`
2. Email aux utilisateurs avec chemin réseau
3. Utilisateurs créent raccourci sur bureau
4. Mises à jour centralisées (IT remplace fichiers)

#### Option C : Script Automatisé (Enterprise)

**Script PowerShell :**
```powershell
# deploy-kpi-analyzer.ps1
# Déploiement automatique via GPO

$source = "\\serveur\applications\AnalyseurKPI-v1.0"
$dest = "$env:USERPROFILE\Applications\AnalyseurKPI"

# Créer dossier destination
New-Item -ItemType Directory -Force -Path $dest

# Copier fichiers
Copy-Item -Path "$source\*" -Destination $dest -Recurse -Force

# Créer raccourci bureau
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Analyseur KPI.lnk")
$Shortcut.TargetPath = "$dest\AnalyseurKPI.exe"
$Shortcut.IconLocation = "$dest\icon.ico"
$Shortcut.Save()

Write-Host "Déploiement terminé !"
```

### 8.4 Formation Utilisateurs

**Programme Formation (30 min)**

| Timing | Module | Contenu |
|--------|--------|---------|
| 0-5 min | Introduction | Objectifs, bénéfices |
| 5-10 min | Installation | Démo live extraction ZIP |
| 10-20 min | Utilisation | Import → Fusion → Visualisation |
| 20-25 min | Export | Génération PDF |
| 25-30 min | Q&A | Questions libres |

**Supports :**
- Slides PowerPoint
- Vidéo enregistrée (réutilisable)
- Sandbox avec données test

### 8.5 Support Post-Déploiement

**Canaux de support :**

| Canal | SLA | Disponibilité |
|-------|-----|---------------|
| **Email** | 24h | Lun-Ven 9h-18h |
| **FAQ/Wiki** | Instantané | 24/7 |
| **Chat interne** | 2h | Heures bureau |
| **Hotline** | 4h (urgent uniquement) | Lun-Ven 9h-17h |

**Escalade :**
1. Niveau 1 : FAQ automatique
2. Niveau 2 : Support IT général
3. Niveau 3 : Développeur (bugs critiques)

---

## 9. Planning et Jalons

### 9.1 Gantt Chart (4 semaines)

```
Semaine 1 : MVP
┌────────────────────────────────────────────────────────────┐
│ Jours  │ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │               │
├────────┼────┼────┼────┼────┼────┼────┼────┤               │
│ Setup  │ ██ │    │    │    │    │    │    │               │
│ Backend│    │ ██ │ ██ │ ██ │    │    │    │               │
│Frontend│    │    │    │ ██ │ ██ │ ██ │    │               │
│Integr. │    │    │    │    │    │ ██ │ ██ │               │
└────────┴────┴────┴────┴────┴────┴────┴────┘               │
         Livrable : Prototype fonctionnel                     │

Semaine 2 : MVP Finalisé
┌────────────────────────────────────────────────────────────┐
│ Jours  │ 8  │ 9  │ 10 │ 11 │ 12 │ 13 │ 14 │               │
├────────┼────┼────┼────┼────┼────┼────┼────┤               │
│ Tests  │ ██ │ ██ │    │    │    │    │    │               │
│ Debug  │    │    │ ██ │ ██ │    │    │    │               │
│ Polish │    │    │    │    │ ██ │ ██ │    │               │
│ Doc    │    │    │    │    │    │    │ ██ │               │
└────────┴────┴────┴────┴────┴────┴────┴────┘               │
         Livrable : MVP testé + documentation                 │

Semaine 3 : Version Complète
┌────────────────────────────────────────────────────────────┐
│ Jours  │ 15 │ 16 │ 17 │ 18 │ 19 │ 20 │ 21 │               │
├────────┼────┼────┼────┼────┼────┼────┼────┤               │
│Features│ ██ │ ██ │ ██ │ ██ │    │    │    │               │
│Sécurité│    │    │    │ ██ │ ██ │    │    │               │
│UI/UX   │    │    │    │    │    │ ██ │ ██ │               │
└────────┴────┴────┴────┴────┴────┴────┴────┘               │
         Livrable : Toutes fonctionnalités implémentées       │

Semaine 4 : Finalisation & Déploiement
┌────────────────────────────────────────────────────────────┐
│ Jours  │ 22 │ 23 │ 24 │ 25 │ 26 │ 27 │ 28 │               │
├────────┼────┼────┼────┼────┼────┼────┼────┤               │
│Package │ ██ │ ██ │    │    │    │    │    │               │
│Tests   │    │    │ ██ │ ██ │    │    │    │               │
│Doc     │    │    │    │    │ ██ │    │    │               │
│Deploy  │    │    │    │    │    │ ██ │ ██ │               │
└────────┴────┴────┴────┴────┴────┴────┴────┘               │
         Livrable : Application production + déploiement      │
```

### 9.2 Jalons et Livrables

| Jalon | Date | Livrable | Critères de Validation |
|-------|------|----------|------------------------|
| **M1 : Prototype** | Fin S2 | Application MVP | [ ] Import CSV fonctionnel<br>[ ] Fusion basique<br>[ ] 1 graphique<br>[ ] Export PDF |
| **M2 : Alpha** | Fin S3 | Version complète | [ ] Toutes fonctionnalités<br>[ ] Tests passés<br>[ ] Sécurité implémentée |
| **M3 : Beta** | S4 J25 | Version finale | [ ] Tests utilisateurs OK<br>[ ] Documentation complète<br>[ ] Package portable |
| **M4 : Release** | S4 J28 | Déploiement | [ ] Déployé utilisateurs pilotes<br>[ ] Formation effectuée<br>[ ] Support actif |

### 9.3 Dépendances Critiques

**Bloquants potentiels :**
- ⚠️ Accès à des fichiers de données réelles (pour tests)
- ⚠️ Validation DSI/IT (peut retarder planning)
- ⚠️ Disponibilité utilisateurs pilotes (tests S3)
- ⚠️ Certificat code signing (optionnel mais recommandé)

**Plan de contingence :**
- Données test : Générer données synthétiques si besoin
- Validation DSI : Prévoir réunion semaine 1
- Utilisateurs pilotes : Identifier dès maintenant
- Certificat : Procéder sans si délai trop long (warning utilisateur)

---

## 10. Coûts et Ressources

### 10.1 Coûts de Développement

| Poste | Détail | Coût |
|-------|--------|------|
| **Développement** | 20 jours × 0€ (interne ou bénévole) | 0€ |
| **Outils/Licences** | Tout open source (Electron, Python, etc.) | 0€ |
| **Certificat code signing** | Windows Authenticode (optionnel) | 100-300€/an |
| **Serveur test** | Non requis (local) | 0€ |
| **Formation** | Interne | 0€ |

**Total Phase Développement : 0€ (ou 100-300€ si certificat)**

### 10.2 Coûts Récurrents

| Poste | Fréquence | Coût Annuel |
|-------|-----------|-------------|
| **Hébergement** | - | 0€ (application locale) |
| **Licences logicielles** | - | 0€ (open source) |
| **Maintenance** | ~12 jours/an | 0€ (interne) |
| **Support utilisateurs** | Variable | 0€ (interne) |
| **Mises à jour certificat** | Annuel | 100-300€ |

**Total Année 1 : 100-300€**
**Total Années suivantes : 100-300€**

### 10.3 ROI Estimé

**Calcul Conservateur (10 utilisateurs) :**

#### Gains Annuels

**Temps économisé :**
```
10 utilisateurs × 3 heures/semaine × 50 semaines × 30€/heure
= 45 000€ par an
```

**Réduction erreurs :**
```
5 erreurs/an évitées × 2 heures correction × 30€/heure
= 300€ par an
```

**Rapidité décisions :** Inestimable (avantage compétitif)

**TOTAL GAINS : 45 300€ par an**

#### Coûts Annuels

```
Développement (an 1) : 0€ (interne) ou 300€ (certificat)
Maintenance : 0€ (interne)
Licences : 0€ (open source)

TOTAL COÛTS : 300€ par an
```

#### ROI

```
ROI = (Gains - Coûts) / Coûts
    = (45 300€ - 300€) / 300€
    = 45 000€ / 300€
    = 15 000%
```

### 🚀 ROI : **15 000%**

**Retour sur investissement en moins d'une semaine !**
**Amortissement : 2.4 jours**

*Note : Calcul conservateur, bénéfices réels probablement supérieurs*

### 10.4 Ressources Humaines

**Équipe projet :**

| Rôle | Charge | Profil |
|------|--------|--------|
| **Développeur Full-Stack** | 20 jours (S1-S4) | Python + JavaScript |
| **Product Owner** | 2-3 jours | Définition besoins |
| **Testeur/QA** | 3 jours (S3-S4) | Tests fonctionnels |
| **Responsable IT** | 1 jour | Validation sécurité |
| **Formateur** | 1 jour | Formation utilisateurs |

**Total : ~1 personne full-time pendant 4 semaines**

---

## 11. Risques et Mitigation

### 11.1 Matrice Risques

| ID | Risque | Prob. | Impact | Mitigation | Propriétaire |
|----|--------|-------|--------|------------|--------------|
| R-01 | Dépassement planning | Moyenne | Moyen | Buffer 20% dans planning | PM |
| R-02 | Bugs critiques post-release | Moyenne | Élevé | Tests rigoureux + pilote | QA |
| R-03 | Adoption faible utilisateurs | Faible | Élevé | Formation + UX simple | PO |
| R-04 | Performance insuffisante | Faible | Moyen | Tests perf + optimisation | Dev |
| R-05 | Problème sécurité découvert | Faible | Critique | Audit code + tests sécu | IT |
| R-06 | Incompatibilité OS/matériel | Moyenne | Moyen | Tests multi-environnements | QA |
| R-07 | Données corrompues | Faible | Critique | Backups auto + validation | Dev |
| R-08 | Refus validation DSI | Faible | Bloquant | Impliquer DSI dès S1 | PM |

### 11.2 Plan de Gestion Risques

**Risque R-01 : Dépassement Planning**

**Plan d'action :**
1. Priorisation stricte fonctionnalités (MVP first)
2. Daily standups (suivi avancement)
3. Buffer 20% dans estimations
4. Si retard > 3 jours : réduire scope ou ajouter ressource

**Risque R-05 : Problème Sécurité**

**Plan d'action :**
1. Audit code sécurité (semaine 3)
2. Tests pénétration basiques
3. Si vulnérabilité critique : patch immédiat + communication
4. Plan de réponse incidents documenté

**Risque R-08 : Refus Validation DSI**

**Plan d'action :**
1. Réunion validation DSI en semaine 1
2. Présentation architecture + sécurité
3. Intégration feedback DSI dans développement
4. Validation checkpoint semaine 2 et 3

---

## 12. Points de Validation

### 12.1 Checklist Validation Technique

**Architecture :**
- [ ] Architecture conforme aux besoins
- [ ] Stack technologique validée
- [ ] Scalabilité suffisante (500K lignes)
- [ ] Pas de dépendance externe critique

**Sécurité :**
- [ ] Chiffrement AES-256 validé
- [ ] Isolation réseau confirmée
- [ ] Logs d'audit complets
- [ ] Conformité RGPD vérifiée
- [ ] Plan réponse incidents documenté

**Performance :**
- [ ] Import 100K lignes < 10s
- [ ] Fusion 3 fichiers < 15s
- [ ] Rendu graphiques < 2s
- [ ] Export PDF < 5s

**Compatibilité :**
- [ ] Windows 10/11 testé
- [ ] macOS 10.14+ testé (optionnel)
- [ ] Config minimale (4GB RAM) validée

### 12.2 Checklist Validation Fonctionnelle

**Fonctionnalités Critiques :**
- [ ] Import CSV/Excel/JSON fonctionnel
- [ ] Fusion automatique opérationnelle
- [ ] Déduplication efficace
- [ ] Graphiques interactifs fluides
- [ ] Export PDF professionnel
- [ ] Interface intuitive (test utilisateur novice)

**Utilisabilité :**
- [ ] Installation < 2 min (test utilisateur)
- [ ] Première utilisation autonome < 5 min
- [ ] Messages d'erreur clairs
- [ ] Pas de crash sur actions normales

### 12.3 Checklist Validation Déploiement

**Package :**
- [ ] Package portable créé et testé
- [ ] Taille < 200 MB
- [ ] Checksum SHA256 publié
- [ ] README inclus
- [ ] Documentation complète

**Formation :**
- [ ] Guide utilisateur rédigé
- [ ] Vidéo tutoriel enregistrée
- [ ] FAQ complétée
- [ ] Formation pilote effectuée

**Support :**
- [ ] Canaux support définis
- [ ] SLA documentés
- [ ] Plan escalade clair
- [ ] Monitoring retours actif

### 12.4 Checklist de Décision Globale

**Avant de Démarrer le Projet, Validez :**

#### Contexte
- [ ] Les contraintes identifiées correspondent à votre situation réelle
- [ ] Le ROI de 15 000% est pertinent pour votre organisation
- [ ] L'approche portable sans droits admin est validée par DSI/IT
- [ ] Les utilisateurs finaux sont bien des profils novices

#### Budget
- [ ] Budget de 0-300€ est acceptable pour le développement
- [ ] Coûts récurrents (100-300€/an) sont validés
- [ ] ROI justifie l'investissement selon vos critères financiers
- [ ] Pas de budget caché ou coût additionnel non prévu

#### Planning
- [ ] Délai de 4 semaines est acceptable pour votre besoin
- [ ] Phase prototype (2 semaines) est envisageable
- [ ] Ressources disponibles pour tests et validation
- [ ] Fenêtre de déploiement identifiée

#### Données
- [ ] 1-2 fichiers d'exemple disponibles (anonymisés si nécessaire)
- [ ] Format et structure des données bien connus
- [ ] KPI prioritaires identifiés (3-5 minimum)
- [ ] Volume de données estimé (< 500K lignes)

#### Organisation
- [ ] Utilisateur pilote identifié pour tests (semaine 3)
- [ ] DSI/IT informée et disponible pour validation (semaine 1)
- [ ] Support interne prévu post-déploiement (1er mois)
- [ ] Sponsor projet identifié et engagé

#### Sécurité & Conformité
- [ ] Politique sécurité entreprise compatible avec solution portable
- [ ] Besoin de chiffrement clarifié (optionnel par défaut)
- [ ] Conformité RGPD validée par DPO si applicable
- [ ] Plan de gestion des risques accepté

**✅ Si toutes les cases cochées → GO pour le prototype !**

### 12.5 Décisions Attendues

**Validation Go/No-Go :**

| Décideur | Validation | Critères |
|----------|------------|----------|
| **DSI/IT** | Architecture & Sécurité | Conformité politique sécu entreprise |
| **Direction Métier** | Fonctionnalités | Répond aux besoins opérationnels |
| **Finance** | Budget | Coûts acceptables |
| **Product Owner** | Planning | Délai acceptable |

**Décision finale :**
- [ ] ✅ **GO** : Autorisation démarrage projet
- [ ] ⚠️ **GO conditionnel** : OK avec ajustements (préciser lesquels)
- [ ] ❌ **NO-GO** : Refus projet (préciser raisons)

---

## 13. Annexes

### Annexe A : Glossaire

| Terme | Définition |
|-------|------------|
| **KPI** | Key Performance Indicator - Indicateur clé de performance |
| **ETL** | Extract-Transform-Load - Processus de traitement données |
| **CSV** | Comma-Separated Values - Format fichier texte avec délimiteurs |
| **IPC** | Inter-Process Communication - Communication entre processus |
| **RGPD** | Règlement Général sur la Protection des Données |
| **AES-256** | Advanced Encryption Standard 256-bit - Algorithme chiffrement |
| **SHA-256** | Secure Hash Algorithm 256-bit - Fonction de hachage |

### Annexe B : Références

**Standards & Normes :**
- ISO/IEC 27001 : Sécurité de l'information
- OWASP Top 10 : Vulnérabilités web
- NIST Cybersecurity Framework
- RGPD (Règlement UE 2016/679)

**Technologies :**
- Electron : https://www.electronjs.org
- React : https://react.dev
- Pandas : https://pandas.pydata.org
- SQLite : https://www.sqlite.org

### Annexe C : Contacts

| Rôle | Nom | Email | Téléphone |
|------|-----|-------|-----------|
| **Chef de Projet** | [À compléter] | | |
| **Responsable IT** | [À compléter] | | |
| **Product Owner** | [À compléter] | | |
| **Support Utilisateurs** | [À compléter] | | |

---

## 14. Signature et Approbation

**Préparé par :**

Nom : ___________________________
Fonction : Architecte Solution
Date : 2024-01-14
Signature : ___________________________

**Approuvé par :**

| Nom | Fonction | Date | Signature |
|-----|----------|------|-----------|
| | DSI/Responsable IT | | |
| | Direction Métier | | |
| | Responsable Sécurité | | |
| | Product Owner | | |

---

**Fin du document**

**Version :** 2.0 (Mise à jour avec RECOMMANDATION_FINALE_V2)
**Statut :** ⏳ En attente de validation
**Prochaine Action :** Réunion de validation avec comité de pilotage

---

## Changelog Version 2.0

**Améliorations apportées depuis v1.0 :**

1. **Chiffrement clarifié** : Passage de "toujours actif" à "optionnel par défaut" avec interface utilisateur
2. **ROI détaillé** : Ajout du calcul complet (15 000%) avec amortissement en 2.4 jours
3. **Comparaison alternatives** : Tableau enrichi avec Power BI, Tableau, Apache Superset
4. **Benchmarks performance** : Section complète avec impact chiffrement mesuré (3-5%)
5. **RGPD renforcé** : Articles précis du règlement (Art. 5, 17, 20, 30, 32)
6. **Checklist décision globale** : 6 catégories de validation avant démarrage
7. **Analyse risques** : Propriétaires et plans d'action définis
8. **Section chiffrement dédiée** : Quand l'activer, interface utilisateur proposée

---

*Ce document est confidentiel et destiné uniquement aux parties prenantes du projet.*
