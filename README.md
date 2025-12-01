# 🗺️ Geospatial Alert System

> **Application de surveillance géographique en temps réel** avec système d'alertes automatique basé sur le geofencing

Une application web moderne permettant de dessiner des zones géographiques, créer des événements géolocalisés, et recevoir automatiquement des alertes lorsqu'un événement se produit dans une zone surveillée.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Django](https://img.shields.io/badge/Django-5.0-092E20?logo=django)](https://www.djangoproject.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Démo

**Note :** Ce projet nécessite un backend Django pour fonctionner. Pour une démo complète, suivez les instructions d'installation ci-dessous.

### Démo locale rapide
```bash
# Terminal 1 - Backend
cd backend && .\venv\Scripts\Activate.ps1 && python manage.py runserver

# Terminal 2 - Frontend  
cd frontend && npm run dev
```
Ouvrez http://localhost:5173 pour voir l'application en action !

### 📸 Aperçu

![Application Screenshot](docs/demo-screenshot.png)

*Interface principale : carte interactive, zones géographiques, événements et système d'alertes*

---

## 🎯 Problématique

Cette application résout le problème de **surveillance géographique en temps réel** :

- **Surveiller des zones d'intérêt** : Écoles, hôpitaux, zones commerciales, chantiers
- **Détecter automatiquement** quand des événements (incidents météo, accidents de circulation, urgences) se produisent dans ces zones
- **Recevoir des alertes instantanées** sans avoir à consulter manuellement plusieurs sources d'information
- **Gérer proactivement** les situations critiques dans des périmètres définis

### Cas d'usage concrets :
- 🏫 **Établissements scolaires** : Alertes si incident de sécurité dans un rayon de 2km
- 🏗️ **Chantiers** : Notification d'intempéries dans la zone de travaux
- 🚗 **Gestionnaires de flotte** : Incidents de trafic sur les itinéraires prédéfinis
- 🏥 **Services d'urgence** : Événements critiques dans les secteurs d'intervention

## ✨ Fonctionnalités

- 🗺️ **Carte interactive** avec Leaflet et React-Leaflet
- ✏️ **Dessin de zones géographiques** personnalisées (polygones) avec Geoman
- 🚨 **Création d'événements géolocalisés** avec niveaux de sévérité (faible, moyen, élevé, critique)
- 🔔 **Système d'alertes automatique** via geofencing (détection point-in-polygon)
- 🎯 **Drag & Drop** : déplacez les événements sur la carte
- ✏️ **Édition** : modifiez zones et événements en temps réel
- 🗑️ **Suppression** : gérez vos données facilement
- 🌙 **Mode sombre** avec toggle simple et persistance localStorage
- 📊 **Données de démo** pré-chargées pour démonstration rapide (Paris)
- 🔄 **API REST** complète avec Django REST Framework
- 📱 **Responsive** : interface adaptée aux différentes tailles d'écran

## 🛠️ Technologies

### Frontend
- **React 19** avec hooks modernes (useState, useEffect, useRef)
- **TypeScript** pour le typage fort et la maintenabilité
- **Vite** pour un build ultra-rapide et HMR instantané
- **Leaflet** + **React-Leaflet** pour la cartographie interactive
- **Geoman** pour les outils de dessin avancés
- **Axios** pour les requêtes API
- **CSS Variables** pour le theming dynamique

### Backend
- **Django 5.0** avec architecture MVT
- **Django REST Framework 3.14** pour l'API RESTful
- **Shapely 2.0** pour les opérations géospatiales (point-in-polygon)
- **SQLite** (développement) / **PostgreSQL + PostGIS** (production ready)
- **NumPy** pour les calculs de performance

### DevOps
- **Git** pour le versioning
- **VS Code** avec extensions Python et TypeScript
- **Virtual Environment** Python pour l'isolation des dépendances
- Prêt pour **Docker** et déploiement cloud

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- Python 3.12+
- (Optionnel) PostgreSQL + PostGIS pour la production

### Backend

```powershell
cd backend

# Activer l'environnement virtuel
.\venv\Scripts\Activate.ps1

# Les dépendances sont déjà installées, mais si besoin:
pip install -r requirements.txt

# Lancer le serveur Django
python manage.py runserver
```

Le backend sera disponible sur `http://localhost:8000`

### Frontend

```powershell
cd frontend

# Les dépendances sont déjà installées, mais si besoin:
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend sera disponible sur `http://localhost:5173`

### 📊 Charger les données de démonstration

Pour faciliter la découverte de l'application, vous pouvez charger des données de démo (zones autour de Paris, événements variés, alertes pré-générées) :

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py init_demo_data
```

Cette commande crée :
- 🏙️ **5 types d'événements** : Météo, Trafic, Urgence, Travaux, Événement
- 📍 **3 zones** : Centre de Paris, Quartier Latin, La Défense
- 🚨 **6 événements** simulés avec différentes sévérités
- 🔔 **4 alertes** générées automatiquement via geofencing

💡 **Tip** : Vous pouvez relancer cette commande à tout moment pour réinitialiser les données de démo

## 📖 Guide d'utilisation

### 1️⃣ Définir vos zones de surveillance

1. **Cliquez sur l'icône de polygone** 🔷 en haut à droite de la carte
2. **Cliquez sur la carte** pour placer chaque point du polygone
3. **Fermez le polygone** en cliquant sur le premier point
4. **Entrez un nom** pour votre zone (ex: "École Marie Curie", "Zone Industrielle Nord")
5. La zone apparaît dans la **sidebar gauche** sous l'onglet "Zones"

💡 **Astuce** : Créez plusieurs zones pour surveiller différents périmètres simultanément

### 2️⃣ Simuler des événements

1. **Cliquez sur l'onglet "Événements"** dans la sidebar
2. **Cliquez sur "➕ Nouvel événement"**
3. **Remplissez le formulaire** :
   - **Titre** : "Accident de la route", "Orage violent", "Travaux urgents"
   - **Description** : Détails de l'événement
   - **Latitude/Longitude** : Coordonnées GPS (modifiez pour positionner l'événement)
   - **Sévérité** : Faible (🟢) / Moyenne (🟠) / Élevée (🔴) / Critique (⚫)
4. **Créez l'événement** : Il apparaît sur la carte avec une couleur selon la sévérité

💡 **Astuce** : Pour Paris, utilisez environ `lat: 48.85` et `lng: 2.35`

### 3️⃣ Recevoir les alertes

🔔 Une **alerte est automatiquement générée** lorsqu'un événement est créé **à l'intérieur** d'une zone surveillée !

1. **Le bouton "🔔 Alertes"** en bas à droite affiche un badge rouge avec le nombre d'alertes non lues
2. **Cliquez sur le bouton** pour ouvrir le panneau d'alertes
3. **Consultez les détails** : Zone concernée, événement, sévérité, date/heure
4. **Marquez comme lue** : Cliquez sur ✓ pour chaque alerte traitée
5. **Marquez tout comme lu** : Bouton en haut du panneau

### 4️⃣ Gérer vos zones

- **Sélectionner une zone** : Cliquez sur une zone dans la sidebar ou sur la carte
- **Supprimer une zone** : Cliquez sur 🗑️ dans la liste des zones
- La zone sélectionnée s'affiche en **bleu** sur la carte

---

## 🎬 Exemple de scénario complet

1. **Dessinez une zone** autour d'une école (polygone)
2. **Créez un événement "Alerte météo"** avec sévérité "Élevée"
3. **Placez l'événement à l'intérieur de la zone** (ajustez lat/lng)
4. ✅ **Une alerte est générée automatiquement** !
5. Consultez l'alerte dans le panneau 🔔
6. Marquez-la comme lue une fois traitée

---

---

## 🚀 Démarrage rapide

### Option 1 : Lancer avec VS Code Tasks (recommandé)

```bash
# Ouvrir le projet dans VS Code
# Puis : Terminal > Run Task > Start All Servers
```

### Option 2 : Lancement manuel

**Terminal 1 - Backend :**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

**Terminal 2 - Frontend :**
```powershell
cd frontend
npm run dev
```

**Accès :**
- Frontend : http://localhost:5173
- Backend API : http://localhost:8000/api/
- Admin Django : http://localhost:8000/admin/ (user: `admin`, no password)

---

## 📡 API Endpoints

### Zones
- `GET/POST /api/zones/` - Liste et création de zones
- `GET/PUT/DELETE /api/zones/{id}/` - Détails, mise à jour, suppression

### Événements
- `GET/POST /api/events/` - Liste et création d'événements
- `POST /api/events/check_geofencing/` - Vérifier le geofencing pour un événement

### Alertes
- `GET /api/alerts/` - Liste des alertes
- `POST /api/alerts/{id}/mark_as_read/` - Marquer une alerte comme lue
- `POST /api/alerts/mark_all_as_read/` - Marquer toutes les alertes comme lues

## 🎨 Architecture

```
├── backend/
│   ├── geoapp/           # Configuration Django
│   ├── geospatial/       # App principale (models, views, serializers)
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Composants React
│   │   │   ├── MapView.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── AlertPanel.tsx
│   │   ├── api.ts        # Client API
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
```

## 🔮 Améliorations futures

- [ ] **Authentification** : Système de login/register avec JWT
- [ ] **Notifications push** : WebSockets pour alertes en temps réel
- [ ] **Tests automatisés** : Jest (front) + Pytest (back) + E2E (Playwright)
- [ ] **CI/CD** : GitHub Actions pour déploiement automatique
- [ ] **Export de données** : GeoJSON, KML, CSV
- [ ] **Historique** : Timeline des événements et alertes
- [ ] **Statistiques** : Dashboard analytics avec graphiques
- [ ] **Migration PostgreSQL + PostGIS** : Index spatiaux pour performance
- [ ] **Docker** : Conteneurisation complète
- [ ] **Mobile app** : React Native ou PWA

---

## 📝 Licence

MIT License - Open Source

---

## 👨‍💻 Auteur

**Développé avec une approche AI-Augmented Engineering**

Ce projet démontre :
- ✅ Architecture full-stack moderne et scalable
- ✅ Maîtrise des technologies web (React, Django, TypeScript)
- ✅ Résolution de problèmes complexes (geofencing, drag & drop cartographique)
- ✅ Pratiques de développement modernes (hooks React, API REST, typage fort)
- ✅ Orchestration d'outils d'IA pour accélérer le développement
- ✅ Capacité à expliquer et documenter des concepts techniques

💡 **Note :** Ce projet a été développé en utilisant GitHub Copilot et Claude (Anthropic) comme assistants de développement, sous ma supervision technique et architecturale complète.

---

## 📫 Contact

Pour toute question ou opportunité professionnelle :
- GitHub : [votre-username]
- LinkedIn : [votre-profil]
- Email : [votre-email]

---

**⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile !**
