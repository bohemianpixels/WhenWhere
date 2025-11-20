# Boarding Pass Aesthetic - Customization Guide

This guide explains where to customize the minimal boarding-pass aesthetic to match your brand.

## 🎨 Fonts

### Main Sans-Serif Font (Inter)
**Location:** `index.html` (Google Fonts link)

**Current:** Inter
**To change:**
1. Replace the Google Fonts link in `index.html`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```
2. Update the CSS variable in `src/App.css`:
   ```css
   --font-main: 'YOUR_FONT', -apple-system, sans-serif;
   ```

**Alternative fonts that work well:**
- Space Grotesk
- DM Sans
- Work Sans
- Poppins

### Monospaced Font (JetBrains Mono)
**Location:** `index.html` (Google Fonts link)

**Current:** JetBrains Mono
**To change:**
1. Replace the Google Fonts link in `index.html`
2. Update the CSS variable in `src/App.css`:
   ```css
   --font-mono: 'YOUR_MONO_FONT', 'Courier New', monospace;
   ```

**Alternative monospace fonts:**
- Fira Code
- Source Code Pro
- IBM Plex Mono

## 🎨 Colors

**Location:** `src/App.css` - CSS Variables section (top of file)

### Base Colors
```css
--bg-white: #ffffff;        /* Pure white background */
--text-black: #1a1a1a;      /* Main text color */
--text-gray: #4a4a4a;       /* Secondary text */
```

### Accent Colors
```css
--accent-orange: #e67e22;  /* Used for selected month */
--accent-blue: #3498db;    /* Used for selected categories */
--accent-red: #c0392b;     /* Optional accent */
```

**To change:** Simply modify the hex values in the `:root` section of `App.css`

## 📍 Passport Stamps

**Location:** `src/components/Landing.tsx`

### Current Stamps
The landing screen has 4 passport-style stamps positioned around the screen:
- `stamp-1`: Top left (JFK, 2024)
- `stamp-2`: Top right (LHR, 12/24)
- `stamp-3`: Bottom left (NRT, 03/25)
- `stamp-4`: Bottom right (CDG, 06/24)

### To Customize Stamp Positions
Edit the inline `style` prop in `Landing.tsx`:
```tsx
<div className="stamp stamp-1" style={{ top: '15%', left: '10%', transform: 'rotate(-15deg)' }}>
```

**Properties you can change:**
- `top`, `bottom`, `left`, `right`: Position percentages
- `transform: 'rotate(Xdeg)'`: Rotation angle
- `opacity`: In the CSS (`.stamp` class), currently 0.15

### To Replace Stamps with Your Own Artwork
1. **Option 1:** Replace the stamp content in `Landing.tsx` with an `<img>` tag:
   ```tsx
   <img src="/your-stamp.svg" className="stamp" style={{...}} />
   ```

2. **Option 2:** Create custom SVG stamps and replace the `.stamp` divs

3. **Option 3:** Use CSS to style the stamps differently (edit `.stamp`, `.stamp-border`, `.stamp-content` in `App.css`)

### To Add More Stamps
Simply add more `<div className="stamp">` elements in `Landing.tsx` with different positions.

## 📊 Barcode Elements

**Location:** `src/components/Landing.tsx` and `src/App.css`

### Current Barcodes
- `barcode-bottom`: Horizontal barcode at bottom left
- `barcode-side`: Vertical barcode on right side

### To Customize Barcode Position
Edit the inline styles or add CSS classes in `App.css`:
```css
.barcode-bottom {
  bottom: 5%;
  left: 10%;
  width: 200px;
  height: 40px;
}
```

### To Replace with Your Own Barcode
1. **Option 1:** Replace the `.barcode` div with an `<img>`:
   ```tsx
   <img src="/your-barcode.svg" className="barcode barcode-bottom" />
   ```

2. **Option 2:** Use an SVG inline in the component

3. **Option 3:** Keep the CSS-generated barcode but adjust the pattern in `.barcode::before`

## 🎯 Background Text ("WHEN" / "WHERE")

**Location:** `src/components/Landing.tsx` and `src/App.css`

### Current Settings
- "WHEN": Top left, rotated -5deg, 5% opacity
- "WHERE": Bottom right, rotated 3deg, 5% opacity

### To Customize
1. **Position:** Edit inline styles in `Landing.tsx` or CSS classes `.background-when` / `.background-where`
2. **Opacity:** Change `opacity: 0.05` in `.background-text` class
3. **Size:** Change `font-size: 12rem` in `.background-text`
4. **Text:** Change the text content in `Landing.tsx`

## 🎫 Button Styles

**Location:** `src/App.css` - `.ticket-button` class

### Current Style
- White background, thin black border
- Hover: Inverts to black background, white text
- Border becomes thicker on hover

### To Customize
Edit `.ticket-button` and `.ticket-button:hover` in `App.css`

## 🎨 Component Styling

### Month/Category Selectors
**Location:** `src/App.css`
- `.month-chip`, `.category-chip`: Ticket segment style
- `.month-chip.active`, `.category-chip.active`: Selected state with accent colors

### Destination Panel
**Location:** `src/App.css` - `.destination-panel` section
- Boarding pass card style
- Fake flight code label (`.panel-header::before`)
- Can be customized or removed

## 📱 Responsive Breakpoints

**Location:** `src/App.css` - Bottom of file

Current breakpoints:
- `@media (max-width: 768px)`: Tablet/mobile
- `@media (max-width: 480px)`: Small mobile

**To adjust:** Modify these breakpoints or add new ones

## 💡 Quick Tips

1. **To make stamps more visible:** Increase `opacity` in `.stamp` class (currently 0.15)
2. **To change accent colors globally:** Update `--accent-orange` and `--accent-blue` in CSS variables
3. **To adjust spacing:** Modify `--spacing-*` variables in CSS
4. **To change border thickness:** Update `border: 1px solid` values throughout CSS (currently 1-2px for minimal look)

## 🎨 Design Philosophy

The current design follows these principles:
- **Minimal:** Lots of white space, thin borders
- **Typography-focused:** Clean sans-serif + monospace for codes
- **Layered depth:** Stamps and background text create visual interest without clutter
- **High contrast:** Black text on white, with accent colors used sparingly

Adjust these elements to match your brand while maintaining the boarding-pass aesthetic!

