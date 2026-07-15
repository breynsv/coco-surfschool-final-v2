---
name: Coco Surf School
description: Calm, editorial pastel identity for a small-group surf school in Hossegor & Seignosse.
colors:
  ink: "#23413A"
  ink-soft: "#4C635C"
  seafoam: "#8FBBAA"
  seafoam-deep: "#3F6957"
  mint: "#DCEDE4"
  mint-2: "#C7E0D3"
  mint-line: "#B4D3C4"
  coral: "#E9A899"
  coral-soft: "#F5D3CA"
  coral-deep: "#B0543F"
  gold: "#E4B24C"
  cream: "#FAF8F2"
  cream-2: "#F3EFE6"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.5rem, 6.4vw, 4.6rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2rem, 4.6vw, 3.1rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif"
    fontSize: "1.4rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.68
    letterSpacing: "normal"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.28em"
rounded:
  sm: "14px"
  md: "22px"
  lg: "34px"
  pill: "100px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "0.82rem 1.5rem"
  button-primary-hover:
    backgroundColor: "#1A332D"
    textColor: "{colors.cream}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.82rem 1.5rem"
  button-coral:
    backgroundColor: "{colors.coral-deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0.82rem 1.5rem"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.md}"
    padding: "1.9rem"
  input:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1rem"
  tag:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.seafoam}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.7rem"
---

# Design System: Coco Surf School

## 1. Overview

**Creative North Star: "The Seafoam Sanctuary"**

Coco Surf School is a small-group surf school on the Landes coast, and the site should feel the way the school promises to feel: an unhurried exhale by the ocean. The whole system is built around a pale, sea-washed calm — mint and cream carrying the surfaces, a warm coral surfacing only where the eye should go. Nothing shouts. Density is low, whitespace is generous, and the reading rhythm is slow on purpose. The design is the argument for *"kwaliteit boven kwantiteit"* — quality over quantity, maximum six per group — made visible before a word is read.

The character is **editorial-pastel**: a Fraunces serif carries every heading with a quiet, humanist warmth, set against a clean system sans for body. Depth is barely-there — soft, teal-tinted shadows that lift a card a few pixels rather than dropping it into a hole. A fixed radial wash of mint (top-right) and coral (bottom-left) sits behind everything like light off water. Motion is a gentle rise-and-settle, never a bounce.

This system explicitly rejects the loud SaaS-landing register: no high-contrast dark heroes, no neon gradients, no glassmorphic cards, no hero-metric template. It also rejects sterile minimalism — the coral accent and the serif keep it human and coastal, not clinical. Warmth here is carried by the palette, the serif, and the imagery, never by an aggressive layout.

**Key Characteristics:**
- Pale seafoam-and-cream base; coral as a rare, directional accent.
- Fraunces serif for all headings; humanist and warm, never stern.
- Soft, low, teal-tinted elevation — surfaces lift gently, never drop.
- Pill geometry (100px) for every interactive shape; 22–34px rounding for surfaces.
- Generous whitespace and slow reading rhythm; calm is the product.

## 2. Colors

A pale coastal palette: sea-washed mints and warm cream carry the surfaces, a single coral hue does all the pointing, and a deep teal grounds the type.

### Primary
- **Deep Teal Ink** (`#23413A`): The anchor. Every heading, the primary button background, and the footer field. It is the system's "black" — grounding, calm, never pure black.
- **Terracotta Coral** (`#C9705E`, `coral-deep`): The one directional accent. Links, the eyebrow kicker, signatures, price footnotes, italic emphasis inside headings. Where this color appears, the eye is meant to go.

### Secondary
- **Seafoam** (`#8FBBAA`): The quiet brand-signature mid-tone. Uppercase micro-labels, "included" notes, brand sub-wordmark. Decorative and structural, not for long-form reading (see Don'ts).
- **Soft Coral** (`#E9A899`) / **Coral Tint** (`#F5D3CA`, `coral-soft`): The accent's soft register — the eyebrow dash, notice/deposit callout backgrounds, the open-FAQ chevron, hero badge dot.

### Neutral
- **Muted Ink** (`#4C635C`, `ink-soft`): Default body text. ~7:1 on cream — the reliable reading color.
- **Sea Mist** (`#DCEDE4`, `mint`) / **Mist 2** (`#C7E0D3`) / **Mist Line** (`#B4D3C4`): The mint family — tinted section backgrounds, the trust strip, tag/lang-switch fills, hairline borders and dividers.
- **Cream** (`#FAF8F2`) / **Cream 2** (`#F3EFE6`): The paper. The body background and input fills; the calm ground everything floats on.
- **White** (`#FFFFFF`): Card and form surfaces — the lifted plane above the cream.

### Accent-only
- **Amber** (`#E4B24C`, `gold`): Review stars only. Never structural.

### Named Rules
**The One Coral Rule.** Coral (`coral-deep` and its tints) is the only directional accent and appears on ≤10% of any screen. Its rarity is the point — the moment two coral things compete, the pointing stops working. Everything else is teal, mint, or cream.

**The Grounded-Not-Black Rule.** There is no pure black and no pure-neutral gray in this system. Ink is teal (`#23413A`), text is teal-gray (`#4C635C`), shadows are teal-tinted. Reaching for `#000` or a neutral `#888` breaks the coastal warmth.

## 3. Typography

**Display Font:** Fraunces (with Georgia, "Times New Roman", serif)
**Body Font:** System sans stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`)

**Character:** A single serif does all the talking. Fraunces is a soft, humanist, slightly old-style serif — warm rather than fashion-magazine sharp — and it italicizes into the coral for emphasis. The body sans stays deliberately neutral and invisible so the serif and the pastel carry the personality. Contrast comes from serif-vs-sans and weight, not from a second display face.

### Hierarchy
- **Display** (Fraunces 500, `clamp(2.5rem, 6.4vw, 4.6rem)`, line-height 1.08, `-0.025em`): Hero H1 only. Italic words drop to weight 400 in coral for lyrical emphasis (*"Leer surfen in Hossegor & Seignosse"*).
- **Headline** (Fraunces 500, `clamp(2rem, 4.6vw, 3.1rem)`, line-height 1.08, `-0.015em`): Section titles. Capped at ~20ch so they stay tight and balanced.
- **Title** (Fraunces 500–600, `~1.4rem`, line-height 1.15): Card and FAQ headings, coach quote (italic, up to 1.8rem).
- **Body** (system sans 400, `17px`, line-height 1.68): Paragraph text in muted ink. Lead paragraphs scale to `clamp(1.05rem, 2vw, 1.22rem)` and cap at ~56ch; body blocks stay within 62–75ch.
- **Label** (system sans 700, `0.74rem`, letter-spacing `0.28em`, UPPERCASE): The eyebrow kicker and micro-labels. Wide-tracked, small, coral or seafoam.

### Named Rules
**The Coral Dash Rule.** The section eyebrow is a deliberate, named brand system, not incidental scaffolding: uppercase 0.74rem label, `0.28em` tracking, in `coral-deep`, preceded by a 26×2px coral dash (`::before`). It is the site's recurring "you are here" marker and part of the identity — keep it consistent (same size, tracking, dash, color) wherever it appears. Because it repeats, it earns its keep only by staying *identical*; a drifting or restyled eyebrow reads as an accident.

**The Serif-Carries-It Rule.** All headings are Fraunces; the body sans is intentionally mute. Never introduce a second display face — contrast is serif-vs-sans and weight, not a new family.

## 4. Elevation

This is a low, ambient elevation system — surfaces sit almost flat on the cream and lift a few pixels on interaction. Shadows are soft, wide, and **teal-tinted** (`rgba(45, 80, 71, …)`) rather than neutral gray, so even depth stays inside the coastal palette. Depth is reinforced tonally: white cards on cream, mint bands, hairline mint borders. A single fixed radial-gradient wash (mint top-right, coral bottom-left, over cream) gives the whole page atmospheric depth behind the flat surfaces.

### Shadow Vocabulary
- **Ambient Rest** (`box-shadow: 0 4px 18px rgba(45,80,71,.06)`): Default resting lift on cards, the lang-switch active pill, icon tiles. Barely there.
- **Ambient Lift** (`box-shadow: 0 18px 50px rgba(45,80,71,.10)`): The hover / focus / featured state — a card rising toward the reader, the hero image, the contact form, the primary button on hover.

### Named Rules
**The Gentle-Lift Rule.** Surfaces rest at `shadow-sm` and rise to `shadow-md` with a `translateY(-2px to -4px)` on hover. Elevation is a *response to interaction*, not decoration at rest. No shadow is ever darker or tighter than `shadow-md` — a hard, near-black drop shadow breaks the whole calm.

## 5. Components

### Buttons
- **Shape:** Full pill (`border-radius: 100px`), 1.5px transparent border reserved for the ghost variant.
- **Primary:** Deep Teal Ink background, cream text (`.82rem 1.5rem` padding, weight 600). The confident, grounding CTA ("Boek een les").
- **Coral:** `coral-deep` background, white text. The warm, high-intent CTA — use where booking urgency matters.
- **Ghost:** Transparent with a `mint-line` border and ink text; on hover the border shifts to seafoam over a translucent white fill.
- **Hover / Focus:** All variants `translateY(-2px)` and rise from `shadow-sm` to `shadow-md`; primary/coral deepen their fill. Transitions run on the house easing `cubic-bezier(.22,.61,.36,1)`, ~.25s. A `--sm` size drops padding to `.55rem 1rem`.

### Chips / Tags
- **Style:** Mint fill, seafoam uppercase text, full pill (`.3rem .7rem`), 0.76rem, tracked. Used for lesson category tags and the "included" flags.
- **Flag variant:** `coral-soft` fill with `coral-deep` text for emphasis flags (e.g. "populair", price badges).

### Cards / Containers
- **Corner Style:** 22px (`rounded.md`); larger surfaces (hero media, contact form, banners) use 34px (`rounded.lg`).
- **Background:** White on the cream ground; some cards use a mint fill (extras) or a `linear-gradient(175deg, mint, #fff 80%)` for the featured rate card.
- **Shadow Strategy:** `shadow-sm` at rest → `shadow-md` on hover with `translateY(-3px to -4px)` (see Elevation).
- **Border:** 1px hairline in `rgba(180,211,196,.4)` (translucent mint-line).
- **Internal Padding:** ~1.9rem on standard cards; image cards bleed the photo to the card edge (`margin: -1.9rem`) with a 16:10 crop that scales 1.04× on hover.

### Inputs / Fields
- **Style:** 1.5px `mint-line` border, 14px radius, **cream** fill (not white — inputs recede into the paper), ink text.
- **Label:** Uppercase 0.82rem, tracked, seafoam, above the field.
- **Focus:** Border shifts to seafoam and the fill brightens to pure white. No glow, no ring — a quiet, tactile shift.

### Navigation
- **Style:** Sticky translucent cream header (`rgba(250,248,242,.82)`) with a 12px backdrop blur and a hairline mint bottom border.
- **Links:** Ink, 0.93rem, weight 500. Hover fades to `coral-deep` and grows a 2px coral underline from left to right (`::after`, width 0→100%).
- **Lang switch:** A mint pill container of tiny uppercase tabs; the active language is a white pill with `shadow-sm`.
- **Mobile:** Below 780px the links collapse into a hamburger (mint rounded square) that slides a full-width cream panel down from under the header.

### Signature: The Floating Badge
A cream pill overlapping the hero image's lower-left corner (`shadow-md`), pairing a coral-soft circular "dot" (emoji/icon) with a two-line Fraunces + sans label. A small, human, coastal flourish that keeps the hero from feeling like stock photography.

## 6. Do's and Don'ts

### Do:
- **Do** keep coral rare and directional — links, the eyebrow, one CTA, emphasis. If two coral elements compete on a screen, demote one (The One Coral Rule).
- **Do** set every heading in Fraunces and let italic-coral carry emphasis inside a headline.
- **Do** ground the system in teal, not black: `#23413A` ink, `#4C635C` body, teal-tinted shadows (The Grounded-Not-Black Rule).
- **Do** keep elevation soft and reactive — `shadow-sm` at rest, `shadow-md` + a 2–4px lift on hover, nothing darker.
- **Do** use the pill (100px) for every interactive shape and 22–34px rounding for surfaces; keep the geometry consistent.
- **Do** keep the eyebrow kicker *identical* everywhere it appears (0.74rem, 0.28em tracking, coral dash) — its consistency is what makes it a system rather than noise.
- **Do** cap body measure at 62–75ch and lead paragraphs at ~56ch; the slow reading rhythm is part of the calm.

### Don't:
- **Don't** use the light seafoam (`#8FBBAA`) as a *text* color — it falls below the 4.5:1 contrast floor on white/cream/mint. It is a decorative-fill/border tone only. For readable seafoam-toned text (labels, `.incl` notes, pins) use **`seafoam-deep` (`#3F6957`, ≥5:1)**; use `ink-soft` for body prose.
- **Don't** introduce a second display typeface or a mono "for technical feel" — this brand isn't technical, and a second face breaks The Serif-Carries-It Rule.
- **Don't** reach for a dark hero, neon gradient, glassmorphic card, or the big-number hero-metric template — all reject the sanctuary calm.
- **Don't** use pure black (`#000`) or a neutral gray (`#888`) anywhere; it drains the coastal warmth.
- **Don't** let the eyebrow *drift* — a restyled, differently-tracked, or recolored kicker reads as an accident. If it can't be identical, drop it for that section instead.
- **Don't** use `border-left`/`border-right` colored stripes on cards or callouts; use full hairline borders, mint/coral-soft tint fills, or leading labels instead.
- **Don't** harden the shadows — a tight, near-black drop shadow is the single fastest way to make this system look like a generic 2014 app.
