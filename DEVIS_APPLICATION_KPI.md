# DEVIS
## Application d'Analyse KPI - Version Portable

---

**Numéro de devis :** DEV-2024-001
**Date d'émission :** 14 janvier 2024
**Validité :** 30 jours
**Statut :** Proposition commerciale

---

## 📋 INFORMATIONS PRESTATAIRE

**Raison sociale :** [À compléter]
**Adresse :** [À compléter]
**Code postal / Ville :** [À compléter]
**SIRET :** [À compléter]
**TVA intracommunautaire :** [À compléter]
**Email :** [À compléter]
**Téléphone :** [À compléter]

---

## 👤 INFORMATIONS CLIENT

**Raison sociale :** [À compléter]
**Adresse :** [À compléter]
**Code postal / Ville :** [À compléter]
**SIRET :** [À compléter]
**Contact :** [À compléter]
**Email :** [À compléter]
**Téléphone :** [À compléter]

---

## 📄 OBJET DU DEVIS

Développement d'une **application desktop portable** pour la visualisation et l'analyse de KPI (Key Performance Indicators) à partir de multiples sources de données (CSV, Excel, JSON).

**Contexte :**
- Utilisateurs finaux novices en informatique
- Aucun droit administrateur requis
- Données très sensibles (conformité RGPD)
- Budget et délai contraints

**Solution proposée :**
Application standalone (sans installation) permettant l'import, la fusion, l'analyse et la visualisation de données avec export de rapports professionnels.

---

## 💼 PRESTATIONS DÉTAILLÉES

### OPTION A : Prototype Rapide + Version Complète (RECOMMANDÉE)

---

#### PHASE 1 : MVP - Prototype Fonctionnel (2 semaines)

| Réf | Désignation | Quantité | PU HT | Total HT |
|-----|-------------|----------|-------|----------|
| **P1.1** | **Analyse et Architecture** | | | |
| P1.1.1 | Analyse des besoins spécifiques client | 1 jour | [Tarif]€ | [Total]€ |
| P1.1.2 | Architecture technique et choix technologiques | 1 jour | [Tarif]€ | [Total]€ |
| P1.1.3 | Conception base de données SQLite | 0.5 jour | [Tarif]€ | [Total]€ |
| | | | **Sous-total P1.1** | **[Total]€** |
| **P1.2** | **Développement Backend (Python)** | | | |
| P1.2.1 | Module lecture CSV (Pandas) | 1 jour | [Tarif]€ | [Total]€ |
| P1.2.2 | Parsing et validation données | 0.5 jour | [Tarif]€ | [Total]€ |
| P1.2.3 | Fonction fusion basique (concat) | 1 jour | [Tarif]€ | [Total]€ |
| P1.2.4 | Déduplication automatique | 0.5 jour | [Tarif]€ | [Total]€ |
| P1.2.5 | Insertion données en base SQLite | 0.5 jour | [Tarif]€ | [Total]€ |
| P1.2.6 | Module export PDF basique (ReportLab) | 1 jour | [Tarif]€ | [Total]€ |
| | | | **Sous-total P1.2** | **[Total]€** |
| **P1.3** | **Développement Frontend (Electron + React)** | | | |
| P1.3.1 | Setup projet Electron + React | 0.5 jour | [Tarif]€ | [Total]€ |
| P1.3.2 | Layout principal et navigation | 0.5 jour | [Tarif]€ | [Total]€ |
| P1.3.3 | Zone drag & drop fichiers | 1 jour | [Tarif]€ | [Total]€ |
| P1.3.4 | Liste fichiers importés | 0.5 jour | [Tarif]€ | [Total]€ |
| P1.3.5 | Composant graphique ligne (Recharts) | 1 jour | [Tarif]€ | [Total]€ |
| P1.3.6 | Composant graphique barre | 0.5 jour | [Tarif]€ | [Total]€ |
| P1.3.7 | Boutons export et loaders | 0.5 jour | [Tarif]€ | [Total]€ |
| | | | **Sous-total P1.3** | **[Total]€** |
| **P1.4** | **Intégration et Tests** | | | |
| P1.4.1 | Communication IPC Electron <-> Python | 1 jour | [Tarif]€ | [Total]€ |
| P1.4.2 | Pipeline import end-to-end | 0.5 jour | [Tarif]€ | [Total]€ |
| P1.4.3 | Pipeline visualisation end-to-end | 0.5 jour | [Tarif]€ | [Total]€ |
| P1.4.4 | Tests unitaires backend | 0.5 jour | [Tarif]€ | [Total]€ |
| P1.4.5 | Tests d'intégration | 0.5 jour | [Tarif]€ | [Total]€ |
| P1.4.6 | Tests utilisateurs avec données réelles | 1 jour | [Tarif]€ | [Total]€ |
| | | | **Sous-total P1.4** | **[Total]€** |

**TOTAL PHASE 1 : [Total]€ HT**

**Livrables Phase 1 :**
- ✅ Application portable Windows (.exe)
- ✅ Import CSV fonctionnel
- ✅ Fusion automatique 2-3 fichiers
- ✅ 2 types de graphiques (ligne, barre)
- ✅ Export PDF basique
- ✅ README utilisation

**Délai : 10 jours ouvrés (2 semaines calendaires)**

---

#### PHASE 2 : Version Complète - Production (2 semaines)

| Réf | Désignation | Quantité | PU HT | Total HT |
|-----|-------------|----------|-------|----------|
| **P2.1** | **Fonctionnalités Avancées** | | | |
| P2.1.1 | Support Excel complet (openpyxl, multi-sheets) | 1 jour | [Tarif]€ | [Total]€ |
| P2.1.2 | Support JSON (nested objects) | 0.5 jour | [Tarif]€ | [Total]€ |
| P2.1.3 | Fusion intelligente (auto-detect keys) | 1.5 jour | [Tarif]€ | [Total]€ |
| P2.1.4 | Gestion conflits avec interface utilisateur | 1 jour | [Tarif]€ | [Total]€ |
| P2.1.5 | 3 graphiques supplémentaires (pie, scatter, heatmap) | 1.5 jour | [Tarif]€ | [Total]€ |
| P2.1.6 | Filtres avancés (date, catégorie, multi-critères) | 1 jour | [Tarif]€ | [Total]€ |
| P2.1.7 | Export PDF avancé (watermark, TOC, multi-pages) | 1 jour | [Tarif]€ | [Total]€ |
| P2.1.8 | Export Excel avec formatage | 0.5 jour | [Tarif]€ | [Total]€ |
| | | | **Sous-total P2.1** | **[Total]€** |
| **P2.2** | **Sécurité et Conformité** | | | |
| P2.2.1 | Chiffrement optionnel AES-256 (cryptography) | 1.5 jour | [Tarif]€ | [Total]€ |
| P2.2.2 | Interface activation/désactivation chiffrement | 0.5 jour | [Tarif]€ | [Total]€ |
| P2.2.3 | Gestion mot de passe (PBKDF2, salt) | 0.5 jour | [Tarif]€ | [Total]€ |
| P2.2.4 | Logs d'audit complets | 1 jour | [Tarif]€ | [Total]€ |
| P2.2.5 | Watermarking exports (nom user + date) | 0.5 jour | [Tarif]€ | [Total]€ |
| P2.2.6 | Validation input (anti-injection) | 0.5 jour | [Tarif]€ | [Total]€ |
| | | | **Sous-total P2.2** | **[Total]€** |
| **P2.3** | **UI/UX et Ergonomie** | | | |
| P2.3.1 | Design système cohérent (TailwindCSS) | 1 jour | [Tarif]€ | [Total]€ |
| P2.3.2 | États de chargement (loaders, progress bars) | 0.5 jour | [Tarif]€ | [Total]€ |
| P2.3.3 | Messages d'erreur explicites | 0.5 jour | [Tarif]€ | [Total]€ |
| P2.3.4 | Onboarding première utilisation | 1 jour | [Tarif]€ | [Total]€ |
| P2.3.5 | Mode sombre (optionnel) | 0.5 jour | [Tarif]€ | [Total]€ |
| | | | **Sous-total P2.3** | **[Total]€** |
| **P2.4** | **Performance et Optimisation** | | | |
| P2.4.1 | Optimisation requêtes SQL (index, vues) | 0.5 jour | [Tarif]€ | [Total]€ |
| P2.4.2 | Streaming fichiers volumineux (> 100K lignes) | 1 jour | [Tarif]€ | [Total]€ |
| P2.4.3 | Cache résultats fréquents | 0.5 jour | [Tarif]€ | [Total]€ |
| | | | **Sous-total P2.4** | **[Total]€** |
| **P2.5** | **Packaging et Déploiement** | | | |
| P2.5.1 | Build portable Windows (Electron Builder) | 1 jour | [Tarif]€ | [Total]€ |
| P2.5.2 | Embarquement Python runtime (PyInstaller) | 0.5 jour | [Tarif]€ | [Total]€ |
| P2.5.3 | Package final ZIP avec README | 0.5 jour | [Tarif]€ | [Total]€ |
| P2.5.4 | Build portable macOS (optionnel) | 1 jour | [Tarif]€ | [Total]€ |
| | | | **Sous-total P2.5** | **[Total]€** |
| **P2.6** | **Documentation et Formation** | | | |
| P2.6.1 | Guide utilisateur complet (PDF, 15-20 pages) | 1.5 jour | [Tarif]€ | [Total]€ |
| P2.6.2 | Vidéo tutoriel (enregistrement et montage, 5 min) | 1 jour | [Tarif]€ | [Total]€ |
| P2.6.3 | FAQ interactive | 0.5 jour | [Tarif]€ | [Total]€ |
| P2.6.4 | Documentation technique (architecture, API) | 1 jour | [Tarif]€ | [Total]€ |
| | | | **Sous-total P2.6** | **[Total]€** |
| **P2.7** | **Tests et Qualité** | | | |
| P2.7.1 | Tests fonctionnels complets | 1.5 jour | [Tarif]€ | [Total]€ |
| P2.7.2 | Tests de sécurité (scan, validation) | 1 jour | [Tarif]€ | [Total]€ |
| P2.7.3 | Tests de performance (benchmarks) | 0.5 jour | [Tarif]€ | [Total]€ |
| P2.7.4 | Tests utilisateurs pilotes (2-3 personnes) | 1 jour | [Tarif]€ | [Total]€ |
| P2.7.5 | Corrections bugs et ajustements | 1 jour | [Tarif]€ | [Total]€ |
| | | | **Sous-total P2.7** | **[Total]€** |

**TOTAL PHASE 2 : [Total]€ HT**

**Livrables Phase 2 :**
- ✅ Application production-ready
- ✅ Support CSV + Excel + JSON
- ✅ 5+ types de graphiques
- ✅ Chiffrement optionnel AES-256
- ✅ Export PDF professionnel (watermark, TOC)
- ✅ Export Excel
- ✅ Documentation complète (PDF + vidéo)
- ✅ Package portable Windows (+ macOS optionnel)
- ✅ Tests validation passés

**Délai : 13 jours ouvrés (2-3 semaines calendaires)**

---

#### PHASE 3 : Améliorations (OPTIONNELLE)

| Réf | Désignation | Quantité | PU HT | Total HT |
|-----|-------------|----------|-------|----------|
| **P3.1** | **Fonctionnalités Supplémentaires** | | | |
| P3.1.1 | Système de mise à jour automatique (sans admin) | 1.5 jour | [Tarif]€ | [Total]€ |
| P3.1.2 | Templates de rapports personnalisables | 1 jour | [Tarif]€ | [Total]€ |
| P3.1.3 | Mode sombre complet | 0.5 jour | [Tarif]€ | [Total]€ |
| P3.1.4 | Support multi-langue (FR/EN) | 1 jour | [Tarif]€ | [Total]€ |
| P3.1.5 | Version macOS complète | 1 jour | [Tarif]€ | [Total]€ |

**TOTAL PHASE 3 : [Total]€ HT**

**Livrables Phase 3 :**
- ✅ Auto-update (optionnel)
- ✅ Templates rapports
- ✅ Multi-langue
- ✅ Version macOS

**Délai : 5 jours ouvrés (1 semaine)**

---

### OPTION B : Développement Direct (Sans Prototype)

**Phase 1 + Phase 2 en une seule itération**

| Désignation | Total HT |
|-------------|----------|
| Développement complet (Phase 1 + Phase 2) | [Total P1 + P2]€ |
| Risque additionnel (pas de validation intermédiaire) | +10% |

**TOTAL OPTION B : [Total]€ HT**

**Délai : 23 jours ouvrés (4 semaines)**

**⚠️ Non recommandé** : Moins de flexibilité, risque d'inadéquation besoins.

---

## 🔧 PRESTATIONS COMPLÉMENTAIRES

### Services Additionnels (Sur Devis Séparé)

| Réf | Désignation | Unité | PU HT |
|-----|-------------|-------|-------|
| **SC.1** | **Certificat de Signature Numérique** | | |
| SC.1.1 | Certificat Windows Authenticode (1 an) | 1 | 100-300€ |
| | *Évite les warnings "Éditeur inconnu" sous Windows* | | |
| **SC.2** | **Support et Maintenance** | | |
| SC.2.1 | Support email (réponse sous 48h) | Mois | [Tarif]€ |
| SC.2.2 | Maintenance corrective (bugs) | Heure | [Tarif]€ |
| SC.2.3 | Maintenance évolutive (nouvelles fonctionnalités) | Jour | [Tarif]€ |
| SC.2.4 | Formation utilisateurs (session 30 min) | Session | [Tarif]€ |
| SC.2.5 | Formation formateurs (1 journée) | Jour | [Tarif]€ |
| **SC.3** | **Services Supplémentaires** | | |
| SC.3.1 | Audit de sécurité externe | Forfait | Sur devis |
| SC.3.2 | Intégration API externe (si besoin futur) | Jour | [Tarif]€ |
| SC.3.3 | Développement connecteur spécifique | Jour | [Tarif]€ |
| SC.3.4 | Hébergement documentation en ligne | Mois | [Tarif]€ |

---

## 💰 RÉCAPITULATIF FINANCIER

### Option A : Prototype + Version Complète (RECOMMANDÉE)

| Phase | Jours | Total HT | TVA 20% | Total TTC |
|-------|-------|----------|---------|-----------|
| **Phase 1 - MVP** | 10 j | [Total]€ | [TVA]€ | [TTC]€ |
| **Phase 2 - Complet** | 13 j | [Total]€ | [TVA]€ | [TTC]€ |
| **Phase 3 - Optionnel** | 5 j | [Total]€ | [TVA]€ | [TTC]€ |
| **TOTAL (Phase 1+2)** | **23 j** | **[Total]€** | **[TVA]€** | **[TTC]€** |
| **TOTAL (Phase 1+2+3)** | **28 j** | **[Total]€** | **[TVA]€** | **[TTC]€** |

**Certificat code signing (optionnel) :** +100-300€ HT (première année)

---

### Tarification Suggérée (Exemples)

**Exemple 1 : Tarif Junior (300€/jour HT)**

| Phase | Jours | Total HT | TVA 20% | Total TTC |
|-------|-------|----------|---------|-----------|
| Phase 1 - MVP | 10 j | 3 000€ | 600€ | 3 600€ |
| Phase 2 - Complet | 13 j | 3 900€ | 780€ | 4 680€ |
| **TOTAL** | **23 j** | **6 900€** | **1 380€** | **8 280€** |

**Exemple 2 : Tarif Intermédiaire (450€/jour HT)**

| Phase | Jours | Total HT | TVA 20% | Total TTC |
|-------|-------|----------|---------|-----------|
| Phase 1 - MVP | 10 j | 4 500€ | 900€ | 5 400€ |
| Phase 2 - Complet | 13 j | 5 850€ | 1 170€ | 7 020€ |
| **TOTAL** | **23 j** | **10 350€** | **2 070€** | **12 420€** |

**Exemple 3 : Tarif Senior (600€/jour HT)**

| Phase | Jours | Total HT | TVA 20% | Total TTC |
|-------|-------|----------|---------|-----------|
| Phase 1 - MVP | 10 j | 6 000€ | 1 200€ | 7 200€ |
| Phase 2 - Complet | 13 j | 7 800€ | 1 560€ | 9 360€ |
| **TOTAL** | **23 j** | **13 800€** | **2 760€** | **16 560€** |

---

## 💎 RETOUR SUR INVESTISSEMENT (ROI)

### Calcul Conservateur (10 utilisateurs)

**Gains annuels estimés :**
- Temps économisé : 10 users × 3h/sem × 50 sem × 30€/h = **45 000€**
- Réduction erreurs : 5 erreurs/an × 2h × 30€/h = **300€**
- **Total gains : 45 300€/an**

**Coûts :**
- Développement (exemple tarif intermédiaire) : **10 350€ HT**
- Maintenance année 1 : **0€** (inclus pendant 3 mois)
- Certificat : **300€**
- **Total investissement : 10 650€**

**ROI = (45 300 - 10 650) / 10 650 = 325%**

**Amortissement : < 3 mois** ✅

---

## 📅 PLANNING PRÉVISIONNEL

### Approche Agile - Sprints de 2 semaines

| Semaine | Phase | Jalons |
|---------|-------|--------|
| **S0** | Démarrage | • Signature devis<br>• Kick-off meeting<br>• Validation DSI/IT<br>• Réception données d'exemple |
| **S1-S2** | Phase 1 - MVP | • Développement prototype<br>• Tests internes<br>• **Livraison MVP**<br>• Validation client |
| **S3** | Phase 2 - Part 1 | • Développement fonctionnalités<br>• Sécurité (chiffrement)<br>• UI/UX avancée |
| **S4** | Phase 2 - Part 2 | • Tests complets<br>• Documentation<br>• **Livraison finale**<br>• Formation |
| **S5** | Déploiement | • Déploiement pilote<br>• Support actif<br>• Ajustements |

**Délai total : 4-5 semaines** (hors Phase 3 optionnelle)

---

## 📋 CONDITIONS DE RÉALISATION

### Responsabilités Client

Le client s'engage à fournir :

1. **Données d'exemple**
   - 2-3 fichiers représentatifs (CSV/Excel/JSON)
   - Anonymisés si données sensibles
   - Dans les 3 jours suivant signature

2. **Spécifications**
   - Liste des KPI prioritaires (3-5 minimum)
   - Exemples de rapports souhaités (si disponibles)
   - Validation DSI/IT (si applicable)

3. **Disponibilité**
   - Point hebdomadaire (1h) - Visio ou présentiel
   - Utilisateur pilote pour tests (Phase 2)
   - Validation intermédiaire (fin Phase 1)

4. **Environnement**
   - Accès à 1-2 postes utilisateurs pour tests
   - Validation compte email pour déploiement

### Responsabilités Prestataire

Le prestataire s'engage à :

1. **Livrables**
   - Code source complet et commenté
   - Documentation technique et utilisateur
   - Package portable prêt à déployer
   - Vidéo tutoriel (5 minutes)

2. **Qualité**
   - Tests unitaires et d'intégration
   - Benchmarks de performance
   - Conformité sécurité (chiffrement, logs)
   - Scan antivirus du package final

3. **Communication**
   - Reporting hebdomadaire (avancement)
   - Alerte immédiate si risque dépassement
   - Disponibilité email (réponse sous 24h)

4. **Support**
   - Support inclus pendant 3 mois post-livraison
   - Corrections bugs (hors nouvelles fonctionnalités)
   - Assistance déploiement

---

## 💳 CONDITIONS DE PAIEMENT

### Modalités de Facturation

**Option 1 : Paiement Échelonné (RECOMMANDÉ)**

| Échéance | Événement | Montant | Date |
|----------|-----------|---------|------|
| **Acompte** | Signature devis | 30% | J+0 |
| **Intermédiaire** | Livraison Phase 1 (MVP) | 30% | J+14 |
| **Solde** | Livraison Phase 2 (Final) | 40% | J+30 |

**Option 2 : Paiement au Forfait**

| Échéance | Événement | Montant | Date |
|----------|-----------|---------|------|
| **Acompte** | Signature devis | 50% | J+0 |
| **Solde** | Livraison finale | 50% | J+30 |

**Option 3 : Régie (Facturation au Temps Passé)**

| Échéance | Événement | Montant |
|----------|-----------|---------|
| **Mensuel** | Fin de mois | Jours réels × TJM |

*Non recommandé - Budget moins prévisible*

---

### Délais de Paiement

- **Délai :** 30 jours à réception de facture
- **Mode :** Virement bancaire
- **Retard :** Pénalités de 3× taux BCE + indemnité forfaitaire 40€ (art. L441-6 C.com)
- **Escompte :** -2% si paiement comptant (sous 7 jours)

---

## 📜 CONDITIONS GÉNÉRALES

### 1. Propriété Intellectuelle

**Code Source :**
- Transfert de propriété au client à réception du paiement intégral
- Licence d'utilisation illimitée
- Droit de modification et distribution interne

**Technologies Open Source :**
- Electron, React, Python, Pandas, etc. : Licences respectives maintenues
- Pas de transfert de propriété (déjà open source)

**Documentation :**
- Propriété client
- Réutilisation libre

### 2. Confidentialité

- Engagement de confidentialité mutuel
- Données client non divulguées
- Suppression données test après livraison
- Clause de non-divulgation (NDA) sur demande

### 3. Garanties

**Garantie de Conformité :** 3 mois
- Application conforme aux spécifications validées
- Corrections bugs incluses
- Hors nouvelles fonctionnalités

**Garantie Évolutive :** Optionnelle (contrat maintenance)
- Adaptations OS (mises à jour Windows/Mac)
- Mises à jour sécurité
- Sur devis séparé

### 4. Limitation de Responsabilité

- Responsabilité limitée au montant du devis
- Hors faute lourde ou intentionnelle
- Assurance RC Professionnelle : [Montant]€

### 5. Force Majeure

- Suspension obligations en cas force majeure
- Notification sous 7 jours
- Résiliation possible si > 30 jours

### 6. Résiliation

**Par le Client :**
- Possible à tout moment avec préavis 15 jours
- Facturation travaux réalisés (prorata)
- Pas de remboursement acompte

**Par le Prestataire :**
- En cas non-paiement après mise en demeure (15 jours)
- En cas non-respect obligations client

### 7. Litiges

- Loi applicable : Française
- Juridiction compétente : [Ville]
- Tentative règlement amiable obligatoire (30 jours)

---

## ✅ VALIDATION ET ACCEPTATION

### Modalités d'Acceptation

**Le client valide le devis en :**

1. **Signature manuscrite** de la mention "Bon pour accord" ci-dessous
2. **Paraphe** de chaque page du devis
3. **Retour** du devis signé par email ou courrier
4. **Versement** de l'acompte (30% ou 50% selon option)

**Délai de validité :** 30 jours à compter de la date d'émission

---

### Bon Pour Accord

**Je soussigné(e) :**

Nom : ______________________________

Fonction : ______________________________

Entreprise : ______________________________

**Déclare avoir pris connaissance et accepter sans réserve :**
- Les prestations détaillées ci-dessus
- Le planning prévisionnel
- Les conditions de réalisation
- Les conditions de paiement
- Les conditions générales

**Option choisie :**
- [ ] Option A - Phase 1 + Phase 2 (RECOMMANDÉE)
- [ ] Option A - Phase 1 + Phase 2 + Phase 3
- [ ] Option B - Développement direct

**Paiement choisi :**
- [ ] Option 1 - Échelonné (30/30/40)
- [ ] Option 2 - Forfait (50/50)
- [ ] Option 3 - Régie (mensuel)

**Services complémentaires :**
- [ ] Certificat code signing (100-300€)
- [ ] Build macOS (inclus Phase 3)
- [ ] Support maintenance : ____ mois à [Tarif]€/mois

---

**Fait à :** ______________________________

**Le :** ______________________________

**Signature et cachet :**


---

## 📎 ANNEXES

### Annexe A : Spécifications Techniques

**Technologies utilisées :**
- **Frontend :** Electron 28.x, React 18.x, Recharts 2.x, TailwindCSS 3.x
- **Backend :** Python 3.11, Pandas 2.1+, SQLite 3.x, ReportLab 4.0+
- **Sécurité :** cryptography 41.x (AES-256), PBKDF2, audit logs
- **Build :** Electron Builder, PyInstaller

**Formats supportés :**
- CSV (délimiteurs : `,` `;` `|` `\t`)
- Excel (.xlsx, .xls)
- JSON (flat et nested)

**Configuration minimale :**
- Windows 10/11 ou macOS 10.14+
- RAM : 4 GB minimum (8 GB recommandé)
- Disque : 5 GB libre
- Processeur : Intel i3 2015+ ou équivalent

**Performance garantie :**
- Import 100K lignes : < 10 secondes
- Fusion 3 fichiers : < 15 secondes
- Export PDF 10 pages : < 5 secondes

### Annexe B : Documents de Référence

- PRESENTATION_SOLUTION_VALIDATION.md (Architecture complète)
- RECOMMANDATION_FINALE_V2.md (Recommandations détaillées)
- EXIGENCES_MATERIELLES.md (Configuration requise)

### Annexe C : Coordonnées Bancaires

**RIB :** [À compléter]
**IBAN :** [À compléter]
**BIC :** [À compléter]
**Banque :** [À compléter]

---

**FIN DU DEVIS**

**Pages : [X] pages**
**Version : 1.0**
**Date : 14 janvier 2024**
