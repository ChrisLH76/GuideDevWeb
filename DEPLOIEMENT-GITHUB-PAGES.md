# 🚀 Déployer sur GitHub Pages

## Étapes pour publier ton site

### 1️⃣ Créer un compte GitHub
1. Va sur [github.com](https://github.com)
2. Clique sur "Sign up" (Inscription)
3. Crée ton compte gratuit

### 2️⃣ Créer un nouveau repository
1. Connecte-toi à GitHub
2. Clique sur le bouton "+" en haut à droite
3. Sélectionne "New repository"
4. Nomme-le : `guides-dev-web` (ou un autre nom)
5. Laisse-le **Public**
6. ⚠️ **NE COCHE PAS** "Add a README file"
7. Clique sur "Create repository"

### 3️⃣ Pousser ton code sur GitHub

Ouvre le terminal dans le dossier `GuideDevWeb` et tape ces commandes :

```bash
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Guides Dev Web"

# Lier au repository GitHub (remplace USERNAME et NOM-REPO)
git remote add origin https://github.com/USERNAME/NOM-REPO.git

# Pousser le code
git branch -M main
git push -u origin main
```

**Remplace :**
- `USERNAME` par ton nom d'utilisateur GitHub
- `NOM-REPO` par le nom de ton repository

### 4️⃣ Activer GitHub Pages

1. Va sur ton repository GitHub
2. Clique sur **"Settings"** (Paramètres)
3. Dans le menu de gauche, clique sur **"Pages"**
4. Sous "Source", sélectionne :
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Clique sur **"Save"**

### 5️⃣ Attendre le déploiement

⏱️ Attends 1-2 minutes. GitHub va construire ton site.

Ton site sera accessible à :
```
https://USERNAME.github.io/NOM-REPO/
```

### 6️⃣ Vérifier que tout fonctionne

✅ Teste toutes les fonctionnalités :
- Mode sombre/clair
- Navigation entre les pages
- Favoris
- Recherche
- Copie de code
- PWA (installation sur mobile)

---

## 🔧 Problèmes fréquents

### ❌ Le CSS ne s'affiche pas
**Solution :** Tous les liens sont déjà en relatif (`./style.css`), ça devrait fonctionner.

### ❌ Le Service Worker ne fonctionne pas
**Solution :** GitHub Pages utilise HTTPS, le Service Worker devrait fonctionner. Si ce n'est pas le cas, vérifie la console (F12).

### ❌ Page 404
**Solution :** Vérifie que :
1. Le fichier `index.html` existe à la racine
2. Tu as sélectionné la branche `main` dans les settings
3. Tu as attendu 1-2 minutes après l'activation

---

## 🔄 Mettre à jour le site

Quand tu modifies ton code :

```bash
# Ajouter les modifications
git add .

# Créer un commit
git commit -m "Description de tes modifications"

# Pousser sur GitHub
git push
```

Le site sera mis à jour automatiquement en 1-2 minutes ! 🎉

---

## 📱 Installer comme PWA

Une fois le site en ligne, tu peux l'installer :

**Sur mobile (Chrome/Safari) :**
1. Va sur ton site
2. Ouvre le menu
3. "Ajouter à l'écran d'accueil"

**Sur desktop (Chrome/Edge) :**
1. Clique sur l'icône ⊕ dans la barre d'adresse
2. "Installer Guides Dev Web"

---

## 🎯 Nom de domaine personnalisé (optionnel)

Si tu veux un domaine type `guides-dev.com` au lieu de `username.github.io` :

1. Achète un domaine (ex: Namecheap, OVH, Gandi)
2. Dans les settings GitHub Pages, ajoute ton domaine dans "Custom domain"
3. Configure les DNS chez ton fournisseur :
   ```
   Type: CNAME
   Host: www
   Value: USERNAME.github.io
   ```

---

## ✅ Fichiers nécessaires (déjà créés)

- ✅ `.nojekyll` - Désactive Jekyll (traitement GitHub)
- ✅ Tous les chemins sont relatifs (`./`)
- ✅ Service Worker compatible
- ✅ Manifest.json configuré

**Ton site est 100% prêt pour GitHub Pages !** 🚀
