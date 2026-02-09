# Plan d'Implémentation - Dashboard Interactif (v2)

Ce document définit la feuille de route pour transformer le visualiseur statique en un dashboard interactif complet.

## 🎯 Objectif
Implémenter la **Proposition 3** : Un tableau de bord personnalisable via une grille de graphiques, avec un configurateur modal et une vue détaillée.

**Choix Validés :**
*   ✅ **Architecture** : Grille CSS simple (Phase 1) évoluant vers Drag & Drop (Phase 3).
*   ✅ **Configurateur** : Modal centralisé pour créer/éditer les graphiques.
*   ✅ **Agrandissement** : Option 1 (Modal Plein Écran) pour l'analyse détaillée.

---

## 📅 Phases de Développement

### Phase 1 : Le Socle (Semaine 1) 🚀
*Objectif : Permettre la création de graphiques personnalisés.*

1.  **Architecture Technique**
    *   Création des types (`ChartConfig`, `DashboardLayout`).
    *   Création du composant `ChartCard` (Conteneur visuel).
    *   Création du composant `DashboardGrid` (Grille responsive).
    *   Refactoring de `Dashboard.tsx` pour gérer un état dynamique (`useState`).

2.  **Fonctionnalités**
    *   Bouton **[+ Nouveau]**.
    *   **Zone d'Import de Données** (Intégration du composant DropZone existant dans le nouveau layout).
    *   **Modal de Configuration** (Formulaire : Titre, Type, KPI).
    *   **Persistance** : Sauvegarde simple dans le `localStorage` du navigateur.

### Phase 2 : Interactivité & Données (Semaine 2)
*Objectif : Analyser les données en profondeur.*

1.  **Mode Agrandissement (`[🔍]`)**
    *   Implémentation du `ChartDetailModal` (Plein écran).
    *   Affichage du graphique en "haute résolution".
    *   Calcul des statistiques (Min, Max, Moyenne) à la volée.

2.  **Gestion des Sources**
    *   Page ou Zone "Mes Données" améliorée.
    *   **Version Compacte** : Affichage discret (résumé 1 ligne) si des données sont déjà importées.
    *   Gestion de multiples fichiers importés.
    *   Filtre par fichier source dans le configurateur.

### Phase 3 : Expérience Utilisateur (Semaine 3 - Optionnel)
*Objectif : Rendre l'interface fluide.*

1.  **Drag & Drop**
    *   Intégration de la librairie `dnd-kit`.
    *   Réorganisation des cartes à la souris.

2.  **Export**
    *   Boutons export PNG/CSV sur chaque graphique.

---

## 🛠️ Détail Technique - Phase 1 (Immédiat)

### 1. Structure des Dossiers
```
src/
├── components/
│   ├── dashboard/
│   │   ├── ChartCard.tsx       # La tuile unitaire
│   │   ├── DashboardGrid.tsx   # La grille (Layout)
│   │   └── ChartConfigModal.tsx # Le formulaire
└── types/
    └── dashboard.ts            # Les interfaces TS
```

### 2. Interfaces Clés (`types/dashboard.ts`)
```typescript
export type ChartType = 'line' | 'bar' | 'area' | 'pie';

export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  kpis: string[];
  period: '7d' | '30d' | '90d' | 'year';
  color?: string;
}
```

### 3. État du Dashboard (`Dashboard.tsx`)
```typescript
// L'état ne sera plus hardcodé mais dynamique
const [charts, setCharts] = useState<ChartConfig[]>([]);

// Sauvegarde automatique
useEffect(() => {
  localStorage.setItem('my_dashboard', JSON.stringify(charts));
}, [charts]);
```

---

## ✅ Critères de Succès Phase 1
*   [ ] Je peux cliquer sur "Nouveau Graphique".
*   [ ] Je peux choisir "Revenus" en "Barre".
*   [ ] Le graphique apparaît sur le dashboard.
*   [ ] Si je recharge la page, le graphique est toujours là.
*   [ ] Je peux supprimer le graphique.
