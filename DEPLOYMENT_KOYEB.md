# Déploiement sur Koyeb (Backend Django)

## 1. Créer un compte Koyeb
- Allez sur https://app.koyeb.com/auth/signup
- Connectez-vous avec GitHub

## 2. Créer le service Backend

1. Cliquez sur **"Create Service"**
2. Sélectionnez **"GitHub"**
3. Autorisez l'accès à votre repo `Cartographie-APP`
4. Configurez :
   - **Repository** : `Atangui/Cartographie-APP`
   - **Branch** : `main`
   - **Build Method** : Docker
   - **Dockerfile path** : `backend/Dockerfile`
   
5. **Variables d'environnement** (onglet "Environment") :
   ```
   DJANGO_SETTINGS_MODULE=geoapp.settings_prod
   SECRET_KEY=votre_secret_key_genere
   ALLOWED_HOSTS=*.koyeb.app
   DB_HOST=aws-0-eu-west-1.pooler.supabase.com
   DB_NAME=postgres
   DB_USER=postgres.xxxxx
   DB_PASSWORD=votre_mot_de_passe_supabase
   DB_PORT=6543
   CORS_ALLOWED_ORIGINS=https://votre-app.vercel.app
   ```

6. **Instance Type** : Free (Eco)
7. **Regions** : Frankfurt (le plus proche)
8. Cliquez sur **"Deploy"**

## 3. Obtenir l'URL du backend
Après le déploiement, notez l'URL publique (ex: `https://cartographie-app-xxx.koyeb.app`)

---

# Déploiement sur Supabase (Base de données)

## 1. Créer un projet Supabase
- Allez sur https://supabase.com/dashboard
- Cliquez sur **"New Project"**
- Nom : `cartographie-app`
- Database Password : **NOTEZ CE MOT DE PASSE**
- Region : **Frankfurt** (Europe West)

## 2. Obtenir les informations de connexion
1. Dans le dashboard, allez dans **Settings** > **Database**
2. Copiez les informations :
   - **Host** : `aws-0-eu-west-1.pooler.supabase.com`
   - **Database name** : `postgres`
   - **Port** : `6543` (Pooler)
   - **User** : `postgres.xxxxx`
   - **Password** : (celui que vous avez noté)

---

# Déploiement sur Vercel (Frontend React)

## 1. Créer un compte Vercel
- Allez sur https://vercel.com/signup
- Connectez-vous avec GitHub

## 2. Importer le projet
1. Cliquez sur **"Add New..."** > **"Project"**
2. Importez `Cartographie-APP` depuis GitHub
3. Configurez :
   - **Root Directory** : `frontend`
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

4. **Variables d'environnement** :
   ```
   VITE_API_URL=https://votre-backend.koyeb.app/api
   ```

5. Cliquez sur **"Deploy"**

## 3. Mettre à jour les CORS
Une fois le déploiement terminé, notez l'URL Vercel (ex: `https://cartographie-app.vercel.app`)

Retournez sur Koyeb et mettez à jour la variable :
```
CORS_ALLOWED_ORIGINS=https://cartographie-app.vercel.app
```

---

# Ordre de déploiement
1. **Supabase** (créer la DB en premier)
2. **Koyeb** (backend avec les infos Supabase)
3. **Vercel** (frontend avec l'URL Koyeb)
4. **Retour Koyeb** (mettre à jour CORS avec URL Vercel)

Votre application sera ensuite accessible 24h/24 sur Vercel !
