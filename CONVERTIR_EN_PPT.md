# Comment Convertir les Slides en PowerPoint

## Option 1 : Pandoc (Ligne de commande) - RECOMMANDÉ

### Installation Pandoc

**macOS :**
```bash
brew install pandoc
```

**Windows :**
1. Télécharger depuis : https://pandoc.org/installing.html
2. Installer le fichier .msi

### Conversion

```bash
cd /Users/tiengd/Documents/tuto/kpi

# Conversion simple
pandoc PRESENTATION_SLIDES.md -o PRESENTATION_KPI.pptx

# Conversion avec template personnalisé (recommandé)
pandoc PRESENTATION_SLIDES.md \
  -o PRESENTATION_KPI.pptx \
  --slide-level=1 \
  -V theme=Madrid \
  -V colortheme=default
```

**Résultat :** Fichier `PRESENTATION_KPI.pptx` prêt à ouvrir dans PowerPoint

---

## Option 2 : Outils en Ligne

### Marp (Markdown Presentation)

1. Aller sur : https://marp.app
2. Installer l'extension VS Code "Marp for VS Code"
3. Ouvrir `PRESENTATION_SLIDES.md` dans VS Code
4. Clic droit → "Marp: Export Slide Deck..."
5. Choisir format PPTX

### Slides.com

1. Aller sur : https://slides.com
2. Créer un compte gratuit
3. Importer le markdown
4. Exporter en PPTX

---

## Option 3 : Import Manuel dans PowerPoint

### Méthode Rapide

1. Ouvrir PowerPoint
2. Créer nouvelle présentation
3. Pour chaque slide markdown (séparé par `---`) :
   - Créer une nouvelle slide PowerPoint
   - Copier le contenu
   - Formater manuellement

**Temps estimé :** 30-60 minutes

---

## Option 4 : Google Slides + Extension

1. Ouvrir Google Slides
2. Installer extension "Markdown to Slides"
3. Importer le fichier
4. Exporter en PowerPoint (.pptx)

---

## Personnalisation Après Conversion

### Dans PowerPoint

1. **Appliquer votre thème corporate**
   - Design → Thèmes → Sélectionner votre template

2. **Ajouter logo entreprise**
   - Insertion → Image
   - Placer sur master slide

3. **Ajuster couleurs**
   - Design → Variantes → Couleurs

4. **Polices**
   - Design → Variantes → Polices

5. **Transitions**
   - Transitions → Choisir effet

---

## Script Automatisé Complet

```bash
#!/bin/bash
# convert-slides.sh

cd /Users/tiengd/Documents/tuto/kpi

# Vérifier si pandoc est installé
if ! command -v pandoc &> /dev/null
then
    echo "Pandoc n'est pas installé. Installation..."
    brew install pandoc
fi

# Conversion
echo "Conversion en cours..."
pandoc PRESENTATION_SLIDES.md \
  -o PRESENTATION_KPI.pptx \
  --slide-level=1 \
  -V theme=Madrid \
  -V colortheme=seahorse \
  --toc

echo "✅ Fichier créé : PRESENTATION_KPI.pptx"
echo "Ouvrir avec : open PRESENTATION_KPI.pptx"
```

**Utilisation :**
```bash
chmod +x convert-slides.sh
./convert-slides.sh
```

---

## Résultat Attendu

### Structure PowerPoint

```
PRESENTATION_KPI.pptx
├─ Slide 1 : Titre
├─ Slide 2 : Agenda
├─ Slide 3 : Résumé Exécutif
├─ Slide 4 : Problématique
├─ ...
└─ Slide 40+ : Fin
```

### Caractéristiques

- **Nombre de slides :** 40+
- **Taille fichier :** ~2-5 MB
- **Format :** PowerPoint 2016+ compatible
- **Editable :** Oui, totalement personnalisable

---

## Troubleshooting

### Problème : Tableaux mal formatés

**Solution :** Ajuster manuellement dans PowerPoint après conversion

### Problème : Caractères spéciaux (émojis)

**Solution :**
```bash
# Utiliser UTF-8 encoding
pandoc PRESENTATION_SLIDES.md -o PRESENTATION_KPI.pptx --from=markdown+emoji
```

### Problème : Code blocks pas jolies

**Solution :** Dans PowerPoint :
1. Sélectionner code
2. Police → "Courier New" ou "Consolas"
3. Couleur de fond → Gris clair

---

## Recommandation Finale

**Pour une présentation professionnelle :**

1. ✅ **Convertir avec Pandoc** (Option 1)
2. ✅ **Ouvrir dans PowerPoint**
3. ✅ **Appliquer votre thème corporate**
4. ✅ **Ajouter logo et ajuster couleurs**
5. ✅ **Réviser animations et transitions**
6. ✅ **Répéter présentation**

**Temps total : 15-30 minutes**

Bon succès avec votre présentation ! 🚀
