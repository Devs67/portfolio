# Devendhar Bachhu — Portfolio (Project Catalyst v1.0)

A single-page portfolio built with plain HTML, CSS and JavaScript — no build tools, no frameworks — deployable directly via GitHub Pages.

This version follows the "Project Catalyst" content plan: Hero → About Me → My Journey → Design Philosophy → Featured Case Studies → Teaching & Makerspace → Gallery → Certifications → Contact.

## File structure

```
index.html
css/
  style.css         → design system (colors, type, layout, components)
  responsive.css     → breakpoint overrides
js/
  main.js            → nav toggle, scroll reveal, hero word rotator, footer year
documents/
  Devendhar_Bachhu_Resume.pdf
images/
  (your photos go here — currently empty)
```

## Adding the Gallery

The Gallery section (`#gallery` in `index.html`) is intentionally empty for now. To populate it:
1. Add your images into `images/`.
2. Uncomment / add a `<div class="gallery-grid">` block inside the gallery section with `<img>` tags pointing to `images/yourfile.jpg`.
3. The `.gallery-grid` CSS class (already in `css/style.css`) will lay them out in a responsive grid automatically.

## Adding case study photos

The three project cards in "Featured Case Studies" currently have no images (per your last request). To add one back:
1. Add the image to `images/`.
2. Inside the relevant `<article class="project-card">`, add an image element above `<div class="card-body">`, e.g.:
   ```html
   <img src="images/agri-robot.jpg" alt="Solar-powered agriculture robot" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:3px 3px 0 0;">
   ```

## Deploying / updating on GitHub Pages

Replace your existing `index.html`, `css/style.css`, `css/responsive.css`, and `js/main.js` with these versions, commit, and push to `main`. If GitHub Pages is already configured (Settings → Pages → `main` / root), it updates automatically within a minute or two.

## Roadmap (from the content plan)

Future additions noted in the source content doc: an interactive project explorer, an animated timeline, premium scroll animations, full project case-study pages, the photo gallery, and a blog/resources section. The current structure (semantic sections, clear IDs, a single design-token file) is built so each of these can be added incrementally without a redesign.
