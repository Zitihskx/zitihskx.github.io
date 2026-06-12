# Academic Website Template (Static)

This is a simple, responsive academic website template generated from the provided CV.

## Run locally
Because the site fetches `data/publications.json`, serve it via a local server:

### Option A (Python)
```bash
python -m http.server 8000
# then open http://localhost:8000
```

### Option B (Node)
```bash
npx serve .
```

## Customize
- Edit `index.html` for the main content.
- Update publications in `data/publications.json`.
- Replace placeholder publication links with real URLs/DOIs.
- Replace `data/Kshitiz_Aryal_CV.pdf` with your latest CV (same filename to keep the button working).

## Deploy (easy)
- GitHub Pages: push this folder to a repo and enable Pages (root).
- Netlify/Vercel: drag-and-drop the folder or connect the repo.
