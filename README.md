# A Little Sorry, Arpita 💗

> A tiny, interactive apology website crafted with love by **Palash** for **Arpita**.

---

## 🌸 Overview

This website is a personal, handcrafted digital letter and interactive experience created to communicate openly and sincerely with Arpita. It explains what happened during the recent 4–5 days of absence (travel, falling ill with pneumonia and fever, and Papa coming to help care for Palash), takes full accountability for the lack of communication, validates her feelings without making excuses, and offers gentle, pressure-free ways to reconnect whenever she feels ready.

### Features & Highlights:
- **Screen 1 — A Little Surprise**: A warm welcome hero card with an illustrated kawaii teddy bear holding a glowing heart and an invitation button.
- **Screen 2 — The Honest Explanation**: A stationery letter styled with lined paper texture, wax seal decor, personal heading, and heartfelt explanation preserving every nuance of the situation.
- **Screen 3 — A Little Teddy For You**: An animated waving teddy bear holding a physical note (*“Palash is sorry, Arpita 🥺💗”*) with a delightful interactive virtual hug button that showers hearts.
- **Screen 4 — A Sincere Apology**: Grounded reflections acknowledging her feelings and expressing a genuine desire to communicate better.
- **Screen 5 — Let Her Choose**: Three independent, non-judgmental response buttons (*"Okay, let's talk 💗"*, *"Send me a hug 🫂"*, and *"I need some time 🌷"*), each responding with custom teddy illustrations, warm affirmations, and zero tracking or guilt.
- **Screen 6 — Made With Love By Palash**: A gentle closing dedication and signature.
- **Soft Ambient Music Box**: Built with the Web Audio API (100% offline, zero audio file dependencies), **muted by default** with an accessible toggle in the navigation bar.
- **Ambient Floating Canvas**: Lightweight floating hearts, flower petals, and sparkles with touch/click burst interactions.
- **Accessibility & Mobile-First**: Full support for screen readers, keyboard navigation (`:focus-visible`), responsive layouts for all phone screens, and `@media (prefers-reduced-motion: reduce)` compliance.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic markup, accessible ARIA attributes (`aria-live`, `aria-expanded`, `aria-controls`), and responsive meta tags.
- **CSS3**: Custom design tokens (CSS variables), fluid typography (`clamp()`), backdrop filters, custom keyframe animations, and reduced-motion media queries.
- **Vanilla JavaScript (ES6+)**: Zero external dependencies or frameworks, HTML5 Canvas particle system, and Web Audio API synthesized music box.
- **Scalable Vector Graphics (SVG)**: Custom-illustrated vector artwork for teddy bears, hearts, seals, and icons, ensuring crisp rendering on all screen resolutions and fast load times.

---

## 🚀 Running the Website Locally

You don't need any complex build tools or package managers. You can run it immediately using any local web server or even by opening the file directly.

### Option 1: Python HTTP Server (Recommended)
Open your terminal in the `for-arpita` folder and run:
```bash
# Python 3
python3 -m http.server 8000
```
Then open your browser and visit: `http://localhost:8000`

### Option 2: Node.js `npx serve`
```bash
npx serve .
```

### Option 3: Direct File Opening
Double-click `index.html` or open it with your browser:
```bash
open index.html
```

---

## 🎨 Customizing the Website

### 1. Customizing the Apology Message
All text is located directly inside [index.html](file:///Users/palashbehura/Documents/for-arpita/index.html):
- **Letter Body**: Look inside `<section id="screen-letter">` under `<div class="letter-body">`.
- **Note on Teddy**: Look inside `<section id="screen-teddy">` under `<p class="note-quote">`.
- **Choice Responses**: Look inside `<div class="response-display-zone">` in `<section id="screen-choice">`.

### 2. Changing Colors & Aesthetics
All color tokens and styling variables are organized at the top of [styles.css](file:///Users/palashbehura/Documents/for-arpita/styles.css) inside `:root`:
```css
:root {
  --bg-primary: #FFF5F7;          /* Page background */
  --color-primary: #FF5E7E;       /* Main accent pink */
  --color-primary-dark: #E60039;  /* Deep strawberry red */
  --color-blush: #FFCCD5;         /* Soft blush border */
  --color-lavender: #EADCF8;      /* Gentle lavender accent */
  --paper-cream: #FFFDF9;         /* Letter paper color */
  --text-main: #3E2F32;           /* Warm mocha text */
}
```

### 3. Adjusting Animations
Animation timings (waving paws, heartbeats, floating cards) can be adjusted in the `@keyframes` section in [styles.css](file:///Users/palashbehura/Documents/for-arpita/styles.css).

---

## 🌐 Publishing via GitHub Pages

Publishing to GitHub Pages takes less than two minutes:

1. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Repository name: `for-arpita`
   - Description: `A tiny interactive apology website made with love by Palash for Arpita 💗`
   - Choose **Public** (or Private with GitHub Pro/Student).
   - Leave "Initialize with README" unchecked.

2. **Push your code to GitHub**:
   ```bash
   cd /Users/palashbehura/Documents/for-arpita
   git remote add origin https://github.com/YOUR-USERNAME/for-arpita.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - On GitHub, go to your repository's **Settings** tab.
   - Click **Pages** in the left sidebar (under "Code and automation").
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`, then click **Save**.

4. **View your live website**:
   Within 1–2 minutes, your website will be live at:
   `https://YOUR-USERNAME.github.io/for-arpita/`

---

## 💌 Personal Note

*Made with a little courage, a lot of heart, and love for Arpita.*
