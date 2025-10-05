# 🔒 Sécurité du Site

## Protections Mises en Place

### 1. **Protection XSS (Cross-Site Scripting)**

✅ **Fonction `escapeHtml()`** dans [app.js](app.js#L5-L9)
```javascript
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

Cette fonction convertit automatiquement les caractères dangereux :
- `<` devient `&lt;`
- `>` devient `&gt;`
- `"` devient `&quot;`
- `'` devient `&#039;`
- `&` devient `&amp;`

✅ **Utilisée partout où du contenu utilisateur est affiché :**
- Page des favoris ([favoris.html](favoris.html#L214-L215))
- Suggestions de recherche ([app.js](app.js#L201))

### 2. **Headers de Sécurité HTTP**

✅ **Meta tags de sécurité** dans toutes les pages HTML :
```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta name="referrer" content="strict-origin-when-cross-origin">
```

**Rôle :**
- `X-Content-Type-Options: nosniff` - Empêche le navigateur de deviner le type MIME
- `X-Frame-Options: DENY` - Empêche le site d'être intégré dans une iframe (protection contre le clickjacking)
- `Referrer-Policy` - Contrôle les informations de référencement envoyées

✅ **Fichier `_headers`** pour GitHub Pages :
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 3. **Stockage Sécurisé (localStorage)**

✅ **Validation des données** avant affichage
- Toutes les données de `localStorage` sont parsées avec `JSON.parse()`
- Puis échappées avec `escapeHtml()` avant insertion dans le DOM

⚠️ **Limitations :**
- localStorage n'est PAS chiffré
- Accessible via DevTools (F12)
- Limité au même domaine (Same-Origin Policy)

### 4. **Service Worker Sécurisé**

✅ **Chemins relatifs uniquement** (pas de chemins absolus)
✅ **Pas d'exécution de code externe**
✅ **Cache uniquement les ressources du site**

## Ce Qui N'est PAS Protégé

⚠️ **Le site est statique (frontend uniquement)**
- Pas de backend
- Pas d'authentification
- Pas de base de données
- Pas de validation côté serveur

⚠️ **localStorage peut être modifié**
- Un utilisateur peut modifier ses propres favoris via DevTools
- Ce n'est pas grave car les données sont locales (pas partagées)

⚠️ **Pas de protection CSRF**
- Non nécessaire car pas de formulaires ni d'actions côté serveur

## Bonnes Pratiques Appliquées

✅ **Principe du moindre privilège**
- Le site ne demande aucune permission (géolocalisation, caméra, etc.)
- Service Worker limité au strict nécessaire

✅ **Validation des entrées**
- Tous les affichages de données utilisateur utilisent `escapeHtml()`

✅ **HTTPS obligatoire sur GitHub Pages**
- Toutes les communications sont chiffrées
- Protection contre les attaques Man-in-the-Middle

✅ **Pas de dépendances externes**
- Pas de CDN tiers
- Pas de bibliothèques externes non auditées
- Tout le code est hébergé sur le même domaine

## Tests de Sécurité

### Test XSS Manuel

Essayez d'ajouter en favori une fonction avec ce titre malveillant :
```
<img src=x onerror=alert('XSS')>
```

✅ **Résultat attendu :** Le code ne s'exécute PAS, le titre s'affiche comme texte brut

### Test Clickjacking

Essayez d'intégrer le site dans une iframe :
```html
<iframe src="https://votre-site.github.io"></iframe>
```

✅ **Résultat attendu :** Le navigateur bloque le chargement (grâce à `X-Frame-Options: DENY`)

## Rapport de Vulnérabilités

Si vous découvrez une faille de sécurité :
1. **NE PAS** la divulguer publiquement
2. Créer une issue GitHub privée
3. Décrire précisément le problème et comment le reproduire

## Mises à Jour de Sécurité

**Dernière mise à jour :** 2024-10-05
- ✅ Ajout de `escapeHtml()` dans tout le code
- ✅ Meta tags de sécurité dans toutes les pages HTML
- ✅ Fichier `_headers` pour CSP et autres protections
- ✅ Chemins relatifs pour compatibilité GitHub Pages

---

**Note :** Ce site est conçu pour l'apprentissage. Il n'y a pas de données sensibles ni d'informations personnelles stockées.
