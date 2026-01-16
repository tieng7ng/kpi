# Propositions d'Interface - Configuration des Graphiques KPI

**Date** : 2026-01-15
**Version** : 1.0
**Objectif** : Concevoir une interface intuitive pour configurer les graphiques (type, données, filtres)

---

## 🎯 Besoins Fonctionnels

### Fonctionnalités Essentielles
1. **Sélection du type de graphique** : Ligne, Barre, Aire, Camembert, Jauge
2. **Sélection des KPIs** : Choisir un ou plusieurs KPIs à afficher
3. **Filtres temporels** : Période (7j, 30j, 90j, personnalisé)
4. **Filtres catégoriels** : Par région, catégorie, source
5. **Comparaison** : Comparer plusieurs KPIs ou périodes
6. **Sauvegarde** : Enregistrer des vues personnalisées

### Fonctionnalités Avancées (V2)
- Agrégation (somme, moyenne, min, max)
- Seuils et alertes visuelles
- Export du graphique (PNG, PDF)
- Partage de configuration

---

## 📊 Proposition 1 : Panneau Latéral Simple (Recommandé MVP)

### Description
Interface minimaliste avec un panneau latéral fixe pour la configuration et une zone centrale pour l'aperçu en temps réel.

### Wireframe Textuel
```
┌─────────────────────────────────────────────────────────┐
│  KPI Analyzer                          [?] [@] [⚙️]     │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ CONFIG   │         📈 APERÇU DU GRAPHIQUE              │
│          │                                              │
│ Type     │    ┌────────────────────────────────┐       │
│ [📈 Ligne]│    │                                │       │
│ [📊 Barre]│    │     Graphique en temps réel    │       │
│ [ 📍 Aire]│    │                                │       │
│ [ 🥧 Tarte]│    │                                │       │
│          │    │                                │       │
│ KPIs     │    └────────────────────────────────┘       │
│ ☑ Revenue│                                              │
│ ☑ Margin │    📅 Période: 7 derniers jours             │
│ ☐ Orders │                                              │
│          │    🏷️ Catégories: Toutes                     │
│ Période  │                                              │
│ ⚪ 7j     │    [📥 Exporter] [💾 Sauvegarder]           │
│ ⚪ 30j    │                                              │
│ ⚪ 90j    │                                              │
│ ⚪ Custom │                                              │
│          │                                              │
│ Catégorie│                                              │
│ [Toutes ▼]                                              │
│          │                                              │
│ [Appliquer]                                             │
└──────────┴──────────────────────────────────────────────┘
```

### Avantages
- ✅ Simple à implémenter
- ✅ Aperçu en temps réel
- ✅ Pas de navigation complexe
- ✅ Familier (type Spotify, VS Code)

### Inconvénients
- ❌ Peu d'espace pour options avancées
- ❌ Nécessite un écran large

### Technologies
- React avec state management (useState/useContext)
- Recharts pour le rendu
- TailwindCSS pour le layout

---

## 📊 Proposition 2 : Workflow par Étapes (Wizard)

### Description
Assistant en plusieurs étapes guidant l'utilisateur dans la création d'un graphique.

### Wireframe Textuel
```
ÉTAPE 1/4 : Sélection du Type
┌─────────────────────────────────────────────────────┐
│  Quel type de graphique souhaitez-vous créer ?      │
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │   📈    │  │   📊    │  │   📍    │            │
│  │ Ligne   │  │  Barre  │  │  Aire   │            │
│  │         │  │         │  │         │            │
│  │ Évolution│  │Comparaison Tendance│            │
│  │ temporelle│  │ valeurs │  │ cumul  │            │
│  └─────────┘  └─────────┘  └─────────┘            │
│                                                      │
│  ┌─────────┐  ┌─────────┐                          │
│  │   🥧    │  │   📊    │                          │
│  │Camembert│  │  Jauge  │                          │
│  │         │  │         │                          │
│  │Répartition Indicateur│                          │
│  │  %      │  │ unique  │                          │
│  └─────────┘  └─────────┘                          │
│                                                      │
│                          [Annuler] [Suivant →]      │
└─────────────────────────────────────────────────────┘

ÉTAPE 2/4 : Sélection des KPIs
┌─────────────────────────────────────────────────────┐
│  Quels KPIs voulez-vous visualiser ?                │
│                                                      │
│  💰 KPIs Financiers                                 │
│  ☑ Revenue          (Dernière valeur: 152K€)       │
│  ☑ Margin           (Dernière valeur: 20.8%)       │
│  ☐ Profit           (Dernière valeur: 31.6K€)      │
│                                                      │
│  📦 KPIs Opérationnels                              │
│  ☐ Orders           (Dernière valeur: 445)         │
│  ☐ Conversion Rate  (Dernière valeur: 3.2%)        │
│                                                      │
│  👥 KPIs Marketing                                  │
│  ☐ Visits           (Dernière valeur: 12.5K)       │
│  ☐ Leads            (Dernière valeur: 892)         │
│                                                      │
│  ℹ️ Conseil: Pour un graphique ligne, max 3 KPIs   │
│                                                      │
│                          [← Retour] [Suivant →]     │
└─────────────────────────────────────────────────────┘

ÉTAPE 3/4 : Configuration Temporelle
┌─────────────────────────────────────────────────────┐
│  Quelle période souhaitez-vous analyser ?           │
│                                                      │
│  Périodes Prédéfinies                               │
│  ⚪ 7 derniers jours                                 │
│  ⚪ 30 derniers jours                                │
│  ⚪ 90 derniers jours                                │
│  ⚪ Cette année                                      │
│  ⚫ Personnalisée                                    │
│                                                      │
│  Période Personnalisée                              │
│  Du:  [15/12/2024 📅]                               │
│  Au:  [15/01/2026 📅]                               │
│                                                      │
│  Granularité                                        │
│  ⚪ Jour    ⚫ Semaine    ⚪ Mois                     │
│                                                      │
│                          [← Retour] [Suivant →]     │
└─────────────────────────────────────────────────────┘

ÉTAPE 4/4 : Filtres et Options
┌─────────────────────────────────────────────────────┐
│  Filtres et options avancées (optionnel)            │
│                                                      │
│  Filtrer par Catégorie                              │
│  [Toutes les catégories ▼]                          │
│                                                      │
│  Filtrer par Source                                 │
│  ☑ Fichier 1 (test_kpi.json)                       │
│  ☑ Fichier 2 (sales_2024.csv)                      │
│  ☐ Fichier 3 (data_q4.xlsx)                        │
│                                                      │
│  Options d'Affichage                                │
│  ☑ Afficher la légende                             │
│  ☑ Afficher les valeurs                            │
│  ☐ Afficher la grille                              │
│  ☑ Lissage de courbe (ligne uniquement)            │
│                                                      │
│  Nom du Graphique (optionnel)                       │
│  [Performance Ventes Q4 2024____________]           │
│                                                      │
│                          [← Retour] [Créer 🎉]      │
└─────────────────────────────────────────────────────┘
```

### Avantages
- ✅ Très intuitif pour débutants
- ✅ Progression claire
- ✅ Explications contextuelles
- ✅ Évite la surcharge cognitive

### Inconvénients
- ❌ Plus lent pour utilisateurs avancés
- ❌ Nécessite plusieurs clics
- ❌ Difficile de modifier un seul paramètre

### Technologies
- React avec router (étapes = routes)
- Context API pour partager l'état
- Validation à chaque étape

---

## 📊 Proposition 3 : Modal Configurateur (Rapide)

### Description
Bouton "Ajouter un graphique" ouvrant un modal centralisé avec tous les contrôles.

### Wireframe Textuel
```
Dashboard avec plusieurs graphiques existants
┌─────────────────────────────────────────────────────┐
│  📊 Mes Graphiques                [+ Nouveau]        │
├─────────────────┬───────────────────────────────────┤
│ 📈 Revenue 30j  │  📊 Orders vs Margin             │
│                 │                                   │
│   [Éditer]      │    [Éditer]                       │
└─────────────────┴───────────────────────────────────┘

Clic sur [+ Nouveau] → MODAL
┌─────────────────────────────────────────────────────┐
│  Créer un Nouveau Graphique                    [✕]  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Type de graphique                                  │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                    │
│  │📈 │ │📊 │ │📍 │ │🥧 │ │📊 │                    │
│  └───┘ └───┘ └───┘ └───┘ └───┘                    │
│  Ligne Barre Aire Tarte Jauge                       │
│                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                      │
│  Sélection des KPIs (1-3)                           │
│  ┌──────────────────────────────────────────────┐  │
│  │ 🔍 Rechercher un KPI...                      │  │
│  ├──────────────────────────────────────────────┤  │
│  │ ☑ Revenue                    💰 Financier    │  │
│  │ ☑ Margin                     💰 Financier    │  │
│  │ ☐ Orders                     📦 Opérationnel │  │
│  │ ☐ Conversion Rate            👥 Marketing    │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  Période                                            │
│  [7 derniers jours ▼]  ou  [Du: 📅] [Au: 📅]       │
│                                                      │
│  Filtres                                            │
│  Catégorie: [Toutes ▼]    Source: [Toutes ▼]      │
│                                                      │
│  Options                                            │
│  ☑ Légende  ☑ Valeurs  ☐ Grille                    │
│                                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                      │
│  Aperçu                                             │
│  ┌────────────────────────────────────────────┐    │
│  │   📈 Miniature du graphique               │    │
│  │                                            │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│               [Annuler]  [Créer le graphique]       │
└─────────────────────────────────────────────────────┘
```

### Avantages
- ✅ Rapide et compact
- ✅ Tout visible d'un coup d'œil
- ✅ Aperçu immédiat
- ✅ Familier (type Google Sheets)

### Inconvénients
- ❌ Peut être chargé visuellement
- ❌ Difficile sur petits écrans
- ❌ Scroll nécessaire

### Technologies
- React Modal (react-modal ou Headless UI)
- Formulaire contrôlé avec validation
- Debounced preview update

---

### 🎯 Indicateurs d'État en Mode Édition

#### Problème
Lorsqu'un utilisateur clique sur [⚙️ Éditer] pour modifier un graphique existant, le modal doit clairement indiquer :
1. Qu'on est en mode édition (pas création)
2. Les valeurs actuellement configurées
3. Ce qui a changé

#### Solution : Indicateurs Visuels

**1. Titre du Modal Différent**
```
Mode Création:
┌─────────────────────────────────────────────────────────┐
│  Créer un Nouveau Graphique                        [✕]  │
└─────────────────────────────────────────────────────────┘

Mode Édition:
┌─────────────────────────────────────────────────────────┐
│  ✏️ Éditer : Revenue & Margin                       [✕]  │
│  Créé le 15/01/2026 • Modifié il y a 2h                 │
└─────────────────────────────────────────────────────────┘
```

**2. Type de Graphique - Indicateur Sélectionné**
```
Sélection du Type (Mode Édition)
┌────────────────────────────────────────┐
│ Type de graphique                      │
├────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│ │  📈  │ │  📊  │ │  📍  │ │  🥧  │  │
│ │Ligne │ │Barre │ │ Aire │ │Tarte │  │
│ │      │ │      │ │      │ │      │  │
│ │✓ SEL │ │      │ │      │ │      │  │ ← Badge "✓ SEL"
│ └──────┘ └──────┘ └──────┘ └──────┘  │
│  ^^^^                                  │
│  Bordure bleue épaisse                │
└────────────────────────────────────────┘
```

**CSS pour Type Sélectionné**
```css
/* Type non sélectionné */
.chart-type-button {
  border: 2px solid #e5e7eb;
  background: white;
}

/* Type sélectionné (état actuel) */
.chart-type-button.selected {
  border: 3px solid #2563eb;
  background: #eff6ff;
  position: relative;
}

.chart-type-button.selected::after {
  content: "✓";
  position: absolute;
  top: 4px;
  right: 4px;
  background: #2563eb;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}
```

**3. KPIs - Checkboxes Pré-cochées**
```
Sélection des KPIs (Mode Édition)
┌────────────────────────────────────────┐
│ KPIs à afficher (2 sélectionnés)       │ ← Compteur
├────────────────────────────────────────┤
│ 🔍 [Rechercher un KPI...............]  │
│                                        │
│ 💰 Financiers                          │
│ ☑ Revenue          152,000€  [📈+2%]  │ ← Coché + surligné
│ ☑ Margin            20.8%    [📈+1%]  │ ← Coché + surligné
│ ☐ Profit            31,600€  [📉-3%]  │
│                                        │
│ 📦 Opérationnels                       │
│ ☐ Orders              445    [📈+5%]  │
│ ☐ Avg Order Value    342€    [─ 0%]   │
└────────────────────────────────────────┘
```

**CSS pour KPI Sélectionné**
```css
/* KPI non sélectionné */
.kpi-item {
  padding: 12px;
  border-left: 3px solid transparent;
}

/* KPI sélectionné (état actuel) */
.kpi-item.selected {
  background: #eff6ff;
  border-left: 3px solid #2563eb;
  font-weight: 500;
}

.kpi-item.selected input[type="checkbox"] {
  accent-color: #2563eb;
}
```

**4. Période - Radio Button Pré-sélectionné**
```
Période d'analyse (Mode Édition)
┌────────────────────────────────────────┐
│ Période                                │
├────────────────────────────────────────┤
│ ⚪ 7 derniers jours                     │
│ ⚫ 30 derniers jours  ← ACTUEL          │ ← Badge "ACTUEL"
│ ⚪ 90 derniers jours                    │
│ ⚪ Cette année                          │
│ ⚪ Personnalisée                        │
└────────────────────────────────────────┘
```

**5. Badge "Modifié" pour Changements**
```
Quand l'utilisateur change une valeur :

Avant modification :
┌────────────────────────────────────────┐
│ ⚫ 30 derniers jours                    │
└────────────────────────────────────────┘

Après modification (sélection de "90 jours") :
┌────────────────────────────────────────┐
│ ⚪ 30 derniers jours                    │
│ ⚫ 90 derniers jours  🔵 MODIFIÉ        │ ← Badge pour changement
└────────────────────────────────────────┘
```

**6. Aperçu avec Indication de Changement**
```
┌────────────────────────────────────────┐
│ 👁️ Aperçu                              │
├────────────────────────────────────────┤
│ ℹ️ Aperçu avec les nouvelles valeurs   │ ← Info si modifications
│ ┌────────────────────────────────────┐ │
│ │  📈 Graphique mis à jour           │ │
│ │                                    │ │
│ └────────────────────────────────────┘ │
│                                        │
│ 2 modification(s) non sauvegardée(s)   │ ← Compteur de changements
└────────────────────────────────────────┘
```

**7. Boutons Footer avec État**
```
Mode Création :
┌────────────────────────────────────────┐
│  [Annuler]  [Créer le graphique]      │
└────────────────────────────────────────┘

Mode Édition (sans changements) :
┌────────────────────────────────────────┐
│  [Annuler]  [Mettre à jour]            │
│              (grisé, disabled)          │
└────────────────────────────────────────┘

Mode Édition (avec changements) :
┌────────────────────────────────────────┐
│  [Annuler]  [💾 Enregistrer] 🔵        │ ← Point bleu = modifs
│                                        │
│  💡 2 modifications en attente         │
└────────────────────────────────────────┘
```

#### Code Exemple - Indicateurs

```typescript
// ChartConfigModal.tsx avec indicateurs
export const ChartConfigModal: React.FC = () => {
  const { editingChartId, charts, closeConfigModal } = useDashboard();

  const [config, setConfig] = useState<ChartConfig>({...});
  const [originalConfig, setOriginalConfig] = useState<ChartConfig | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Charger config existante en mode édition
  useEffect(() => {
    if (editingChartId) {
      const chart = charts.find(c => c.id === editingChartId);
      if (chart) {
        setConfig(chart.config);
        setOriginalConfig(chart.config); // Sauvegarder l'original
      }
    } else {
      setOriginalConfig(null);
    }
  }, [editingChartId, charts]);

  // Détecter les changements
  useEffect(() => {
    if (originalConfig) {
      const changed = JSON.stringify(config) !== JSON.stringify(originalConfig);
      setHasChanges(changed);
    }
  }, [config, originalConfig]);

  // Compter les modifications
  const countChanges = () => {
    if (!originalConfig) return 0;
    let count = 0;
    if (config.type !== originalConfig.type) count++;
    if (JSON.stringify(config.kpis) !== JSON.stringify(originalConfig.kpis)) count++;
    if (JSON.stringify(config.period) !== JSON.stringify(originalConfig.period)) count++;
    return count;
  };

  return (
    <div className="modal">
      {/* Header avec indication */}
      <div className="modal-header">
        <div>
          <h2>
            {editingChartId ? (
              <>
                ✏️ Éditer : {originalConfig?.title || originalConfig?.kpis.join(' & ')}
              </>
            ) : (
              'Créer un Nouveau Graphique'
            )}
          </h2>
          {editingChartId && (
            <p className="text-sm text-gray-500">
              Créé le {formatDate(chart.createdAt)} • Modifié {formatRelative(chart.updatedAt)}
            </p>
          )}
        </div>
        <button onClick={closeConfigModal}>✕</button>
      </div>

      {/* Type Selector avec indication */}
      <TypeSelector
        value={config.type}
        originalValue={originalConfig?.type}
        onChange={(type) => setConfig({ ...config, type })}
      />

      {/* KPI Selector avec compteur */}
      <div>
        <h3>KPIs à afficher ({config.kpis.length} sélectionné{config.kpis.length > 1 ? 's' : ''})</h3>
        <KPISelector
          selected={config.kpis}
          onChange={(kpis) => setConfig({ ...config, kpis })}
        />
      </div>

      {/* Aperçu avec indication changements */}
      {hasChanges && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            ℹ️ Aperçu avec les nouvelles valeurs
          </p>
        </div>
      )}
      <ChartPreview config={config} />

      {/* Footer avec état */}
      <div className="modal-footer">
        {hasChanges && (
          <p className="text-sm text-blue-600">
            💡 {countChanges()} modification(s) en attente
          </p>
        )}
        <div className="flex gap-2">
          <button onClick={closeConfigModal}>Annuler</button>
          <button
            onClick={handleSave}
            disabled={!hasChanges && editingChartId !== null}
            className={hasChanges ? 'btn-primary' : 'btn-disabled'}
          >
            {editingChartId ? (
              <>💾 Enregistrer {hasChanges && '🔵'}</>
            ) : (
              'Créer le graphique'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// TypeSelector avec indicateur
const TypeSelector: React.FC<{
  value: ChartType;
  originalValue?: ChartType;
  onChange: (type: ChartType) => void;
}> = ({ value, originalValue, onChange }) => {
  const types = [
    { id: 'line', icon: TrendingUp, label: 'Ligne' },
    { id: 'bar', icon: BarChart3, label: 'Barre' },
    { id: 'area', icon: Activity, label: 'Aire' },
    { id: 'pie', icon: PieChart, label: 'Camembert' }
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {types.map(type => {
        const Icon = type.icon;
        const isSelected = value === type.id;
        const wasOriginal = originalValue === type.id;
        const hasChanged = isSelected && originalValue && !wasOriginal;

        return (
          <button
            key={type.id}
            onClick={() => onChange(type.id as ChartType)}
            className={`
              relative p-4 border-2 rounded-lg transition-all
              ${isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <Icon className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm font-medium">{type.label}</div>

            {/* Indicateur sélectionné */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}

            {/* Badge "MODIFIÉ" */}
            {hasChanged && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                MODIFIÉ
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
```

#### Résumé des Indicateurs

| Élément | Mode Création | Mode Édition | État Modifié |
|---------|--------------|--------------|--------------|
| **Titre** | "Créer..." | "✏️ Éditer : [Nom]" + dates | - |
| **Type** | Pas de sélection | Bordure bleue + ✓ | Badge "MODIFIÉ" |
| **KPIs** | Aucun coché | Cochés + surligné bleu | Compteur mis à jour |
| **Période** | Aucune | Radio ⚫ sélectionné | Badge "MODIFIÉ" |
| **Aperçu** | "Sélectionnez KPIs..." | Données actuelles | "Aperçu avec nouvelles valeurs" |
| **Bouton** | "Créer" | "Enregistrer" (disabled si 0 changement) | "💾 Enregistrer 🔵" |
| **Footer** | - | - | "💡 X modification(s) en attente" |

Ces indicateurs permettent à l'utilisateur de **toujours savoir** :
1. ✅ Si il crée ou édite
2. ✅ Quelles sont les valeurs actuelles
3. ✅ Ce qu'il a changé
4. ✅ S'il peut sauvegarder

---

### 🔄 Réorganisation des Graphiques (Drag & Drop Dashboard)

#### Description
Une fois les graphiques créés via le modal, ils apparaissent sur le dashboard et **peuvent être déplacés** pour personnaliser la mise en page.

#### Wireframe Dashboard avec Drag & Drop
```
Dashboard Interactif
┌─────────────────────────────────────────────────────────┐
│  📊 Mon Dashboard KPI                   [+ Nouveau]     │
│                                                          │
│  💡 Astuce: Glissez-déposez pour réorganiser            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │ ⋮⋮ 📈 Revenue 30j   │  │ ⋮⋮ 📊 Orders/Margin │      │
│  │      [⚙️] [📥] [🗑️] │  │      [⚙️] [📥] [🗑️] │      │
│  ├─────────────────────┤  ├─────────────────────┤      │
│  │                     │  │                     │      │
│  │   [Graphique]       │  │   [Graphique]       │      │
│  │                     │  │   [Graphique]       │      │
│  └─────────────────────┘  └─────────────────────┘      │
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │ ⋮⋮ 🥧 Répartition   │  │ ⋮⋮ 📍 Tendance CA   │      │
│  │      [⚙️] [📥] [🗑️] │  │      [⚙️] [📥] [🗑️] │      │
│  ├─────────────────────┤  ├─────────────────────┤      │
│  │   [Graphique]       │  │   [Graphique]       │      │
│  └─────────────────────┘  └─────────────────────┘      │
│                                                          │
└─────────────────────────────────────────────────────────┘

Pendant le Glissement (Drag)
┌─────────────────────────────────────────────────────────┐
│  📊 Mon Dashboard KPI                                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  ┌─────────────────────┐      │
│  │  Zone de dépôt     │  │ ⋮⋮ 📊 Orders/Margin │      │
│  │   (vide)           │  │      [⚙️] [📥] [🗑️] │      │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  ├─────────────────────┤      │
│     ↑ Glissez ici       │   [Graphique]       │      │
│                          └─────────────────────┘      │
│  ┌───────────────────────────┐                         │
│  │ 📈 Revenue 30j       🖐️   │ ← Carte en cours de    │
│  │    (Fantôme semi-trans)   │    déplacement         │
│  └───────────────────────────┘                         │
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │ ⋮⋮ 🥧 Répartition   │  │ ⋮⋮ 📍 Tendance CA   │      │
│  └─────────────────────┘  └─────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

#### Fonctionnalités de Déplacement

**1. Drag Handle (Poignée)**
```
┌─────────────────────┐
│ ⋮⋮ 📈 Revenue 30j   │  ← Icône ⋮⋮ = poignée cliquable
│    [⚙️] [📥] [🗑️]   │
├─────────────────────┤
│                     │
│   [Graphique]       │
│                     │
└─────────────────────┘
```
- Cursor change au survol (🖐️)
- Seule la zone ⋮⋮ permet le drag (pas tout le graphique)

**2. Feedback Visuel pendant le Drag**
- Carte originale devient semi-transparente (fantôme)
- Zones de dépôt valides affichent une bordure bleue en pointillés
- Autres cartes se réorganisent en temps réel pour montrer la position future

**3. Grille Responsive**
```
Desktop (>1200px)     : 3 colonnes
Tablette (768-1200px) : 2 colonnes
Mobile (<768px)       : 1 colonne (pas de drag)
```

**4. Actions sur les Graphiques**
- **⋮⋮** : Drag & drop pour déplacer
- **⚙️** : Ouvre le modal en mode édition (préremplit le formulaire)
- **📥** : Exporte en PNG/CSV
- **🗑️** : Suppression avec confirmation

#### Comportements

**Sauvegarde Automatique**
- Position sauvegardée en localStorage
- Restaurée au prochain chargement
- Format: `{ chartId: 'chart-1', position: 0 }`

**Responsive**
- Desktop: Drag & drop actif
- Mobile: Boutons "↑ Monter" / "↓ Descendre" à la place

**Accessibilité**
- Support clavier: Tab → Focus → Espace → Flèches ↑↓ → Entrée
- Screen reader: "Graphique Revenue, position 1 sur 4, appuyez sur Espace pour déplacer"

#### Code Exemple (dnd-kit)

```typescript
// DashboardGrid.tsx
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Chart {
  id: string;
  config: ChartConfig;
}

export const DashboardGrid: React.FC = () => {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCharts((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      // Sauvegarde en localStorage
      saveLayout(charts);
    }
    setActiveId(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={charts.map(c => c.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charts.map(chart => (
            <SortableChartCard key={chart.id} chart={chart} />
          ))}
        </div>
      </SortableContext>

      {/* Overlay pendant le drag */}
      <DragOverlay>
        {activeId ? (
          <ChartCard
            chart={charts.find(c => c.id === activeId)!}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// SortableChartCard.tsx
const SortableChartCard: React.FC<{ chart: Chart }> = ({ chart }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: chart.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="chart-card">
      {/* Header avec contrôles */}
      <div className="chart-header">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="drag-handle cursor-grab active:cursor-grabbing"
          aria-label="Déplacer le graphique"
        >
          ⋮⋮
        </button>

        <h3>{chart.config.title || 'Graphique'}</h3>

        <div className="chart-actions">
          <button onClick={() => editChart(chart)} title="Éditer">⚙️</button>
          <button onClick={() => exportChart(chart)} title="Exporter">📥</button>
          <button onClick={() => deleteChart(chart.id)} title="Supprimer">🗑️</button>
        </div>
      </div>

      {/* Graphique */}
      <div className="chart-content">
        <ChartRenderer config={chart.config} />
      </div>
    </div>
  );
};
```

#### Styles CSS

```css
/* ChartCard avec effet hover */
.chart-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s;
}

.chart-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #2563eb;
}

/* Drag Handle */
.drag-handle {
  color: #9ca3af;
  font-size: 20px;
  padding: 4px 8px;
  background: none;
  border: none;
  cursor: grab;
  transition: color 0.2s;
}

.drag-handle:hover {
  color: #2563eb;
}

.drag-handle:active {
  cursor: grabbing;
}

/* Pendant le drag */
.chart-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

/* Zone de dépôt valide */
.drop-zone-active {
  border: 2px dashed #2563eb;
  background: rgba(37, 99, 235, 0.05);
}

/* Overlay fantôme */
.drag-overlay {
  opacity: 0.9;
  transform: rotate(-3deg);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}
```

#### Alternative Mobile (Sans Drag & Drop)

```
Mobile - Boutons de Réorganisation
┌─────────────────────┐
│ 📈 Revenue 30j      │
│                     │
│ [⚙️ Config]         │
│ [📥 Export]         │
│ [↑ Monter]          │
│ [↓ Descendre]       │
│ [🗑️ Supprimer]      │
└─────────────────────┘

OU Menu Contextuel (Plus épuré)
┌─────────────────────┐
│ 📈 Revenue 30j  [⋯] │ ← Au tap sur [⋯]
├─────────────────────┤
│   [Graphique]       │   Menu s'ouvre:
└─────────────────────┘   ┌──────────────┐
                           │ ⚙️ Éditer    │
                           │ 📥 Exporter  │
                           │ ↑ Monter     │
                           │ ↓ Descendre  │
                           │ 🗑️ Supprimer │
                           └──────────────┘
```

#### Avantages du Drag & Drop
- ✅ Personnalisation intuitive
- ✅ Feedback visuel immédiat
- ✅ Expérience moderne
- ✅ Pas de modal supplémentaire

#### Considérations
- ⚠️ Complexité technique moyenne (librairie nécessaire)
- ⚠️ Tests tactiles nécessaires (mobile)
- ⚠️ Accessibilité clavier à bien implémenter
- ⚠️ Performance avec beaucoup de graphiques (>20)

#### Librairies Recommandées
- **dnd-kit** (recommandé) : Moderne, accessible, performant
- **react-beautiful-dnd** : Mature mais pas maintenu activement
- **react-grid-layout** : Si besoin de resize aussi (avancé)

#### Timeline d'Implémentation
- **MVP** : Pas de drag & drop, ordre fixe chronologique
- **V1.1** : Ajout drag & drop desktop uniquement
- **V1.2** : Alternative mobile (boutons monter/descendre)
- **V2.0** : Support touch tactile + animations fluides

---

### 🔍 Agrandissement des Graphiques (Mode Détaillé)

#### Description
Les utilisateurs peuvent **agrandir un graphique** pour le voir en plein écran avec plus de détails et d'options d'analyse.

#### Wireframe - Carte Normale vs Agrandie

**État Normal (Dashboard)**
```
┌─────────────────────┐
│ ⋮⋮ 📈 Revenue 30j   │
│    [⚙️] [📥] [🔍] [🗑️]│ ← Nouveau bouton [🔍]
├─────────────────────┤
│                     │
│   [Graphique]       │
│   (Compact)         │
│                     │
└─────────────────────┘
```

**Au Clic sur [🔍] → Modal Plein Écran**
```
┌─────────────────────────────────────────────────────────┐
│  📈 Revenue - 30 derniers jours                     [✕] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                │    │
│  │                                                │    │
│  │         Graphique Grande Taille                │    │
│  │         (Plus de détails visibles)             │    │
│  │                                                │    │
│  │                                                │    │
│  │                                                │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 📊 Statistiques Détaillées                      │   │
│  ├──────────┬──────────┬──────────┬──────────┬─────┤   │
│  │ Min      │ Max      │ Moyenne  │ Total    │ Δ%  │   │
│  │ 88,000€  │ 152,000€ │ 128,750€ │ 3,862K€  │ +12%│   │
│  └──────────┴──────────┴──────────┴──────────┴─────┘   │
│                                                          │
│  Options d'Analyse:                                     │
│  [📊 Afficher Tendance] [📈 Moyennes Mobiles]          │
│  [🎯 Ajouter Seuils]    [📅 Comparaison Période]       │
│                                                          │
│  [📥 Exporter PNG] [📄 Exporter CSV] [⚙️ Configurer]   │
└─────────────────────────────────────────────────────────┘
```

#### Options d'Agrandissement

**Option 1 : Modal Plein Écran (Recommandé)**
- Clic sur bouton 🔍 ou double-clic sur le graphique
- Modal occupe 90% de l'écran
- Fond sombre semi-transparent (backdrop)
- **Croix de fermeture [✕] en haut à droite** (toujours visible)
- Touche Échap pour fermer (alternative clavier)
- Clic sur le backdrop pour fermer (optionnel)

**Option 2 : Mode Inline Expandé**
- Le graphique s'agrandit dans le dashboard même
- Occupe 2 colonnes au lieu d'1
- Autres graphiques se réorganisent
- Clic à nouveau pour rétrécir

**Option 3 : Page Dédiée**
- Navigation vers `/chart/:id` (route)
- Page complète dédiée au graphique
- Bouton retour vers dashboard
- URL partageable

#### Wireframe Option 2 - Inline Expandé

**Avant l'expansion**
```
Dashboard - Grille 3 colonnes
┌──────────┬──────────┬──────────┐
│ Chart A  │ Chart B  │ Chart C  │
├──────────┼──────────┼──────────┤
│ Chart D  │ Chart E  │ Chart F  │
└──────────┴──────────┴──────────┘
```

**Après clic sur [🔍] du Chart B**
```
Dashboard - Expansion Inline
┌──────────┬─────────────────────┐
│ Chart A  │                     │
├──────────┤   Chart B (Grand)   │
│ Chart C  │                     │
├──────────┼─────────────────────┤
│ Chart D  │ Chart E  │ Chart F  │
└──────────┴──────────┴──────────┘
```

#### Fonctionnalités du Mode Détaillé

**1. Graphique Haute Résolution**
- Taille 2x plus grande
- Plus de points de données visibles
- Labels lisibles
- Zoom/Pan (molette souris)

**2. Statistiques Avancées**
```
┌─────────────────────────────────────────┐
│ 📊 Statistiques                         │
├──────────┬──────────┬──────────────────┤
│ Minimum  │ 88,000€  │ 06/01/2024       │
│ Maximum  │ 152,000€ │ 08/01/2024       │
│ Moyenne  │ 128,750€ │                  │
│ Médiane  │ 131,500€ │                  │
│ Écart-type 18,942€  │                  │
│ Total    │ 3,862K€  │ (30 jours)       │
│ Variation│ +12.5%   │ vs période préc. │
└──────────┴──────────┴──────────────────┘
```

**3. Outils d'Analyse**
- **Tendance linéaire** : Ligne de régression
- **Moyennes mobiles** : 7j, 14j, 30j
- **Seuils** : Ajouter des lignes horizontales (objectifs, alertes)
- **Annotations** : Marquer des événements sur le graphique
- **Comparaison** : Superposer une période précédente

**4. Export Avancé**
- PNG haute résolution (pour présentation)
- CSV des données
- PDF du rapport complet
- Lien partageable (si authentification)

#### Code Exemple

```typescript
// ChartCard.tsx - Ajout du bouton agrandir
const ChartCard: React.FC<{ chart: Chart }> = ({ chart }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="chart-card">
        <div className="chart-header">
          <button {...dragHandleProps}>⋮⋮</button>
          <h3>{chart.title}</h3>
          <div className="chart-actions">
            <button onClick={() => editChart(chart)} title="Éditer">
              ⚙️
            </button>
            <button onClick={() => exportChart(chart)} title="Exporter">
              📥
            </button>
            {/* NOUVEAU : Bouton agrandir */}
            <button
              onClick={() => setIsExpanded(true)}
              title="Agrandir"
              className="hover:text-blue-600"
            >
              🔍
            </button>
            <button onClick={() => deleteChart(chart.id)} title="Supprimer">
              🗑️
            </button>
          </div>
        </div>

        <div className="chart-content">
          <ChartRenderer config={chart.config} compact />
        </div>
      </div>

      {/* Modal Plein Écran */}
      {isExpanded && (
        <ChartDetailModal
          chart={chart}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

// ChartDetailModal.tsx
interface ChartDetailModalProps {
  chart: Chart;
  onClose: () => void;
}

export const ChartDetailModal: React.FC<ChartDetailModalProps> = ({
  chart,
  onClose
}) => {
  const [showTrend, setShowTrend] = useState(false);
  const [showMovingAvg, setShowMovingAvg] = useState(false);
  const [thresholds, setThresholds] = useState<number[]>([]);

  // Calcul des statistiques
  const stats = useMemo(() => {
    const values = chart.data.map(d => d.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      median: calculateMedian(values),
      stdDev: calculateStdDev(values),
      total: values.reduce((a, b) => a + b, 0)
    };
  }, [chart.data]);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold">{chart.config.title}</h2>
            <p className="text-sm text-gray-500">
              {chart.config.period.preset} - {chart.config.kpis.join(', ')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Graphique Grande Taille */}
        <div className="p-6">
          <div className="h-96 bg-gray-50 rounded-lg p-4">
            <ChartRenderer
              config={{
                ...chart.config,
                showTrend,
                showMovingAvg,
                thresholds
              }}
              height={380}
              interactive // Zoom, pan, tooltip avancé
            />
          </div>
        </div>

        {/* Statistiques */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold mb-3">📊 Statistiques</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Minimum" value={formatNumber(stats.min)} />
            <StatCard label="Maximum" value={formatNumber(stats.max)} />
            <StatCard label="Moyenne" value={formatNumber(stats.avg)} />
            <StatCard label="Total" value={formatNumber(stats.total)} />
          </div>
        </div>

        {/* Outils d'Analyse */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold mb-3">🔧 Outils d'Analyse</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowTrend(!showTrend)}
              className={`px-4 py-2 rounded-lg border ${
                showTrend ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
              }`}
            >
              📈 {showTrend ? '✓' : ''} Tendance
            </button>
            <button
              onClick={() => setShowMovingAvg(!showMovingAvg)}
              className={`px-4 py-2 rounded-lg border ${
                showMovingAvg ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
              }`}
            >
              📊 {showMovingAvg ? '✓' : ''} Moyennes Mobiles
            </button>
            <button
              onClick={() => {
                const threshold = prompt('Valeur du seuil :');
                if (threshold) setThresholds([...thresholds, Number(threshold)]);
              }}
              className="px-4 py-2 rounded-lg border border-gray-300"
            >
              🎯 Ajouter Seuil
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3 border-t pt-6">
          <button
            onClick={() => exportAsPNG(chart)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📥 Exporter PNG
          </button>
          <button
            onClick={() => exportAsCSV(chart)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            📄 Exporter CSV
          </button>
          <button
            onClick={() => { onClose(); editChart(chart); }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ⚙️ Configurer
          </button>
        </div>
      </div>
    </div>
  );
};

// StatCard.tsx - Composant pour afficher une stat
const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="text-sm text-gray-500 mb-1">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);
```

#### Interactions Clavier

```
Dans le modal agrandi :
- Échap        : Fermer le modal
- ← →          : Naviguer entre périodes (si plusieurs)
- + -          : Zoom in/out
- T            : Toggle tendance
- M            : Toggle moyennes mobiles
- E            : Export rapide
```

#### Responsive Mobile

```
Mobile - Modal Adapté
┌─────────────────────┐
│ Revenue 30j     [✕] │
├─────────────────────┤
│                     │
│  [Graphique]        │
│  (Portrait)         │
│                     │
├─────────────────────┤
│ 📊 Stats (Swipe →) │
│ Min: 88K            │
│ Max: 152K           │
│ Moy: 128K           │
├─────────────────────┤
│ [📥 Export]         │
│ [⚙️ Config]         │
└─────────────────────┘
```

- Graphique occupe toute la largeur
- Stats en swipe horizontal (carousel)
- Outils d'analyse en accordion
- Boutons en bas fixe

#### Animations

```typescript
// Framer Motion pour animations fluides
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.2 }}
  className="modal-content"
>
  {/* Contenu du modal */}
</motion.div>
```

#### Alternatives Compactes

**Quick Peek au Survol (Desktop uniquement)**
```
Au survol du graphique (sans cliquer) :
┌─────────────────────┐
│ ⋮⋮ 📈 Revenue 30j   │
│    [⚙️] [📥] [🔍] [🗑️]│
├─────────────────────┤
│                     │
│   [Graphique]       │
│                     │
│ ┌─────────────────┐ │ ← Tooltip étendu
│ │ Min: 88K        │ │
│ │ Max: 152K       │ │
│ │ Δ: +12%         │ │
│ └─────────────────┘ │
└─────────────────────┘
```

#### Avantages de l'Agrandissement
- ✅ Analyse détaillée sans quitter le dashboard
- ✅ Outils avancés disponibles à la demande
- ✅ Export de haute qualité
- ✅ Statistiques complètes visibles
- ✅ Pas de perte de contexte

#### Considérations
- ⚠️ Performance avec gros datasets (lazy loading)
- ⚠️ Mobile : optimiser pour portrait
- ⚠️ Accessibilité : focus trap dans modal
- ⚠️ UX : toujours montrer comment fermer

#### Timeline d'Implémentation
- **MVP** : Bouton 🔍 + modal simple avec graphique agrandi
- **V1.1** : Ajout statistiques détaillées
- **V1.2** : Outils d'analyse (tendances, seuils)
- **V2.0** : Zoom/pan interactif, annotations

---

### 📥 Import de Données (Source des KPIs)

#### Description
Avant de créer des graphiques, les utilisateurs doivent **importer leurs données KPI**. Cette interface permet d'uploader des fichiers et de gérer les sources de données.

#### Emplacement dans l'Interface

**Proposition 3 inclut 2 zones d'import** :

1. **Zone d'import permanente** (dans le dashboard)
2. **Page dédiée "Mes Données"** (navigation)

#### Wireframe 1 - Zone d'Import Dashboard

```
Dashboard Principal
┌─────────────────────────────────────────────────────────┐
│  📊 KPI Analyzer                    [Mes Données] [👤]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  📂 Importer des Données                       │    │
│  │  ┌──────────────────────────────────────────┐  │    │
│  │  │  📁 Glissez-déposez vos fichiers ici     │  │    │
│  │  │  ou [Parcourir]                           │  │    │
│  │  │                                           │  │    │
│  │  │  Formats: CSV, Excel (.xlsx), JSON       │  │    │
│  │  └──────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  📊 Mes Graphiques                   [+ Nouveau]        │
│  ┌──────────┬──────────┬──────────┐                    │
│  │ Chart 1  │ Chart 2  │ Chart 3  │                    │
│  └──────────┴──────────┴──────────┘                    │
└─────────────────────────────────────────────────────────┘
```

**Version Compacte (Si données déjà importées)**
```
┌─────────────────────────────────────────────────────────┐
│  📊 KPI Analyzer                    [Mes Données] [👤]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [📥 Importer] 3 fichiers • 1,234 KPIs • Dernière       │
│                                     maj: Il y a 2h       │
│                                                          │
│  📊 Mes Graphiques                   [+ Nouveau]        │
│  ┌──────────┬──────────┬──────────┐                    │
│  │ Chart 1  │ Chart 2  │ Chart 3  │                    │
└─────────────────────────────────────────────────────────┘
```

#### Wireframe 2 - Page "Mes Données"

**Accessible via le menu ou bouton [Mes Données]**

```
┌─────────────────────────────────────────────────────────┐
│  ← Retour Dashboard                        [👤] [⚙️]    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📂 Mes Sources de Données                              │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  📁 Zone d'Import                              │    │
│  │  ┌──────────────────────────────────────────┐  │    │
│  │  │  Glissez-déposez ou [Parcourir]         │  │    │
│  │  │  CSV • Excel • JSON                      │  │    │
│  │  └──────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  📊 Fichiers Importés (3)                               │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ 📄 test_kpi.json                          [⋯]  │    │
│  │ 10 lignes • 3 KPIs • Importé: 15/01/2026      │    │
│  │ KPIs: revenue, margin, orders                  │    │
│  │ [👁️ Aperçu] [📥 Télécharger] [🗑️ Supprimer]   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ 📄 sales_2024.csv                         [⋯]  │    │
│  │ 1,234 lignes • 5 KPIs • Importé: 14/01/2026   │    │
│  │ KPIs: revenue, margin, orders, visits, leads  │    │
│  │ [👁️ Aperçu] [📥 Télécharger] [🗑️ Supprimer]   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ 📄 data_q4.xlsx                           [⋯]  │    │
│  │ 567 lignes • 8 KPIs • Importé: 10/01/2026     │    │
│  │ ⚠️ Attention: Doublons détectés (15 lignes)   │    │
│  │ [👁️ Aperçu] [🔧 Corriger] [🗑️ Supprimer]      │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  💡 Astuce: Les fichiers sont dédupliqués              │
│     automatiquement par checksum SHA256                 │
└─────────────────────────────────────────────────────────┘
```

#### États de l'Import

**1. Idle (Aucun upload en cours)**
```
┌──────────────────────────────────────────┐
│  📁 Glissez-déposez vos fichiers ici     │
│  ou [Parcourir]                           │
│                                           │
│  Formats supportés:                       │
│  • CSV (séparateurs: ; , | tab)          │
│  • Excel (.xlsx, .xls)                   │
│  • JSON (array ou object)                │
└──────────────────────────────────────────┘
```

**2. Uploading (En cours)**
```
┌──────────────────────────────────────────┐
│  ⏳ Upload de test_kpi.json...           │
│  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 50%               │
│  125 Ko / 250 Ko                         │
└──────────────────────────────────────────┘
```

**3. Processing (Traitement ETL)**
```
┌──────────────────────────────────────────┐
│  ⚙️ Analyse de test_kpi.json...          │
│  • Détection du format: JSON ✓           │
│  • Lecture des données: 10 lignes ✓     │
│  • Détection colonnes: date, revenue... ✓│
│  • Création KPIs: 30 entrées...          │
└──────────────────────────────────────────┘
```

**4. Success**
```
┌──────────────────────────────────────────┐
│  ✅ test_kpi.json importé avec succès    │
│  • 10 lignes traitées                    │
│  • 30 KPIs créés (revenue, margin, ...)  │
│  • 0 doublon détecté                     │
│                                           │
│  [Voir les données] [Créer un graphique] │
└──────────────────────────────────────────┘
```

**5. Error**
```
┌──────────────────────────────────────────┐
│  ❌ Erreur lors de l'import               │
│  Colonne 'date' introuvable               │
│                                           │
│  Votre fichier doit contenir une colonne │
│  'date', 'datetime', 'timestamp' ou       │
│  'jour' pour pouvoir être traité.         │
│                                           │
│  [Réessayer] [Documentation]              │
└──────────────────────────────────────────┘
```

**6. Duplicate (Fichier déjà importé)**
```
┌──────────────────────────────────────────┐
│  ℹ️ Fichier déjà importé                  │
│  Ce fichier (checksum identique) a       │
│  déjà été importé le 14/01/2026.         │
│                                           │
│  [Voir le fichier] [Importer quand même] │
└──────────────────────────────────────────┘
```

#### Aperçu des Données (Modal)

**Clic sur [👁️ Aperçu]**
```
┌─────────────────────────────────────────────────────────┐
│  👁️ Aperçu: test_kpi.json                          [✕] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 Informations                                        │
│  • Fichier: test_kpi.json (2.4 Ko)                     │
│  • Importé: 15/01/2026 à 14:32                         │
│  • Lignes: 10                                           │
│  • Colonnes: 4 (date, revenue, margin, orders)         │
│  • KPIs générés: 30                                     │
│                                                          │
│  📋 Aperçu des Données (5 premières lignes)            │
│  ┌──────────┬──────────┬────────┬────────┐            │
│  │ date     │ revenue  │ margin │ orders │            │
│  ├──────────┼──────────┼────────┼────────┤            │
│  │ 01/01/24 │ 125,000€ │ 15.5%  │ 342    │            │
│  │ 02/01/24 │ 132,000€ │ 18.2%  │ 389    │            │
│  │ 03/01/24 │ 118,500€ │ 14.8%  │ 325    │            │
│  │ 04/01/24 │ 145,000€ │ 19.5%  │ 412    │            │
│  │ 05/01/24 │ 138,000€ │ 17.3%  │ 378    │            │
│  └──────────┴──────────┴────────┴────────┘            │
│  ... 5 lignes supplémentaires                          │
│                                                          │
│  [📥 Télécharger] [📊 Créer un graphique] [Fermer]    │
└─────────────────────────────────────────────────────────┘
```

#### Code Exemple - Composant Import

```typescript
// DataImportZone.tsx
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error' | 'duplicate';

interface UploadResult {
  filename: string;
  linesProcessed: number;
  kpisCreated: number;
  duplicates: number;
  error?: string;
}

export const DataImportZone: React.FC = () => {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFile = async (file: File) => {
    setStatus('uploading');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulation progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();

      // Vérifier si c'est un doublon
      if (data.status === 'Already exists') {
        setStatus('duplicate');
        setResult({
          filename: data.filename,
          linesProcessed: 0,
          kpisCreated: 0,
          duplicates: 1
        });
        return;
      }

      setStatus('processing');

      // Attendre un peu pour montrer le traitement
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('success');
      setResult({
        filename: data.filename,
        linesProcessed: data.lines || 0,
        kpisCreated: data.kpis_created || 0,
        duplicates: 0
      });

      // Notifier le reste de l'app
      window.dispatchEvent(new Event('kpi-data-updated'));

    } catch (error) {
      setStatus('error');
      setResult({
        filename: file.name,
        linesProcessed: 0,
        kpisCreated: 0,
        duplicates: 0,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">📂 Importer des Données</h3>

      {/* Zone Idle */}
      {status === 'idle' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
          onDragLeave={() => setIsDragActive(false)}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          `}
        >
          <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-700 mb-2">
            Glissez-déposez vos fichiers ici
          </p>
          <p className="text-sm text-gray-500 mb-4">
            ou
          </p>
          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
            Parcourir
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 mt-4">
            Formats: CSV, Excel (.xlsx, .xls), JSON
          </p>
        </div>
      )}

      {/* Zone Uploading */}
      {status === 'uploading' && (
        <div className="text-center py-6">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-700 mb-2">Upload en cours...</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">{progress}%</p>
        </div>
      )}

      {/* Zone Processing */}
      {status === 'processing' && (
        <div className="text-center py-6">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-700 mb-2">⚙️ Analyse des données...</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>✓ Détection du format</p>
            <p>✓ Lecture des données</p>
            <p>⏳ Création des KPIs...</p>
          </div>
        </div>
      )}

      {/* Zone Success */}
      {status === 'success' && result && (
        <div className="text-center py-6">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-green-600 font-medium mb-4">
            ✅ {result.filename} importé avec succès
          </p>
          <div className="bg-green-50 rounded-lg p-4 text-sm text-left">
            <p>• {result.linesProcessed} lignes traitées</p>
            <p>• {result.kpisCreated} KPIs créés</p>
            <p>• {result.duplicates} doublon détecté</p>
          </div>
          <div className="flex gap-2 justify-center mt-4">
            <button
              onClick={() => {/* Navigate to data page */}}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Voir les données
            </button>
            <button
              onClick={() => {/* Open chart config modal */}}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Créer un graphique
            </button>
          </div>
          <button
            onClick={() => setStatus('idle')}
            className="mt-3 text-sm text-blue-600 underline"
          >
            Importer un autre fichier
          </button>
        </div>
      )}

      {/* Zone Error */}
      {status === 'error' && result && (
        <div className="text-center py-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-2">
            ❌ Erreur lors de l'import
          </p>
          <p className="text-sm text-gray-600 mb-4">
            {result.error || 'Une erreur est survenue'}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setStatus('idle')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Réessayer
            </button>
            <button
              onClick={() => {/* Open docs */}}
              className="px-4 py-2 text-blue-600 underline"
            >
              Documentation
            </button>
          </div>
        </div>
      )}

      {/* Zone Duplicate */}
      {status === 'duplicate' && result && (
        <div className="text-center py-6">
          <FileText className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <p className="text-blue-600 font-medium mb-2">
            ℹ️ Fichier déjà importé
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Ce fichier (checksum identique) a déjà été importé.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {/* View existing file */}}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Voir le fichier
            </button>
            <button
              onClick={() => setStatus('idle')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

#### Intégration avec la Proposition 3

**Workflow Complet** :

1. **Import des données** 📥
   - Via zone d'import dashboard ou page "Mes Données"
   - Fichier traité par l'ETL Python
   - KPIs créés en base de données

2. **Création du graphique** ⚙️
   - Clic sur [+ Nouveau] ouvre le modal configurateur
   - Liste des KPIs disponibles (provenant des fichiers importés)
   - Configuration type, période, filtres

3. **Affichage sur dashboard** 📊
   - Graphique apparaît dans la grille
   - Drag & drop pour réorganiser
   - Clic sur 🔍 pour agrandir

#### Gestion Multi-Sources

**Si plusieurs fichiers importés** :

```typescript
// Dans le modal configurateur
<section>
  <h3>Sélection des KPIs</h3>
  <div className="space-y-4">
    {/* Groupe par source */}
    <div>
      <h4 className="text-sm font-medium text-gray-500">
        📄 test_kpi.json (10 lignes)
      </h4>
      <div className="space-y-2 ml-4">
        <label>
          <input type="checkbox" value="revenue_1" />
          Revenue (125K€)
        </label>
        <label>
          <input type="checkbox" value="margin_1" />
          Margin (15.5%)
        </label>
      </div>
    </div>

    <div>
      <h4 className="text-sm font-medium text-gray-500">
        📄 sales_2024.csv (1,234 lignes)
      </h4>
      <div className="space-y-2 ml-4">
        <label>
          <input type="checkbox" value="revenue_2" />
          Revenue (542K€)
        </label>
        <label>
          <input type="checkbox" value="visits_2" />
          Visits (12.5K)
        </label>
      </div>
    </div>
  </div>
</section>
```

#### Validation et Erreurs

**Erreurs courantes détectées** :

1. **Pas de colonne date**
   - Message: "Colonne 'date' requise"
   - Solution: Renommer la colonne ou ajouter une colonne date

2. **Aucune colonne numérique**
   - Message: "Aucun KPI détecté (aucune valeur numérique)"
   - Solution: Vérifier les types de données

3. **Format JSON invalide**
   - Message: "JSON invalide (erreur parsing ligne 15)"
   - Solution: Valider avec jsonlint.com

4. **Fichier trop volumineux**
   - Message: "Fichier > 10 MB (limite actuelle)"
   - Solution: Diviser le fichier ou augmenter la limite

5. **Encodage incorrect**
   - Message: "Erreur d'encodage (essayez UTF-8)"
   - Solution: Convertir en UTF-8

#### Mobile - Import Simplifié

```
Mobile
┌─────────────────────┐
│ 📂 Importer     [✕] │
├─────────────────────┤
│                     │
│  [📷 Prendre photo] │
│  [📁 Choisir fichier]│
│                     │
│  Formats:           │
│  CSV, Excel, JSON   │
│                     │
│  ℹ️ Sur mobile,     │
│  préférez des       │
│  fichiers < 1 MB    │
└─────────────────────┘
```

#### Timeline d'Implémentation
- **MVP** : Zone drag & drop simple + états de base
- **V1.1** : Page "Mes Données" avec liste et aperçu
- **V1.2** : Détection avancée des erreurs + suggestions
- **V2.0** : Import incrémental, fusion de sources

---

## 📊 Proposition 4 : Glisser-Déposer Avancé (Drag & Drop)

### Description
Interface inspirée de Tableau/Power BI avec zones de dépôt pour construire le graphique visuellement.

### Wireframe Textuel
```
┌─────────────────────────────────────────────────────┐
│  Créateur de Graphique                          [✕] │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ KPIs     │  ┌────────────────────────────────┐     │
│          │  │ ZONE DE CONSTRUCTION           │     │
│ 💰       │  │                                │     │
│ Revenue  │  │  Axe Y (Valeurs)              │     │
│ [Glisser]│  │  ┌──────────────────────┐     │     │
│          │  │  │ 💰 Revenue           │     │     │
│ 💰       │  │  │ 💰 Margin            │     │     │
│ Margin   │  │  └──────────────────────┘     │     │
│ [Glisser]│  │                                │     │
│          │  │  Axe X (Dimension)            │     │
│ 📦       │  │  ┌──────────────────────┐     │     │
│ Orders   │  │  │ 📅 Date              │     │     │
│ [Glisser]│  │  └──────────────────────┘     │     │
│          │  │                                │     │
│ 📅       │  │  Groupe/Couleur (optionnel)   │     │
│ Date     │  │  ┌──────────────────────┐     │     │
│ [Glisser]│  │  │ Glisser ici...       │     │     │
│          │  │  └──────────────────────┘     │     │
│ 🏷️       │  └────────────────────────────────┘     │
│ Category │                                          │
│ [Glisser]│  Type de Visualisation                  │
│          │  📈 Ligne  📊 Barre  📍 Aire  🥧 Tarte   │
│ 📁       │                                          │
│ Source   │  ┌────────────────────────────────┐     │
│ [Glisser]│  │  📈 APERÇU                    │     │
│          │  │                                │     │
│          │  │  Graphique temps réel          │     │
│          │  │                                │     │
│          │  └────────────────────────────────┘     │
│          │                                          │
│          │  [Annuler]  [Créer]                     │
└──────────┴──────────────────────────────────────────┘
```

### Avantages
- ✅ Très visuel et intuitif
- ✅ Puissant et flexible
- ✅ Professionnel
- ✅ Découverte par l'expérimentation

### Inconvénients
- ❌ Complexe à développer
- ❌ Courbe d'apprentissage
- ❌ Pas accessible au clavier
- ❌ Overkill pour MVP

### Technologies
- react-dnd ou dnd-kit
- State complexe pour zones de dépôt
- Validation des combinaisons

---

## 📊 Proposition 5 : Configuration Inline (Dans le Graphique)

### Description
Les graphiques ont des contrôles directement intégrés, modifiables au survol.

### Wireframe Textuel
```
Dashboard
┌─────────────────────────────────────────────────────┐
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ 📈 Revenue & Margin          [⚙️] [📥] [🗑️]│    │
│  ├────────────────────────────────────────────┤    │
│  │ [📈▼] [KPIs: 2▼] [Période: 7j▼] [⚡Filtres]│    │
│  ├────────────────────────────────────────────┤    │
│  │                                            │    │
│  │     Graphique ici                          │    │
│  │                                            │    │
│  └────────────────────────────────────────────┘    │
│                                                      │

Au clic sur [⚙️] → EXPAND
┌─────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────┐    │
│  │ 📈 Revenue & Margin          [⚙️] [📥] [🗑️]│    │
│  ├────────────────────────────────────────────┤    │
│  │                                            │    │
│  │ Type: [📈 Ligne ▼]                         │    │
│  │ KPIs: ☑Revenue ☑Margin ☐Orders            │    │
│  │ Période: ⚪7j ⚫30j ⚪90j ⚪Custom            │    │
│  │ Catégorie: [Toutes ▼]                      │    │
│  │ Options: ☑Légende ☑Valeurs ☐Grille         │    │
│  │                                            │    │
│  │ [Appliquer] [Réinitialiser]                │    │
│  ├────────────────────────────────────────────┤    │
│  │     Graphique mis à jour                   │    │
│  └────────────────────────────────────────────┘    │
```

### Avantages
- ✅ Contextuel et rapide
- ✅ Pas de navigation
- ✅ Modification directe
- ✅ Familier (type Notion)

### Inconvénients
- ❌ Peut encombrer le dashboard
- ❌ Difficile pour création initiale
- ❌ Interactions complexes

### Technologies
- Accordion/Collapse components
- State local par graphique
- Context pour synchronisation

---

## 🎯 Comparaison et Recommandation

| Critère                  | P1 Panneau | P2 Wizard | P3 Modal | P4 Drag&Drop | P5 Inline |
|--------------------------|------------|-----------|----------|--------------|-----------|
| **Facilité MVP**         | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐   | ⭐⭐         | ⭐⭐⭐      |
| **Intuitivité**          | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐    | ⭐⭐⭐       | ⭐⭐⭐⭐    |
| **Rapidité d'usage**     | ⭐⭐⭐⭐    | ⭐⭐⭐     | ⭐⭐⭐⭐⭐   | ⭐⭐⭐       | ⭐⭐⭐⭐⭐   |
| **Évolutivité**          | ⭐⭐⭐     | ⭐⭐⭐⭐    | ⭐⭐⭐     | ⭐⭐⭐⭐⭐    | ⭐⭐⭐     |
| **Accessibilité**        | ⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐    | ⭐⭐         | ⭐⭐⭐     |
| **Mobile Friendly**      | ⭐⭐       | ⭐⭐⭐⭐    | ⭐⭐⭐     | ⭐           | ⭐⭐⭐⭐    |

### 🏆 Recommandation pour MVP : **Proposition 3 (Modal Configurateur)**

**Pourquoi ?**
1. ✅ **Équilibre parfait** entre simplicité et fonctionnalités
2. ✅ **Rapide à implémenter** (2-3 jours de dev)
3. ✅ **Familier** pour les utilisateurs (pattern commun)
4. ✅ **Évolutif** : facile d'ajouter des onglets pour options avancées
5. ✅ **Bon pour démo** : tout visible, pas de navigation

### 🚀 Roadmap d'Évolution

**Phase 1 (MVP)** : Modal simple
- Types de base : Ligne, Barre, Aire
- Sélection KPIs multi
- Filtres temporels prédéfinis
- Aperçu statique

**Phase 2 (V1.1)** : Amélioration Modal
- Aperçu temps réel
- Filtres catégoriels
- Options d'affichage
- Sauvegarde de vues

**Phase 3 (V2.0)** : Hybride Modal + Inline
- Création via modal
- Édition rapide inline
- Duplication de graphiques
- Templates prédéfinis

**Phase 4 (V3.0)** : Advanced
- Drag & Drop pour power users
- Mode "Wizard" pour débutants
- Basculement entre modes
- Dashboard personnalisables

---

## 🎨 Maquettes Détaillées - Modal Configurateur

### État Initial (Modal Fermé)
```typescript
// Dashboard.tsx
<div className="dashboard">
  <div className="header">
    <h1>📊 Mes Graphiques KPI</h1>
    <button onClick={openModal} className="btn-primary">
      + Nouveau Graphique
    </button>
  </div>

  <div className="charts-grid">
    {savedCharts.map(chart => (
      <ChartCard key={chart.id} chart={chart} />
    ))}
  </div>
</div>
```

### Modal Ouvert - Structure
```typescript
interface ChartConfig {
  type: 'line' | 'bar' | 'area' | 'pie' | 'gauge';
  kpis: string[];        // ['revenue', 'margin']
  period: {
    type: 'preset' | 'custom';
    preset?: '7d' | '30d' | '90d' | 'ytd';
    custom?: { start: Date; end: Date };
  };
  filters: {
    categories?: string[];
    sources?: number[];
  };
  options: {
    showLegend: boolean;
    showValues: boolean;
    showGrid: boolean;
    smoothCurve: boolean;
  };
  title?: string;
}
```

### Sections du Modal

#### 1. Sélection Type
```
┌────────────────────────────────────────┐
│ Type de graphique                      │
├────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│ │  📈  │ │  📊  │ │  📍  │ │  🥧  │  │
│ │Ligne │ │Barre │ │ Aire │ │Tarte │  │
│ │      │ │      │ │      │ │      │  │
│ │✓ Sel │ │      │ │      │ │      │  │
│ └──────┘ └──────┘ └──────┘ └──────┘  │
│                                        │
│ ℹ️ Ligne: Idéal pour tendances        │
└────────────────────────────────────────┘
```

#### 2. Sélection KPIs (Multi-select avec recherche)
```
┌────────────────────────────────────────┐
│ KPIs à afficher (1-3)                  │
├────────────────────────────────────────┤
│ 🔍 [Rechercher un KPI...............]  │
│                                        │
│ 💰 Financiers                          │
│ ☑ Revenue          152,000€  [📈+2%]  │
│ ☑ Margin            20.8%    [📈+1%]  │
│ ☐ Profit            31,600€  [📉-3%]  │
│                                        │
│ 📦 Opérationnels                       │
│ ☐ Orders              445    [📈+5%]  │
│ ☐ Avg Order Value    342€    [─ 0%]   │
│                                        │
│ 2 KPIs sélectionnés                   │
└────────────────────────────────────────┘
```

#### 3. Période
```
┌────────────────────────────────────────┐
│ Période d'analyse                      │
├────────────────────────────────────────┤
│ ⚪ 7 derniers jours                     │
│ ⚫ 30 derniers jours (Recommandé)      │
│ ⚪ 90 derniers jours                    │
│ ⚪ Cette année                          │
│ ⚪ Personnalisée                        │
│                                        │
│ [Si personnalisée]                     │
│ Du:  [15/12/2024 📅]                   │
│ Au:  [15/01/2026 📅]                   │
└────────────────────────────────────────┘
```

#### 4. Filtres (Accordéon, optionnel)
```
┌────────────────────────────────────────┐
│ ⚡ Filtres avancés (optionnel)    [▼]  │
├────────────────────────────────────────┤
│                                        │
│ Catégorie                              │
│ [Toutes les catégories ▼]             │
│                                        │
│ Source de données                      │
│ ☑ test_kpi.json (10 lignes)           │
│ ☑ sales_2024.csv (1,234 lignes)       │
│ ☐ data_q4.xlsx (567 lignes)           │
│                                        │
└────────────────────────────────────────┘
```

#### 5. Options d'Affichage
```
┌────────────────────────────────────────┐
│ Options d'affichage              [▼]   │
├────────────────────────────────────────┤
│ ☑ Afficher la légende                  │
│ ☑ Afficher les valeurs sur le graphe   │
│ ☐ Afficher la grille                   │
│ ☑ Lissage de courbe (ligne uniquement)│
└────────────────────────────────────────┘
```

#### 6. Aperçu
```
┌────────────────────────────────────────┐
│ 👁️ Aperçu                              │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │  📈 Revenue & Margin (30j)        │ │
│ │                                    │ │
│ │  [Miniature graphique temps réel]  │ │
│ │                                    │ │
│ │  Revenue: 152K€ (+2%)              │ │
│ │  Margin: 20.8% (+1%)               │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

#### 7. Actions
```
┌────────────────────────────────────────┐
│                                        │
│    [Annuler]           [Créer 🎉]     │
│                                        │
└────────────────────────────────────────┘
```

---

## 💻 Exemple de Code React

```typescript
// ChartConfigModal.tsx
import React, { useState } from 'react';
import { X, TrendingUp, BarChart3, Activity, PieChart } from 'lucide-react';

interface ChartConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: ChartConfig) => void;
}

export const ChartConfigModal: React.FC<ChartConfigModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [config, setConfig] = useState<ChartConfig>({
    type: 'line',
    kpis: [],
    period: { type: 'preset', preset: '30d' },
    filters: {},
    options: {
      showLegend: true,
      showValues: true,
      showGrid: false,
      smoothCurve: true
    }
  });

  const chartTypes = [
    { id: 'line', icon: TrendingUp, label: 'Ligne', desc: 'Évolution temporelle' },
    { id: 'bar', icon: BarChart3, label: 'Barre', desc: 'Comparaison' },
    { id: 'area', icon: Activity, label: 'Aire', desc: 'Tendance cumul' },
    { id: 'pie', icon: PieChart, label: 'Camembert', desc: 'Répartition %' }
  ];

  const availableKPIs = [
    { id: 'revenue', name: 'Revenue', value: '152K€', trend: '+2%', category: 'Financiers' },
    { id: 'margin', name: 'Margin', value: '20.8%', trend: '+1%', category: 'Financiers' },
    { id: 'orders', name: 'Orders', value: '445', trend: '+5%', category: 'Opérationnels' }
  ];

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">Créer un Nouveau Graphique</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Type Selection */}
          <section>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Type de graphique</h3>
            <div className="grid grid-cols-4 gap-3">
              {chartTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setConfig({ ...config, type: type.id as any })}
                    className={`
                      p-4 border-2 rounded-lg text-center transition-all
                      ${config.type === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm font-medium">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.desc}</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* KPI Selection */}
          <section>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              KPIs à afficher (1-3)
            </h3>
            <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
              {availableKPIs.map(kpi => (
                <label
                  key={kpi.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={config.kpis.includes(kpi.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setConfig({ ...config, kpis: [...config.kpis, kpi.id] });
                      } else {
                        setConfig({
                          ...config,
                          kpis: config.kpis.filter(k => k !== kpi.id)
                        });
                      }
                    }}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{kpi.name}</div>
                    <div className="text-xs text-gray-500">{kpi.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{kpi.value}</div>
                    <div className="text-xs text-green-600">{kpi.trend}</div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Period Selection */}
          <section>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Période</h3>
            <div className="space-y-2">
              {['7d', '30d', '90d'].map(period => (
                <label key={period} className="flex items-center">
                  <input
                    type="radio"
                    name="period"
                    checked={config.period.preset === period}
                    onChange={() => setConfig({
                      ...config,
                      period: { type: 'preset', preset: period as any }
                    })}
                    className="mr-2"
                  />
                  <span>
                    {period === '7d' && '7 derniers jours'}
                    {period === '30d' && '30 derniers jours (Recommandé)'}
                    {period === '90d' && '90 derniers jours'}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Preview */}
          <section>
            <h3 className="text-sm font-medium text-gray-700 mb-3">👁️ Aperçu</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-500 text-center">
                Aperçu du graphique apparaîtra ici
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={config.kpis.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Créer le graphique 🎉
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## 📱 Adaptation Mobile

Pour les écrans < 768px, le modal s'adapte :

```
Mobile (Portrait)
┌─────────────────────┐
│ Créer Graphique [✕]│
├─────────────────────┤
│                     │
│ Type                │
│ ┌────┐ ┌────┐      │
│ │ 📈 │ │ 📊 │      │
│ └────┘ └────┘      │
│ ┌────┐ ┌────┐      │
│ │ 📍 │ │ 🥧 │      │
│ └────┘ └────┘      │
│                     │
│ KPIs (Scroll)       │
│ ☑ Revenue           │
│ ☑ Margin            │
│ ☐ Orders            │
│                     │
│ Période             │
│ [30 jours ▼]       │
│                     │
│ [Aperçu ▼]         │
│                     │
│ [Créer]             │
└─────────────────────┘
```

- Grille 2x2 pour types
- Liste verticale pour KPIs
- Accordéons fermés par défaut
- Boutons pleine largeur

---

## 🎨 Design System

### Palette de Couleurs
```
Primaire: #2563EB (Blue-600) - Actions principales
Secondaire: #64748B (Gray-600) - Textes secondaires
Succès: #10B981 (Green-500) - Confirmation
Erreur: #EF4444 (Red-500) - Erreurs
Fond: #F9FAFB (Gray-50) - Background
Bordure: #E5E7EB (Gray-200) - Séparateurs
```

### Typographie
```
Titres: Inter/System Font 600 (16-20px)
Corps: Inter/System Font 400 (14px)
Petits: Inter/System Font 400 (12px)
```

### Espacements
```
Padding modal: 24px
Gap entre sections: 24px
Gap entre éléments: 12px
Border radius: 8px
```

---

## 🧪 Tests Utilisateurs Recommandés

### Scénario 1 : Utilisateur Novice
**Tâche** : "Créez un graphique montrant l'évolution du revenue sur 30 jours"
**Observation** :
- Temps de complétion
- Nombre de clics
- Zones de confusion

### Scénario 2 : Utilisateur Avancé
**Tâche** : "Comparez revenue et margin, filtrés par catégorie Ventes, sur Q4 2024"
**Observation** :
- Efficacité
- Utilisation des raccourcis
- Satisfaction

### Scénario 3 : Premier Contact
**Tâche** : "Explorez l'interface et créez un graphique de votre choix"
**Observation** :
- Découvrabilité
- Intuitivité
- Questions posées

---

## 📚 Ressources et Inspirations

### Outils Similaires
- **Google Sheets Charts** : Modal simple, très accessible
- **Tableau** : Drag & drop puissant mais complexe
- **Power BI** : Panneau latéral avec preview
- **Chart.js Builder** : Configuration JSON visuelle
- **Recharts Playground** : Code + preview

### Libraries React Recommandées
- **Recharts** : Graphiques (déjà utilisé)
- **Headless UI** : Modal accessible
- **react-select** : Multi-select KPIs
- **react-day-picker** : Date picker custom
- **framer-motion** : Animations fluides

---

## 🚀 Plan d'Implémentation (3 Sprints)

### Sprint 1 (1 semaine) : Modal Basique
- [ ] Structure du modal
- [ ] Sélection type (4 types)
- [ ] Sélection KPIs (liste simple)
- [ ] Période prédéfinie (3 options)
- [ ] Bouton créer → Affichage graphique

### Sprint 2 (1 semaine) : Enrichissement
- [ ] Aperçu temps réel
- [ ] Filtres catégories/sources
- [ ] Options d'affichage
- [ ] Validation formulaire
- [ ] Messages d'erreur

### Sprint 3 (1 semaine) : Polish
- [ ] Animations
- [ ] Responsive mobile
- [ ] Raccourcis clavier
- [ ] Sauvegarde de templates
- [ ] Tests E2E

---

## ✅ Checklist de Validation

Avant de démarrer le développement, valider :

- [ ] Choix de la proposition (recommandation : Modal)
- [ ] Design system aligné avec l'existant
- [ ] Liste complète des types de graphiques supportés
- [ ] Contraintes métier (max KPIs, formats de date, etc.)
- [ ] Priorité des fonctionnalités (MVP vs Nice-to-have)
- [ ] Tests utilisateurs planifiés
- [ ] API backend ready (endpoints pour KPIs list, data fetch)

---

**FIN DU DOCUMENT**

Prochaine étape : Choisir une proposition et créer les maquettes Figma/Sketch détaillées.
