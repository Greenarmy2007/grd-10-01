# GRD-10 — SHRI GHANSHYAM DUBE ACHIEVER AWARDS 2026
### A Living Legacy of Shri Ghanshyam Dube • A MedscapeIndia Legacy Initiative

> **Brand Line:** *Honouring Quiet Contributors • Celebrating a Lasting Legacy*  
> **Inaugural Convocation:** 10 November 2026 | Mumbai, India  
> **Core Objective:** A permanent digital archive and national legacy institution acknowledging people whose quiet contributions strengthen society.

---

## 1. Institutional Overview & Philosophy

GRD-10 is not an event website. It is an enduring digital institution and archive honoring the life, virtues, and public stewardship of **Late Shri Ghanshyam Dube (1938–2021)**:

- **Courage:** The moral fortitude to stand for public justice.
- **Service:** Unconditional labor for fellow human beings without personal acclaim.
- **Integrity:** Incorruptible alignment of ethics and action.
- **Perseverance:** The earthen discipline and stamina forged in the traditional wrestling akhada.

### Signature Framework
```
10 ACHIEVERS  •  10 STORIES  •  1 LEGACY
```

---

## 2. Design System & Colour Architecture

Strictly adheres to the institutional palette:

| Token | Hex | Role |
| :--- | :--- | :--- |
| **Midnight Navy** | `#0B1726` | Hero, Main Navigation, Primary dark sections, Footer |
| **Deep Navy** | `#112735` | Secondary dark sections, Cards, Elevated backgrounds |
| **Champagne Gold** | `#C8A96A` | CTAs, Hairline borders, Dividers, Numbers, Accents |
| **Soft Gold** | `#E4C97E` | Subtle micro-accents, Hover interactions |
| **Ivory** | `#F5F1E8` | Light editorial backgrounds, Text contrast |
| **Charcoal** | `#20252B` | Editorial typography on light backgrounds |

**Typography:**
- Headings: `Playfair Display` (Serif, authoritative, timeless)
- Body & Interface: `Inter` (Legible, modern, high contrast)

---

## 3. Architecture & Page Roster

The site contains seven dedicated public sections and an isolated volunteer administration vault:

1. **`index.html` (Home)**
   - Dark full-width hero with monochrome archival portrait placeholder of Shri Ghanshyam Dube
   - Editorial section: *Why GRD-10?* with signature *10 ACHIEVERS | 10 STORIES | 1 LEGACY* visual
   - *A Life in Moments* biographical vignettes
   - *A Living Legacy* (Four Value Cards)
   - *GRD-10 Achiever Awards 2026* Category preview (Approved 01–05 + Reserved 06–10 notice)
   - Dedicated *Medicine & Healthcare* institutional feature block (MedscapeIndia Initiative)
   - *Voices of the Legacy* video previews
   - High-conversion *Nominate an Achiever* CTA
   - *10 November • Every Year* future-facing decadal timeline

2. **`about.html` (About GRD-10)**
   - Institutional charter, founding philosophy, and MedscapeIndia stewardship

3. **`legacy.html` (The Legacy)**
   - The Man (Kushti, akhada, family)
   - The Leader (Maharashtra public life, civic leadership)
   - The Journey (Chronological interactive timeline)
   - The Values & Perpetual Flame

4. **`awards.html` (Awards 2026)**
   - 01 Sports & Kushti
   - 02 Education
   - 03 Social Service
   - 04 Medicine & Healthcare
   - 05 Media & Journalism
   - Official notice for Categories 06–10
   - *The 10* Laureate Architecture dossiers and selection criteria

5. **`nominate.html` (Nominate)**
   - Multi-step interactive dossier submission
   - Ground validation, drag-and-drop document upload simulation
   - Real-time progress bar, unique Reference ID generation (`GRD-2026-NOM-XXXXX`)
   - Strict privacy safeguards

6. **`voices.html` (Voices)**
   - Video messages across three circles: *Remembering Ghanshyam Dube*, *Supporting GRD-10*, and *The GRD-10 Circle*
   - Accessible video modal without intrusive autoplay

7. **`media.html` (Media & Permanent Archive)**
   - Press, Articles, Photographs, Video, Event Coverage
   - Feature block for *GRD-10 2026 — Event Film*
   - Permanent multi-year archive system (Photo, Document, Newspaper, Video)

8. **`admin.html` (Volunteer CMS Portal)**
   - Protected jury vault (Passkey: `grd2026`)
   - Private review and CSV export of submitted nominations
   - Category expansion interface to activate categories 06–10 when ratified by the honorary jury

---

## 4. Multi-Year Edition CMS Architecture

The website is designed so it **never needs to be rebuilt each year**.
In `js/data.js`, the central state store manages:
- `editions` (2026, 2027, 2028...)
- `categories` (dynamic categories with status flags)
- `awardees` (The 10 laureates per edition)
- `voices` (archival oral history recordings)
- `media` (press and permanent archive artifacts)

---

## 5. Security & Ownership Guidelines

Per Requirement 33 & 28:
- All domain registrations, DNS records, Google Search Console, and hosting deployments MUST be registered under authorized MedscapeIndia / GRD-10 organizational credentials.
- Nominations are stored privately and never displayed on public pages.
- Zero tracking of private user telemetry beyond standard privacy-respecting metrics.
