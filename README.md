# Devendhar Bachhu — Portfolio

A single-page portfolio site built with plain HTML, CSS and JavaScript — no build tools, no frameworks, so it deploys instantly on GitHub Pages.

## File structure

```
index.html
css/
  style.css        → main design system (colors, type, layout, components)
  responsive.css    → reserved for extra breakpoint overrides (optional — style.css already includes its own @media rules)
js/
  main.js           → mobile nav, scroll reveal, footer year
documents/
  Devendhar_Bachhu_Resume.pdf   → linked from the hero "Download résumé" button
images/
  (your photos go here)
```

**Important:** all paths in `index.html` are relative to these folders. If you rename or move a file, update its matching `<link>`, `<script>`, `<img>`, or `<a href>` tag in `index.html` to match — a mismatched path is the #1 reason a page loses its styling (it'll fall back to the browser's unstyled default look).

## Adding your photos

Search `index.html` for `IMAGE PLACEHOLDER` comments — there are 4:
1. Hero portrait
2. Agriculture robot project photo
3. Wave energy project photo
4. Mould / mixer coupler project photo

To swap one in:
1. Add your image file into `images/`, e.g. `images/portrait.jpg`.
2. Find the matching `<div class="photo-slot ...">...</div>` block in `index.html`.
3. Replace the inner `<div class="photo-placeholder">...</div>` with:
   ```html
   <img src="images/portrait.jpg" alt="Devendhar Bachhu at a robotics lab session">
   ```

## Deploying to GitHub Pages

1. Push this folder structure to your repository's `main` branch (you've already got it set up).
2. On GitHub: go to **Settings → Pages**, set **Source** to `main` branch, `/ (root)` folder, and save.
3. Your site will be live in a minute or two at:
   `https://<your-username>.github.io/<repo-name>/`

## Customizing later

- **Colors & fonts** live as CSS variables at the top of `css/style.css` (`:root { ... }`).
- **Text content** — experience, projects, skills — lives directly in `index.html`, organized by section comments (`<!-- ============ ... ============ -->`).
- To add Experion Robotics Academy as its own dedicated section (rather than the current mention inside "About"), duplicate the `.project-card` or `.timeline-item` markup as a starting point.
