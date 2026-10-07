# GRD-10 — VOLUNTEER & MAINTAINER EDITING GUIDE
### Complete Guide for Non-Technical Volunteers and Future Teams

This website is architected so that **any future change—new annual editions (2027, 2028...), new award categories, laureate profiles, video testimonies, event dates, and press articles—can be edited without rewriting code.**

There are two easy methods to make changes:
1. **Method 1 (Recommended): Visual Volunteer CMS Portal** *(Zero coding required)*
2. **Method 2: Direct Configuration File (`js/data.js`)** *(Single source of truth)*

---

## METHOD 1: VISUAL VOLUNTEER CMS PORTAL (NO CODING)

### 1. How to Access
1. Open the portal in your browser:
   - **Local:** [http://localhost:8080/admin.html](http://localhost:8080/admin.html)
   - **Production:** `https://your-domain.org/admin.html`
2. Enter the committee volunteer passkey:
   ```
   grd2026
   ```
3. Click **"Unlock Volunteer Portal"**.

---

### 2. What You Can Edit in the Portal

#### A. Event Metadata & New Annual Editions (`Site Settings & Year` Tab)
- **Active Edition:** Switch between `2026`, `2027`, `2028`, or `2029`.
- **Event Date:** Change e.g. from `10 November 2026` to `10 November 2027`.
- **Location:** Update convening venue or city (e.g. `Mumbai, Maharashtra`).
- **Nomination Status:** Toggle e.g. `Nominations Open`, `Deliberations in Progress`, or `Laureates Announced`.
- **Brand Line:** Update theme slogan.
- *Click **"Save Site Settings"** — updates take effect immediately across all pages.*

#### B. Adding Categories 06–10 (`Categories (01–10)` Tab)
- When the Selection Committee ratifies categories 06 to 10:
  1. Go to the **"Ratify New Category"** box on the right.
  2. Enter the Category Number (e.g. `06`).
  3. Enter the Category Name (e.g. `Grassroots Rural Innovation`).
  4. Enter the one-line description.
  5. Click **"Ratify & Publish"**.
  6. The new category instantly appears on both the Homepage and `awards.html` with its own nomination link!
- You can also click **"Edit"** on any existing category to revise its title or description.

#### C. Updating Laureate Profiles («The 10») (`Laureates ("The 10")` Tab)
- When the 2026 honourees are finalised:
  1. Open the **Laureates** tab.
  2. Click **"Edit Laureate Profile"** on any of the 10 laureate cards.
  3. You will be prompted to enter:
     - **Laureate Full Name**
     - **Short Biography / Citation**
     - **Their Full Story**
     - **Their Key Contribution**
     - **Why They Were Chosen**
  4. The profile instantly updates in the public registry modal without touching HTML.

#### D. Adding Video Messages & Oral Histories (`Voices & Videos` Tab)
- To add a new video message from family, supporters, or youth volunteers:
  1. Enter Speaker Name (e.g. `Justice V. S. Patil`).
  2. Enter Role / Affiliation.
  3. Select the Circle (`Remembering Ghanshyam Dube`, `Supporting GRD-10`, or `The GRD-10 Circle`).
  4. Paste the YouTube / Vimeo embed URL (e.g. `https://www.youtube-nocookie.com/embed/VIDEO_ID`).
  5. Enter a 1–2 sentence quote excerpt.
  6. Click **"Add Video Message"**.

#### E. Reviewing Private Nominations & CSV Export (`Jury Nominations` Tab)
- Every nomination submitted through `nominate.html` is deposited into this private vault.
- Click **"View Dossier"** next to any submission to inspect candidate credentials, contact info, and attached documents.
- Click **"Export Dossiers (CSV)"** to download an Excel-ready spreadsheet for jury deliberation.

#### F. 1-Click Backup & Restore (`Backup & Restore` Tab)
- **Download Full Site Data (JSON):** Saves all settings, categories, awardees, and videos into a single portable `.json` file.
- **Restore from JSON File:** If moving to a new computer or server, upload your `.json` file and click **"Apply Backup to Site"** to restore everything in one second.

---

## METHOD 2: DIRECT CODE CONFIGURATION (`js/data.js`)

If a technical volunteer or developer prefers editing code directly in a text editor (VS Code, Notepad, etc.), all content is located in **one file**:

📁 [`js/data.js`](file:///e:/advait/GRD.10/js/data.js)

### 1. To Change Categories
Open `js/data.js` and locate the `categories` array (lines 56–120):
```javascript
{
  id: "cat-06",
  number: "06",
  slug: "rural-innovation",
  name: "Rural Innovation & Agriculture",
  description: "Recognising grassroots agricultural pioneers and indigenous water conservationists.",
  status: "Approved",
  active: true,
  edition: "2026"
}
```

### 2. To Change Laureates ("The 10")
Locate the `awardees` array in `js/data.js`:
```javascript
{
  id: "awd-2026-01",
  number: "01",
  edition: "2026",
  name: "Actual Honouree Name",
  isPlaceholder: false,
  categoryName: "Sports & Kushti",
  photo: "assets/images/honouree-photo.jpg",
  shortBio: "Lifetime devotion to grassroots wrestling in Maharashtra.",
  theirStory: "...",
  theirContribution: "...",
  whyChosen: "..."
}
```

### 3. To Roll Out Next Year's Edition (e.g. 2027)
In `js/data.js`:
1. Change `activeEdition: "2027"` at line 10.
2. Under `editions`, update the 2027 entry status from `"Upcoming"` to `"Nominations Open"`.
3. Add the 2027 categories and awardees with `edition: "2027"`.
4. The site automatically switches over!

---

## 🎨 DESIGN SYSTEM SAFEGUARDS

When making future edits, remember the **core institutional design rules**:

| Rule | Instruction |
| :--- | :--- |
| **Colours** | Use ONLY Midnight Navy (`#0B1726`), Deep Navy (`#112735`), Champagne Gold (`#C8A96A`), Ivory (`#F5F1E8`), and Charcoal (`#20252B`). |
| **Gold** | Use gold as an expensive material (thin lines, accents, CTA buttons), **never as a dominant background**. |
| **Photography** | Maintain black-and-white / monochrome historical treatment. Avoid generic stock photos or saturated artificial images. |
| **Videos** | Never autoplay videos. Always embed through YouTube/Vimeo to keep page loading instantaneous. |
| **Navigation** | Keep only the **7 main tabs** (`HOME`, `ABOUT GRD-10`, `THE LEGACY`, `AWARDS 2026`, `NOMINATE`, `VOICES`, `MEDIA`). Never add extra clutter. |
| **Footer** | Keep the minimal 4-line institutional hierarchy. |

---

## 🔒 CREDENTIALS & HANDOVER
- **Admin Passkey:** `grd2026`
- **Primary Domain:** `https://grd10.medscapeindia.org`
- **Ownership:** MedscapeIndia / GRD-10 Institutional Trust
