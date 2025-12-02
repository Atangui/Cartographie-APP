# Guide de déploiement simplifié

## 1. Backend sur Koyeb (via l'interface web - 5 min)

1. Allez sur https://app.koyeb.com/apps
2. Cliquez sur **"Create Service"**
3. Sélectionnez **"GitHub"** 
4. Choisissez le repo **"Cartographie-APP"**
5. Configurez :
   - **Builder** : Dockerfile
   - **Dockerfile path** : `backend/Dockerfile`
   - **Port** : 8000
   
6. **Variables d'environnement** :
   ```
   DJANGO_SETTINGS_MODULE=geoapp.settings_prod
   SECRET_KEY=cnngoqkw3lb54del16rt1cdobfg424ps4n6ydpctlwr0m81re2
   ALLOWED_HOSTS=*.koyeb.app
   DB_HOST=aws-0-eu-west-1.pooler.supabase.com
   DB_NAME=postgres
   DB_USER=postgres.xxxxxxxxxxxxx
   DB_PASSWORD=7fYba9HeibNRH6m
   DB_PORT=6543
   ```
   
   **IMPORTANT** : Pour `DB_USER`, allez sur Supabase > Settings > Database, copiez exactement la valeur "User" (qui ressemble à `postgres.xxxxxx`)

7. Cliquez sur **"Deploy"**
8. **Notez l'URL** une fois déployé (ex: `https://cartographie-backend-xxx.koyeb.app`)

---

## 2. Frontend sur Vercel (via CLI - déjà configuré)

Dans le terminal (depuis le dossier `frontend`) :

```powershell
# Mettre à jour la variable avec l'URL Koyeb
vercel env rm VITE_API_URL production
vercel env add VITE_API_URL production
# Entrez : https://cartographie-backend-xxx.koyeb.app/api

# Déployer
vercel --prod
```

---

## 3. Mise à jour CORS (retour sur Koyeb)

Une fois Vercel déployé, notez l'URL (ex: `https://cartographie-app.vercel.app`)

Retournez sur Koyeb > Service > Settings > Environment Variables :
- Ajoutez : `CORS_ALLOWED_ORIGINS=https://cartographie-app.vercel.app`
- Redéployez le service

**C'EST FINI !** ✅
