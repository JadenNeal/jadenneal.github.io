# Weicai Long Academic Homepage

Local source for the academic homepage of Weicai Long (龙为材).

## Edit the content

All academic content lives in `src/content/`. Each homepage section has one
Markdown file:

- `profile.md`: sidebar profile and contact information
- `about.md`: education and current research overview
- `research.md`: research interests
- `collaboration.md`: message to prospective collaborators
- `talks.md`: talks
- `news.md`: news
- `publications.md`: the complete selected-publication list
- `experience.md`: professional experience
- `more.md`: teaching, service, patent, and awards

For publications, add a new entry to the `publications` list in
`src/content/publications.md` and set its `date`. The site sorts publications
from newest to oldest and assigns numbers automatically, so the earliest paper
is always number 1 and the newest paper has the largest number. Use the optional
`ranking` field for journal metrics or conference rankings.

## Local preview

```bash
npm install
npm run dev
```

Open `http://localhost:3000/` in a browser.

## Production check

```bash
npm test
```

The Astro build generates a static site in `dist/`.

## Deployment

The public site is hosted at `https://jadenneal.github.io/`. Every push to the
`main` branch triggers `.github/workflows/deploy.yml`, which builds the Astro
site and deploys it to GitHub Pages.

After editing content, publish the changes with:

```bash
git add .
git commit -m "Update homepage"
git push
```
