#!/usr/bin/env python3
import sys
import getpass
from database.connection import SessionLocal, init_db
from database.models import User
from auth.auth_service import get_password_hash

def create_user():
    print("Initialisation de la base de données...")
    init_db()
    db = SessionLocal()

    username = input("Nom d'utilisateur: ")
    email = input("Email (optionnel): ") or None
    password = getpass.getpass("Mot de passe: ")
    confirm = getpass.getpass("Confirmer mot de passe: ")

    if password != confirm:
        print("Erreur: Les mots de passe ne correspondent pas")
        sys.exit(1)

    if db.query(User).filter(User.username == username).first():
        print(f"Erreur: L'utilisateur '{username}' existe déjà")
        sys.exit(1)

    user = User(
        username=username,
        email=email,
        hashed_password=get_password_hash(password),
        is_admin=True,
        is_active=True
    )

    db.add(user)
    db.commit()
    print(f"\nSuccès! Utilisateur '{username}' créé.")

if __name__ == "__main__":
    create_user()
