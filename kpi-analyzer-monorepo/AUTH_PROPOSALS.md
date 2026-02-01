# Propositions d'Authentification - KPI Analyzer

## Contexte actuel

L'application n'a actuellement **aucune authentification** :
- Tous les endpoints API sont publics
- Pas de gestion d'utilisateurs
- Pas de sessions ou tokens

**Stack technique :**
- Frontend : React 19 + TypeScript + Vite
- Backend : FastAPI + SQLAlchemy + SQLite
- Communication : API REST (fetch)

---

## Comparatif des solutions

| Solution | Complexité | Temps impl. | Multi-users | SSO possible | Coût |
|----------|------------|-------------|-------------|--------------|------|
| **Option 1 : JWT Simple** | Faible | 1-2 jours | Oui | Non | Gratuit |
| **Option 2 : JWT + Refresh** | Moyenne | 2-3 jours | Oui | Non | Gratuit |
| **Option 3 : OAuth2 / OIDC** | Élevée | 3-5 jours | Oui | Oui | Gratuit |
| **Option 4 : Auth0** | Moyenne | 1-2 jours | Oui | Oui | Freemium |
| **Option 5 : Basic Auth Nginx** | Très faible | 1 heure | Limité | Non | Gratuit |

---

## Option 1 : JWT Simple (Recommandée pour démarrer)

### Description

Authentification par token JWT stocké en localStorage. Solution la plus simple et adaptée à une application mono-utilisateur ou petit groupe.

### Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend       │
│   React         │         │   FastAPI       │
├─────────────────┤         ├─────────────────┤
│ 1. Login form   │───────> │ POST /api/login │
│                 │ <─────  │ Return JWT      │
│ 2. Store token  │         │                 │
│    localStorage │         │                 │
│                 │         │                 │
│ 3. API calls    │───────> │ Verify JWT      │
│    + Bearer     │         │ in header       │
└─────────────────┘         └─────────────────┘
```

### Avantages

- Simple à implémenter
- Pas de dépendance externe
- Stateless (scalable)
- Fonctionne bien avec Electron

### Inconvénients

- Token en localStorage (vulnérable XSS)
- Pas de révocation de token
- Gestion manuelle de l'expiration

### Implémentation Backend

**Nouvelles dépendances (`requirements.txt`) :**

```
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

**Nouveau modèle User (`database/models.py`) :**

```python
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
```

**Service d'authentification (`auth/auth_service.py`) :**

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# Configuration
SECRET_KEY = "votre-clé-secrète-à-changer-en-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 heures

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if user is None or not user.is_active:
        raise credentials_exception
    return user
```

**Endpoints d'authentification (`api/auth_endpoints.py`) :**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["auth"])

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[str] = None

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user.last_login = datetime.utcnow()
    db.commit()

    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "email": current_user.email,
        "is_admin": current_user.is_admin
    }
```

**Protéger les endpoints existants :**

```python
# Avant (non protégé)
@router.get("/transport/stats")
async def get_transport_stats(db: Session = Depends(get_db)):
    ...

# Après (protégé)
@router.get("/transport/stats")
async def get_transport_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Ajout
):
    ...
```

### Implémentation Frontend

**Service d'authentification (`src/services/auth.ts`) :**

```typescript
const API_URL = import.meta.env.VITE_API_URL || '/api';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface User {
  username: string;
  email: string | null;
  is_admin: boolean;
}

class AuthService {
  private tokenKey = 'kpi_auth_token';

  async login(username: string, password: string): Promise<boolean> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Identifiants incorrects');
    }

    const data: LoginResponse = await response.json();
    localStorage.setItem(this.tokenKey, data.access_token);
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    window.location.href = '/login';
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    const response = await fetch(`${API_URL}/me`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      this.logout();
      return null;
    }

    return response.json();
  }
}

export const authService = new AuthService();
```

**Composant LoginPage (`src/components/LoginPage.tsx`) :**

```tsx
import { useState } from 'react';
import { authService } from '../services/auth';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(username, password);
      onLoginSuccess();
    } catch (err) {
      setError('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">KPI Analyzer</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

**Modifier App.tsx pour gérer l'authentification :**

```tsx
import { useState, useEffect } from 'react';
import { authService } from './services/auth';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser();
        setIsAuthenticated(!!user);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <Dashboard />;
}

export default App;
```

---

## Option 2 : JWT avec Refresh Token

### Description

Amélioration de l'Option 1 avec un système de refresh token pour une meilleure sécurité et expérience utilisateur.

### Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend       │
├─────────────────┤         ├─────────────────┤
│ Login           │───────> │ POST /api/login │
│                 │ <─────  │ Access Token    │
│                 │         │ + Refresh Token │
│                 │         │ (HTTP-only)     │
│                 │         │                 │
│ Token expiré    │───────> │ POST /refresh   │
│                 │ <─────  │ New Access Token│
└─────────────────┘         └─────────────────┘
```

### Différences avec Option 1

| Aspect | Option 1 | Option 2 |
|--------|----------|----------|
| Access Token durée | 24h | 15 min |
| Refresh Token | Non | Oui (7 jours, HTTP-only cookie) |
| Révocation | Non | Oui (via refresh token) |
| Sécurité XSS | Vulnérable | Meilleure (cookie HTTP-only) |

### Implémentation supplémentaire

**Backend - Refresh Token :**

```python
REFRESH_TOKEN_EXPIRE_DAYS = 7

@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: Request,
    db: Session = Depends(get_db)
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token manquant")

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Token invalide")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

    user = db.query(User).filter(User.username == username).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Utilisateur invalide")

    new_access_token = create_access_token(
        data={"sub": username},
        expires_delta=timedelta(minutes=15)
    )

    return {"access_token": new_access_token, "token_type": "bearer"}

@router.post("/login")
async def login(response: Response, ...):
    # ... validation ...

    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=15)
    )

    refresh_token = create_access_token(
        data={"sub": user.username, "type": "refresh"},
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,  # HTTPS only
        samesite="strict",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )

    return {"access_token": access_token, "token_type": "bearer"}
```

**Frontend - Intercepteur automatique :**

```typescript
class AuthenticatedFetch {
  private refreshPromise: Promise<boolean> | null = null;

  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = authService.getToken();

    const headers = new Headers(options.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response = await fetch(url, { ...options, headers, credentials: 'include' });

    // Si 401, tenter de rafraîchir le token
    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers.set('Authorization', `Bearer ${authService.getToken()}`);
        response = await fetch(url, { ...options, headers, credentials: 'include' });
      } else {
        authService.logout();
      }
    }

    return response;
  }

  private async refreshToken(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        const response = await fetch('/api/refresh', {
          method: 'POST',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('kpi_auth_token', data.access_token);
          return true;
        }
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }
}

export const api = new AuthenticatedFetch();
```

---

## Option 3 : OAuth2 / OpenID Connect

### Description

Implémentation complète OAuth2 avec support pour Single Sign-On (SSO) via des providers externes (Google, Microsoft, etc.) ou un serveur d'identité interne.

### Cas d'usage

- Entreprise avec Active Directory / Azure AD
- Authentification Google/Microsoft pour utilisateurs externes
- Intégration avec Keycloak ou autre IdP

### Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │     │   Backend   │     │  Provider   │
│   React     │     │   FastAPI   │     │  (Google,   │
│             │     │             │     │   Azure AD) │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ 1. Click    │────>│             │     │             │
│    Login    │     │             │     │             │
│             │<────│ 2. Redirect │────>│             │
│             │     │    to IdP   │     │             │
│ 3. Login    │─────────────────────────>│ 4. Auth    │
│    on IdP   │<─────────────────────────│    + Code  │
│             │     │             │     │             │
│ 5. Callback │────>│ 6. Exchange │────>│ 7. Tokens  │
│    + Code   │     │    Code     │<────│             │
│             │<────│ 8. JWT      │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Implémentation avec Authlib

**Dépendances :**

```
authlib==1.3.0
httpx==0.27.0
```

**Configuration (`auth/oauth_config.py`) :**

```python
from authlib.integrations.starlette_client import OAuth

oauth = OAuth()

# Google
oauth.register(
    name='google',
    client_id='GOOGLE_CLIENT_ID',
    client_secret='GOOGLE_CLIENT_SECRET',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# Microsoft Azure AD
oauth.register(
    name='azure',
    client_id='AZURE_CLIENT_ID',
    client_secret='AZURE_CLIENT_SECRET',
    server_metadata_url='https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)
```

**Endpoints OAuth (`api/oauth_endpoints.py`) :**

```python
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse

router = APIRouter(prefix="/api/auth", tags=["oauth"])

@router.get("/login/{provider}")
async def oauth_login(provider: str, request: Request):
    client = oauth.create_client(provider)
    redirect_uri = request.url_for('oauth_callback', provider=provider)
    return await client.authorize_redirect(request, redirect_uri)

@router.get("/callback/{provider}")
async def oauth_callback(provider: str, request: Request, db: Session = Depends(get_db)):
    client = oauth.create_client(provider)
    token = await client.authorize_access_token(request)
    user_info = token.get('userinfo')

    # Créer ou mettre à jour l'utilisateur
    user = db.query(User).filter(User.email == user_info['email']).first()
    if not user:
        user = User(
            username=user_info['email'],
            email=user_info['email'],
            oauth_provider=provider,
            oauth_id=user_info['sub']
        )
        db.add(user)
        db.commit()

    # Générer JWT
    access_token = create_access_token(data={"sub": user.username})

    # Rediriger vers le frontend avec le token
    return RedirectResponse(f"/?token={access_token}")
```

### Avantages

- SSO avec providers existants
- Délégation de la gestion des mots de passe
- MFA intégré (selon provider)
- Standards de sécurité élevés

### Inconvénients

- Complexité d'implémentation
- Dépendance à des services externes
- Configuration des providers nécessaire

---

## Option 4 : Auth0 (Service géré)

### Description

Utilisation d'Auth0 comme service d'authentification géré. Solution rapide à implémenter avec des fonctionnalités avancées.

### Avantages

- Implémentation rapide (SDK disponibles)
- MFA, passwordless, social login inclus
- Gestion des utilisateurs via dashboard
- Conformité GDPR, SOC2
- Plan gratuit jusqu'à 7000 utilisateurs actifs

### Inconvénients

- Dépendance à un service tiers
- Coût au-delà du plan gratuit
- Latence réseau supplémentaire

### Implémentation

**Backend (`auth/auth0.py`) :**

```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from functools import lru_cache
import httpx

AUTH0_DOMAIN = "votre-tenant.auth0.com"
AUTH0_AUDIENCE = "https://api.kpi-analyzer.com"

security = HTTPBearer()

@lru_cache()
def get_jwks():
    response = httpx.get(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
    return response.json()

async def verify_auth0_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    jwks = get_jwks()

    try:
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = next(
            (key for key in jwks["keys"] if key["kid"] == unverified_header["kid"]),
            None
        )

        if not rsa_key:
            raise HTTPException(status_code=401, detail="Token invalide")

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=["RS256"],
            audience=AUTH0_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )

        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")
```

**Frontend (avec Auth0 React SDK) :**

```tsx
// index.tsx
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <Auth0Provider
    domain="votre-tenant.auth0.com"
    clientId="VOTRE_CLIENT_ID"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://api.kpi-analyzer.com"
    }}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

// App.tsx
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();

  if (isLoading) return <div>Chargement...</div>;

  if (!isAuthenticated) {
    return (
      <button onClick={() => loginWithRedirect()}>
        Se connecter
      </button>
    );
  }

  return <Dashboard getToken={getAccessTokenSilently} />;
}
```

---

## Option 5 : Basic Auth Nginx (Solution rapide)

### Description

Protection basique au niveau Nginx avec htpasswd. Solution la plus rapide mais limitée.

### Cas d'usage

- Protection temporaire rapide
- Environnement de staging
- Application interne avec peu d'utilisateurs

### Implémentation

```bash
# Créer le fichier de mots de passe
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin

# Ajouter d'autres utilisateurs
sudo htpasswd /etc/nginx/.htpasswd user2
```

**Configuration Nginx :**

```nginx
server {
    listen 443 ssl;
    server_name votre-domaine.com;

    # Protection par mot de passe
    auth_basic "KPI Analyzer - Accès restreint";
    auth_basic_user_file /etc/nginx/.htpasswd;

    location / {
        # ... configuration existante ...
    }

    # Exclure l'API health check de l'auth
    location /api/health {
        auth_basic off;
        proxy_pass http://127.0.0.1:8000;
    }
}
```

### Avantages

- Implémentation en 5 minutes
- Aucune modification du code
- Fonctionne immédiatement

### Inconvénients

- Pas de gestion de sessions
- Popup navigateur basique
- Pas de logout propre
- Pas d'audit des connexions

---

## Recommandation

### Pour démarrer rapidement

**Option 1 (JWT Simple)** est recommandée :
- Implémentation en 1-2 jours
- Pas de dépendance externe
- Suffisant pour la plupart des cas
- Base évolutive vers Option 2 si besoin

### Pour une application entreprise

**Option 3 (OAuth2)** ou **Option 4 (Auth0)** :
- SSO avec Active Directory
- MFA intégré
- Audit des connexions
- Conformité sécurité

### Pour du prototypage/staging

**Option 5 (Basic Auth Nginx)** :
- Protection immédiate
- Aucun développement requis

---

## Étapes suivantes

1. **Choisir l'option** adaptée à vos besoins
2. **Créer le premier utilisateur** admin (script ou commande CLI)
3. **Tester en local** avant déploiement
4. **Mettre à jour le déploiement VPS** avec les nouvelles dépendances
5. **Documenter** les credentials et procédures

---

## Script de création d'utilisateur initial

Créez `python-engine/create_user.py` :

```python
#!/usr/bin/env python3
import sys
import getpass
from database.connection import SessionLocal, init_db
from database.models import User
from auth.auth_service import get_password_hash

def create_user():
    init_db()
    db = SessionLocal()

    username = input("Nom d'utilisateur: ")
    email = input("Email (optionnel): ") or None
    password = getpass.getpass("Mot de passe: ")
    confirm = getpass.getpass("Confirmer mot de passe: ")

    if password != confirm:
        print("Les mots de passe ne correspondent pas")
        sys.exit(1)

    if db.query(User).filter(User.username == username).first():
        print("Cet utilisateur existe déjà")
        sys.exit(1)

    user = User(
        username=username,
        email=email,
        hashed_password=get_password_hash(password),
        is_admin=True
    )

    db.add(user)
    db.commit()
    print(f"Utilisateur '{username}' créé avec succès")

if __name__ == "__main__":
    create_user()
```

```bash
# Utilisation
cd python-engine
source .venv/bin/activate
python create_user.py
```
