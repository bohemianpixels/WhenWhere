# Customization Guide

This guide explains where to customize the sketchy, hand-drawn style to match your brand.

## 🎨 Color Palette

All colors are defined as CSS variables in `src/App.css` at the top of the file:

```css
:root {
  --paper-bg: #fefcf8;        /* Change this for different paper tones */
  --accent-primary: #ff6b6b;   /* Main brand color */
  --accent-secondary: #4ecdc4; /* Secondary accent */
  --accent-warm: #ffe66d;      /* Warm highlights */
  /* ... more colors */
}
```

**To change colors:** Simply modify the values in the `:root` section of `App.css`.

## ✍️ Fonts

### Handwritten Font (Titles)

The handwritten font is loaded in `index.html`:
- Currently using: **Kalam** from Google Fonts
- Applied via CSS variable: `--font-handwritten`

**To change the handwritten font:**
1. Replace the Google Fonts link in `index.html` with your preferred font
2. Update `--font-handwritten` in `App.css` to match the font family name

**Alternative handwritten fonts to try:**
- Permanent Marker
- Caveat
- Indie Flower
- Shadows Into Light
- Your own custom font (add @font-face in CSS)

### Body Font

The body font uses system fonts for readability:
- CSS variable: `--font-body`
- Currently: System font stack (San Francisco, Segoe UI, etc.)

**To change:** Update `--font-body` in `App.css`

## 🗺️ Map Styling

### Map Frame

The sketchy frame around the map is styled in `.map-wrapper`:
- Border width: `4px` (change for thicker/thinner frame)
- Border radius: `16px` (change for more/less rounded)
- Shadow layers: Multiple box-shadows create depth

### Markers

Marker colors are defined in `src/utils/categories.ts`:

```typescript
export const categories: Record<CategoryKey, CategoryInfo> = {
  beach: {
    icon: '☀️',
    label: 'Beach',
    color: '#FFD93D',  // Change this color
    keywords: [...],
  },
  // ...
}
```

**To change marker colors:** Edit the `color` property for each category in `categories.ts`

**To change marker icons:** Edit the `icon` emoji for each category

## 📱 Responsive Breakpoints

Breakpoints are defined in `App.css`:
- Mobile: `@media (max-width: 768px)`
- Small mobile: `@media (max-width: 480px)`

**To adjust:** Modify these breakpoints in `App.css`

## 🎭 Animation Timing

Animation durations are set in CSS:
- Marker fade: `0.3s` and `0.4s`
- Panel slide: `0.4s`
- Hover transitions: `0.3s`

**To change:** Modify the animation durations in `App.css` (search for `animation:` or `transition:`)

## 📝 Paper Texture

The paper texture is created with an SVG pattern in CSS:
- Variable: `--paper-texture`
- Currently: Subtle noise pattern

**To change:**
1. Replace the SVG in `--paper-texture` with your own pattern
2. Or set to `none` to remove texture
3. Adjust opacity in the SVG for more/less visible texture

## 🎨 Category Colors & Icons

All category styling is in `src/utils/categories.ts`:

- **Icons:** Change the emoji for each category
- **Colors:** Modify the hex color codes
- **Keywords:** Add/remove keywords to improve category detection

## 💡 Quick Style Tweaks

### Make borders more sketchy:
Increase border width in `.sidebar`, `.map-wrapper`, etc.

### Make shadows more dramatic:
Increase shadow offsets and blur in box-shadow properties

### Change border style:
Replace `solid` with `dashed` or `dotted` for different sketchy effects

### Adjust rounded corners:
Change `border-radius` values throughout the CSS

---

**Tip:** Use your browser's developer tools to experiment with CSS variables in real-time before committing changes!

