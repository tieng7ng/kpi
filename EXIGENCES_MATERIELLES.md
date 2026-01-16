# Exigences Matérielles - Application KPI

## 🚨 IMPORTANT : Version Portable (Sans Droits Administrateur)

### ✅ Solution RECOMMANDÉE pour Environnements Professionnels Verrouillés

**Problème courant en entreprise :**
- Les utilisateurs n'ont PAS les droits administrateur sur leur machine
- Impossible d'installer des logiciels classiques
- IT/DSI bloque les installations

**Notre solution : VERSION PORTABLE (ZERO INSTALLATION)**

---

### 📦 Qu'est-ce qu'une Version Portable ?

Une application portable est un logiciel qui :
- ❌ **NE NÉCESSITE AUCUNE INSTALLATION**
- ❌ **N'A PAS BESOIN DE DROITS ADMIN**
- ✅ Fonctionne depuis n'importe quel dossier
- ✅ Peut être lancée depuis une clé USB
- ✅ Ne modifie PAS le registre Windows
- ✅ Ne laisse aucune trace sur le système

**Analogie :** Comme un fichier Word - vous le copiez et vous l'ouvrez, c'est tout !

---

### 🎯 Déploiement Version Portable

#### Méthode 1 : Déploiement par l'IT (Recommandé)

```
1. L'IT télécharge : AnalyseurKPI-Portable.zip
2. L'IT décompresse sur un partage réseau :
   \\serveur\applications\AnalyseurKPI\
3. Les utilisateurs créent un raccourci vers :
   \\serveur\applications\AnalyseurKPI\AnalyseurKPI.exe
4. ✅ Terminé ! Aucune installation sur les postes
```

**Avantages :**
- Déploiement sur 1000 utilisateurs en 5 minutes
- Mises à jour centralisées (1 seul endroit)
- Aucune intervention sur les postes
- Conforme aux politiques de sécurité

---

#### Méthode 2 : Déploiement par Email

```
1. L'IT envoie un email avec :
   - Fichier joint : AnalyseurKPI-Portable.zip (150 MB)
   - Instructions : "Décompressez et double-cliquez sur AnalyseurKPI.exe"

2. L'utilisateur :
   - Télécharge le ZIP
   - Extrait dans Documents\MesApplications\AnalyseurKPI\
   - Double-clic sur AnalyseurKPI.exe
   - ✅ Ça fonctionne !
```

**Temps utilisateur : 2 minutes**

---

#### Méthode 3 : Clé USB (Pour données ultra-sensibles)

```
1. Copier le dossier AnalyseurKPI\ sur une clé USB
2. Brancher la clé sur n'importe quel ordinateur Windows
3. Ouvrir la clé USB (ex: E:\)
4. Double-cliquer sur E:\AnalyseurKPI\AnalyseurKPI.exe
5. ✅ L'application démarre !

Données stockées sur la clé USB (jamais sur l'ordinateur)
```

**Cas d'usage :**
- Auditeurs externes
- Consultants itinérants
- Données top-secrètes
- Environnements ultra-sécurisés

---

### 📁 Structure du Dossier Portable

```
AnalyseurKPI\
├── AnalyseurKPI.exe          ← Double-cliquer ici pour lancer
├── python311.dll              ← Python embarqué (invisible)
├── lib\                       ← Bibliothèques (invisible)
├── data\                      ← Vos données (créé au 1er lancement)
│   ├── database.db           ← Base SQLite locale
│   ├── imports\              ← Fichiers importés
│   └── exports\              ← PDF/Excel générés
├── config\                    ← Configuration
│   └── settings.json         ← Paramètres utilisateur
└── logs\                      ← Logs techniques (dépannage)
```

**Taille totale :** 150-200 MB

---

### 🔒 Sécurité de la Version Portable

#### Avantages Sécurité

✅ **Aucune modification système**
- Pas d'écriture dans C:\Program Files
- Pas de modification du registre
- Pas de service Windows installé
- Facile à auditer par la DSI

✅ **Isolation totale**
- Chaque utilisateur a sa propre copie
- Aucun impact entre utilisateurs
- Désinstallation = supprimer le dossier

✅ **Traçabilité**
- Logs conservés dans le dossier
- Audit trail complet
- Conforme RGPD

#### Conformité Entreprise

**Points de validation DSI :**
- ☑ Pas de droits admin requis
- ☑ Pas d'accès réseau externe (100% local)
- ☑ Données chiffrées (AES-256)
- ☑ Logs d'audit
- ☑ Code signé numériquement (option)
- ☑ Scan antivirus possible
- ☑ Désinstallation propre

---

### 🚀 Comparaison Versions

| Critère | Version Installable | Version Portable |
|---------|-------------------|------------------|
| **Droits admin requis** | ✅ OUI | ❌ NON |
| **Facilité déploiement** | Moyen | ⭐⭐⭐⭐⭐ Très facile |
| **Déploiement IT** | Nécessite GPO/SCCM | Simple copie fichier |
| **Mises à jour** | Auto-update possible | Copie nouveau ZIP |
| **Clé USB** | ❌ Non | ✅ OUI |
| **Taille** | 150 MB | 150 MB |
| **Performance** | Identique | Identique |
| **Sécurité** | Identique | Identique |
| **Multi-utilisateurs** | 1 install = tous users | 1 copie par user |

**Recommandation : Version PORTABLE pour entreprise**

---

### 💼 Cas d'Usage Entreprise

#### Scénario 1 : Banque / Finance (Sécurité max)
```
Contraintes :
- Postes verrouillés (pas de droits admin)
- Pare-feu strict (pas d'accès externe)
- Données ultra-sensibles
- Audit trail obligatoire

Solution :
✅ Version portable sur partage réseau interne
✅ Données stockées localement (jamais le réseau)
✅ Logs centralisés (partage réseau)
✅ Validation DSI simple (code source auditable)
```

#### Scénario 2 : Consultants / Auditeurs
```
Contraintes :
- Travail chez différents clients
- Pas d'accès admin sur machines clientes
- Besoin d'emporter les données

Solution :
✅ Version portable sur clé USB chiffrée
✅ Tout autonome (app + données + exports)
✅ Aucune trace laissée sur ordinateur client
```

#### Scénario 3 : PME sans IT dédié
```
Contraintes :
- Pas de service IT
- Utilisateurs non techniques
- Budget limité

Solution :
✅ Version portable déployée par email
✅ Instructions simples (3 étapes)
✅ Support minimal requis
```

---

### ⚙️ Configuration IT (Pour Déploiement Masse)

#### Script de Déploiement Automatique (Windows)

```batch
@echo off
REM Script de déploiement AnalyseurKPI (Version Portable)
REM À exécuter via GPO ou SCCM

SET DEST=%USERPROFILE%\Applications\AnalyseurKPI
SET SOURCE=\\serveur\applications\AnalyseurKPI-Portable

echo Déploiement AnalyseurKPI...

REM Créer le dossier de destination
if not exist "%DEST%" mkdir "%DEST%"

REM Copier les fichiers
xcopy /E /I /Y "%SOURCE%\*" "%DEST%\"

REM Créer un raccourci sur le bureau
powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut('%USERPROFILE%\Desktop\Analyseur KPI.lnk');$s.TargetPath='%DEST%\AnalyseurKPI.exe';$s.Save()"

echo Déploiement terminé !
pause
```

#### Script de Mise à Jour

```batch
@echo off
REM Mise à jour automatique (ne touche pas aux données)

SET DEST=%USERPROFILE%\Applications\AnalyseurKPI
SET SOURCE=\\serveur\applications\AnalyseurKPI-Portable

REM Sauvegarder les données utilisateur
xcopy /E /I /Y "%DEST%\data" "%DEST%\data_backup"

REM Mettre à jour l'application
xcopy /E /I /Y "%SOURCE%\*.exe" "%DEST%\"
xcopy /E /I /Y "%SOURCE%\lib" "%DEST%\lib\"

echo Mise à jour terminée !
```

---

### 📋 Checklist Validation DSI

**Pour faire valider par votre département IT :**

```
☐ Application portable (pas d'installation système)
☐ Pas de droits administrateur requis
☐ Aucune connexion réseau externe
☐ Données stockées localement (chiffrées)
☐ Code source disponible pour audit (option)
☐ Certificat de signature numérique (option)
☐ Scan antivirus propre (VirusTotal)
☐ Logs d'audit détaillés
☐ Conforme RGPD (données personnelles)
☐ Documentation technique complète
☐ Support et maintenance définis
```

---

### 🎯 Installation Pas-à-Pas (Utilisateur Final)

#### Version Simple (Email)

```
1️⃣ Recevoir l'email de l'IT avec le fichier ZIP

2️⃣ Télécharger AnalyseurKPI-Portable.zip
   → Enregistrer dans Téléchargements

3️⃣ Clic droit sur le ZIP → "Extraire tout..."
   → Choisir : Documents\MesApplications\

4️⃣ Ouvrir le dossier :
   Documents\MesApplications\AnalyseurKPI\

5️⃣ Double-cliquer sur : AnalyseurKPI.exe

6️⃣ ✅ L'application démarre !
   (Aucune installation, aucun message admin)
```

**TEMPS TOTAL : 1 minute**

---

#### Version Partage Réseau (IT géré)

```
1️⃣ Recevoir l'email de l'IT avec les instructions

2️⃣ Ouvrir l'Explorateur Windows

3️⃣ Dans la barre d'adresse, taper :
   \\serveur\applications\AnalyseurKPI\

4️⃣ Double-cliquer sur : AnalyseurKPI.exe

5️⃣ ✅ L'application démarre !

Optionnel : Créer un raccourci sur le bureau
→ Clic droit sur AnalyseurKPI.exe
→ "Créer un raccourci"
→ Glisser le raccourci sur le bureau
```

**TEMPS TOTAL : 30 secondes**

---

### ❓ FAQ Version Portable

**Q : Mes données sont-elles sauvegardées si je supprime le dossier ?**
R : Non, tout est dans le dossier. Faire une copie = backup complet.

**Q : Puis-je copier le dossier sur plusieurs ordinateurs ?**
R : Oui ! Chaque copie est indépendante.

**Q : Est-ce que ça fonctionne sur Mac ?**
R : Oui, version .app portable disponible aussi.

**Q : Puis-je mettre le dossier sur OneDrive/Dropbox ?**
R : Techniquement oui, mais non recommandé (conflits de base de données). Mieux : synchroniser le dossier exports/ uniquement.

**Q : L'application se met-à-jour automatiquement ?**
R : Non (pas de droits admin). L'IT envoie la nouvelle version par email ou partage réseau.

**Q : Quelle est la différence de performance vs version installée ?**
R : Aucune différence ! Performance identique.

**Q : Puis-je utiliser l'application sur un ordinateur non connecté au réseau ?**
R : Oui à 100% ! L'application fonctionne totalement hors-ligne.

---

## 🖥️ Solution 2 : Application Web Locale

### ✅ Spécifications MINIMALES (Ordinateur d'entrée de gamme)

**Configuration :**
- **Processeur** : Intel Core i3 ou équivalent (2015+)
- **RAM** : 4 GB
- **Disque dur** : 5 GB d'espace libre (SSD ou HDD)
- **Système d'exploitation** :
  - Windows 10/11
  - macOS 10.14+ (Mojave ou plus récent)
  - Linux (Ubuntu 20.04+)

**Performance attendue avec cette config :**
- Fichiers jusqu'à **50 000 lignes** : Fluide ✅
- Temps de traitement : 5-10 secondes
- Graphiques : Chargement instantané
- Export PDF : 3-5 secondes

---

### 🚀 Spécifications RECOMMANDÉES (Confort optimal)

**Configuration :**
- **Processeur** : Intel Core i5 / AMD Ryzen 5 (2018+)
- **RAM** : 8 GB
- **Disque dur** : 10 GB d'espace libre (SSD recommandé)
- **Système d'exploitation** : Windows 10/11, macOS 10.15+

**Performance attendue avec cette config :**
- Fichiers jusqu'à **500 000 lignes** : Fluide ✅
- Temps de traitement : 2-5 secondes
- Graphiques : Instantané
- Export PDF : 1-2 secondes
- Plusieurs dashboards simultanés : Pas de problème

---

### 💪 Spécifications PUISSANTES (Pour gros volumes)

**Configuration :**
- **Processeur** : Intel Core i7 / AMD Ryzen 7
- **RAM** : 16 GB+
- **Disque dur** : SSD NVMe
- **Système d'exploitation** : Windows 11, macOS récent

**Performance attendue :**
- Fichiers jusqu'à **5 000 000+ lignes** : Gérable ✅
- Temps de traitement : 10-30 secondes
- Multi-tâches sans ralentissement

---

## 📊 Tableau Comparatif par Volume de Données

| Volume de données | Config MIN | Config RECOMMANDÉE | Config PUISSANTE |
|-------------------|------------|-------------------|------------------|
| **< 10K lignes** | ⚡ Instantané | ⚡ Instantané | ⚡ Instantané |
| **10K - 50K lignes** | ✅ 5-10s | ⚡ 2-3s | ⚡ < 1s |
| **50K - 100K lignes** | ⚠️ 15-30s | ✅ 5-8s | ⚡ 2-3s |
| **100K - 500K lignes** | ❌ Lent/Crash | ✅ 10-20s | ✅ 5-10s |
| **500K - 1M lignes** | ❌ Non viable | ⚠️ 30-60s | ✅ 15-30s |
| **> 1M lignes** | ❌ Impossible | ❌ Très lent | ⚠️ Possible mais lent |

**Légende :**
- ⚡ Instantané (< 2 secondes)
- ✅ Fluide (2-15 secondes)
- ⚠️ Acceptable (15-60 secondes)
- ❌ Non recommandé

---

## 💻 Exemples d'Ordinateurs Compatibles

### ✅ COMPATIBLES (Config minimale suffisante)

**Ordinateurs de bureau :**
- Dell Inspiron 3000 series (2018+)
- HP Pavilion (2017+)
- Lenovo IdeaCentre (2017+)
- Tout PC de bureau depuis 2015 avec 4GB RAM

**Ordinateurs portables :**
- Dell Latitude série E (E7470+)
- HP EliteBook 840 G3+
- Lenovo ThinkPad T460+
- MacBook Air 2015+
- MacBook Pro 2015+

**Prix indicatif :**
- Neufs : à partir de 400€
- D'occasion : 200-300€ (2017-2019)

---

### 🚀 OPTIMAUX (Config recommandée)

**Ordinateurs portables récents :**
- MacBook Air M1/M2 (excellent choix, très rapide)
- Dell XPS 13/15
- HP EliteBook 850
- Lenovo ThinkPad T14/X1
- Tout laptop moderne de bureau (2020+)

**Prix indicatif :**
- Neufs : 700-1200€
- D'occasion : 400-600€

---

## 🔍 Comment Connaître les Spécifications de Votre Ordinateur

### Windows 10/11
```
1. Clic droit sur "Ce PC" / "Ordinateur"
2. Cliquer "Propriétés"
3. Vous verrez :
   - Processeur : (ex: Intel Core i5-8250U)
   - RAM installée : (ex: 8,00 Go)
   - Type système : 64 bits
```

### macOS
```
1. Logo Apple (coin haut gauche)
2. "À propos de ce Mac"
3. Vous verrez :
   - Processeur : (ex: Intel Core i5 2,3 GHz)
   - Mémoire : (ex: 8 GB)
   - macOS : (ex: Monterey 12.6)
```

---

## 📈 Impact du Volume de Données

### Scénario 1 : Petite Entreprise / Usage Personnel
**Données typiques :**
- 3-5 fichiers par mois
- 1 000 - 10 000 lignes total
- Fichiers CSV/Excel légers (< 1 MB chacun)

**Configuration requise :** MINIMALE ✅
**Ordinateur type :** N'importe quel PC/Mac depuis 2015
**Budget :** 0€ (ordinateur existant suffit)

---

### Scénario 2 : PME / Département
**Données typiques :**
- 10-20 fichiers par mois
- 50 000 - 200 000 lignes total
- Fichiers Excel moyens (1-10 MB)

**Configuration requise :** RECOMMANDÉE
**Ordinateur type :** PC de bureau standard (2018+)
**Budget :** 0-400€ (upgrade RAM si < 8GB)

---

### Scénario 3 : Grande Entreprise
**Données typiques :**
- 50+ fichiers par mois
- 500 000 - 2 000 000 lignes
- Gros fichiers Excel/CSV (10-100 MB)

**Configuration requise :** PUISSANTE
**Ordinateur type :** Workstation ou laptop performant
**Budget :** 800-1500€

---

## ⚡ Optimisations Possibles (Sans Changer d'Ordinateur)

### Si votre ordinateur est LENT, on peut :

**1. Traitement par Lots**
```
Au lieu de charger tout d'un coup :
├─ Fichier 1 → Traiter → Sauvegarder
├─ Fichier 2 → Traiter → Sauvegarder
├─ Fichier 3 → Traiter → Sauvegarder
└─ Fusionner les résultats
```
**Résultat :** Fonctionne même avec 2GB RAM !

**2. Échantillonnage Intelligent**
```
Pour la visualisation :
- Afficher 10 000 points au lieu de 1 000 000
- Qualité graphique identique
- Vitesse x100
```

**3. Cache Agressif**
```
Calculs lourds :
- 1ère fois : 30 secondes
- Fois suivantes : < 1 seconde (cache)
```

**4. Mode "Données Allégées"**
```
Option dans l'app :
☐ Mode complet (lent mais précis)
☑ Mode rapide (échantillonné, rapide)
```

**5. Pré-agrégation**
```
Au lieu de stocker :
- 1 000 000 de lignes détaillées

On stocke :
- 365 jours × moyennes quotidiennes
= 365 lignes (2700x plus léger !)
```

---

## 🎯 Recommandation Selon Votre Cas

### Vous avez un ordinateur de bureau/portable depuis 2017+ ?
**→ ✅ PARFAIT ! Aucun achat nécessaire**

Vérifiez juste :
- Au moins 4 GB de RAM (8 GB idéal)
- 5 GB d'espace disque libre
- Windows 10/11 ou macOS récent

---

### Vous avez un vieil ordinateur (2010-2016) ?

**Option A : Upgrade RAM (30-80€)**
- Passer de 4GB à 8GB de RAM
- Installation simple (ou chez un réparateur : +20€)
- **Résultat :** Ordinateur 2x plus rapide

**Option B : Optimisations logicielles (0€)**
- On adapte l'application pour ordinateurs lents
- Mode "allégé" automatique
- Ça fonctionnera, juste un peu plus lent

**Option C : Nouvel ordinateur (400-800€)**
- Si l'ordinateur actuel est vraiment trop vieux
- Investissement aussi pour autres usages

---

## 💾 Espace Disque Nécessaire

### Installation de l'Application
- **Application elle-même** : 100-200 MB
- **Base de données SQLite** : Variable selon données
  - 10 000 lignes : ~2 MB
  - 100 000 lignes : ~20 MB
  - 1 000 000 lignes : ~200 MB
- **Cache temporaire** : 50-100 MB
- **Exports (PDF/Excel)** : 1-10 MB par export

### Calcul Rapide
```
Application : 200 MB
+ Données (100K lignes) : 20 MB
+ Cache : 50 MB
+ Exports : 50 MB
= TOTAL : ~300-500 MB

Sur un disque dur de 256 GB → Aucun problème !
```

---

## 🌐 Connexion Internet Requise ?

### Installation
**1ère fois uniquement :**
- Télécharger le fichier d'installation (150-200 MB)
- Temps : 2-10 minutes selon débit

### Utilisation
**❌ NON, aucune connexion requise !**

L'application fonctionne 100% hors-ligne :
- Traitement des données : LOCAL
- Base de données : LOCAL
- Graphiques : LOCAL
- Exports : LOCAL

**Avantage :** Fonctionne même :
- En avion
- Dans un train
- Sans Wi-Fi
- Avec données sensibles (aucune fuite possible)

---

## 🔋 Consommation Électrique / Batterie

### Ordinateur Portable
**En utilisation :**
- Traitement de données : Consommation moyenne
- Visualisation graphiques : Consommation faible
- Mode veille : Consommation minimale

**Autonomie :**
- Laptop moderne (8h autonomie) : 6-7h avec l'application
- Vieux laptop (3h autonomie) : 2-3h avec l'application

**Conseil :** Brancher sur secteur pour traiter de gros fichiers

---

## 📱 Compatibilité Tablette / Smartphone

### Tablette Windows (Surface, etc.)
**✅ Fonctionne parfaitement**
- Surface Pro 6+ : Excellent
- Tablettes Windows 10/11 avec 4GB+ RAM : OK

### iPad / Tablette Android
**❌ Non compatible**
- L'application nécessite Windows/macOS/Linux
- Alternative possible : Version web consultable depuis tablette

### Smartphone
**❌ Non compatible**
- Écran trop petit pour dashboards
- Puissance insuffisante
- Alternative : Exporter les rapports en PDF et consulter sur mobile

---

## 🧪 Test de Compatibilité Avant Installation

### Checklist Rapide

```
☐ Système d'exploitation :
   ☐ Windows 10/11 OU
   ☐ macOS 10.14+ OU
   ☐ Linux Ubuntu 20.04+

☐ RAM :
   ☐ Au moins 4 GB (8 GB recommandé)

☐ Espace disque :
   ☐ Au moins 5 GB libre

☐ Processeur :
   ☐ Fabriqué après 2015

☐ Droits administrateur :
   ☐ Possibilité d'installer des logiciels
```

**Si tous les ☐ sont cochés → Vous êtes bon ! ✅**

---

## 💡 Cas Particuliers

### Mon entreprise utilise des ordinateurs verrouillés
**Solution :** Version portable (sans installation)
- Fichier .zip à décompresser
- Lancer directement sans installer
- Aucun droit administrateur requis
- Fonctionne depuis une clé USB

### J'ai un Mac avec puce M1/M2
**✅ EXCELLENT !** Encore plus rapide que les configs recommandées
- MacBook Air M1 (base) > PC i7 puissant
- Très basse consommation
- Parfaitement silencieux

### J'ai un Chromebook
**⚠️ Limité**
- Dépend du modèle
- Chromebook récents avec Linux : Possible
- Chromebook basiques : Non recommandé
- Alternative : Version web uniquement

---

## 🎯 Verdict Final pour Solution 2

### Pour 90% des utilisateurs :

**Votre ordinateur actuel suffit probablement !**

**Si vous pouvez :**
- Ouvrir Excel avec un fichier de 10 000 lignes
- Regarder une vidéo YouTube en HD
- Naviguer sur internet sans lag

**→ Alors vous pouvez utiliser cette application sans problème ✅**

---

## 📞 Comment Savoir si MON Ordinateur Spécifique Fonctionne ?

**Méthode 1 : Envoyez-moi vos specs**
```
Windows :
1. Touche Windows + R
2. Taper "msinfo32"
3. Screenshot et m'envoyer

Mac :
1. Pomme > À propos de ce Mac
2. Screenshot et m'envoyer
```

**Méthode 2 : Test benchmark simple**
```
Essayez d'ouvrir un fichier Excel avec :
- 50 000 lignes
- Quelques colonnes

Si ça s'ouvre en < 10 secondes :
→ Votre PC est parfait pour l'app ! ✅
```

---

## 🆚 Comparaison avec Autres Logiciels

| Logiciel | RAM Min | Disque | Processeur |
|----------|---------|--------|------------|
| **Notre App KPI** | 4 GB | 500 MB | i3 2015+ |
| Microsoft Excel | 4 GB | 4 GB | i3 2010+ |
| Tableau Desktop | 8 GB | 15 GB | i5 récent |
| Power BI Desktop | 8 GB | 2.5 GB | i5 récent |
| Google Sheets (web) | 2 GB | 0 MB | Tout |

**→ Notre application est MOINS exigeante qu'Excel !**

---

## ✅ Conclusion

**Besoin d'un ordinateur puissant ? NON !** ✅

**Configuration minimale :**
- N'importe quel PC/Mac depuis 2015
- 4 GB de RAM
- Configuration similaire à celle pour utiliser Excel

**Si votre ordinateur peut faire tourner Excel → Il peut faire tourner notre app**

**Besoin de plus d'infos sur votre configuration spécifique ?**
Envoyez-moi les caractéristiques de votre ordinateur et je vous dirai exactement ce qu'il peut gérer !
