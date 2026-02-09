# Analyse KPI - Données Transport Import 2024-2025

**Fichier source** : extract_377_71_260114_1428 - 2025 ROUTE IMPORT.csv
**Date d'analyse** : 2026-01-15
**Volume de données** : 109 542 lignes
**Période couverte** : Août 2024 - Décembre 2025
**Secteur** : Transport & Logistique - Import international

---

## 📊 Vue d'Ensemble du Dataset

### Structure des Données

**Format** : CSV (séparateur point-virgule)
**Encodage** : UTF-8 avec BOM
**Qualité** : Données structurées avec doublons apparents (lignes identiques multiples)

### Champs Disponibles (25 colonnes)

| # | Nom du Champ | Type | Description |
|---|-------------|------|-------------|
| 1 | Date de récépissé | Date | Date de réception du bordereau |
| 2 | Date d'exploitation | Date | Date effective de traitement |
| 3 | Récépissé | Texte | Numéro de récépissé |
| 4 | Libellé produit vendu | Texte | Type de service (INTER IMPORT) |
| 5 | Ligne départ code | Texte | Code de la ligne de départ |
| 6 | Super-ligne code | Texte | Code super-ligne (souvent vide) |
| 7 | Bordereau arrivée EDI | Texte | Numéro EDI du bordereau |
| 8 | Bordereau arrivage date | Date | Date d'arrivage |
| 9 | Num. de bordereau | Entier | Numéro de bordereau |
| 10 | Date de départ | Date | Date de création du bordereau |
| 11 | Nom du Donneur d'ordre | Texte | Client donneur d'ordre |
| 12 | Type donneur d'ordre | Texte | Confrère/Chargeur |
| 13 | Expéditeur Pays | Texte | Code pays expéditeur (IT, FR, etc.) |
| 14 | Pays destinataire | Texte | Code pays destinataire |
| 15 | Nombre d'UM | Entier | Unités de Manutention |
| 16 | Poids | Décimal | Poids en kg |
| 17 | **Montant Net HT** | Décimal | Chiffre d'affaires HT |
| 18 | **Montant achat sous-traitance** | Décimal | Coût total sous-traitance |
| 19 | Montant achat ST sans coût interne | Décimal | Sous-traitance externe |
| 20 | **Coût interne** | Décimal | Coût opérationnel interne |
| 21 | Incoterm | Texte | Termes commerciaux (DAP, etc.) |
| 22 | Pays du Remettant | Texte | Pays d'origine |
| 23 | Nom du Correspondant | Texte | Partenaire local |
| 24 | Ligne départ type | Texte | Type de ligne (Expédition, Affretement, etc.) |
| 25 | Code ligne arrivée | Texte | Code ligne destination |

---

## 🎯 KPIs Financiers (Priorité 1)

### 1. Chiffre d'Affaires

**Champ source** : `Montant Net HT`

#### KPIs Dérivés

| KPI | Formule | Unité | Utilité |
|-----|---------|-------|---------|
| **CA Total** | SUM(Montant Net HT) | € | Volume d'affaires global |
| **CA Moyen par Envoi** | AVG(Montant Net HT) | € | Valeur moyenne d'une expédition |
| **CA Mensuel** | SUM(Montant Net HT) GROUP BY mois | € | Évolution mensuelle |
| **CA par Donneur d'Ordre** | SUM(Montant Net HT) GROUP BY Donneur d'ordre | € | Top clients |
| **CA par Pays Origine** | SUM(Montant Net HT) GROUP BY Expéditeur Pays | € | Répartition géographique |
| **CA par Type de Service** | SUM(Montant Net HT) GROUP BY Ligne départ type | € | Mix produit |
| **CA par Correspondant** | SUM(Montant Net HT) GROUP BY Correspondant | € | Performance partenaires |

#### Visualisations Recommandées
- 📈 **Ligne** : Évolution CA mensuel
- 📊 **Barre** : Top 10 donneurs d'ordre
- 🥧 **Camembert** : Répartition CA par pays
- 📍 **Aire** : Tendance CA cumulé

---

### 2. Rentabilité & Marges

**Champs sources** : `Montant Net HT`, `Montant achat sous-traitance`, `Coût interne`

#### Calculs Intermédiaires

```
Coût Total = Montant achat sous-traitance + Coût interne
Marge Brute = Montant Net HT - Coût Total
Taux de Marge = (Marge Brute / Montant Net HT) × 100
```

#### KPIs Dérivés

| KPI | Formule | Unité | Utilité |
|-----|---------|-------|---------|
| **Marge Brute Totale** | SUM(CA - Coûts) | € | Profitabilité globale |
| **Taux de Marge Moyen** | AVG((CA - Coûts) / CA × 100) | % | Rentabilité moyenne |
| **Marge par Envoi** | AVG(CA - Coûts) | € | Profitabilité unitaire |
| **Taux de Marge par Client** | Marge / CA par Donneur d'ordre | % | Clients rentables |
| **Taux de Marge par Route** | Marge / CA par Pays Origine → Destination | % | Routes profitables |
| **Coût de Sous-Traitance %** | (ST / CA) × 100 | % | Part des coûts externes |
| **Coût Interne %** | (Coût interne / CA) × 100 | % | Part des coûts internes |

#### Alertes à Créer
- 🔴 Taux de marge < 10% (non rentable)
- 🟠 Taux de marge entre 10-20% (faible)
- 🟢 Taux de marge > 20% (bon)

---

### 3. Coûts & Achats

**Champs sources** : `Montant achat sous-traitance`, `Coût interne`

#### KPIs Dérivés

| KPI | Formule | Unité | Utilité |
|-----|---------|-------|---------|
| **Coût Total** | SUM(Sous-traitance + Interne) | € | Dépenses totales |
| **Coût de ST Moyen** | AVG(Montant achat sous-traitance) | € | Coût externe par envoi |
| **Coût Interne Moyen** | AVG(Coût interne) | € | Coût interne par envoi |
| **Ratio ST / Interne** | ST / Interne | ratio | Balance make or buy |
| **Coût au Kg** | Coût Total / Poids | €/kg | Efficience logistique |
| **Coût par UM** | Coût Total / Nombre UM | €/UM | Coût unitaire manutention |

---

## 📦 KPIs Opérationnels (Priorité 2)

### 4. Volumétrie & Capacité

**Champs sources** : `Nombre d'UM`, `Poids`

#### KPIs Dérivés

| KPI | Formule | Unité | Utilité |
|-----|---------|-------|---------|
| **Nombre Total d'Envois** | COUNT(*) après déduplication | envois | Volume d'activité |
| **Total UM Traitées** | SUM(Nombre d'UM) | UM | Charge manutention |
| **Poids Total Transporté** | SUM(Poids) | kg | Tonnage |
| **UM Moyennes par Envoi** | AVG(Nombre d'UM) | UM | Taille moyenne envoi |
| **Poids Moyen par Envoi** | AVG(Poids) | kg | Poids moyen |
| **Poids Moyen par UM** | SUM(Poids) / SUM(UM) | kg/UM | Densité moyenne |
| **Envois par Jour** | COUNT(*) GROUP BY date | envois/jour | Cadence journalière |
| **Tonnage Mensuel** | SUM(Poids) GROUP BY mois | tonnes | Évolution capacité |

#### Visualisations Recommandées
- 📈 **Ligne** : Évolution tonnage mensuel
- 📊 **Barre** : UM par type de service
- 📍 **Aire** : Poids cumulé

---

### 5. Délais & Temps de Transit

**Champs sources** : `Date de récépissé`, `Date d'exploitation`, `Date de départ`, `Bordereau arrivage date`

#### Calculs de Délais

```
Délai Traitement = Date d'exploitation - Date de récépissé
Délai Transit = Bordereau arrivage date - Date de départ
Délai Total = Date d'exploitation - Date de départ
```

#### KPIs Dérivés

| KPI | Formule | Unité | Utilité |
|-----|---------|-------|---------|
| **Délai Moyen de Traitement** | AVG(Date exploit - Date récépissé) | jours | Réactivité admin |
| **Délai Moyen de Transit** | AVG(Date arrivée - Date départ) | jours | Performance transport |
| **Délai Total Moyen** | AVG(Date exploit - Date départ) | jours | Lead time global |
| **% Livraisons J+1** | COUNT(délai = 1) / COUNT(*) × 100 | % | Rapidité |
| **% Livraisons > 3 jours** | COUNT(délai > 3) / COUNT(*) × 100 | % | Retards |

#### Alertes à Créer
- 🔴 Délai > 5 jours
- 🟠 Délai entre 3-5 jours
- 🟢 Délai ≤ 2 jours

---

## 🌍 KPIs Géographiques (Priorité 3)

### 6. Flux par Pays & Routes

**Champs sources** : `Expéditeur Pays`, `Pays destinataire`, `Pays du Remettant`

#### KPIs Dérivés

| KPI | Formule | Unité | Utilité |
|-----|---------|-------|---------|
| **Nombre de Pays Origine** | COUNT(DISTINCT Expéditeur Pays) | pays | Couverture géographique |
| **Nombre de Pays Destination** | COUNT(DISTINCT Pays destinataire) | pays | Réseau distribution |
| **Top 5 Routes** | COUNT(*) GROUP BY (Origine → Dest) | envois | Routes principales |
| **CA par Route** | SUM(CA) GROUP BY (Origine → Dest) | € | Rentabilité des routes |
| **% IT → FR** | COUNT(IT→FR) / COUNT(*) × 100 | % | Concentration principale |
| **Diversification Géo** | Indice Herfindahl des routes | index | Concentration/diversité |

#### Exemple de Routes

```
IT → FR : Principal flux (majorité des données)
IT → MC : Monaco (flux secondaire)
FR → FR : Flux domestiques
```

---

## 👥 KPIs Clients & Partenaires (Priorité 4)

### 7. Performance Donneurs d'Ordre

**Champ source** : `Nom du Donneur d'ordre`, `Type donneur d'ordre`

#### KPIs Dérivés

| KPI | Formule | Unité | Utilité |
|-----|---------|-------|---------|
| **Nombre de Clients Actifs** | COUNT(DISTINCT Donneur d'ordre) | clients | Base client |
| **CA par Client** | SUM(CA) GROUP BY Client | € | Valeur client |
| **Top 10 Clients** | CA descendant, top 10 | € | Concentration |
| **Fréquence par Client** | COUNT(*) GROUP BY Client | envois | Fidélité |
| **Panier Moyen Client** | AVG(CA) GROUP BY Client | € | Valeur moyenne |
| **% CA Top 3 Clients** | SUM(CA top 3) / SUM(CA total) × 100 | % | Dépendance |
| **Nouveaux Clients** | COUNT(DISTINCT Client WHERE first date in period) | clients | Acquisition |

#### Segmentation Clients

```
Confrères : Autres transporteurs (réseau)
Chargeurs : Clients directs (spots)
```

---

### 8. Performance Correspondants

**Champ source** : `Nom du Correspondant`

#### KPIs Dérivés

| KPI | Formule | Unité | Utilité |
|-----|---------|-------|---------|
| **Nombre de Correspondants** | COUNT(DISTINCT Correspondant) | partenaires | Réseau |
| **Envois par Correspondant** | COUNT(*) GROUP BY Correspondant | envois | Activité |
| **CA par Correspondant** | SUM(CA) GROUP BY Correspondant | € | Performance |
| **Taux de Marge par Corresp.** | AVG(Marge) GROUP BY Correspondant | % | Rentabilité |
| **Top 5 Correspondants** | CA descendant, top 5 | € | Partenaires clés |

#### Exemples de Correspondants

```
- PROVENCE DISTRIBUTION LOG
- FRANCE EXPRESS
- FP BOIS
- MONACO LOGISTIQUE SAM
- TLC TRANSPORTS LIMOUSIN
```

---

## 🚚 KPIs Services & Produits (Priorité 5)

### 9. Mix Produit & Services

**Champs sources** : `Libellé produit vendu`, `Ligne départ type`

#### KPIs Dérivés

| KPI | Formule | Unité | Utilité |
|-----|---------|-------|---------|
| **% INTER IMPORT** | COUNT(INTER IMPORT) / COUNT(*) × 100 | % | Répartition produit |
| **CA par Type Service** | SUM(CA) GROUP BY Type | € | Mix revenus |
| **CA Expédition vs Affretement** | SUM(CA) par type | € | Balance services |
| **Marge par Type Service** | AVG(Marge) GROUP BY Type | % | Rentabilité service |

#### Types de Services Identifiés

```
- Expédition : Envois standard
- Affretement : Location véhicules
- Locale - Livraison : Distribution locale
```

---

## 📈 KPIs Tendances & Croissance (Priorité 6)

### 10. Évolution Temporelle

**Champ source** : `Date de récépissé`, `Date d'exploitation`

#### KPIs Dérivés

| KPI | Formule | Unité | Utilité |
|-----|---------|-------|---------|
| **Croissance CA MoM** | (CA mois N / CA mois N-1 - 1) × 100 | % | Croissance mensuelle |
| **Croissance CA YoY** | (CA 2025 / CA 2024 - 1) × 100 | % | Croissance annuelle |
| **Taux de Rétention Client** | Clients récurrents / Total clients | % | Fidélisation |
| **Saisonnalité** | AVG(CA) par mois de l'année | € | Patterns saisonniers |
| **Jours Ouvrés** | COUNT(DISTINCT date) | jours | Activité |
| **Tendance Marge** | Régression linéaire marge | pente | Amélioration/dégradation |

---

## 🎯 Dashboard Recommandé - Vue Synthétique

### Layout Proposition

```
┌─────────────────────────────────────────────────────┐
│  KPI Dashboard Transport Import                     │
├─────────────────┬───────────────────────────────────┤
│                 │                                   │
│  📊 CA Mensuel  │  💰 Marge Brute Mensuelle        │
│  (Ligne)        │  (Aire)                          │
│                 │                                   │
├─────────────────┼───────────────────────────────────┤
│                 │                                   │
│  🌍 CA par Pays │  👥 Top 10 Clients               │
│  (Camembert)    │  (Barre horizontale)             │
│                 │                                   │
├─────────────────┴───────────────────────────────────┤
│                                                      │
│  📦 Volumétrie (UM + Tonnage)                       │
│  (Ligne double)                                      │
│                                                      │
├──────────────────────────────────────────────────────┤
│  ⏱️ Délais Moyens par Route (Heatmap)               │
└──────────────────────────────────────────────────────┘
```

---

## 🔢 KPIs Calculés - Formules SQL

### Exemple 1 : CA Mensuel avec Marge

```sql
SELECT
    strftime('%Y-%m', "Date de récépissé") AS mois,
    COUNT(*) AS nombre_envois,
    SUM("Nombre d'UM") AS total_um,
    SUM("Poids") AS tonnage,
    SUM("Montant Net HT") AS ca_ht,
    SUM("Montant achat sous-traitance" + "Coût interne") AS cout_total,
    SUM("Montant Net HT" - "Montant achat sous-traitance" - "Coût interne") AS marge_brute,
    ROUND(
        AVG(("Montant Net HT" - "Montant achat sous-traitance" - "Coût interne") / "Montant Net HT" * 100),
        2
    ) AS taux_marge_pct
FROM unified_kpis
WHERE "Libellé produit vendu" = 'INTER IMPORT'
GROUP BY mois
ORDER BY mois;
```

### Exemple 2 : Top 10 Clients par CA

```sql
SELECT
    "Nom du Donneur d'ordre" AS client,
    "Type donneur d'ordre" AS type_client,
    COUNT(*) AS nombre_envois,
    SUM("Montant Net HT") AS ca_total,
    AVG("Montant Net HT") AS ca_moyen,
    ROUND(
        AVG(("Montant Net HT" - "Montant achat sous-traitance" - "Coût interne") / "Montant Net HT" * 100),
        2
    ) AS taux_marge_moyen_pct
FROM unified_kpis
WHERE "Nom du Donneur d'ordre" IS NOT NULL
GROUP BY client, type_client
ORDER BY ca_total DESC
LIMIT 10;
```

### Exemple 3 : Performance par Route

```sql
SELECT
    "Expéditeur Pays" || ' → ' || "Pays destinataire" AS route,
    COUNT(*) AS nombre_envois,
    SUM("Poids") / 1000.0 AS tonnage,
    SUM("Montant Net HT") AS ca_total,
    AVG("Montant Net HT") AS ca_moyen,
    AVG(julianday("Date d'exploitation") - julianday("Date de récépissé")) AS delai_moyen_jours,
    ROUND(
        AVG(("Montant Net HT" - "Montant achat sous-traitance" - "Coût interne") / "Montant Net HT" * 100),
        2
    ) AS taux_marge_pct
FROM unified_kpis
GROUP BY route
HAVING nombre_envois > 10
ORDER BY ca_total DESC
LIMIT 15;
```

---

## 🚨 Alertes & Seuils Recommandés

### Alertes Financières

| Alerte | Condition | Sévérité | Action |
|--------|-----------|----------|--------|
| Marge négative | Taux de marge < 0% | 🔴 Critique | Réviser tarifs |
| Marge faible | Taux de marge < 10% | 🟠 Avertissement | Optimiser coûts |
| CA en baisse | CA mois N < CA mois N-1 × 0.9 | 🟠 Avertissement | Analyse commerciale |
| Coût ST élevé | ST > 80% du CA | 🟠 Avertissement | Renégocier ST |

### Alertes Opérationnelles

| Alerte | Condition | Sévérité | Action |
|--------|-----------|----------|--------|
| Délai long | Délai > 5 jours | 🟠 Avertissement | Check process |
| Poids anormal | Poids > 5000 kg | ℹ️ Info | Validation |
| UM élevé | Nombre UM > 20 | ℹ️ Info | Vérification |

### Alertes Commerciales

| Alerte | Condition | Sévérité | Action |
|--------|-----------|----------|--------|
| Client inactif | Aucun envoi depuis 30j | 🟠 Avertissement | Relance |
| Nouveau client | 1ère commande | ℹ️ Info | Onboarding |
| Top client perdu | Top 10 client 0 envois sur 60j | 🔴 Critique | Urgence commerciale |

---

## 📊 Exemples de Graphiques

### 1. Évolution CA & Marge (Ligne + Aire)

```typescript
// Configuration Recharts
<ComposedChart data={monthlyData}>
  <XAxis dataKey="mois" />
  <YAxis yAxisId="left" label="CA (€)" />
  <YAxis yAxisId="right" orientation="right" label="Marge (%)" />
  <Tooltip />
  <Legend />
  <Area yAxisId="left" dataKey="ca_ht" fill="#3b82f6" stroke="#2563eb" />
  <Line yAxisId="right" dataKey="taux_marge_pct" stroke="#16a34a" strokeWidth={2} />
</ComposedChart>
```

### 2. Répartition CA par Pays (Camembert)

```typescript
<PieChart>
  <Pie
    data={countryData}
    dataKey="ca_total"
    nameKey="pays"
    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
  >
    {countryData.map((entry, index) => (
      <Cell key={index} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>
```

### 3. Top Clients (Barre Horizontale)

```typescript
<BarChart data={topClients} layout="vertical">
  <XAxis type="number" label="CA (€)" />
  <YAxis type="category" dataKey="client" width={150} />
  <Tooltip />
  <Bar dataKey="ca_total" fill="#2563eb" />
</BarChart>
```

---

## 🔍 Analyses Avancées Possibles

### 1. Analyse de Rentabilité par Segment

**Croisements intéressants** :
- Route × Type Service → Identifier les combinaisons les plus rentables
- Client × Route → Optimiser les offres par client/destination
- Période × Marge → Détecter saisonnalité de rentabilité

### 2. Prédiction & Forecasting

**Modèles possibles** :
- Régression linéaire : Prédire CA des 3 prochains mois
- Moyennes mobiles : Lisser les variations saisonnières
- Détection d'anomalies : Identifier les envois atypiques

### 3. Segmentation Clients (RFM)

**Critères** :
- **Recency** : Date du dernier envoi
- **Frequency** : Nombre d'envois sur période
- **Monetary** : CA généré

**Segmentation** :
- Champions : R=5, F=5, M=5
- Loyaux : R=4-5, F=3-5, M=3-5
- À risque : R=2-3, F=2-3, M=3-5
- Perdus : R=1, F=1-2, M=1-5

---

## 📝 Recommandations d'Utilisation

### Déduplication des Données

**Problème identifié** : Lignes en apparence identiques (probablement 1 ligne par UM)

**Solution recommandée** :
```sql
-- Agréger par bordereau pour éviter double comptage
SELECT
    "Num. de bordereau",
    "Date de récépissé",
    "Nom du Donneur d'ordre",
    SUM("Nombre d'UM") AS total_um,
    SUM("Poids") AS total_poids,
    MAX("Montant Net HT") AS ca_ht,  -- Prendre le max pour éviter multiplication
    MAX("Montant achat sous-traitance") AS cout_st
FROM unified_kpis
WHERE "Num. de bordereau" IS NOT NULL
GROUP BY "Num. de bordereau", "Date de récépissé", "Nom du Donneur d'ordre"
```

### Nettoyage des Données

**Actions recommandées** :
1. Supprimer BOM UTF-8 en début de fichier
2. Normaliser les noms de colonnes (retirer BOM, espaces)
3. Gérer les champs vides (NULL vs "")
4. Convertir virgules en points pour les décimaux
5. Standardiser les codes pays (IT, FR, MC)

### Import dans l'Application

**Mapping des colonnes** :
```json
{
  "date": "Date de récépissé",
  "kpi_name": ["Montant Net HT", "Marge Brute", "Nombre d'UM", "Poids"],
  "category": "Nom du Donneur d'ordre",
  "metadata": {
    "pays_origine": "Expéditeur Pays",
    "pays_destination": "Pays destinataire",
    "type_service": "Ligne départ type",
    "correspondant": "Nom du Correspondant"
  }
}
```

---

## 🖥️ Implémentation dans l'Application

Cette section détaille comment les KPIs Transport sont réellement calculés dans le code de l'application.

### Architecture de Calcul

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FICHIER CSV IMPORT                              │
│  extract_377_71_260114_1428 - 2025 ROUTE IMPORT.csv                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ POST /api/upload
┌─────────────────────────────────────────────────────────────────────────┐
│                      DÉTECTION AUTOMATIQUE                               │
│  Fichier : python-engine/api/endpoints.py:44-54                         │
│                                                                          │
│  preview = content.decode('utf-8-sig')[:1000]                           │
│  if "Num. de bordereau" in preview and "Incoterm" in preview:           │
│      is_transport_file = True                                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ process_transport_file()
┌─────────────────────────────────────────────────────────────────────────┐
│                            ETL TRANSPORT                                 │
│  Fichier : python-engine/ingestion.py                                   │
│                                                                          │
│  1. Lecture CSV (UTF-8-sig, séparateur ";")                             │
│  2. Nettoyage colonnes (BOM, espaces)                                   │
│  3. Conversion décimaux (virgule → point)                               │
│  4. CALCUL MARGE BRUTE :                                                │
│     marge_brute = montant_net_ht - montant_achat_st - cout_interne      │
│  5. Insertion bulk dans transport_entries                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      TABLE: transport_entries                            │
│  Fichier : python-engine/database/models.py                             │
│                                                                          │
│  Colonnes principales stockées :                                         │
│  - date_recepisse (DateTime, indexé)                                    │
│  - donneur_ordre (String, indexé)                                       │
│  - montant_net_ht (Float) ───────────────────▶ CA                       │
│  - montant_achat_st (Float) ─────────────────▶ Coût sous-traitance      │
│  - cout_interne (Float) ─────────────────────▶ Coût interne             │
│  - marge_brute (Float) ──────────────────────▶ CALCULÉ à l'import       │
│  - poids_kg (Float) ─────────────────────────▶ Poids                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Calcul de la Marge Brute (ETL)

**Fichier :** `python-engine/ingestion.py`

**Formule appliquée lors de l'import :**

```python
marge_brute = montant_net_ht - montant_achat_st - cout_interne
```

**Exemple concret :**
```
Montant Net HT (CA)         = 386,05 €
Montant achat sous-traitance = 182,32 €
Coût interne                 =  20,00 €
─────────────────────────────────────────
Marge Brute                  = 386,05 - 182,32 - 20,00 = 183,73 €
```

La marge est **pré-calculée et stockée** dans la colonne `marge_brute` de la table `transport_entries` pour éviter de recalculer à chaque requête.

---

### Endpoint `/api/transport/stats` - KPIs Globaux

**Fichier :** `python-engine/api/endpoints.py:201-227`

**Code SQLAlchemy :**
```python
stats = db.query(
    func.sum(TransportEntry.montant_net_ht).label('ca_total'),
    func.sum(TransportEntry.marge_brute).label('marge_total'),
    func.sum(TransportEntry.poids_kg).label('poids_total'),
    func.count(TransportEntry.id).label('nb_envois')
).first()
```

**Requête SQL générée :**
```sql
SELECT
    SUM(montant_net_ht) AS ca_total,
    SUM(marge_brute) AS marge_total,
    SUM(poids_kg) AS poids_total,
    COUNT(id) AS nb_envois
FROM transport_entries;
```

**Calculs de transformation (Python) :**

| KPI affiché | Formule Python | Unité |
|-------------|----------------|-------|
| **CA Total (revenue)** | `stats.ca_total` | € |
| **Marge Brute (margin)** | `stats.marge_total` | € |
| **Tonnage** | `stats.poids_total / 1000.0` | T |
| **Nb Expéditions (shipments)** | `stats.nb_envois` | envois |
| **Taux de Marge (margin_rate)** | `(marge_total / ca_total) * 100` | % |

**Réponse JSON :**
```json
{
    "count": 109542,
    "revenue": 320714.80,
    "margin": 68539.35,
    "tonnage": 12345.67,
    "shipments": 109542,
    "margin_rate": 21.37
}
```

---

### Endpoint `/api/transport/graph/revenue` - Évolution Mensuelle

**Fichier :** `python-engine/api/endpoints.py:229-251`

**Code SQLAlchemy :**
```python
results = db.query(
    func.strftime('%Y-%m', TransportEntry.date_recepisse).label('month'),
    func.sum(TransportEntry.montant_net_ht).label('revenue'),
    func.sum(TransportEntry.marge_brute).label('margin')
).group_by('month').order_by('month').all()
```

**Requête SQL générée :**
```sql
SELECT
    strftime('%Y-%m', date_recepisse) AS month,
    SUM(montant_net_ht) AS revenue,
    SUM(marge_brute) AS margin
FROM transport_entries
GROUP BY strftime('%Y-%m', date_recepisse)
ORDER BY month ASC;
```

**Explication :**
- `strftime('%Y-%m', date_recepisse)` : Extrait année-mois (ex: "2024-08")
- `GROUP BY month` : Agrège CA et Marge par mois
- `ORDER BY month` : Trie chronologiquement

**Réponse JSON :**
```json
[
    { "name": "2024-08", "revenue": 45678.90, "margin": 9876.54 },
    { "name": "2024-09", "revenue": 52345.67, "margin": 11234.56 },
    { "name": "2024-10", "revenue": 48901.23, "margin": 10567.89 }
]
```

---

### Endpoint `/api/transport/graph/distribution` - Top 10 Clients

**Fichier :** `python-engine/api/endpoints.py:253-276`

**Paramètre :** `type=client` ou `type=country`

**Code SQLAlchemy (type=client) :**
```python
field = TransportEntry.donneur_ordre

results = db.query(
    field.label('name'),
    func.sum(TransportEntry.montant_net_ht).label('value')
).group_by(field).order_by(
    func.sum(TransportEntry.montant_net_ht).desc()
).limit(10).all()
```

**Requête SQL générée :**
```sql
SELECT
    donneur_ordre AS name,
    SUM(montant_net_ht) AS value
FROM transport_entries
GROUP BY donneur_ordre
ORDER BY SUM(montant_net_ht) DESC
LIMIT 10;
```

**Réponse JSON :**
```json
[
    { "name": "BIANCHI TRASPORTI", "value": 160907.39 },
    { "name": "SALVAT LOGISTICA", "value": 30076.06 },
    { "name": "LABORATOIRES ASEPTA", "value": 18138.01 }
]
```

---

### Calcul du Panier Moyen (Frontend)

**Fichier :** `electron-app/src/components/dashboard/TransportDashboard.tsx:74`

Ce calcul est effectué **côté frontend** car il dépend de deux valeurs déjà récupérées :

```typescript
const panierMoyen = stats.revenue / (stats.shipments || 1);
```

**Formule :** `CA Total ÷ Nombre d'expéditions`

**Exemple :** `320 714,80 € ÷ 109 542 = 2,93 €`

---

### Formatage des Valeurs (Frontend)

**Fichier :** `electron-app/src/components/dashboard/TransportDashboard.tsx`

**Montants en euros (cards) :**
```typescript
new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
}).format(stats.revenue)
// Résultat: "320 714,80 €"
```

**Valeurs en k€ (graphiques) :**
```typescript
formatter={(val) => `${(Number(val) / 1000).toFixed(0)}k€`}
// Résultat: "321k€"
```

**Tonnage :**
```typescript
`${stats.tonnage.toFixed(0)} T`
// Résultat: "12 346 T"
```

**Taux de marge :**
```typescript
`${stats.margin_rate.toFixed(1)}% du CA`
// Résultat: "21.4% du CA"
```

---

### Schéma Récapitulatif des Calculs

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TABLE: transport_entries                          │
│                                                                          │
│  Colonnes stockées :                                                     │
│  ┌──────────────────┬────────────────────┬──────────────────────────┐   │
│  │ montant_net_ht   │ montant_achat_st   │ cout_interne │ poids_kg │   │
│  │      (CA)        │    (Coût ST)       │  (Interne)   │  (Poids) │   │
│  └────────┬─────────┴──────────┬─────────┴──────┬───────┴────┬─────┘   │
│           │                    │                │            │          │
│           │    CALCUL ETL      │                │            │          │
│           │         ▼          │                │            │          │
│           │  ┌─────────────────┴────────────────┴─┐          │          │
│           │  │ marge_brute = CA - ST - Interne    │          │          │
│           │  └─────────────────┬──────────────────┘          │          │
│           │                    │                             │          │
└───────────┼────────────────────┼─────────────────────────────┼──────────┘
            │                    │                             │
            ▼                    ▼                             ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│ /transport/stats  │  │ /transport/graph  │  │ /transport/graph  │
│                   │  │    /revenue       │  │  /distribution    │
├───────────────────┤  ├───────────────────┤  ├───────────────────┤
│ SUM(montant_net)  │  │ GROUP BY mois     │  │ GROUP BY client   │
│ SUM(marge_brute)  │  │ SUM(montant_net)  │  │ SUM(montant_net)  │
│ SUM(poids_kg)     │  │ SUM(marge_brute)  │  │ ORDER BY DESC     │
│ COUNT(*)          │  │                   │  │ LIMIT 10          │
├───────────────────┤  ├───────────────────┤  ├───────────────────┤
│ + Calculs Python: │  │                   │  │                   │
│ tonnage = poids   │  │                   │  │                   │
│          / 1000   │  │                   │  │                   │
│ margin_rate =     │  │                   │  │                   │
│  marge/CA × 100   │  │                   │  │                   │
└───────────────────┘  └───────────────────┘  └───────────────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│   4 StatsCards    │  │  ComposedChart    │  │    BarChart       │
│ CA, Marge, Volume │  │  Barres + Ligne   │  │  Top 10 Clients   │
│ Panier Moyen      │  │                   │  │                   │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

---

### Fichiers Sources de l'Implémentation

| Composant | Fichier | Lignes clés |
|-----------|---------|-------------|
| Modèle BDD | `python-engine/database/models.py` | 38-91 |
| ETL Import | `python-engine/ingestion.py` | Tout le fichier |
| Endpoint Stats | `python-engine/api/endpoints.py` | 201-227 |
| Endpoint Revenue | `python-engine/api/endpoints.py` | 229-251 |
| Endpoint Distribution | `python-engine/api/endpoints.py` | 253-276 |
| Dashboard Frontend | `electron-app/src/components/dashboard/TransportDashboard.tsx` | Tout le fichier |
| Composant Graphique | `electron-app/src/components/KPIChart.tsx` | Tout le fichier |

---

## 🔧 Propositions : Filtres Configurables pour le CA

Cette section présente les propositions d'interface et d'implémentation pour filtrer le Chiffre d'Affaires par **période** et par **clients**.

---

### Proposition 1 : Interface Utilisateur

#### 1.1 Maquette du Panneau de Filtres

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🔧 FILTRES                                                    [Réinitialiser] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📅 PÉRIODE                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Date début: [  01/01/2025  📅 ]    Date fin: [  31/12/2025  📅 ]   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Raccourcis:  [ 7j ] [ 30j ] [ 90j ] [ Cette année ] [ Tout ]              │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  👥 CLIENTS (Donneurs d'ordre)                      [ ✓ Tous ] [ ✗ Aucun ] │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🔍 Rechercher un client...                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [✓] BIANCHI TRASPORTI                              160 907 €       │   │
│  │  [✓] SALVAT LOGISTICA                                30 076 €       │   │
│  │  [✓] LABORATOIRES ASEPTA                             18 138 €       │   │
│  │  [ ] TRANSPORT MARTIN                                12 450 €       │   │
│  │  [✓] LOGISTIQUE EXPRESS                               9 234 €       │   │
│  │  [ ] FRET INTERNATIONAL                               8 567 €       │   │
│  │  ...                                                                │   │
│  │  (Afficher plus ▼)                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  📊 Sélection: 42 clients sur 156  │  CA filtré: 245 890 €                 │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                    [ Appliquer les filtres ]                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 1.2 Spécification Retenue : Icône sur la Card "Chiffre d'Affaires"

**Principe :** Une icône de filtre (⚙️ ou 🔧) est placée en haut à droite de la card "Chiffre d'Affaires". Au clic, une popup/modal s'ouvre avec les options de filtrage.

---

**Étape 1 : Card avec icône de filtre**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DASHBOARD TRANSPORT                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────┐ │
│  │ Chiffre d'Affaires│  │               │  │               │  │          │ │
│  │              [⚙️]◀──── ICÔNE FILTRE  │  │               │  │          │ │
│  │                   │  │  Marge Brute  │  │    Tonnage    │  │  Panier  │ │
│  │   2 941 131 €     │  │   681 392 €   │  │   9 183 T     │  │   244 €  │ │
│  │                   │  │   23,2% du CA │  │  12 057 exp.  │  │          │ │
│  └───────────────────┘  └───────────────┘  └───────────────┘  └──────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Détail de la card "Chiffre d'Affaires" :**

```
┌─────────────────────────────────────┐
│  Chiffre d'Affaires           [⚙️] │◀── Icône cliquable (hover: couleur)
├─────────────────────────────────────┤
│                                     │
│         2 941 131 €                 │◀── Valeur principale (filtrée)
│                                     │
│  📅 Tout  │  👥 156/156 clients     │◀── Résumé des filtres actifs
│                                     │
└─────────────────────────────────────┘
```

---

**Étape 2 : Clic sur l'icône → Ouverture de la Popup**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DASHBOARD TRANSPORT                                  │
├───────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌───────────────────┐                                                      │
│  │ Chiffre d'Affaires│                                                      │
│  │              [⚙️]─┼────────────────────────────────────────┐             │
│  │   2 941 131 €     │                                        │             │
│  └───────────────────┘                                        ▼             │
│                              ┌─────────────────────────────────────────────┐│
│                              │  🔧 FILTRES CA                         [✕]  ││
│                              ├─────────────────────────────────────────────┤│
│                              │                                             ││
│                              │  📅 PÉRIODE                                 ││
│                              │  ┌─────────────────────────────────────┐   ││
│                              │  │ Début: [ 01/01/2025 📅 ]            │   ││
│                              │  │ Fin:   [ 31/12/2025 📅 ]            │   ││
│                              │  └─────────────────────────────────────┘   ││
│                              │                                             ││
│                              │  [ 7j ] [ 30j ] [ 90j ] [ Année ] [ Tout ] ││
│                              │                                             ││
│                              ├─────────────────────────────────────────────┤│
│                              │                                             ││
│                              │  👥 CLIENTS          [ ✓ Tous ] [ ✗ Aucun ]││
│                              │  ┌─────────────────────────────────────┐   ││
│                              │  │ 🔍 Rechercher...                    │   ││
│                              │  └─────────────────────────────────────┘   ││
│                              │  ┌─────────────────────────────────────┐   ││
│                              │  │ [✓] BIANCHI TRASPORTI    160 907 €  │   ││
│                              │  │ [✓] SALVAT LOGISTICA      30 076 €  │   ││
│                              │  │ [✓] LABORATOIRES ASEPTA   18 138 €  │   ││
│                              │  │ [ ] TRANSPORT MARTIN      12 450 €  │   ││
│                              │  │ ...                                 │   ││
│                              │  └─────────────────────────────────────┘   ││
│                              │                                             ││
│                              │  📊 42/156 clients │ CA filtré: 245 890 €  ││
│                              │                                             ││
│                              ├─────────────────────────────────────────────┤│
│                              │  [ Réinitialiser ]      [ Appliquer ]      ││
│                              └─────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

**Étape 3 : Après application des filtres**

```
┌─────────────────────────────────────┐
│  Chiffre d'Affaires           [⚙️] │◀── Icône avec indicateur (point coloré)
├─────────────────────────────────────┤
│                                     │
│          245 890 €                  │◀── Valeur recalculée avec filtres
│                                     │
│  📅 01/01 → 30/06  │  👥 42/156     │◀── Résumé filtres actifs (badges)
│                                     │
└─────────────────────────────────────┘
```

---

#### 1.3 Comportement de l'Icône

| État | Apparence | Description |
|------|-----------|-------------|
| **Aucun filtre** | ⚙️ gris | Pas de filtres appliqués |
| **Filtres actifs** | ⚙️ bleu + point | Des filtres sont appliqués |
| **Hover** | ⚙️ + tooltip | Affiche "Configurer les filtres" |

#### 1.4 Éléments de la Popup

| Zone | Contenu | Interaction |
|------|---------|-------------|
| **Header** | Titre "Filtres CA" + bouton fermer [✕] | Ferme sans appliquer |
| **Période** | 2 date pickers + raccourcis | Sélection de dates |
| **Clients** | Recherche + liste checkboxes | Multi-sélection |
| **Résumé** | Compteur clients + CA prévisualisé | Lecture seule |
| **Footer** | Boutons Réinitialiser / Appliquer | Actions |

#### 1.5 Flux Utilisateur

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Dashboard      │     │    Popup        │     │  Dashboard      │
│  affiché        │────▶│    ouverte      │────▶│  mis à jour     │
│                 │     │                 │     │                 │
│  Clic sur ⚙️    │     │  Configuration  │     │  Nouvelles      │
│                 │     │  des filtres    │     │  valeurs        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              │ Clic "Appliquer"
                              ▼
                        ┌─────────────────┐
                        │  API appelée    │
                        │  avec filtres   │
                        │  ?start_date=   │
                        │  &end_date=     │
                        │  &clients=      │
                        └─────────────────┘
```

---

### Proposition 2 : API Backend

#### 2.1 Modification de l'endpoint `/api/transport/stats`

**Nouvelle signature :**
```
GET /api/transport/stats?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&clients=client1,client2,client3
```

**Paramètres :**

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `start_date` | string (YYYY-MM-DD) | Non | Date de début de la période |
| `end_date` | string (YYYY-MM-DD) | Non | Date de fin de la période |
| `clients` | string (CSV) | Non | Liste des noms de clients séparés par virgules |

**Exemple de requête :**
```bash
curl "http://localhost:8000/api/transport/stats?start_date=2025-01-01&end_date=2025-06-30&clients=BIANCHI%20TRASPORTI,SALVAT%20LOGISTICA"
```

#### 2.2 Nouvel endpoint pour lister les clients

```
GET /api/transport/clients
```

**Réponse :**
```json
{
    "clients": [
        { "name": "BIANCHI TRASPORTI", "ca_total": 160907.39, "nb_envois": 1234 },
        { "name": "SALVAT LOGISTICA", "ca_total": 30076.06, "nb_envois": 456 },
        { "name": "LABORATOIRES ASEPTA", "ca_total": 18138.01, "nb_envois": 234 }
    ],
    "total_clients": 156
}
```

#### 2.3 Code Backend Proposé

**Endpoint stats avec filtres :**
```python
@router.get("/transport/stats")
def get_transport_stats(
    db: Session = Depends(get_db),
    start_date: Optional[str] = Query(None, description="Date début YYYY-MM-DD"),
    end_date: Optional[str] = Query(None, description="Date fin YYYY-MM-DD"),
    clients: Optional[str] = Query(None, description="Clients séparés par virgules")
):
    query = db.query(
        func.sum(TransportEntry.montant_net_ht).label('ca_total'),
        func.sum(TransportEntry.marge_brute).label('marge_total'),
        func.sum(TransportEntry.poids_kg).label('poids_total'),
        func.count(TransportEntry.id).label('nb_envois')
    )

    # Filtre par période
    if start_date:
        query = query.filter(TransportEntry.date_recepisse >= start_date)
    if end_date:
        query = query.filter(TransportEntry.date_recepisse <= end_date)

    # Filtre par clients
    if clients:
        client_list = [c.strip() for c in clients.split(',')]
        query = query.filter(TransportEntry.donneur_ordre.in_(client_list))

    stats = query.first()
    # ... suite du traitement
```

**Endpoint liste des clients :**
```python
@router.get("/transport/clients")
def get_transport_clients(db: Session = Depends(get_db)):
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
```

---

### Proposition 3 : Composants Frontend

#### 3.1 Composant DateRangePicker

```typescript
interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    onChange: (start: Date | null, end: Date | null) => void;
    presets?: Array<{ label: string; days: number }>;
}

// Presets suggérés
const DATE_PRESETS = [
    { label: "7 jours", days: 7 },
    { label: "30 jours", days: 30 },
    { label: "90 jours", days: 90 },
    { label: "Cette année", days: -1 },  // Spécial: depuis 01/01
    { label: "Tout", days: 0 }           // Spécial: aucun filtre
];
```

#### 3.2 Composant ClientSelector

```typescript
interface Client {
    name: string;
    ca_total: number;
    nb_envois: number;
    selected: boolean;
}

interface ClientSelectorProps {
    clients: Client[];
    selectedClients: string[];
    onSelectionChange: (selected: string[]) => void;
    showCaTotal?: boolean;  // Afficher le CA à côté du nom
}

// Fonctionnalités :
// - Recherche par nom (filtre local)
// - Select All / Deselect All
// - Tri par CA ou par nom
// - Affichage du résumé (X sur Y sélectionnés)
```

#### 3.3 Hook de gestion des filtres

```typescript
interface TransportFilters {
    startDate: string | null;
    endDate: string | null;
    clients: string[];
}

function useTransportFilters() {
    const [filters, setFilters] = useState<TransportFilters>({
        startDate: null,
        endDate: null,
        clients: []
    });

    const buildQueryString = () => {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('start_date', filters.startDate);
        if (filters.endDate) params.append('end_date', filters.endDate);
        if (filters.clients.length > 0) params.append('clients', filters.clients.join(','));
        return params.toString();
    };

    return { filters, setFilters, buildQueryString };
}
```

---

### Proposition 4 : Requêtes SQL avec Filtres

#### 4.1 Stats globales filtrées

```sql
SELECT
    SUM(montant_net_ht) AS ca_total,
    SUM(marge_brute) AS marge_total,
    SUM(poids_kg) AS poids_total,
    COUNT(id) AS nb_envois
FROM transport_entries
WHERE date_recepisse >= '2025-01-01'
  AND date_recepisse <= '2025-06-30'
  AND donneur_ordre IN ('BIANCHI TRASPORTI', 'SALVAT LOGISTICA');
```

#### 4.2 Évolution mensuelle filtrée

```sql
SELECT
    strftime('%Y-%m', date_recepisse) AS month,
    SUM(montant_net_ht) AS revenue,
    SUM(marge_brute) AS margin
FROM transport_entries
WHERE date_recepisse >= '2025-01-01'
  AND date_recepisse <= '2025-06-30'
  AND donneur_ordre IN ('BIANCHI TRASPORTI', 'SALVAT LOGISTICA')
GROUP BY month
ORDER BY month ASC;
```

#### 4.3 Index recommandés pour la performance

```sql
-- Index composé pour les requêtes filtrées fréquentes
CREATE INDEX idx_transport_date_client
ON transport_entries(date_recepisse, donneur_ordre);

-- Index pour la liste des clients
CREATE INDEX idx_transport_donneur
ON transport_entries(donneur_ordre);
```

---

### Proposition 5 : Comportements UX

#### 5.1 États de l'interface

| État | Description | Affichage |
|------|-------------|-----------|
| **Aucun filtre** | Toutes les données | Badge "Tout" grisé |
| **Période active** | Dates sélectionnées | Badge bleu "01/01 → 30/06" |
| **Clients filtrés** | Sélection partielle | Badge vert "42/156 clients" |
| **Combiné** | Période + Clients | 2 badges actifs |

#### 5.2 Interactions

| Action | Comportement |
|--------|--------------|
| Clic "Appliquer" | Recharge les données avec filtres, ferme le panneau |
| Clic "Réinitialiser" | Supprime tous les filtres, revient à "Tout" |
| Clic raccourci période | Applique immédiatement la période |
| Clic "Tous" (clients) | Coche tous les clients |
| Clic "Aucun" (clients) | Décoche tous les clients |
| Recherche client | Filtre la liste en temps réel (pas les données) |

#### 5.3 Persistance des filtres

```typescript
// Sauvegarder les filtres dans localStorage
localStorage.setItem('transport_filters', JSON.stringify(filters));

// Options de persistance :
// - Par session (sessionStorage)
// - Permanent (localStorage)
// - URL (query params pour partage)
```

---

### Proposition 6 : Tableau Comparatif des Options UI

| Critère | Option A (Sidebar) | Option B (Header) | Option C (Modal) |
|---------|-------------------|-------------------|------------------|
| **Visibilité** | Toujours visible | Résumé visible | Cachée |
| **Espace écran** | Réduit le dashboard | Minimal | Aucun impact |
| **Accès rapide** | ✅ Excellent | ✅ Bon | ⚠️ 1 clic requis |
| **Mobile** | ⚠️ Problématique | ✅ Bon | ✅ Excellent |
| **Complexité** | Moyenne | Faible | Moyenne |
| **Recommandation** | Desktop uniquement | **Recommandé** | Filtres complexes |

**Recommandation finale : Option B (Header) + Option C (Modal) pour les filtres avancés**

---

### Proposition 7 : Plan d'Implémentation Filtres

#### Phase A : Backend (Priorité haute)
- [ ] Ajouter paramètres `start_date`, `end_date` à `/transport/stats`
- [ ] Ajouter paramètre `clients` à `/transport/stats`
- [ ] Créer endpoint `/transport/clients`
- [ ] Appliquer les mêmes filtres à `/transport/graph/revenue`
- [ ] Appliquer les mêmes filtres à `/transport/graph/distribution`
- [ ] Ajouter index SQL pour performance

#### Phase B : Frontend - Composants (Priorité haute)
- [ ] Créer composant `DateRangePicker`
- [ ] Créer composant `ClientSelector` avec checkboxes
- [ ] Créer hook `useTransportFilters`

#### Phase C : Frontend - Intégration (Priorité moyenne)
- [ ] Intégrer barre de filtres dans TransportDashboard
- [ ] Connecter filtres aux appels API
- [ ] Ajouter badges de filtres actifs
- [ ] Implémenter persistance localStorage

### Phase 7 : Implémentation Réalisée - Filtres de Données ✅

Cette fonctionnalité permet de filtrer l'ensemble des données du Dashboard Transport par Période et par Clients.

#### 1. Architecture Technique

**Backend (Python/FastAPI)**
- **Endpoints mis à jour** : Les endpoints `/api/transport/stats`, `/api/transport/graph/revenue`, et `/api/transport/graph/distribution` acceptent désormais les paramètres `start_date`, `end_date`, et `clients` (CSV).
- **Nouvel Endpoint** : `/api/transport/clients` fournit la liste des clients triée par chiffre d'affaires.
- **Sécurité** : Gestion des cas limites (aucun résultat) pour renvoyer des structures JSON valides (évitant les crashs frontend).

**Frontend (React/Electron)**
- **Hook Personnalisé** : `useTransportFilters` gère l'état global des filtres et la génération des query strings.
- **Composants UI** :
  - `TransportFilterModal` : Modale centrale de configuration.
  - `DateRangePicker` : Sélecteur de date avec pré-réglages (7j, 30j, Année).
  - `ClientSelector` : Liste des clients avec recherche et sélection multiple.
- **Intégration** : Bouton de configuration (⚙️) ajouté sur la carte "Chiffre d'Affaires".

#### 2. Workflow Utilisateur
1. L'utilisateur clique sur l'icône ⚙️ dans le header.
2. La modale s'ouvre avec les options de filtrage.
3. Après sélection, le clic sur "Appliquer" ferme la modale et recharge tous les graphiques.
4. Les données sont filtrées côté serveur (SQLAlchemy) pour une performance optimale.

---

## 🎯 Plan d'Implémentation

### Phase 1 : KPIs Essentiels ✅ Implémenté

- [x] CA Total & Mensuel
- [x] Marge Brute & Taux de Marge
- [x] Nombre d'Envois
- [x] Top 10 Clients
- [x] Tonnage
- [x] Panier Moyen

### Phase 2 : KPIs Géographiques (À faire)

- [ ] CA par Pays (endpoint existe: `?type=country`)
- [ ] Répartition géographique (PieChart)
- [ ] Routes principales

### Phase 3 : KPIs Avancés (À faire)

- [ ] Délais moyens
- [ ] Performance par Correspondant
- [ ] Segmentation clients
- [ ] Alertes automatiques

---

## 📚 Glossaire

| Terme | Définition |
|-------|------------|
| **UM** | Unité de Manutention (palette, colis, etc.) |
| **DAP** | Delivered At Place (Incoterm) - Rendu au lieu de destination |
| **HT** | Hors Taxes |
| **EDI** | Échange de Données Informatisé |
| **Bordereau** | Document de transport listant les marchandises |
| **Confrère** | Autre transporteur (partenaire réseau) |
| **Chargeur** | Client direct qui confie la marchandise |
| **Sous-traitance** | Coût de prestations externes (transporteurs partenaires) |
| **Coût interne** | Coût opérationnel propre (personnel, véhicules, etc.) |
| **MoM** | Month over Month (mois sur mois) |
| **YoY** | Year over Year (année sur année) |

---

## 🎉 Conclusion

Ce fichier contient **une mine d'or de données opérationnelles et financières** pour le secteur du transport international.

### Points Forts
✅ Données riches (25 champs)
✅ Historique long (17 mois)
✅ Volume important (109K+ lignes)
✅ Données financières complètes (CA, coûts, marges)
✅ Données opérationnelles (délais, volumes, poids)
✅ Données géographiques (routes, pays)

### Points d'Attention
⚠️ Doublons apparents à gérer
⚠️ Champs vides à nettoyer
⚠️ BOM UTF-8 à retirer
⚠️ Séparateur point-virgule

### Potentiel d'Analyse
🚀 **30+ KPIs** exploitables immédiatement
🚀 **10+ graphiques** pour un dashboard complet
🚀 **Analyses prédictives** possibles
🚀 **Segmentation clients** avancée

---

**Prochaine étape** : Importer ce fichier dans le KPI Analyzer pour créer un dashboard temps réel de suivi de l'activité transport !

**Auteur** : Claude Code
**Date** : 2026-01-15
**Version** : 1.0
