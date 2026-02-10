#!/usr/bin/env python3
import sys
import getpass
from database.connection import SessionLocal, init_db
from database.models import User
from auth.auth_service import get_password_hash

def change_password():
    init_db()
    db = SessionLocal()

    # Liste des utilisateurs disponibles
    users = db.query(User).all()
    if not users:
        print("Aucun utilisateur dans la base de données")
        sys.exit(1)

    print("Utilisateurs disponibles:")
    for u in users:
        status = "actif" if u.is_active else "inactif"
        role = "admin" if u.is_admin else "user"
        print(f"  - {u.username} ({role}, {status})")
    print()

    username = input("Nom d'utilisateur: ")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        print(f"Erreur: L'utilisateur '{username}' n'existe pas")
        sys.exit(1)

    password = getpass.getpass("Nouveau mot de passe: ")
    confirm = getpass.getpass("Confirmer mot de passe: ")

    if password != confirm:
        print("Erreur: Les mots de passe ne correspondent pas")
        sys.exit(1)

    if len(password) < 4:
        print("Erreur: Le mot de passe doit contenir au moins 4 caractères")
        sys.exit(1)

    user.hashed_password = get_password_hash(password)
    db.commit()
    db.close()

    print(f"\nSuccès! Mot de passe de '{username}' mis à jour.")

if __name__ == "__main__":
    change_password()
