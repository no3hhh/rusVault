# RusVault PWA — iPhone App

**Apprentissage du russe par lecture active — version mobile offline.**

## 📱 Installation sur iPhone

### Option 1 : Hébergement local (recommandé)
```bash
# Sur ton Mac, dans le dossier rusvault-pwa :
python3 -m http.server 8080

# Puis sur iPhone (même réseau WiFi) :
# Ouvrir Safari → http://<IP-du-mac>:8080
# Tap "Partager" → "Sur l'écran d'accueil"
```

### Option 2 : Hébergement gratuit
- **GitHub Pages** : Push le dossier sur un repo → Settings → Pages → Deploy
- **Netlify** : Drag & drop le dossier sur netlify.com
- **Cloudflare Pages** : Connecter un repo ou upload direct

> ⚠️ HTTPS est requis pour le Service Worker (localhost est une exception).

## 🎯 Fonctionnalités

| Fonctionnalité | Status |
|---|---|
| 📄 Import texte (copier-coller) | ✅ |
| 📂 Import fichier .txt | ✅ |
| 🎥 Import YouTube (URL + paste) | ✅ |
| 🔵 Mots nouveaux (bleu) | ✅ |
| 🟡 Mots sauvegardés (jaune) | ✅ |
| ⚪ Mots connus (grisés) | ✅ |
| Tap → traduction auto (FR) | ✅ |
| Save / Known / Ignore | ✅ |
| Base de données locale (IndexedDB) | ✅ |
| Export/Import JSON | ✅ |
| Mode sombre/clair | ✅ |
| Taille de police ajustable | ✅ |
| Statistiques | ✅ |
| 100% Offline après premier chargement | ✅ |

## 🏗 Architecture

```
rusvault-pwa/
├── index.html      ← App complète (HTML + CSS + JS, ~30KB)
├── sw.js           ← Service Worker (cache offline)
├── manifest.json   ← PWA manifest
├── icon-192.png    ← Icône app
├── icon-512.png    ← Icône app HD
└── README.md
```

**Choix technique : PWA (Progressive Web App)**
- ✅ Pas besoin de l'App Store
- ✅ Fonctionne offline via Service Worker
- ✅ IndexedDB pour stockage local illimité
- ✅ "Add to Home Screen" = icône native
- ✅ Un seul fichier HTML, zéro dépendance
- ✅ Compatible iOS Safari 15+

## 🗄 Schéma de la base (IndexedDB)

```
words {
  id: autoIncrement
  word: string           // форма слова
  wordLower: string      // index pour recherche
  translation: string    // traduction FR
  status: enum           // new | saved | learning | known | ignored
  encounters: number     // nombre de rencontres
  contexts: string[]     // phrases de contexte (max 10)
  createdAt: ISO string
  lastSeen: ISO string
}
```

## 🔄 Migration depuis l'extension Chrome

1. Depuis le backend Python, exporter les mots :
```python
import sqlite3, json
conn = sqlite3.connect('rusvault.db')
conn.row_factory = sqlite3.Row
words = [dict(r) for r in conn.execute('SELECT * FROM words').fetchall()]
with open('export.json', 'w') as f:
    json.dump({'version': 1, 'words': words}, f)
```

2. Dans la PWA : Settings → Import Database → sélectionner `export.json`

## 📝 Notes

- La traduction utilise Google Translate (gratuit, pas de clé API)
- Langue cible : français (modifiable dans le code, `tl: 'fr'`)
- Pour YouTube : si la récupération auto échoue, copier-coller le transcript depuis YouTube
