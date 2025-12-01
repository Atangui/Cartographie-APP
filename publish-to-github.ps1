# Script de publication sur GitHub
# Geospatial Alert System

Write-Host "🚀 Publication du projet sur GitHub" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PROJECT_NAME = "geospatial-alert-system"
$GITHUB_USERNAME = Read-Host "Entrez votre nom d'utilisateur GitHub"

Write-Host ""
Write-Host "📝 Informations du projet:" -ForegroundColor Yellow
Write-Host "  - Nom du projet: $PROJECT_NAME"
Write-Host "  - Username GitHub: $GITHUB_USERNAME"
Write-Host ""

# Confirmation
$confirm = Read-Host "Voulez-vous continuer? (O/N)"
if ($confirm -ne "O" -and $confirm -ne "o") {
    Write-Host "❌ Publication annulée" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🔄 Étape 1/5 : Initialisation Git..." -ForegroundColor Green

# Vérifier si Git est déjà initialisé
if (Test-Path ".git") {
    Write-Host "⚠️  Git déjà initialisé" -ForegroundColor Yellow
} else {
    git init
    Write-Host "✅ Git initialisé" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Étape 2/5 : Ajout des fichiers..." -ForegroundColor Green
git add .
Write-Host "✅ Fichiers ajoutés" -ForegroundColor Green

Write-Host ""
Write-Host "💾 Étape 3/5 : Commit initial..." -ForegroundColor Green
git commit -m "Initial commit: Geospatial Alert System v1.0

- Full-stack application React 19 + Django 5
- Geofencing algorithm with Shapely
- Drag & drop cartographic features
- Real-time alerts system
- Dark mode with localStorage persistence
- Complete API REST with Django REST Framework"

Write-Host "✅ Commit créé" -ForegroundColor Green

Write-Host ""
Write-Host "🌐 Étape 4/5 : Configuration du remote..." -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Créez maintenant le dépôt sur GitHub" -ForegroundColor Yellow
Write-Host "   1. Allez sur https://github.com/new" -ForegroundColor White
Write-Host "   2. Nom du dépôt: $PROJECT_NAME" -ForegroundColor White
Write-Host "   3. Description: Real-time geospatial alert system with automatic geofencing" -ForegroundColor White
Write-Host "   4. Public ✅" -ForegroundColor White
Write-Host "   5. NE PAS initialiser avec README, .gitignore ou license" -ForegroundColor White
Write-Host "   6. Cliquez sur 'Create repository'" -ForegroundColor White
Write-Host ""

$ready = Read-Host "Avez-vous créé le dépôt sur GitHub? (O/N)"
if ($ready -ne "O" -and $ready -ne "o") {
    Write-Host "❌ Veuillez créer le dépôt sur GitHub d'abord" -ForegroundColor Red
    exit
}

# Configuration du remote
$REPO_URL = "https://github.com/$GITHUB_USERNAME/$PROJECT_NAME.git"
git remote add origin $REPO_URL
git branch -M main

Write-Host "✅ Remote configuré: $REPO_URL" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 Étape 5/5 : Push vers GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host ""
Write-Host "🎉 Publication réussie!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Votre projet est maintenant disponible à:" -ForegroundColor Cyan
Write-Host "   https://github.com/$GITHUB_USERNAME/$PROJECT_NAME" -ForegroundColor White
Write-Host ""
Write-Host "📋 Prochaines étapes recommandées:" -ForegroundColor Yellow
Write-Host "   1. Ajoutez une image du projet dans About > Add picture" -ForegroundColor White
Write-Host "   2. Ajoutez les topics suggérés:" -ForegroundColor White
Write-Host "      react, typescript, django, leaflet, geospatial, fullstack, portfolio" -ForegroundColor Gray
Write-Host "   3. Prenez une screenshot et ajoutez-la au README si besoin" -ForegroundColor White
Write-Host ""
Write-Host "✨ Bon courage pour vos démarches! 🚀" -ForegroundColor Cyan
