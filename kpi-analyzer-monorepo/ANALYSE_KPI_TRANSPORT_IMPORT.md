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

## 🎯 Plan d'Implémentation

### Phase 1 : KPIs Essentiels (Semaine 1)

- [x] CA Total & Mensuel
- [x] Marge Brute & Taux de Marge
- [x] Nombre d'Envois
- [x] Top 10 Clients
- [x] CA par Pays

### Phase 2 : KPIs Opérationnels (Semaine 2)

- [ ] Tonnage & UM
- [ ] Délais moyens
- [ ] Performance par Route
- [ ] Coûts détaillés

### Phase 3 : KPIs Avancés (Semaine 3)

- [ ] Segmentation RFM
- [ ] Prédictions
- [ ] Alertes automatiques
- [ ] Analyses croisées

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
