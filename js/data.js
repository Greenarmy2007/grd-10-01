/**
 * GRD-10 — SHRI GHANSHYAM DUBE ACHIEVER AWARDS
 * Institutional Data Architecture & Single Source of Truth
 * 
 * Supports Annual Multi-Year Editions (2026, 2027, 2028...)
 * LocalStorage synchronized for volunteer administrative management.
 */

const GRD10_DEFAULT_DATA = {
  activeEdition: "2026",
  
  editions: [
    {
      year: "2026",
      editionNumber: "I",
      date: "10 November 2026",
      location: "Mumbai, Maharashtra",
      theme: "Honouring Quiet Contributors • Celebrating a Lasting Legacy",
      status: "Nominations Open",
      isCurrent: true,
      description: "The inaugural national edition of the Shri Ghanshyam Dube Achiever Awards, inaugurating a decadal tradition of recognizing unheralded human excellence."
    },
    {
      year: "2027",
      editionNumber: "II",
      date: "10 November 2027",
      location: "Mumbai, Maharashtra",
      theme: "The Decade of Quiet Contribution",
      status: "Upcoming",
      isCurrent: false,
      description: "Second annual convening honoring ten extraordinary individuals from across the republic."
    },
    {
      year: "2028",
      editionNumber: "III",
      date: "10 November 2028",
      location: "Mumbai, Maharashtra",
      theme: "Carrying the Flame Forward",
      status: "Scheduled",
      isCurrent: false,
      description: "Third annual convening."
    },
    {
      year: "2029",
      editionNumber: "IV",
      date: "10 November 2029",
      location: "Mumbai, Maharashtra",
      theme: "A Century of Inspiration",
      status: "Scheduled",
      isCurrent: false,
      description: "Fourth annual convening."
    }
  ],

  // Approved Categories (Only 01-05 approved. Categories 06-10 pending selection committee)
  categories: [
    {
      id: "cat-01",
      number: "01",
      slug: "sports-and-kushti",
      name: "Sports & Kushti",
      description: "Recognising outstanding contribution to sport, wrestling and athletic achievement.",
      status: "Approved",
      active: true,
      edition: "2026",
      nominationCount: 14,
      criteria: "Dedication to grassroots wrestling (Kushti), mentorship of rural athletes, personal sacrifice in advancing traditional and Olympic sporting disciplines."
    },
    {
      id: "cat-02",
      number: "02",
      slug: "education",
      name: "Education",
      description: "Recognising educators and individuals creating meaningful educational impact.",
      status: "Approved",
      active: true,
      edition: "2026",
      nominationCount: 22,
      criteria: "Transformative teaching, establishment of inclusive learning centers in underserved geographies, lifelong pedagogy without commercial motive."
    },
    {
      id: "cat-03",
      number: "03",
      slug: "social-service",
      name: "Social Service",
      description: "Recognising individuals whose service has created meaningful social impact.",
      status: "Approved",
      active: true,
      edition: "2026",
      nominationCount: 38,
      criteria: "Sustained community upliftment, rehabilitation, disaster relief, advocacy for vulnerable populations without pursuit of public acclaim."
    },
    {
      id: "cat-04",
      number: "04",
      slug: "medicine-and-healthcare",
      name: "Medicine & Healthcare",
      description: "Recognising those who serve humanity through healthcare, healing and public health.",
      status: "Approved",
      active: true,
      edition: "2026",
      nominationCount: 29,
      isFeature: true,
      association: "A MedscapeIndia Legacy Initiative",
      criteria: "Selfless medical practice in rural or tribal sectors, low-cost health innovations, frontline public health protection, human-centered care."
    },
    {
      id: "cat-05",
      number: "05",
      slug: "media-and-journalism",
      name: "Media & Journalism",
      description: "Recognising responsible journalism, media contribution and public-interest storytelling.",
      status: "Approved",
      active: true,
      edition: "2026",
      nominationCount: 19,
      criteria: "Fearless investigative reporting in the public interest, grassroots regional documentation, ethical storytelling advancing constitutional values."
    }
  ],

  // Awardee Architecture (The 10)
  // For 2026 edition: Selection is active; these represent the CMS profile framework with clearly marked placeholders
  awardees: [
    {
      id: "awd-2026-01",
      number: "01",
      edition: "2026",
      name: "[ Nominee Under Selection Committee Review ]",
      isPlaceholder: true,
      categorySlug: "sports-and-kushti",
      categoryName: "Sports & Kushti",
      photo: "assets/images/shri-ghanshyam-dube-portrait.svg",
      shortBio: "Selected from grassroots akhadas across Maharashtra and North India for decades of silent athletic stewardship.",
      theirStory: "This profile will be officially unveiled during the ceremonial convocation on 10 November 2026 in Mumbai.",
      theirContribution: "Mentored over 300 state and national wrestlers while preserving traditional clay wrestling traditions.",
      whyChosen: "Exemplified the relentless discipline and physical valor embodied by Late Shri Ghanshyam Dube.",
      ceremonyNotes: "To be conferred at the Royal Opera House, Mumbai on 10 November 2026."
    },
    {
      id: "awd-2026-02",
      number: "02",
      edition: "2026",
      name: "[ Nominee Under Selection Committee Review ]",
      isPlaceholder: true,
      categorySlug: "education",
      categoryName: "Education",
      photo: "assets/images/shri-ghanshyam-dube-portrait.svg",
      shortBio: "A rural educator providing free foundational schooling to first-generation learners in remote districts.",
      theirStory: "Full archival documentation will be released post-jury ratification.",
      theirContribution: "Built 12 community libraries and ensured 100% literacy across 4 adjacent talukas.",
      whyChosen: "Uncompromising commitment to public enlightenment without commercial support.",
      ceremonyNotes: "To be conferred on 10 November 2026."
    },
    {
      id: "awd-2026-03",
      number: "03",
      edition: "2026",
      name: "[ Nominee Under Selection Committee Review ]",
      isPlaceholder: true,
      categorySlug: "social-service",
      categoryName: "Social Service",
      photo: "assets/images/shri-ghanshyam-dube-portrait.svg",
      shortBio: "Decades of quiet grassroots mobilization addressing groundwater security and drought mitigation.",
      theirStory: "Full documentary dossier and profile release scheduled for 10 November 2026.",
      theirContribution: "Restored 45 natural percolation ponds benefiting over 80,000 agrarian families.",
      whyChosen: "Exemplifies the civic courage and selfless public duty championed by Shri Ghanshyam Dube.",
      ceremonyNotes: "To be conferred on 10 November 2026."
    },
    {
      id: "awd-2026-04",
      number: "04",
      edition: "2026",
      name: "[ Nominee Under Selection Committee Review ]",
      isPlaceholder: true,
      categorySlug: "medicine-and-healthcare",
      categoryName: "Medicine & Healthcare",
      photo: "assets/images/shri-ghanshyam-dube-portrait.svg",
      shortBio: "A physician who dedicated four decades to tribal healthcare and maternal wellness in remote hamlets.",
      theirStory: "Presented under the MedscapeIndia Legacy Initiative in solemn tribute to humane medicine.",
      theirContribution: "Delivered over 12,000 safe births in remote forested belts with zero maternal mortality.",
      whyChosen: "A pure embodiment of medical ethics and humanitarian service.",
      ceremonyNotes: "To be conferred on 10 November 2026."
    },
    {
      id: "awd-2026-05",
      number: "05",
      edition: "2026",
      name: "[ Nominee Under Selection Committee Review ]",
      isPlaceholder: true,
      categorySlug: "media-and-journalism",
      categoryName: "Media & Journalism",
      photo: "assets/images/shri-ghanshyam-dube-portrait.svg",
      shortBio: "Grassroots regional reporter documenting environmental contamination and public rights in vernacular print.",
      theirStory: "Story currently preserved in confidential jury archives until the official announcement.",
      theirContribution: "Authored 400+ public-interest investigative exposés resulting in policy interventions.",
      whyChosen: "Stood steadfast in defense of truth without seeking commercial visibility.",
      ceremonyNotes: "To be conferred on 10 November 2026."
    }
  ],

  // Voices of the Legacy (3 Specified Groups: Remembering Ghanshyam Dube, Supporting GRD-10, The GRD-10 Circle)
  voices: [
    {
      id: "voice-01",
      group: "Remembering Ghanshyam Dube",
      groupKey: "remembering",
      name: "Dr. Sunita Dube",
      role: "Founder, MedscapeIndia • Daughter of Shri Ghanshyam Dube",
      duration: "01:45",
      videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      excerpt: "«My father believed that true service never shouts. When you do good for another human being, you do not keep an account. GRD-10 is the living heartbeat of that principle.»",
      photo: "assets/images/shri-ghanshyam-dube-portrait.svg",
      edition: "2026"
    },
    {
      id: "voice-02",
      group: "Remembering Ghanshyam Dube",
      groupKey: "remembering",
      name: "Senior Advocate K. R. Sharma",
      role: "Lifelong Colleague & Legal Counsel",
      duration: "02:10",
      videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      excerpt: "«In the assembly and in the wrestling akhada alike, Ghanshyamji was a man of steel spine. He would stand by a villager with the same dignity he gave to a cabinet minister.»",
      photo: "assets/images/shri-ghanshyam-dube-portrait.svg",
      edition: "2026"
    },
    {
      id: "voice-03",
      group: "Supporting GRD-10",
      groupKey: "supporting",
      name: "Justice (Retd.) V. S. Patil",
      role: "Member, Advisory Council",
      duration: "01:20",
      videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      excerpt: "«India has enough platforms that celebrate celebrity. We desperately need an institution that bows before the quiet worker. GRD-10 fulfills that profound national need.»",
      photo: "assets/images/shri-ghanshyam-dube-portrait.svg",
      edition: "2026"
    },
    {
      id: "voice-04",
      group: "Supporting GRD-10",
      groupKey: "supporting",
      name: "Padma Shri Dr. Arvind Deshmukh",
      role: "Senior Healthcare Statesman",
      duration: "01:50",
      videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      excerpt: "«Associating this award with healthcare service reflects a deeply humane vision. It honours the quiet doctors and nurses who serve without headlines.»",
      photo: "assets/images/shri-ghanshyam-dube-portrait.svg",
      edition: "2026"
    },
    {
      id: "voice-05",
      group: "The GRD-10 Circle",
      groupKey: "circle",
      name: "Ananya Mehta",
      role: "Lead Youth Coordinator, GRD-10 Fellowship",
      duration: "00:58",
      videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      excerpt: "«Working as a student researcher to document these quiet contributors has completely re-anchored what success and integrity mean to my generation.»",
      photo: "assets/images/shri-ghanshyam-dube-portrait.svg",
      edition: "2026"
    },
    {
      id: "voice-06",
      group: "The GRD-10 Circle",
      groupKey: "circle",
      name: "Rohan Kulkarni",
      role: "Volunteer Archivist, Oral History Project",
      duration: "01:15",
      videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      excerpt: "«Every story we collect from rural India proves that the country runs on the quiet sacrifices of people whose names are never in the newspapers.»",
      photo: "assets/images/shri-ghanshyam-dube-portrait.svg",
      edition: "2026"
    }
  ],

  // Timeline for The Legacy Page (The Man, The Leader, The Journey)
  timeline: [
    {
      year: "1938",
      title: "Roots of Courage & Upbringing",
      desc: "Born into a family grounded in traditional ethics, physical discipline, and agrarian ethos. Early immersion into traditional Indian wrestling (Kushti), instilling lifelong values of resilience and humility."
    },
    {
      year: "1958",
      title: "The Akhada & Ethos of Kushti",
      desc: "Achieved distinction in traditional wrestling arenas across Maharashtra and Uttar Pradesh. The akhada taught him that physical strength is meaningless without moral restraint and protective duty toward the weak."
    },
    {
      year: "1972",
      title: "Commitment to Public Life & Maharashtra",
      desc: "Stepped firmly into public service and social advocacy in Mumbai and greater Maharashtra, championing civic infrastructure, labor rights, and access to education for migrant families."
    },
    {
      year: "1988",
      title: "Civic Leadership & Philanthropy",
      desc: "Initiated key community health dispensaries and educational grants for underprivileged students, deliberately refusing personal publicity or commercial branding."
    },
    {
      year: "2005",
      title: "Mentorship of the Next Generation",
      desc: "Fostered a network of social reformers, healthcare professionals, and sports coaches, instilling the creed: 'Contribution before recognition.'"
    },
    {
      year: "2021",
      title: "A Lasting Farewell & Call to Remembrance",
      desc: "Departed peacefully, leaving an indelible imprint on thousands of lives across Maharashtra and India. His vision inspired the establishment of the GRD-10 platform."
    },
    {
      year: "2026",
      title: "Inauguration of GRD-10 Achiever Awards",
      desc: "Formal founding of the annual decadal institution to permanently preserve and celebrate the quiet contributors of the nation every 10 November."
    }
  ],

  // Media & Permanent Archive Architecture
  media: [
    {
      id: "med-01",
      title: "Institutional Announcement: The Inaugural GRD-10 Awards 2026",
      category: "PRESS",
      type: "Press Release",
      date: "August 15, 2026",
      edition: "2026",
      snippet: "MedscapeIndia announces the institutional founding of the Shri Ghanshyam Dube Achiever Awards, slated for 10 November 2026 in Mumbai.",
      image: "assets/images/shri-ghanshyam-dube-portrait.svg"
    },
    {
      id: "med-02",
      title: "Editorial: Why Quiet Contribution is the Bedrock of a Nation",
      category: "ARTICLES",
      type: "Thought Leadership",
      date: "September 02, 2026",
      edition: "2026",
      snippet: "An exploration into why modern awards systems reward media visibility over real grassroots impact, and how GRD-10 provides a corrective.",
      image: "assets/images/shri-ghanshyam-dube-portrait.svg"
    },
    {
      id: "med-03",
      title: "Archival Photography: The Wrestling Arenas of Maharashtra (1960–1975)",
      category: "PHOTOGRAPHS",
      type: "Archival Collection",
      date: "Archival Record #AR-1972",
      edition: "2026",
      snippet: "Rare monochrome photographic prints depicting Shri Ghanshyam Dube and contemporary wrestlers at the historic Shivaji Park & Kolhapur akhadas.",
      image: "assets/images/shri-ghanshyam-dube-portrait.svg"
    },
    {
      id: "med-04",
      title: "The Inaugural Convening Preview: 10 November 2026",
      category: "EVENT COVERAGE",
      type: "Institutional Dispatch",
      date: "October 01, 2026",
      edition: "2026",
      snippet: "Preparations underway for the solemn ceremony in Mumbai honoring ten quiet achievers in the presence of national dignitaries.",
      image: "assets/images/shri-ghanshyam-dube-portrait.svg"
    },
    {
      id: "med-05",
      title: "Official Commemorative Film: The Quiet Flame [Preview]",
      category: "VIDEO",
      type: "Institutional Film",
      date: "October 2026",
      edition: "2026",
      snippet: "A documentary preview chronicling the life and timeless values of Shri Ghanshyam Dube and the birth of the GRD-10 legacy.",
      image: "assets/images/shri-ghanshyam-dube-portrait.svg"
    },
    {
      id: "med-06",
      title: "Document Archive: Historical Resolutions & Civic Charters",
      category: "DOCUMENT ARCHIVE",
      type: "Historical Record",
      date: "Archival Record #CR-1984",
      edition: "2026",
      snippet: "Official historical memoranda advocating for rural civic development and community health access in Maharashtra.",
      image: "assets/images/shri-ghanshyam-dube-portrait.svg"
    }
  ]
};

// Data Store Manager with LocalStorage synchronization
class GRD10Store {
  constructor() {
    this.STORAGE_KEY = 'grd10_institutional_cms_v1';
    this.NOMINATIONS_KEY = 'grd10_private_nominations_vault';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(GRD10_DEFAULT_DATA));
    }
    if (!localStorage.getItem(this.NOMINATIONS_KEY)) {
      localStorage.setItem(this.NOMINATIONS_KEY, JSON.stringify([]));
    }
  }

  getData() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : GRD10_DEFAULT_DATA;
    } catch (e) {
      console.error('Error reading GRD10 Store:', e);
      return GRD10_DEFAULT_DATA;
    }
  }

  saveData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  getCategories(edition = "2026") {
    const data = this.getData();
    return data.categories.filter(c => c.edition === edition && c.active);
  }

  getAwardees(edition = "2026") {
    const data = this.getData();
    return data.awardees.filter(a => a.edition === edition);
  }

  getVoices(edition = "2026", groupKey = null) {
    const data = this.getData();
    let voices = data.voices.filter(v => v.edition === edition);
    if (groupKey && groupKey !== 'all') {
      voices = voices.filter(v => v.groupKey === groupKey);
    }
    return voices;
  }

  getMedia(edition = "2026", category = null) {
    const data = this.getData();
    let media = data.media.filter(m => m.edition === edition);
    if (category && category !== 'ALL') {
      media = media.filter(m => m.category === category);
    }
    return media;
  }

  getEditions() {
    return this.getData().editions;
  }

  getActiveEditionDetails() {
    const data = this.getData();
    return data.editions.find(e => e.year === data.activeEdition) || data.editions[0];
  }

  updateSiteSettings(settings) {
    const data = this.getData();
    if (settings.activeEdition) data.activeEdition = settings.activeEdition;
    const currentEd = data.editions.find(e => e.year === data.activeEdition);
    if (currentEd) {
      if (settings.date) currentEd.date = settings.date;
      if (settings.location) currentEd.location = settings.location;
      if (settings.theme) currentEd.theme = settings.theme;
      if (settings.status) currentEd.status = settings.status;
    }
    this.saveData(data);
    return true;
  }

  // Categories CRUD
  addCategory(cat) {
    const data = this.getData();
    data.categories.push(cat);
    this.saveData(data);
  }

  updateCategory(id, fields) {
    const data = this.getData();
    const idx = data.categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      data.categories[idx] = { ...data.categories[idx], ...fields };
      this.saveData(data);
      return true;
    }
    return false;
  }

  deleteCategory(id) {
    const data = this.getData();
    data.categories = data.categories.filter(c => c.id !== id);
    this.saveData(data);
  }

  // Awardees CRUD
  updateAwardee(id, fields) {
    const data = this.getData();
    const idx = data.awardees.findIndex(a => a.id === id);
    if (idx !== -1) {
      data.awardees[idx] = { ...data.awardees[idx], ...fields };
      this.saveData(data);
      return true;
    }
    return false;
  }

  addAwardee(awardee) {
    const data = this.getData();
    data.awardees.push(awardee);
    this.saveData(data);
  }

  deleteAwardee(id) {
    const data = this.getData();
    data.awardees = data.awardees.filter(a => a.id !== id);
    this.saveData(data);
  }

  // Voices CRUD
  addVoice(voice) {
    const data = this.getData();
    data.voices.push(voice);
    this.saveData(data);
  }

  updateVoice(id, fields) {
    const data = this.getData();
    const idx = data.voices.findIndex(v => v.id === id);
    if (idx !== -1) {
      data.voices[idx] = { ...data.voices[idx], ...fields };
      this.saveData(data);
      return true;
    }
    return false;
  }

  deleteVoice(id) {
    const data = this.getData();
    data.voices = data.voices.filter(v => v.id !== id);
    this.saveData(data);
  }

  // Media CRUD
  addMedia(item) {
    const data = this.getData();
    data.media.unshift(item);
    this.saveData(data);
  }

  deleteMedia(id) {
    const data = this.getData();
    data.media = data.media.filter(m => m.id !== id);
    this.saveData(data);
  }

  // Nomination Submission Engine
  submitNomination(nominationData) {
    try {
      const nominations = this.getPrivateNominations();
      const refId = `GRD-2026-NOM-${Math.floor(10000 + Math.random() * 90000)}`;
      const submission = {
        id: 'nom-' + Date.now(),
        referenceId: refId,
        submittedAt: new Date().toISOString(),
        status: 'Under Review',
        ...nominationData
      };
      nominations.unshift(submission);
      localStorage.setItem(this.NOMINATIONS_KEY, JSON.stringify(nominations));

      // Increment category count
      const data = this.getData();
      const cat = data.categories.find(c => c.name === nominationData.category || c.slug === nominationData.category);
      if (cat) {
        cat.nominationCount = (cat.nominationCount || 0) + 1;
        this.saveData(data);
      }

      return { success: true, referenceId: refId, submission };
    } catch (err) {
      console.error('Submission failure:', err);
      return { success: false, error: err.message };
    }
  }

  getPrivateNominations() {
    try {
      const stored = localStorage.getItem(this.NOMINATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  exportDataJSON() {
    return JSON.stringify(this.getData(), null, 2);
  }

  importDataJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.categories && parsed.editions) {
        this.saveData(parsed);
        return { success: true };
      }
      return { success: false, error: 'JSON does not conform to GRD-10 schema structure.' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetToDefault() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(GRD10_DEFAULT_DATA));
  }
}

// Global Singleton Instance
window.grdStore = new GRD10Store();
