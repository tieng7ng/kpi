# Guide de Déploiement VPS - KPI Analyzer

Guide complet pour déployer l'application KPI Analyzer sur un serveur VPS de production.

---

## Table des matières

1. [Prérequis](#1-prérequis)
2. [Configuration initiale du VPS](#2-configuration-initiale-du-vps)
3. [Installation des dépendances](#3-installation-des-dépendances)
4. [Déploiement du code](#4-déploiement-du-code)
5. [Configuration du Backend](#5-configuration-du-backend)
6. [Configuration du Frontend](#6-configuration-du-frontend)
7. [Configuration Nginx](#7-configuration-nginx)
8. [Configuration HTTPS](#8-configuration-https-lets-encrypt)
9. [Services Systemd](#9-services-systemd)
10. [Firewall et Sécurité](#10-firewall-et-sécurité)
11. [Mises à jour et Maintenance](#11-mises-à-jour-et-maintenance)
12. [Monitoring et Logs](#12-monitoring-et-logs)
13. [Backups](#13-backups)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Prérequis

### 1.1 Spécifications VPS recommandées

| Ressource | Minimum | Recommandé |
|-----------|---------|------------|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 1 Go | 2 Go |
| Stockage | 20 Go SSD | 40 Go SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| Bande passante | 1 To/mois | Illimité |

### 1.2 Informations à préparer

- [ ] Adresse IP du VPS
- [ ] Accès SSH root ou sudo
- [ ] Nom de domaine pointant vers l'IP du VPS
- [ ] Accès au dépôt Git du projet

### 1.3 Fournisseurs VPS compatibles

- OVH
- Scaleway
- DigitalOcean
- Hetzner
- Linode
- Vultr

---

## 2. Configuration initiale du VPS

### 2.1 Première connexion SSH

```bash
# Connexion en root
ssh root@VOTRE_IP_VPS
```

### 2.2 Mise à jour du système

```bash
apt update && apt upgrade -y
```

### 2.3 Créer un utilisateur dédié

```bash
# Créer l'utilisateur
adduser kpi-app

# Ajouter au groupe sudo
usermod -aG sudo kpi-app

# Configurer les permissions sudo sans mot de passe (optionnel)
echo "kpi-app ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/kpi-app
```

### 2.4 Configurer SSH pour l'utilisateur

```bash
# Copier les clés SSH autorisées
mkdir -p /home/kpi-app/.ssh
cp /root/.ssh/authorized_keys /home/kpi-app/.ssh/
chown -R kpi-app:kpi-app /home/kpi-app/.ssh
chmod 700 /home/kpi-app/.ssh
chmod 600 /home/kpi-app/.ssh/authorized_keys
```

### 2.5 Sécuriser SSH (optionnel mais recommandé)

Éditez `/etc/ssh/sshd_config` :

```bash
# Désactiver la connexion root
PermitRootLogin no

# Désactiver l'authentification par mot de passe
PasswordAuthentication no

# Changer le port SSH (optionnel)
# Port 2222
```

```bash
# Appliquer les changements
systemctl restart sshd
```

### 2.6 Configurer le hostname

```bash
hostnamectl set-hostname kpi-analyzer
echo "127.0.0.1 kpi-analyzer" >> /etc/hosts
```

---

## 3. Installation des dépendances

Connectez-vous avec l'utilisateur kpi-app :

```bash
ssh kpi-app@VOTRE_IP_VPS
```

### 3.1 Installer les paquets essentiels

```bash
sudo apt install -y \
    git \
    curl \
    wget \
    vim \
    htop \
    ufw \
    nginx \
    certbot \
    python3-certbot-nginx
```

### 3.2 Installer Python 3.11

```bash
# Ajouter le PPA deadsnakes
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt update

# Installer Python 3.11
sudo apt install -y python3.11 python3.11-venv python3.11-dev

# Vérifier l'installation
python3.11 --version
```

### 3.3 Installer Node.js 20 LTS

```bash
# Ajouter le repository NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Installer Node.js
sudo apt install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

### 3.4 Installer pip et les outils Python

```bash
sudo apt install -y python3-pip
pip3 install --upgrade pip
```

---

## 4. Déploiement du code

### 4.1 Cloner le dépôt

```bash
cd /home/kpi-app
git clone https://github.com/VOTRE_REPO/kpi-analyzer.git
cd kpi-analyzer
```

### 4.2 Structure des dossiers

```
/home/kpi-app/
└── kpi-analyzer/
    ├── kpi-analyzer-monorepo/
    │   ├── electron-app/      # Frontend React
    │   └── python-engine/     # Backend FastAPI
    └── ...
```

### 4.3 Configurer les permissions

```bash
sudo chown -R kpi-app:kpi-app /home/kpi-app/kpi-analyzer
chmod -R 755 /home/kpi-app/kpi-analyzer
```

---

## 5. Configuration du Backend

### 5.1 Créer l'environnement virtuel Python

```bash
cd /home/kpi-app/kpi-analyzer/kpi-analyzer-monorepo/python-engine

# Créer le venv
python3.11 -m venv .venv

# Activer le venv
source .venv/bin/activate

# Installer les dépendances
pip install --upgrade pip
pip install -r requirements.txt

# Installer Gunicorn (serveur de production)
pip install gunicorn
```

### 5.2 Créer le fichier de configuration

Créez `/home/kpi-app/kpi-analyzer/kpi-analyzer-monorepo/python-engine/.env` :

```bash
cat > .env << 'EOF'
# Configuration Production
DEBUG=false
HOST=127.0.0.1
PORT=8000

# Base de données
DATABASE_URL=sqlite:///./data/kpi.db

# CORS - Remplacez par votre domaine
ALLOWED_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com
EOF
```

### 5.3 Créer le dossier data

```bash
mkdir -p /home/kpi-app/kpi-analyzer/kpi-analyzer-monorepo/python-engine/data
chmod 755 /home/kpi-app/kpi-analyzer/kpi-analyzer-monorepo/python-engine/data
```

### 5.4 Tester le backend manuellement

```bash
source .venv/bin/activate
python main.py

# Dans un autre terminal, tester l'API
curl http://127.0.0.1:8000/api/health
```

---

## 6. Configuration du Frontend

### 6.1 Installer les dépendances Node.js

```bash
cd /home/kpi-app/kpi-analyzer/kpi-analyzer-monorepo/electron-app

# Installer les dépendances
npm ci
```

### 6.2 Configurer l'URL de l'API

Créez `.env.production` :

```bash
cat > .env.production << 'EOF'
VITE_API_URL=/api
EOF
```

### 6.3 Build de production

```bash
npm run build
```

Les fichiers statiques seront générés dans `dist/`.

### 6.4 Copier les fichiers vers Nginx

```bash
sudo mkdir -p /var/www/kpi-analyzer
sudo cp -r dist/* /var/www/kpi-analyzer/
sudo chown -R www-data:www-data /var/www/kpi-analyzer
sudo chmod -R 755 /var/www/kpi-analyzer
```

---

## 7. Configuration Nginx

### 7.1 Créer la configuration du site

```bash
sudo nano /etc/nginx/sites-available/kpi-analyzer
```

Contenu :

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Redirection HTTPS (sera configuré par Certbot)
    # return 301 https://$server_name$request_uri;

    root /var/www/kpi-analyzer;
    index index.html;

    # Logs
    access_log /var/log/nginx/kpi-analyzer.access.log;
    error_log /var/log/nginx/kpi-analyzer.error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    # Frontend React (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy vers l'API Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support (si nécessaire)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts pour les uploads
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 300s;

        # Taille max des uploads (50 Mo)
        client_max_body_size 50M;
    }

    # Cache des assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Sécurité : bloquer l'accès aux fichiers cachés
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### 7.2 Activer le site

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/kpi-analyzer /etc/nginx/sites-enabled/

# Supprimer le site par défaut
sudo rm -f /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### 7.3 Vérifier que Nginx fonctionne

```bash
sudo systemctl status nginx
curl http://localhost
```

---

## 8. Configuration HTTPS (Let's Encrypt)

### 8.1 Obtenir le certificat SSL

```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

Suivez les instructions :
- Entrez votre email
- Acceptez les conditions
- Choisissez de rediriger HTTP vers HTTPS (option 2)

### 8.2 Vérifier le renouvellement automatique

```bash
# Test de renouvellement
sudo certbot renew --dry-run

# Vérifier le timer systemd
sudo systemctl status certbot.timer
```

### 8.3 Configuration Nginx après Certbot

Certbot modifie automatiquement la configuration. Vérifiez avec :

```bash
sudo cat /etc/nginx/sites-available/kpi-analyzer
```

---

## 9. Services Systemd

### 9.1 Créer le service Backend

```bash
sudo nano /etc/systemd/system/kpi-backend.service
```

Contenu :

```ini
[Unit]
Description=KPI Analyzer Backend (FastAPI)
After=network.target

[Service]
Type=simple
User=kpi-app
Group=kpi-app
WorkingDirectory=/home/kpi-app/kpi-analyzer/kpi-analyzer-monorepo/python-engine
Environment="PATH=/home/kpi-app/kpi-analyzer/kpi-analyzer-monorepo/python-engine/.venv/bin"
EnvironmentFile=/home/kpi-app/kpi-analyzer/kpi-analyzer-monorepo/python-engine/.env
ExecStart=/home/kpi-app/kpi-analyzer/kpi-analyzer-monorepo/python-engine/.venv/bin/gunicorn \
    main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 127.0.0.1:8000 \
    --access-logfile /var/log/kpi-backend/access.log \
    --error-logfile /var/log/kpi-backend/error.log
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### 9.2 Créer les dossiers de logs

```bash
sudo mkdir -p /var/log/kpi-backend
sudo chown kpi-app:kpi-app /var/log/kpi-backend
```

### 9.3 Activer et démarrer le service

```bash
# Recharger systemd
sudo systemctl daemon-reload

# Activer le service au démarrage
sudo systemctl enable kpi-backend

# Démarrer le service
sudo systemctl start kpi-backend

# Vérifier le statut
sudo systemctl status kpi-backend
```

### 9.4 Commandes de gestion du service

```bash
# Démarrer
sudo systemctl start kpi-backend

# Arrêter
sudo systemctl stop kpi-backend

# Redémarrer
sudo systemctl restart kpi-backend

# Voir les logs
sudo journalctl -u kpi-backend -f
```

---

## 10. Firewall et Sécurité

### 10.1 Configurer UFW

```bash
# Activer UFW
sudo ufw enable

# Autoriser SSH
sudo ufw allow ssh
# ou si vous avez changé le port SSH :
# sudo ufw allow 2222/tcp

# Autoriser HTTP et HTTPS
sudo ufw allow 'Nginx Full'

# Vérifier les règles
sudo ufw status verbose
```

### 10.2 Résultat attendu

```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
22/tcp (v6)                ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)
```

### 10.3 Sécurité additionnelle (optionnel)

```bash
# Installer Fail2ban pour protéger SSH
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 11. Mises à jour et Maintenance

### 11.1 Script de déploiement

Créez `/home/kpi-app/deploy.sh` :

```bash
#!/bin/bash
set -e

echo "=== Déploiement KPI Analyzer ==="

cd /home/kpi-app/kpi-analyzer

# Récupérer les dernières modifications
echo "1. Récupération du code..."
git pull origin main

# Backend
echo "2. Mise à jour du backend..."
cd kpi-analyzer-monorepo/python-engine
source .venv/bin/activate
pip install -r requirements.txt

# Frontend
echo "3. Build du frontend..."
cd ../electron-app
npm ci
npm run build

# Copier les fichiers statiques
echo "4. Déploiement des fichiers statiques..."
sudo cp -r dist/* /var/www/kpi-analyzer/
sudo chown -R www-data:www-data /var/www/kpi-analyzer

# Redémarrer les services
echo "5. Redémarrage des services..."
sudo systemctl restart kpi-backend
sudo systemctl reload nginx

echo "=== Déploiement terminé ==="
```

```bash
chmod +x /home/kpi-app/deploy.sh
```

### 11.2 Exécuter une mise à jour

```bash
/home/kpi-app/deploy.sh
```

### 11.3 Mises à jour système

```bash
# Mettre à jour le système (à faire régulièrement)
sudo apt update && sudo apt upgrade -y

# Redémarrer si nécessaire
sudo reboot
```

---

## 12. Monitoring et Logs

### 12.1 Logs de l'application

```bash
# Logs du backend (systemd)
sudo journalctl -u kpi-backend -f

# Logs Gunicorn
sudo tail -f /var/log/kpi-backend/access.log
sudo tail -f /var/log/kpi-backend/error.log

# Logs Nginx
sudo tail -f /var/log/nginx/kpi-analyzer.access.log
sudo tail -f /var/log/nginx/kpi-analyzer.error.log
```

### 12.2 Monitoring système

```bash
# Utilisation CPU/RAM en temps réel
htop

# Espace disque
df -h

# Utilisation mémoire
free -h

# Processus actifs
ps aux | grep -E "(python|gunicorn|nginx)"
```

### 12.3 Vérifier la santé de l'API

```bash
# Test de l'endpoint health
curl -s https://votre-domaine.com/api/health | jq

# Ou sans jq
curl https://votre-domaine.com/api/health
```

### 12.4 Script de health check

Créez `/home/kpi-app/healthcheck.sh` :

```bash
#!/bin/bash

API_URL="https://votre-domaine.com/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ "$RESPONSE" != "200" ]; then
    echo "[$(date)] ERREUR: API non disponible (HTTP $RESPONSE)"
    # Optionnel: redémarrer le service
    # sudo systemctl restart kpi-backend
    exit 1
else
    echo "[$(date)] OK: API disponible"
    exit 0
fi
```

```bash
chmod +x /home/kpi-app/healthcheck.sh

# Ajouter au crontab pour vérification toutes les 5 minutes
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/kpi-app/healthcheck.sh >> /var/log/kpi-backend/healthcheck.log 2>&1") | crontab -
```

---

## 13. Backups

### 13.1 Script de backup

Créez `/home/kpi-app/backup.sh` :

```bash
#!/bin/bash
set -e

BACKUP_DIR="/home/kpi-app/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_PATH="/home/kpi-app/kpi-analyzer/kpi-analyzer-monorepo/python-engine/data/kpi.db"

# Créer le dossier de backup
mkdir -p $BACKUP_DIR

# Backup de la base de données SQLite
if [ -f "$DB_PATH" ]; then
    cp "$DB_PATH" "$BACKUP_DIR/kpi_$DATE.db"
    echo "[$(date)] Backup créé: kpi_$DATE.db"
else
    echo "[$(date)] ERREUR: Base de données non trouvée"
    exit 1
fi

# Supprimer les backups de plus de 30 jours
find $BACKUP_DIR -name "kpi_*.db" -mtime +30 -delete

# Lister les backups
echo "Backups disponibles:"
ls -lh $BACKUP_DIR
```

```bash
chmod +x /home/kpi-app/backup.sh
```

### 13.2 Automatiser les backups (crontab)

```bash
# Backup quotidien à 2h du matin
(crontab -l 2>/dev/null; echo "0 2 * * * /home/kpi-app/backup.sh >> /var/log/kpi-backend/backup.log 2>&1") | crontab -
```

### 13.3 Restaurer un backup

```bash
# Arrêter le service
sudo systemctl stop kpi-backend

# Restaurer
cp /home/kpi-app/backups/kpi_20240115_020000.db \
   /home/kpi-app/kpi-analyzer/kpi-analyzer-monorepo/python-engine/data/kpi.db

# Redémarrer
sudo systemctl start kpi-backend
```

---

## 14. Troubleshooting

### 14.1 Le backend ne démarre pas

```bash
# Vérifier les logs
sudo journalctl -u kpi-backend -n 100

# Tester manuellement
cd /home/kpi-app/kpi-analyzer/kpi-analyzer-monorepo/python-engine
source .venv/bin/activate
python main.py
```

### 14.2 Erreur 502 Bad Gateway

```bash
# Vérifier que le backend tourne
curl http://127.0.0.1:8000/api/health

# Vérifier le service
sudo systemctl status kpi-backend

# Redémarrer si nécessaire
sudo systemctl restart kpi-backend
```

### 14.3 Erreur 504 Gateway Timeout

```bash
# Augmenter les timeouts dans Nginx
# Éditer /etc/nginx/sites-available/kpi-analyzer
# proxy_read_timeout 300s;
sudo systemctl reload nginx
```

### 14.4 Problèmes de permissions

```bash
# Réappliquer les permissions
sudo chown -R kpi-app:kpi-app /home/kpi-app/kpi-analyzer
sudo chown -R www-data:www-data /var/www/kpi-analyzer
```

### 14.5 Espace disque plein

```bash
# Vérifier l'utilisation
df -h

# Nettoyer les logs
sudo journalctl --vacuum-time=7d

# Supprimer les anciens backups
find /home/kpi-app/backups -mtime +7 -delete

# Nettoyer apt
sudo apt autoremove -y
sudo apt clean
```

### 14.6 Le certificat SSL expire

```bash
# Renouveler manuellement
sudo certbot renew

# Vérifier la date d'expiration
sudo certbot certificates
```

### 14.7 Port 8000 déjà utilisé

```bash
# Trouver le processus
sudo lsof -i :8000

# Tuer le processus si nécessaire
sudo kill -9 <PID>

# Redémarrer le service
sudo systemctl restart kpi-backend
```

---

## 15. Checklist de déploiement

### Avant le déploiement

- [ ] VPS provisionné et accessible en SSH
- [ ] Domaine configuré avec DNS pointant vers l'IP du VPS
- [ ] Accès au dépôt Git

### Configuration initiale

- [ ] Système mis à jour (`apt update && apt upgrade`)
- [ ] Utilisateur `kpi-app` créé
- [ ] SSH sécurisé (connexion root désactivée)
- [ ] Python 3.11 installé
- [ ] Node.js 20 installé
- [ ] Nginx installé

### Déploiement application

- [ ] Code cloné dans `/home/kpi-app/kpi-analyzer`
- [ ] Environnement virtuel Python créé
- [ ] Dépendances Python installées
- [ ] Dépendances Node.js installées
- [ ] Frontend buildé et copié dans `/var/www/kpi-analyzer`
- [ ] Fichier `.env` configuré avec le bon domaine

### Services et sécurité

- [ ] Service systemd `kpi-backend` créé et actif
- [ ] Nginx configuré et actif
- [ ] Certificat SSL installé (Let's Encrypt)
- [ ] Firewall UFW configuré (ports 22, 80, 443)
- [ ] Fail2ban installé (optionnel)

### Post-déploiement

- [ ] Test de l'API : `curl https://votre-domaine.com/api/health`
- [ ] Test du frontend : ouvrir https://votre-domaine.com dans un navigateur
- [ ] Script de backup configuré et testé
- [ ] Script de déploiement créé
- [ ] Monitoring/health check configuré

---

## 16. Commandes de référence rapide

```bash
# === SERVICES ===
sudo systemctl status kpi-backend          # Statut backend
sudo systemctl restart kpi-backend         # Redémarrer backend
sudo systemctl reload nginx                # Recharger Nginx

# === LOGS ===
sudo journalctl -u kpi-backend -f          # Logs backend temps réel
sudo tail -f /var/log/nginx/kpi-analyzer.error.log  # Logs Nginx

# === DÉPLOIEMENT ===
/home/kpi-app/deploy.sh                    # Déployer une mise à jour

# === BACKUP ===
/home/kpi-app/backup.sh                    # Créer un backup

# === MONITORING ===
htop                                       # Ressources système
df -h                                      # Espace disque
curl https://votre-domaine.com/api/health  # Test API

# === SSL ===
sudo certbot renew                         # Renouveler SSL
sudo certbot certificates                  # Voir certificats
```
