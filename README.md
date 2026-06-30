# Devendhar Bachhu — Portfolio

A single-page portfolio site built from scratch with plain HTML, CSS and JavaScript — no build tools, no frameworks, so it deploys instantly on GitHub Pages.

## Files

```
index.html      → all page content
styles.css       → design system (colors, type, layout, animation)
script.js        → mobile nav, scroll reveal, footer year
Devendhar_Bachhu_Resume.pdf  → downloadable resume (linked from the hero button)
```

## Adding your photos

Search the project for `IMAGE PLACEHOLDER` comments in `index.html` — there are 4:
1. Hero portrait
2. Agriculture robot project photo
3. Wave energy project photo
4. Mould / mixer coupler project photo

To swap a placeholder for a real photo:
1. Drop your image file into the project folder (e.g. `images/portrait.jpg` — create an `images` folder).
2. Find the matching `<div class="photo-slot ...">...</div>` block.
3. Replace the inner `<div class="photo-placeholder">...</div>` with:
   ```html
   <img src="images/portrait.jpg" alt="Devendhar Bachhu at a robotics lab session">
   ```

## Deploying to GitHub Pages

1. Create a new repository on GitHub, e.g. `devendhar-portfolio`.
2. From this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/devendhar-portfolio.git
   git push -u origin main
   ```
3. On GitHub: go to **Settings → Pages**, set **Source** to `main` branch, `/ (root)` folder, and save.
4. Your site will be live in a minute or two at:
   `https://<your-username>.github.io/devendhar-portfolio/`

## Customizing later

- **Colors & fonts** live as CSS variables at the top of `styles.css` (`:root { ... }`).
- **Text content** — experience, projects, skills — lives directly in `index.html`, organized by section comments (`<!-- ============ ... ============ -->`).
- To add Experion Robotics Academy as its own dedicated section (rather than the current mention inside "About"), duplicate the `.project-card` or `.timeline-item` markup as a starting point.
