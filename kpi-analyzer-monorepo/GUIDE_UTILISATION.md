# Guide d'Utilisation - KPI Analyzer

## Vue d'ensemble

KPI Analyzer est une application desktop permettant d'analyser vos données business via des tableaux de bord interactifs. L'application supporte deux modes de visualisation :

- **Mode Général** : Dashboard personnalisable pour fichiers CSV/Excel/JSON simples
- **Mode Transport** : Dashboard dédié au suivi logistique (détecté automatiquement)

---

## 1. Navigation

### 1.1 Pages principales

| Page | Accès | Description |
|------|-------|-------------|
| **Dashboard** | Page d'accueil | Visualisation des graphiques et KPIs |
| **Mes Données** | Bouton en haut à droite | Gestion des fichiers importés |

### 1.2 Basculer entre les vues

Lorsque des données Transport sont détectées, un **toggle** apparaît dans le header :

| Bouton | Vue |
|--------|-----|
| **Général** | Dashboard KPI personnalisable |
| **Transport** | Dashboard Transport pré-configuré |

Le header change dynamiquement :
- Mode Général : "KPI Analyzer - Tableau de bord de performance"
- Mode Transport : "Transport & Logistique - Suivi de la performance import/export"

---

## 2. Page "Mes Données"

### 2.1 Importer un fichier

1. Glissez-déposez votre fichier dans la zone d'import (ou cliquez pour parcourir)
2. Formats supportés : `.csv`, `.xlsx`, `.xls`, `.json`
3. L'application détecte automatiquement le type de données :
   - Si colonnes "Num. de bordereau" + "Incoterm" → **Mode Transport**
   - Sinon → **Mode Générique**

### 2.2 Fichiers importés

La liste affiche tous vos fichiers avec :
- Nom du fichier
- Date d'import
- Statut (PROCESSED, ERROR)

### 2.3 Réinitialiser les données

En bas de page, le bouton **"Réinitialiser"** permet de :
- Supprimer tous les fichiers importés
- Vider toutes les données (KPI + Transport)
- Remettre le dashboard à zéro

> **Attention** : Cette action est irréversible.

---

## 3. Dashboard - Mode Général

### 3.1 Créer un graphique

1. Cliquez sur **"Nouveau Graphique"**
2. Configurez :
   - **Titre** : Nom affiché sur le graphique
   - **Type** : Ligne, Barres, Aire, Camembert
   - **Indicateur** : Le KPI à afficher (ex: revenue, margin)
   - **Catégories** : Filtrer par région/catégorie (ex: Nord, Sud)
   - **Période** : 7j, 30j, 90j, Année, ou dates personnalisées
   - **Couleur** : Couleur principale du graphique

### 3.2 Gérer les graphiques

Chaque graphique dispose de 3 boutons :
- **Agrandir** : Voir en plein écran avec détails
- **Modifier** : Changer la configuration
- **Supprimer** : Retirer du dashboard

### 3.3 Sauvegarde automatique

La disposition de votre dashboard est sauvegardée automatiquement (localStorage).

---

## 4. Dashboard - Mode Transport

Lorsque vous importez un fichier transport, le dashboard Transport devient disponible avec des visualisations pré-configurées.

### 4.1 Bandeau de KPIs

Quatre cartes affichent les indicateurs clés :

| Carte | Description | Format |
|-------|-------------|--------|
| **Chiffre d'Affaires** | CA total (Montant Net HT) | € |
| **Marge Brute** | Marge totale + taux de marge | € (%) |
| **Volume** | Tonnage total + nombre d'envois | tonnes |
| **Panier Moyen** | CA moyen par envoi | € |

### 4.2 Graphique Évolution CA / Marge

Un graphique combiné affiche :
- **Barres bleues** : Chiffre d'affaires mensuel (axe gauche)
- **Ligne verte** : Marge brute mensuelle (axe droit)

Permet de visualiser la corrélation entre volume d'affaires et rentabilité.

### 4.3 Top 10 Clients

Un graphique en barres affiche les 10 plus gros clients (donneurs d'ordre) classés par CA.

Couleur : Violet (#8b5cf6)

### 4.4 Données analysées

| Catégorie | Champs | Utilisation |
|-----------|--------|-------------|
| **Financier** | CA, Marge Brute, Taux de Marge | Rentabilité |
| **Volumétrie** | Poids (kg), Nombre d'UM | Capacité |
| **Géographie** | Pays départ, Pays arrivée | Routes |
| **Clients** | Donneur d'ordre, Type | Segmentation |
| **Partenaires** | Correspondant | Réseau |
| **Temporel** | Dates récépissé, exploitation, arrivage | Délais |

### 4.5 Accéder aux statistiques - Guide détaillé

#### Vue d'ensemble de l'interface Transport

```
┌─────────────────────────────────────────────────────────────────────┐
│                            HEADER                                    │
│  ┌─────────┐  ┌───────────┐                      ┌──────────────┐   │
│  │ Général │  │ Transport │◀── CLIQUER ICI       │ Mes Données  │   │
│  └─────────┘  └───────────┘                      └──────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐  │
│  │ ① CA Total   │ │ ② Marge     │ │ ③ Tonnage   │ │ ④ Panier   │  │
│  │   15.2 M€    │ │   2.3 M€    │ │   12 345 T  │ │    139 €   │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────┐ ┌────────────────────┐  │
│  │ ⑤ Évolution CA vs Marge (mensuel)      │ │ ⑥ Top 10 Clients  │  │
│  │                                         │ │                    │  │
│  │   ████                                  │ │ Client A ████████ │  │
│  │   ████ ████      ●────●                 │ │ Client B ██████   │  │
│  │   ████ ████ ████●      \                │ │ Client C █████    │  │
│  │   ──────────────────────                │ │ ...               │  │
│  │   08   09   10   11   12                │ │                    │  │
│  └────────────────────────────────────────┘ └────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

#### ① CA Total (Chiffre d'Affaires)

**Ce que c'est** : Somme de tous les `Montant Net HT` de vos envois

**Comment y accéder** :
1. Cliquer sur **"Transport"** dans le header
2. Regarder la **1ère carte** en haut à gauche

**Formule** : `SUM(Montant Net HT)`

---

#### ② Marge Brute + Taux de Marge

**Ce que c'est** :
- Marge = CA - Coûts sous-traitance - Coûts internes
- Taux = Marge / CA × 100

**Comment y accéder** :
1. Dashboard Transport
2. **2ème carte** : affiche le montant + le pourcentage

**Formule** : `SUM(Montant Net HT - Montant achat ST - Coût interne)`

---

#### ③ Tonnage + Nombre d'expéditions

**Ce que c'est** :
- Tonnage = Somme des poids convertie en tonnes
- Expéditions = Nombre total de lignes

**Comment y accéder** :
1. Dashboard Transport
2. **3ème carte** : "12 345 T" avec "109 542 expéditions" en dessous

**Formule** : `SUM(Poids) / 1000` et `COUNT(*)`

---

#### ④ Panier Moyen (Performance)

**Ce que c'est** : CA moyen par envoi

**Comment y accéder** :
1. Dashboard Transport
2. **4ème carte** à droite : "139 €" avec "Panier moyen par envoi"

**Formule** : `SUM(Montant Net HT) / COUNT(*)`

---

#### ⑤ Évolution Mensuelle CA vs Marge

**Ce que c'est** : Graphique combiné montrant l'évolution sur plusieurs mois

**Comment y accéder** :
1. Dashboard Transport
2. **Grand graphique central** (occupe 2/3 de la largeur)

**Lecture** :
- **Barres bleues** = CA du mois (lire sur l'axe gauche)
- **Ligne verte avec points** = Marge du mois (lire sur l'axe droit)

**Formule** : `SUM(Montant Net HT) GROUP BY mois`

**Astuce** : Survolez une barre ou un point pour voir la valeur exacte dans l'info-bulle.

---

#### ⑥ Top 10 Clients par CA

**Ce que c'est** : Les 10 donneurs d'ordre générant le plus de chiffre d'affaires

**Comment y accéder** :
1. Dashboard Transport
2. **Graphique à droite** : barres violettes horizontales

**Lecture** : Le client en haut est celui avec le plus gros CA.

**Formule** : `SUM(Montant Net HT) GROUP BY Donneur d'ordre ORDER BY DESC LIMIT 10`

---

#### Tableau récapitulatif

| # | Statistique | Emplacement | Formule |
|---|-------------|-------------|---------|
| ① | CA Total | Carte 1 (haut gauche) | `SUM(CA)` |
| ② | Marge Brute | Carte 2 | `SUM(CA - ST - Interne)` |
| ② | Taux de Marge | Carte 2 (sous-texte) | `Marge / CA × 100` |
| ③ | Tonnage | Carte 3 | `SUM(Poids) / 1000` |
| ③ | Nb Expéditions | Carte 3 (sous-texte) | `COUNT(*)` |
| ④ | Panier Moyen | Carte 4 | `CA / Nb Expéditions` |
| ⑤ | CA Mensuel | Graphique central (barres) | `SUM(CA) GROUP BY mois` |
| ⑤ | Marge Mensuelle | Graphique central (ligne) | `SUM(Marge) GROUP BY mois` |
| ⑥ | Top Clients | Graphique droite | `SUM(CA) GROUP BY client LIMIT 10` |

---

#### Statistiques disponibles via API uniquement

Ces statistiques existent dans le système mais ne sont pas encore affichées dans l'interface :

| Statistique | Endpoint API | Commande |
|-------------|--------------|----------|
| CA par Pays | `/transport/graph/distribution?type=country` | `curl http://localhost:8000/api/transport/graph/distribution?type=country` |

---

## 5. API Endpoints

### 5.1 Endpoints généraux

```bash
# Santé du serveur
curl http://localhost:8000/api/health

# Liste des fichiers importés
curl http://localhost:8000/api/upload/files

# Résumé KPI (mode générique)
curl http://localhost:8000/api/kpi/summary

# Réinitialisation complète
curl -X POST http://localhost:8000/api/reset
```

### 5.2 Endpoints Transport

```bash
# Stats globales (CA, Marge, Tonnage, Envois)
curl http://localhost:8000/api/transport/stats

# Évolution CA/Marge mensuelle
curl http://localhost:8000/api/transport/graph/revenue

# Répartition par client
curl http://localhost:8000/api/transport/graph/distribution?type=client
```

---

## 6. Résolution de problèmes

| Problème | Solution |
|----------|----------|
| Fichier refusé (duplicate) | Le fichier a déjà été importé (même checksum) |
| Toggle Transport absent | Aucune donnée transport détectée, vérifiez le format du fichier |
| Graphique vide | Vérifiez que l'indicateur et les catégories correspondent à vos données |
| Données non affichées | Allez dans "Mes Données" pour vérifier le statut du fichier |
| Valeurs à 0 | Les données sont peut-être en cours de chargement, patientez |

---

## 7. Raccourcis

| Action | Comment |
|--------|---------|
| Basculer vue | Cliquez sur "Général" ou "Transport" dans le header |
| Retour Dashboard | Cliquez "Retour Dashboard" depuis Mes Données |
| Rafraîchir données | Les données se rafraîchissent automatiquement après import |
| Reset complet | Mes Données → Réinitialiser → Confirmer |

---

## 8. Architecture technique

```
┌─────────────────────────────────────────────────────────┐
│                    ELECTRON APP                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  Dashboard  │  │  Transport  │  │    Mes Données  │  │
│  │  (Général)  │  │  Dashboard  │  │    (Import)     │  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
└─────────┼────────────────┼──────────────────┼───────────┘
          │                │                  │
          ▼                ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                  PYTHON API (FastAPI)                    │
│  /kpi/summary    /transport/stats    /upload            │
│                  /transport/graph/*   /reset            │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                    SQLite Database                       │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  raw_imports │  │  unified_kpi │  │transport_entries│ │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

**Version** : 2.2 (Guide statistiques détaillé)
**Dernière mise à jour** : Janvier 2026
