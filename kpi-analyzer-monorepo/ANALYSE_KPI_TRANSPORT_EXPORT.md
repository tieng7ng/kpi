# Analyse KPI - Fichier Transport EXPORT

**Fichier source :** `extract_377_72_260114_1438-2025_ROUTE_EXPORT_CLEAN.csv`
**Date d'analyse :** Janvier 2026

---

## 1. Vue d'ensemble du fichier

| Métrique | Valeur |
|----------|--------|
| Nombre de lignes | 12 057 |
| Nombre de colonnes | 26 |
| Période couverte | 11/04/2024 → 30/12/2025 |
| Type d'activité | INTER EXPORT (100%) |

---

## 2. Structure des colonnes

### 2.1 Colonnes Temporelles

| Colonne | Description | Format |
|---------|-------------|--------|
| `Date de récépissé` | Date d'enregistrement de l'envoi | JJ/MM/AAAA |
| `Date d'exploitation` | Date de traitement opérationnel | JJ/MM/AAAA |
| `bordereau arrivage date` | Date d'arrivée effective | JJ/MM/AAAA |
| `Date de départ (création du bordereau)` | Date de départ physique | JJ/MM/AAAA |

### 2.2 Colonnes Identifiants

| Colonne | Description | Valeurs uniques |
|---------|-------------|-----------------|
| `Récépissé` | Numéro de récépissé | ~12 000 |
| `Num. de bordereau` | Numéro de bordereau transport | ~1 400 |
| `Bordereau arrivée EDI` | Référence EDI arrivée | ~5 500 |

### 2.3 Colonnes Financières

| Colonne | Min | Max | Total |
|---------|-----|-----|-------|
| `Montant Net HT` | 0 € | 23 950 € | **2 941 131 €** |
| `Montant achat sous-traitance` | -92 € | 6 276 € | 2 259 739 € |
| `Montant achat ST sans coût interne` | -250 € | 5 886 € | 1 601 200 € |
| `Coût interne` | 0 € | 1 427 € | 477 787 € |

### 2.4 Colonnes Volumétrie

| Colonne | Min | Max | Total |
|---------|-----|-----|-------|
| `Nombre d'UM` | 1 | 4 458 | 31 736 UM |
| `Poids` | 0 kg | 97 097 kg | **9 182 954 kg** (~9 183 T) |

### 2.5 Colonnes Catégorielles

| Colonne | Valeurs | Top valeurs |
|---------|---------|-------------|
| `Super-ligne code` | 6 | ITALIE (45%), ALLEMAGNE (28%), ESPAGNE (20%) |
| `Type donneur d'ordre` | 3 | Chargeur (84%), Confrère (16%), Agence (0.3%) |
| `Ligne départ type` | 3 | Expédition (95%), Locale (4%), Affrètement (1%) |
| `Incoterm` | 12 | DAP, EXW, FCA, CIP... |
| `Expéditeur Pays` | 18 | FR majoritaire |
| `Pays destinataire` | 47 | IT, DE, ES, PL, TN... |

---

## 3. KPIs Financiers (Priorité 1)

### 3.1 Chiffre d'Affaires

| KPI | Formule SQL | Unité |
|-----|-------------|-------|
| **CA Total Export** | `SUM(Montant Net HT)` | € |
| **CA Moyen par Envoi** | `AVG(Montant Net HT)` | € |
| **CA Mensuel** | `SUM(Montant Net HT) GROUP BY mois` | € |
| **CA par Destination** | `SUM(Montant Net HT) GROUP BY Pays destinataire` | € |
| **CA par Super-ligne** | `SUM(Montant Net HT) GROUP BY Super-ligne code` | € |
| **CA par Client** | `SUM(Montant Net HT) GROUP BY Nom du Donneur d'ordre` | € |
| **CA par Type Client** | `SUM(Montant Net HT) GROUP BY Type donneur d'ordre` | € |
| **CA par Correspondant** | `SUM(Montant Net HT) GROUP BY Nom du Correspondant` | € |

### 3.2 Marge Brute

**Formule de calcul :**
```
Marge Brute = Montant Net HT - Montant achat sous-traitance
```

| KPI | Formule SQL | Unité |
|-----|-------------|-------|
| **Marge Totale** | `SUM(Montant Net HT - Montant achat ST)` | € |
| **Taux de Marge Global** | `(Marge Totale / CA Total) × 100` | % |
| **Marge par Destination** | `SUM(Marge) GROUP BY Pays destinataire` | € |
| **Marge par Super-ligne** | `SUM(Marge) GROUP BY Super-ligne code` | € |
| **Marge par Client** | `SUM(Marge) GROUP BY Nom du Donneur d'ordre` | € |

### 3.3 Coûts

| KPI | Formule SQL | Unité |
|-----|-------------|-------|
| **Coût ST Total** | `SUM(Montant achat sous-traitance)` | € |
| **Coût Interne Total** | `SUM(Coût interne)` | € |
| **Ratio Coût ST / CA** | `(Coût ST / CA) × 100` | % |
| **Coût Moyen par Envoi** | `AVG(Montant achat sous-traitance)` | € |

---

## 4. KPIs Volumétrie (Priorité 2)

### 4.1 Poids / Tonnage

| KPI | Formule SQL | Unité |
|-----|-------------|-------|
| **Tonnage Total** | `SUM(Poids) / 1000` | T |
| **Poids Moyen par Envoi** | `AVG(Poids)` | kg |
| **Tonnage Mensuel** | `SUM(Poids) GROUP BY mois` | T |
| **Tonnage par Destination** | `SUM(Poids) GROUP BY Pays destinataire` | T |
| **Tonnage par Super-ligne** | `SUM(Poids) GROUP BY Super-ligne code` | T |

### 4.2 Unités de Manutention

| KPI | Formule SQL | Unité |
|-----|-------------|-------|
| **Total UM** | `SUM(Nombre d'UM)` | UM |
| **UM Moyen par Envoi** | `AVG(Nombre d'UM)` | UM |
| **Poids Moyen par UM** | `SUM(Poids) / SUM(Nombre d'UM)` | kg/UM |

---

## 5. KPIs Géographiques (Priorité 2)

### 5.1 Par Pays Destinataire

| KPI | Formule SQL |
|-----|-------------|
| **Top 10 Pays (CA)** | `SUM(CA) GROUP BY Pays destinataire ORDER BY DESC LIMIT 10` |
| **Top 10 Pays (Tonnage)** | `SUM(Poids) GROUP BY Pays destinataire ORDER BY DESC LIMIT 10` |
| **Nb Envois par Pays** | `COUNT(*) GROUP BY Pays destinataire` |

### 5.2 Par Super-ligne (Zone)

| Zone | Description |
|------|-------------|
| ITALIE | 5 437 envois (45%) |
| ALLEMAGNE | 3 369 envois (28%) |
| ESPAGNE | 2 358 envois (20%) |
| TUNISIE | 678 envois (6%) |
| MONACO | 5 envois (0.04%) |

| KPI | Formule SQL |
|-----|-------------|
| **CA par Zone** | `SUM(CA) GROUP BY Super-ligne code` |
| **Marge par Zone** | `SUM(Marge) GROUP BY Super-ligne code` |
| **Tonnage par Zone** | `SUM(Poids) GROUP BY Super-ligne code` |

---

## 6. KPIs Clients (Priorité 1)

### 6.1 Par Donneur d'Ordre

| KPI | Formule SQL |
|-----|-------------|
| **Top 10 Clients (CA)** | `SUM(CA) GROUP BY Nom du Donneur d'ordre ORDER BY DESC LIMIT 10` |
| **Top 10 Clients (Volume)** | `SUM(Poids) GROUP BY Nom du Donneur d'ordre ORDER BY DESC LIMIT 10` |
| **Nb Clients Actifs** | `COUNT(DISTINCT Nom du Donneur d'ordre)` |
| **CA Moyen par Client** | `AVG(SUM(CA) GROUP BY client)` |

### 6.2 Par Type de Donneur d'Ordre

| Type | Nb Envois | % |
|------|-----------|---|
| Chargeur | 10 088 | 84% |
| Confrère | 1 927 | 16% |
| Agence | 42 | 0.3% |

| KPI | Formule SQL |
|-----|-------------|
| **CA par Type** | `SUM(CA) GROUP BY Type donneur d'ordre` |
| **Marge par Type** | `SUM(Marge) GROUP BY Type donneur d'ordre` |
| **Taux Marge par Type** | `(Marge / CA × 100) GROUP BY Type` |

---

## 7. KPIs Partenaires (Priorité 3)

### 7.1 Par Correspondant

| KPI | Formule SQL |
|-----|-------------|
| **Top 10 Correspondants (CA)** | `SUM(CA) GROUP BY Nom du Correspondant ORDER BY DESC LIMIT 10` |
| **Nb Correspondants Actifs** | `COUNT(DISTINCT Nom du Correspondant)` |
| **CA Moyen par Correspondant** | `AVG(SUM(CA) GROUP BY correspondant)` |

---

## 8. KPIs Temporels (Priorité 1)

### 8.1 Évolution Mensuelle

| KPI | Formule SQL |
|-----|-------------|
| **CA Mensuel** | `SUM(CA) GROUP BY strftime('%Y-%m', Date de récépissé)` |
| **Marge Mensuelle** | `SUM(Marge) GROUP BY strftime('%Y-%m', Date)` |
| **Tonnage Mensuel** | `SUM(Poids) GROUP BY strftime('%Y-%m', Date)` |
| **Nb Envois Mensuel** | `COUNT(*) GROUP BY strftime('%Y-%m', Date)` |

### 8.2 Délais

| KPI | Formule SQL |
|-----|-------------|
| **Délai Moyen Traitement** | `AVG(Date exploitation - Date récépissé)` |
| **Délai Moyen Transport** | `AVG(Date arrivage - Date départ)` |

---

## 9. KPIs Opérationnels (Priorité 3)

### 9.1 Par Type de Ligne

| Type | Nb | % |
|------|-----|---|
| Expédition | 11 469 | 95% |
| Locale - Livraison | 487 | 4% |
| Affrètement | 98 | 1% |

| KPI | Formule SQL |
|-----|-------------|
| **CA par Type Ligne** | `SUM(CA) GROUP BY Ligne départ type` |
| **Marge par Type Ligne** | `SUM(Marge) GROUP BY Ligne départ type` |

### 9.2 Par Incoterm

| KPI | Formule SQL |
|-----|-------------|
| **Répartition par Incoterm** | `COUNT(*) GROUP BY Incoterm` |
| **CA par Incoterm** | `SUM(CA) GROUP BY Incoterm` |

---

## 10. KPIs de Performance

### 10.1 Ratios

| KPI | Formule | Interprétation |
|-----|---------|----------------|
| **CA par Tonne** | `CA Total / Tonnage Total` | Valeur moyenne transportée |
| **CA par UM** | `CA Total / Total UM` | Valeur par unité |
| **Marge par Tonne** | `Marge Totale / Tonnage Total` | Rentabilité au kg |
| **Taux de Sous-traitance** | `Coût ST / CA × 100` | Part externalisée |

### 10.2 Valeurs Estimées (fichier actuel)

| KPI | Valeur |
|-----|--------|
| CA Total | ~2.94 M€ |
| Tonnage Total | ~9 183 T |
| CA par Tonne | ~320 €/T |
| Marge Brute | ~681 k€ (CA - ST) |
| Taux de Marge | ~23% |

---

## 11. Visualisations Recommandées

### 11.1 Dashboard Export

| Graphique | Type | Données |
|-----------|------|---------|
| **KPIs Header** | 4 Cards | CA, Marge, Tonnage, Nb Envois |
| **Évolution CA/Marge** | ComposedChart | Mensuel |
| **Top Destinations** | BarChart Horizontal | Top 10 pays par CA |
| **Répartition Zones** | PieChart | CA par Super-ligne |
| **Top Clients** | BarChart | Top 10 clients |

### 11.2 Comparaison Import vs Export

| Métrique | IMPORT | EXPORT |
|----------|--------|--------|
| Direction | Entrée FR | Sortie FR |
| Pays origine | Multiple | FR |
| Pays destination | FR | Multiple (47) |
| Super-lignes | À analyser | 6 zones |

---

## 12. Implémentation Suggérée

### 12.1 Nouveaux Endpoints API

```
GET /api/transport/export/stats
GET /api/transport/export/graph/revenue
GET /api/transport/export/graph/distribution?type=destination
GET /api/transport/export/graph/distribution?type=zone
GET /api/transport/export/graph/distribution?type=client
```

### 12.2 Détection Automatique

Le fichier EXPORT peut être détecté par :
- Colonne `Libellé produit vendu` = "INTER EXPORT"
- Ou `Super-ligne code` contient des pays de destination

---

**Document généré le :** Janvier 2026
**Fichier analysé :** 12 057 lignes (après déduplication)
