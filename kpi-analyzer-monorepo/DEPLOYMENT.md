# Procédure de Déploiement Web - KPI Analyzer

## Table des matières

1. [Architecture de déploiement](#1-architecture-de-déploiement)
2. [Préparer le Backend](#2-préparer-le-backend-python-fastapi)
3. [Préparer le Frontend](#3-préparer-le-frontend-react)
4. [Configuration du serveur](#4-configuration-du-serveur)
5. [Configurer HTTPS](#5-configurer-https-avec-lets-encrypt)
6. [Migration vers PostgreSQL](#6-migration-vers-postgresql-recommandé-pour-production)
7. [Checklist finale](#7-checklist-finale-de-déploiement)
8. [Commandes utiles](#8-commandes-utiles-post-déploiement)

---

## 1. Architecture de déploiement

```
                    ┌─────────────────┐
                    │   Nginx/Apache  │
                    │  (Reverse Proxy)│
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────▼─────────┐       ┌──────────▼──────────┐
    │  Frontend React   │       │   Backend FastAPI   │
    │  (Static files)   │       │  (Uvicorn/Gunicorn) │
    │  Port 80/443      │       │    Port 8000        │
    └───────────────────┘       └──────────────────────┘
                                          │
                                ┌─────────▼─────────┐
                                │     SQLite/       │
                                │   PostgreSQL      │
                                └───────────────────┘
```

---

## 2. Préparer le Backend (Python FastAPI)

### 2.1 Modifier la configuration CORS

Éditez `python-engine/main.py` pour configurer les origines autorisées :

```python
from fastapi.middleware.cors import CORSMiddleware
import os

# Lecture des origines depuis les variables d'environnement (plus flexible)
# Exemple: ALLOWED_ORIGINS="https://votre-domaine.com,https://www.votre-domaine.com"
origins_str = os.getenv("ALLOWED_ORIGINS", "")
origins = [origin.strip() for origin in origins_str.split(",") if origin.strip()]

# Fallback pour le développement local si aucune variable n'est définie
if not origins:
    origins = ["http://localhost:5173", "http://localhost:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2.2 Créer le fichier de configuration production

Créez `python-engine/config.py` :

```python
import os

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/kpi.db")
    DEBUG = os.getenv("DEBUG", "false").lower() == "true"
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))

settings = Settings()
```

### 2.3 Installer Gunicorn (serveur production)

```bash
cd python-engine
pip install gunicorn
pip freeze > requirements.txt
```

---

## 3. Préparer le Frontend (React)

### 3.1 Configurer l'URL de l'API

Créez `electron-app/.env.production`.
Avec la configuration Nginx proposée plus bas (proxy_pass), vous pouvez utiliser un chemin relatif, ce qui rend l'image Docker agnostique du domaine !

```
VITE_API_URL=/api
```

### 3.2 Modifier les appels API dans le code

Dans vos composants React, utilisez la variable d'environnement :

```typescript
// En production avec Nginx (et Docker), l'API est servie sur le même domaine via /api
// Donc on peut simplement utiliser un chemin relatif ou une chaîne vide.
const API_BASE = import.meta.env.VITE_API_URL || '/api'; 

// OU si vous préférez pointer vers le chemin racine de l'API:
// const API_BASE = import.meta.env.VITE_API_URL || '';

// Exemple d'appel
fetch(`${API_BASE}/transport/stats`)
```

### 3.3 Build de production

```bash
cd electron-app
npm run build
```

Les fichiers statiques seront dans `electron-app/dist/`

---

## 4. Configuration du serveur

## 4. Configuration du serveur (Docker)

#### 4.1 Dockerfile pour le Backend

Créez `python-engine/Dockerfile` :

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Code source
COPY . .

# Créer le dossier data
RUN mkdir -p /app/data

EXPOSE 8000

CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
```

#### 4.2 Dockerfile pour le Frontend

Créez `electron-app/Dockerfile` :

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 4.3 Configuration Nginx pour le frontend

Créez `electron-app/nginx.conf` :

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gestion des routes SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy vers l'API
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Cache des assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 4.4 Docker Compose

Créez `docker-compose.yml` à la racine :

```yaml
version: '3.8'

services:
  backend:
    build: ./python-engine
    container_name: kpi-backend
    restart: unless-stopped
    volumes:
      - ./data:/app/data
    environment:
      - DEBUG=false
    networks:
      - kpi-network
    environment:
      - ALLOWED_ORIGINS=https://votre-domaine.com,https://www.votre-domaine.com

  frontend:
    build: ./electron-app
    container_name: kpi-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - kpi-network

networks:
  kpi-network:
    driver: bridge

volumes:
  data:
```

#### 4.5 Déployer avec Docker

```bash
# Sur le serveur
git clone <votre-repo> /opt/kpi-analyzer
cd /opt/kpi-analyzer

# Build et lancement
docker-compose build
docker-compose up -d

# Vérifier les logs
docker-compose logs -f
```



---

## 5. Configurer HTTPS avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Vérifier le renouvellement automatique
sudo certbot renew --dry-run
```

---

## 6. Migration vers PostgreSQL (Recommandé pour production)

### 6.1 Installer PostgreSQL

```bash
sudo apt install postgresql postgresql-contrib
```

### 6.2 Créer la base de données

```bash
sudo -u postgres psql

CREATE DATABASE kpi_analyzer;
CREATE USER kpi_user WITH ENCRYPTED PASSWORD 'mot_de_passe_fort';
GRANT ALL PRIVILEGES ON DATABASE kpi_analyzer TO kpi_user;
\q
```

### 6.3 Modifier la connexion dans le code

Éditez `python-engine/database/connection.py` :

```python
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://kpi_user:mot_de_passe_fort@localhost/kpi_analyzer"
)
```

### 6.4 Installer le driver PostgreSQL

```bash
pip install psycopg2-binary
```

---

## 7. Checklist finale de déploiement

- [ ] Variables d'environnement configurées
- [ ] CORS configuré avec les bons domaines
- [ ] HTTPS activé avec certificat SSL
- [ ] Firewall configuré (ports 80, 443 ouverts)
- [ ] Backups de la base de données planifiés
- [ ] Monitoring en place (logs, health check)
- [ ] Service backend en mode daemon (systemd)
- [ ] Nginx configuré comme reverse proxy

---

## 8. Commandes utiles post-déploiement

### Gestion des services

```bash
# Vérifier le status des services
sudo systemctl status kpi-backend
sudo systemctl status nginx

# Redémarrer après mise à jour
sudo systemctl restart kpi-backend
sudo systemctl reload nginx
```

### Consultation des logs

```bash
# Logs du backend
sudo journalctl -u kpi-backend -f

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Docker (si utilisé)

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer les services
docker-compose restart

# Mettre à jour
git pull
docker-compose build
docker-compose up -d
```

### Backup de la base de données

```bash
# SQLite
cp /home/kpi-app/kpi-analyzer/python-engine/data/kpi.db /backup/kpi_$(date +%Y%m%d).db

# PostgreSQL
pg_dump -U kpi_user kpi_analyzer > /backup/kpi_$(date +%Y%m%d).sql
```

---

## 9. Troubleshooting

### Le backend ne démarre pas

```bash
# Vérifier les logs
sudo journalctl -u kpi-backend -n 50

# Tester manuellement
cd /home/kpi-app/kpi-analyzer/python-engine
source .venv/bin/activate
python main.py
```

### Erreur 502 Bad Gateway

```bash
# Vérifier que le backend tourne
curl http://127.0.0.1:8000/api/health

# Vérifier les permissions du socket
sudo nginx -t
```

### Erreur CORS

Vérifiez que les domaines dans `main.py` correspondent exactement à votre URL (avec ou sans www, http ou https).

### Problème de permissions

```bash
# Réappliquer les permissions
sudo chown -R kpi-app:kpi-app /home/kpi-app/kpi-analyzer
sudo chown -R www-data:www-data /var/www/kpi-analyzer
```
