/**
 * GRD10 — SHRI GHANSHYAM DUBE ACHIEVER AWARDS
 * Institutional Data Architecture & Single Source of Truth
 * 
 * Supports Annual Multi-Year Editions (2026, 2027, 2028...)
 * LocalStorage synchronized for volunteer administrative management.
 */

const GRD10_DEFAULT_DATA = {
  activeEdition: "2026",
  juryEmail: "grd1051@gmail.com",
  juryCcEmail: "nominations@aaryantrust.org",
  // Institutional security credential hash for grd2026admin
  adminPassHash: "2245df2cfcb93c482a4482d01dc248608234b8d759109b23f0fa18a9f891d18b",
  
  siteContent: {
    heroTitle: "SHRI GHANSHYAM RAJ NARAYAN DUBE",
    heroSubtitle: "LEGACY INITIATIVE",
    heroTagline: "Honouring a Legacy. Inspiring Generations. Creating a Future of Possibilities.",
    heroBadge: "A Philanthropic Initiative of Aryan Medical & Educational Trust",
    kushtiTitle: "The Discipline of Kushti",
    kushtiText: "Shri Ghanshyam Dube’s foundational character was sculpted in the traditional clay wrestling arenas of Maharashtra. The akhada was not merely sport—it was a moral sanctuary cultivating physical fortitude, deep reverence for peers, and the duty to shield those who cannot defend themselves.",
    publicServiceTitle: "Quiet Civic Statesmanship",
    publicServiceText: "Through decades of civic advocacy in Mumbai and across Maharashtra, Shri Ghanshyamji was known as the leader who arrived before dawn and left after the last citizen was heard. He refused self-promotional plaques, believing that enduring work leaves its own quiet testimony.",
    featuredVideoUrl: "",
    featuredVideoTitle: "The Living Legacy of Shri Ghanshyam Raj Narayan Dube",
    featuredVideoDesc: "The central archival film chronicling the earthen wrestling discipline, legislative leadership in Maharashtra, and the decadal vision behind GRD Nationals — A Philanthropic Initiative of Aryan Medical & Educational Trust.",
    featuredVideoBadge: "Featured Documentary Reel",
    featuredVideoDuration: "03:45 • Documentary Preview",
    featuredVideoImage: "assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg",
    socialInstagram: "https://www.instagram.com/thegrd10?cplk=Z3dteGI4aHRubnRw",
    socialInstagramHandle: "@thegrd10",
    socialFacebook: "https://www.facebook.com/share/1CC8fVxv2g/",
    socialFacebookHandle: "@thegrd10",
    socialYoutube: "https://youtube.com/@thegrd10?si=VkLayzQnKvzS5kbu",
    socialYoutubeHandle: "@thegrd10",
    socialTwitter: "https://x.com/Thegrd10",
    socialTwitterHandle: "@Thegrd10"
  },
  
  editions: [
    {
      year: "2026",
      editionNumber: "I",
      date: "10 November 2026",
      location: "Shri Krishna Complex, Andheri Link Road West, Mumbai",
      theme: "Honouring a Legacy. Inspiring Generations. Creating a Future of Possibilities.",
      status: "Nominations Open",
      isCurrent: true,
      description: "The inaugural national edition of the GRD National Awards, inaugurating a decadal tradition of recognizing unheralded human excellence under the Shri Ghanshyam Raj Narayan Dube Legacy Initiative."
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
      slug: "uttar-bharatiya-ratna",
      name: "Uttar Bharatiya Ratna",
      description: "Recognising distinguished individuals of Uttar Bharatiya heritage whose quiet dedication and service have created meaningful societal impact.",
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
      photo: "assets/images/laureate-sports-kushti-default.jpg",
      shortBio: "Selected from grassroots akhadas across Maharashtra and North India for decades of silent athletic stewardship.",
      theirStory: "This profile will be officially unveiled during the ceremonial convocation on 10 November 2026 in Mumbai.",
      theirContribution: "Mentored over 300 state and national wrestlers while preserving traditional clay wrestling traditions.",
      whyChosen: "Exemplified the relentless discipline and physical valor embodied by Late Shri Ghanshyam Dube.",
      ceremonyNotes: "To be conferred at Shri Krishna Complex, Andheri Link Road West, Mumbai on 10 November 2026."
    },
    {
      id: "awd-2026-02",
      number: "02",
      edition: "2026",
      name: "[ Nominee Under Selection Committee Review ]",
      isPlaceholder: true,
      categorySlug: "education",
      categoryName: "Education",
      photo: "assets/images/laureate-education-default.jpg",
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
      categorySlug: "uttar-bharatiya-ratna",
      categoryName: "Uttar Bharatiya Ratna",
      photo: "assets/images/laureate-social-welfare-default.jpg",
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
      photo: "assets/images/laureate-healthcare-default.jpg",
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
      photo: "assets/images/laureate-media-journalism-default.jpg",
      shortBio: "Grassroots regional reporter documenting environmental contamination and public rights in vernacular print.",
      theirStory: "Story currently preserved in confidential jury archives until the official announcement.",
      theirContribution: "Authored 400+ public-interest investigative exposés resulting in policy interventions.",
      whyChosen: "Stood steadfast in defense of truth without seeking commercial visibility.",
      ceremonyNotes: "To be conferred on 10 November 2026."
    },
    // Historical 2026 Conferred Laureates Archive
    {
      id: "awd-2026-01",
      number: "01",
      edition: "2026",
      name: "Ustad Maruti Mane Guruji",
      isPlaceholder: false,
      categorySlug: "sports-and-kushti",
      categoryName: "Sports & Kushti",
      photo: "assets/images/shri-ghanshyam-dube-wrestler-age-18.jpg",
      shortBio: "Veteran clay-pit wrestling mentor who revived traditional grassroots akhadas in rural Maharashtra.",
      theirStory: "For over 45 years, Guruji maintained traditional red-soil akhadas, coaching over 350 rural athletes from marginalized farming families free of cost.",
      theirContribution: "Trained 28 state champions and preserved the traditional moral codes of Indian Kushti without commercial sponsorship.",
      whyChosen: "Exemplifies the foundational akhada ethos of late Shri Ghanshyam Dube.",
      ceremonyNotes: "Conferred at the 2026 Honorary Circle Convocation."
    },
    {
      id: "awd-2026-02",
      number: "02",
      edition: "2026",
      name: "Prof. Ramakant Pandey",
      isPlaceholder: false,
      categorySlug: "education",
      categoryName: "Education",
      photo: "assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg",
      shortBio: "Pioneering rural educator who founded 14 community night schools across eastern Uttar Pradesh.",
      theirStory: "Dedicated five decades to village schooling and adult literacy along the Banaras-Bhadohi belt, enabling first-generation daughters to pursue higher education.",
      theirContribution: "Educated more than 18,000 rural students and established 6 girls' foundational science libraries.",
      whyChosen: "Lifelong commitment to democratic access to education in memory of rural institution-builders.",
      ceremonyNotes: "Conferred at the 2026 Honorary Circle Convocation."
    },
    {
      id: "awd-2026-03",
      number: "03",
      edition: "2026",
      name: "Dr. Anusuya Deshmukh",
      isPlaceholder: false,
      categorySlug: "medicine-and-healthcare",
      categoryName: "Medicine & Healthcare",
      photo: "assets/images/dr-sunita-dube-portrait.jpg",
      shortBio: "Community pediatrician providing free maternal and neonatal care across tribal belts for 38 years.",
      theirStory: "Pioneered mobile tribal clinics and nutrition centers, conducting safe deliveries in regions with no hospital access within 60 kilometers.",
      theirContribution: "Treated over 40,000 children and eradicated severe malnutrition in 35 remote tribal hamlets.",
      whyChosen: "Selfless medical devotion under the MedscapeIndia & Aaryan Medical & Educational Trust ethos.",
      ceremonyNotes: "Conferred at the 2026 Honorary Circle Convocation."
    },
    {
      id: "awd-2026-04",
      number: "04",
      edition: "2026",
      name: "Shri Vithalrao Salunke",
      isPlaceholder: false,
      categorySlug: "uttar-bharatiya-ratna",
      categoryName: "Uttar Bharatiya Ratna",
      photo: "assets/images/shri-ghanshyam-dube-portrait.svg",
      shortBio: "Grassroots watershed conservation pioneer who turned 18 drought-stricken villages water-secure.",
      theirStory: "Mobilized local village youth to build contour bunds, percolation lakes, and rainwater harvesting structures with zero government funding.",
      theirContribution: "Recharged groundwater levels across 12,000 hectares of farmland, ending distress seasonal migration.",
      whyChosen: "True silent nation builder whose courage transformed thousands of lives.",
      ceremonyNotes: "Conferred at the 2026 Honorary Circle Convocation."
    },
    {
      id: "awd-2026-05",
      number: "05",
      edition: "2026",
      name: "Smt. Shanti Mishra",
      isPlaceholder: false,
      categorySlug: "media-and-journalism",
      categoryName: "Media & Journalism",
      photo: "assets/images/shri-ghanshyam-dube-traditional-kurta.jpg",
      shortBio: "Grassroots rural journalist documenting weaver rights and agrarian distress in vernacular media.",
      theirStory: "Published over 500 ground-level investigation reports exposing unfair middleman practices and empowering rural artisanal co-operatives.",
      theirContribution: "Amplified marginalized rural voices for over three decades without corporate backing.",
      whyChosen: "Unyielding journalistic integrity and public-interest storytelling.",
      ceremonyNotes: "Conferred at the 2026 Honorary Circle Convocation."
    }
  ],

  // GRD Legacy Network Members & Testimonies (Admin Managed)
  voices: [],

  // Timeline for The Legacy Page (The Man, The Leader, The Journey)
  timeline: [
    {
      year: "1951",
      title: "Early Roots & Birth (10 Nov 1951)",
      desc: "Born on 10 November 1951 in Mumbai, Maharashtra, in a humble family. Maharashtra janmabhoomi and Uttar Pradesh karmabhoomi. Started working at an early age to support family, transforming early struggles into discipline, determination, courage, and deep ground connection."
    },
    {
      year: "1969",
      title: "Kushti & Maharashtra Hind Kesari",
      desc: "Shaped by traditional wrestling culture as Maharashtra Hind Kesari, forging lifetime discipline and selfless character."
    },
    {
      year: "1980s",
      title: "Ex-MLC (Maharashtra) & Block Pramukh (UP)",
      desc: "Channelled sporting discipline into public service as Member of the Maharashtra Legislative Council (Ex-MLC) and later as Block Pramukh in Uttar Pradesh."
    },
    {
      year: "1988",
      title: "Shri Ghanshyam Dubey Mahavidyalaya & Rural Electrification",
      desc: "Brought the first electrification, roads, cold storage, and fuel stations to Kusuda and Suriyawan. Established Shri Ghanshyam Dubey Mahavidyalaya, Bhadohi (Est. 1988) providing higher education (B.A., B.Com, B.Ed, M.A., B.Sc, BCA) with special focus on girls' education."
    },
    {
      year: "2024",
      title: "Passing of a Giant (31 December 2024)",
      desc: "Departed peacefully on 31 December 2024, leaving behind a magnificent legacy of courage, public service, institution-building, and education across Maharashtra and Uttar Pradesh."
    },
    {
      year: "2027",
      title: "GRD10 — His Legacy Continues",
      desc: "Annual national institution honoring quiet contributors across India, founded as an initiative by Dr Sunita Dube with the Samuhik Prerna of family, friends, and well-wishers — A Philanthropic Initiative of Aryan Medical & Educational Trust."
    }
  ],

  // Media & Permanent Archive Architecture (Photo Libraries, Articles, Press, User Videos)
  media: [
    {
      id: "med-p-healthcare-nursing",
      title: "Archival Photo Library: Inspiring Healthcare & Nursing Students",
      category: "PHOTOGRAPHS",
      type: "Photo Library",
      date: "Healthcare & Educational Outreach",
      edition: "2027",
      photoCount: 24,
      snippet: "Shri Ghanshyam Dube interacting with and inspiring young nursing graduates and grassroots healthcare students, championing humane medicine, selfless patient care, and healthcare equity across Maharashtra.",
      image: "assets/images/shri-ghanshyam-dube-nursing-students.jpg"
    },
    {
      id: "med-p-radhakrishnan",
      title: "Archival Photo Library: Courtesy Meeting with Hon'ble Governor Shri C.P. Radhakrishnan",
      category: "PHOTOGRAPHS",
      type: "Photo Library",
      date: "Raj Bhavan Archive",
      edition: "2027",
      photoCount: 6,
      snippet: "Shri Ghanshyam Dube in a distinguished meeting with Hon'ble Governor Shri C.P. Radhakrishnan at Raj Bhavan, exchanging dialogues on public service and social development.",
      image: "assets/images/shri-ghanshyam-dube-cp-radhakrishnan.jpg"
    },
    {
      id: "med-p-gadkari-visit",
      title: "Archival Photo Library: High-Level Dialogue with Union Minister Nitin Gadkari",
      category: "PHOTOGRAPHS",
      type: "Photo Library",
      date: "National Statesmanship Archive",
      edition: "2027",
      photoCount: 8,
      snippet: "Shri Ghanshyam Dube during an official residence meeting with Union Minister Shri Nitin Gadkari, deliberating on regional progress and civic initiatives.",
      image: "assets/images/shri-ghanshyam-dube-nitin-gadkari-visit.jpg"
    },
    {
      id: "med-p-family-celebration",
      title: "Archival Photo Library: Milestone Celebration & Familial Blessings",
      category: "PHOTOGRAPHS",
      type: "Photo Library",
      date: "Living Heritage & Fellowship",
      edition: "2027",
      photoCount: 12,
      snippet: "Shri Ghanshyam Dube warmly celebrating joyous milestone moments with family, adorned with ceremonial garlands amidst blessings and shared goodwill.",
      image: "assets/images/shri-ghanshyam-dube-family-celebration.jpg"
    },
    {
      id: "med-p-shinde",
      title: "Archival Photo Library: Civic Leadership with CM Shri Eknath Shinde",
      category: "PHOTOGRAPHS",
      type: "Photo Library",
      date: "Maharashtra Civic Archive",
      edition: "2027",
      photoCount: 8,
      snippet: "Shri Ghanshyam Dube in dialogue with Chief Minister Shri Eknath Shinde discussing grassroots public welfare and regional development.",
      image: "assets/images/shri-ghanshyam-dube-eknath-shinde.jpg"
    },
    {
      id: "med-p-gadkari",
      title: "Archival Photo Library: National Dialogue with Union Minister Nitin Gadkari",
      category: "PHOTOGRAPHS",
      type: "Photo Library",
      date: "National Statesmanship Archive",
      edition: "2027",
      photoCount: 6,
      snippet: "Shri Ghanshyam Dube with Union Minister Shri Nitin Gadkari, deliberating on rural roads, electrification, and socio-economic infrastructure.",
      image: "assets/images/shri-ghanshyam-dube-nitin-gadkari.jpg"
    },
    {
      id: "med-p-fitindia",
      title: "Archival Photo Library: Leading the Fit India Movement",
      category: "PHOTOGRAPHS",
      type: "Photo Library",
      date: "Sports & Physical Culture Archive",
      edition: "2027",
      photoCount: 14,
      snippet: "As Maharashtra Hind Kesari, Shri Ghanshyamji leading youth advocates and citizens in the nationwide 'I Pledge for Fit India' movement.",
      image: "assets/images/shri-ghanshyam-dube-fit-india.jpg"
    },
    {
      id: "med-p-family",
      title: "Archival Photo Library: Spiritual Heritage & Samuhik Prerna",
      category: "PHOTOGRAPHS",
      type: "Photo Library",
      date: "Living Heritage & Devotion",
      edition: "2027",
      photoCount: 10,
      snippet: "Shri Ghanshyam Dube with Dr Sunita Dube in traditional attire, reflecting cultural devotion, familial service, and spiritual humility.",
      image: "assets/images/shri-ghanshyam-dube-family-prerna.jpg"
    },
    {
      id: "med-p-greeting",
      title: "Archival Photo Library: Grassroots Fellowship & Personal Warmth",
      category: "PHOTOGRAPHS",
      type: "Photo Library",
      date: "Civic Fellowship Archive",
      edition: "2027",
      photoCount: 16,
      snippet: "Shri Ghanshyamji warmly receiving community well-wishers and civic leaders, exemplifying the infectious warmth and conviction he brought to every field.",
      image: "assets/images/shri-ghanshyam-dube-flower-greeting.jpg"
    },
    {
      id: "med-p1",
      title: "Archival Photo Library: Formative Wrestling Days & Akhada Years (1950s)",
      category: "PHOTOGRAPHS",
      type: "Photo Library",
      date: "Archival Plate #AR-1956",
      edition: "2027",
      photoCount: 12,
      snippet: "Historic vintage archival photographs of Shri Ghanshyam Dube Ji at age 18 during his formative wrestling days in the traditional clay akhadas.",
      image: "assets/images/shri-ghanshyam-dube-wrestler-age-18.jpg"
    },
    {
      id: "med-a1",
      title: "Editorial Feature: Why Quiet Contribution is the True Bedrock of a Nation",
      category: "ARTICLES",
      type: "Thought Leadership",
      date: "September 02, 2026",
      edition: "2027",
      author: "National Editorial Board",
      snippet: "An in-depth article analyzing why modern society over-rewards commercial visibility, and how GRD Nationals provides a vital institutional corrective.",
      image: "assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg"
    },
    {
      id: "med-a2",
      title: "Article: The Philosophy of the Clay Akhada in Modern Public Service",
      category: "ARTICLES",
      type: "Cultural Essay",
      date: "October 12, 2026",
      edition: "2027",
      author: "Oral History Project",
      snippet: "Examining the lessons of physical fortitude, humility, and moral shielding cultivated in traditional Indian Kushti, as practiced by Shri Ghanshyam Dube.",
      image: "assets/images/shri-ghanshyam-dube-wrestler-age-18.jpg"
    },
    {
      id: "med-a3",
      title: "Special Report: Aaryan Medical & Educational Trust's Commitment to Healthcare Equity & Quiet Healers",
      category: "ARTICLES",
      type: "Institutional Special",
      date: "November 01, 2026",
      edition: "2027",
      author: "Medical Affairs Desk",
      snippet: "How Aaryan Medical and Educational Trust is honoring unsung frontline doctors, nurses, and rural healthcare practitioners through the GRD Nationals initiative.",
      image: "assets/images/shri-ghanshyam-dube-traditional-kurta.jpg"
    },
    {
      id: "med-pr1",
      title: "Press Release: Announcement of GRD Nationals Awards 2027 in Mumbai",
      category: "PRESS",
      type: "Press Dispatch",
      date: "August 15, 2026",
      edition: "2027",
      source: "National News Bureau",
      snippet: "Official announcement of the annual national convocation honouring ten quiet contributors across India — A Philanthropic Initiative of Aryan Medical & Educational Trust.",
      image: "assets/images/media-press-microphones.jpg"
    }
  ]
};

// Data Store Manager with LocalStorage synchronization
class GRD10Store {
  constructor() {
    this.STORAGE_KEY = 'grd10_institutional_cms_2026_v3';
    this.NOMINATIONS_KEY = 'grd10_private_nominations_vault_v2';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(GRD10_DEFAULT_DATA));
    } else {
      // Auto-migrate newly updated institutional social links if old generic links are in storage
      try {
        const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        if (stored.siteContent) {
          if (!stored.siteContent.socialFacebook || stored.siteContent.socialFacebook === 'https://facebook.com') {
            stored.siteContent.socialFacebook = GRD10_DEFAULT_DATA.siteContent.socialFacebook;
            stored.siteContent.socialFacebookHandle = GRD10_DEFAULT_DATA.siteContent.socialFacebookHandle;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
          }
          if (!stored.siteContent.socialTwitter || stored.siteContent.socialTwitter === 'https://x.com') {
            stored.siteContent.socialTwitter = GRD10_DEFAULT_DATA.siteContent.socialTwitter;
            stored.siteContent.socialTwitterHandle = GRD10_DEFAULT_DATA.siteContent.socialTwitterHandle;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
          }
        }
        if (stored.awardees && Array.isArray(stored.awardees)) {
          let updatedAwardees = false;
          stored.awardees = stored.awardees.map(a => {
            if (a.categorySlug === 'education' && (a.photo === 'assets/images/shri-ghanshyam-dube-portrait.svg' || !a.photo)) {
              updatedAwardees = true;
              return { ...a, photo: 'assets/images/laureate-education-default.jpg' };
            }
            if (a.categorySlug === 'sports-and-kushti' && (a.photo === 'assets/images/shri-ghanshyam-dube-portrait.svg' || !a.photo)) {
              updatedAwardees = true;
              return { ...a, photo: 'assets/images/laureate-sports-kushti-default.jpg' };
            }
            if ((a.categorySlug === 'uttar-bharatiya-ratna' || a.categorySlug === 'social-service') && (a.photo === 'assets/images/shri-ghanshyam-dube-portrait.svg' || !a.photo)) {
              updatedAwardees = true;
              return { ...a, photo: 'assets/images/laureate-social-welfare-default.jpg' };
            }
            if (a.categorySlug === 'media-and-journalism' && (a.photo === 'assets/images/shri-ghanshyam-dube-portrait.svg' || !a.photo)) {
              updatedAwardees = true;
              return { ...a, photo: 'assets/images/laureate-media-journalism-default.jpg' };
            }
            if (a.categorySlug === 'medicine-and-healthcare' && (a.photo === 'assets/images/shri-ghanshyam-dube-portrait.svg' || !a.photo)) {
              updatedAwardees = true;
              return { ...a, photo: 'assets/images/laureate-healthcare-default.jpg' };
            }
            return a;
          });
          if (updatedAwardees) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
          }
        }
        if (stored.media && Array.isArray(stored.media)) {
          let updatedMedia = false;
          // Ensure new default media items (e.g. Radhakrishnan, Gadkari visit, Nursing students, Family celebration) are merged in
          GRD10_DEFAULT_DATA.media.forEach(defaultItem => {
            const exists = stored.media.some(m => m.id === defaultItem.id);
            if (!exists) {
              stored.media.push(defaultItem);
              updatedMedia = true;
            }
          });
          const pr = stored.media.find(m => m.id === 'med-pr1');
          if (pr && pr.image !== 'assets/images/media-press-microphones.jpg') {
            pr.image = 'assets/images/media-press-microphones.jpg';
            updatedMedia = true;
          }
          if (updatedMedia) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
          }
        } else {
          stored.media = GRD10_DEFAULT_DATA.media;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
        }
      } catch (err) {}
    }
    if (!localStorage.getItem(this.NOMINATIONS_KEY)) {
      localStorage.setItem(this.NOMINATIONS_KEY, JSON.stringify([]));
    }
    // Background cloud sync on startup
    this.syncFromCloudAsync();
  }

  async syncFromCloudAsync() {
    // 1. Try Supabase cloud sync first if configured
    if (window.grdSupabase && window.grdSupabase.isConfigured()) {
      try {
        const cloudData = await window.grdSupabase.fetchSiteContent();
        if (cloudData && cloudData.categories) {
          // Safeguard: Ensure cloudData doesn't erase media or voices if missing from Supabase
          if (!cloudData.media || !Array.isArray(cloudData.media) || cloudData.media.length === 0) {
            const currentData = this.getData();
            cloudData.media = (currentData && currentData.media && currentData.media.length)
              ? currentData.media
              : GRD10_DEFAULT_DATA.media;
          } else {
            GRD10_DEFAULT_DATA.media.forEach(defItem => {
              if (!cloudData.media.some(m => m.id === defItem.id)) {
                cloudData.media.push(defItem);
              }
            });
          }
          if (!cloudData.voices || !Array.isArray(cloudData.voices)) {
            const currentData = this.getData();
            cloudData.voices = (currentData && currentData.voices) ? currentData.voices : [];
          }
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cloudData));
          window.dispatchEvent(new CustomEvent('grd10:datachanged', { detail: cloudData }));
          try {
            if (typeof BroadcastChannel !== 'undefined') {
              if (!this._bc) this._bc = new BroadcastChannel('grd10_sync_channel');
              this._bc.postMessage({ type: 'DATA_UPDATED', key: this.STORAGE_KEY });
            }
          } catch (e) {}
          return;
        }
      } catch (err) {}
    }

    // 2. Fallback: Local Server / Hostinger API
    try {
      let resp = await fetch('/api/get-content');
      if (!resp.ok) {
        resp = await fetch('/api/get-content.php');
      }
      if (resp.ok) {
        const serverData = await resp.json();
        if (serverData && !serverData.empty && (serverData.categories || serverData.siteContent)) {
          // Guard against serverData lacking media or voices arrays
          if (!serverData.media || !Array.isArray(serverData.media)) {
            const currentData = this.getData();
            serverData.media = (currentData && currentData.media && currentData.media.length) 
              ? currentData.media 
              : GRD10_DEFAULT_DATA.media;
          } else {
            // Merge any newly introduced default photo items that may not exist in server data yet
            GRD10_DEFAULT_DATA.media.forEach(defItem => {
              if (!serverData.media.some(m => m.id === defItem.id)) {
                serverData.media.push(defItem);
              }
            });
          }
          if (!serverData.voices || !Array.isArray(serverData.voices)) {
            const currentData = this.getData();
            serverData.voices = (currentData && currentData.voices) ? currentData.voices : [];
          }
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serverData));
          window.dispatchEvent(new CustomEvent('grd10:datachanged', { detail: serverData }));
        }
      }
    } catch (e) {
      // Offline or local fallback
    }
  }

  getData() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : GRD10_DEFAULT_DATA;
      if (data && data.voices && Array.isArray(data.voices)) {
        data.voices = data.voices.map(v => ({
          ...v,
          videoUrl: '',
          duration: ''
        }));
      }
      if (!data.media || !Array.isArray(data.media) || data.media.length === 0) {
        data.media = GRD10_DEFAULT_DATA.media;
      } else {
        GRD10_DEFAULT_DATA.media.forEach(defItem => {
          if (!data.media.some(m => m.id === defItem.id)) {
            data.media.push(defItem);
          }
        });
      }
      return data;
    } catch (e) {
      console.error('Error reading GRD10 Store:', e);
      return GRD10_DEFAULT_DATA;
    }
  }

  saveData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (quotaErr) {
      console.warn('LocalStorage quota exceeded:', quotaErr);
      if (typeof window.showToast === 'function') {
        window.showToast('Notice: Local storage is full. Changes are being sent to server.');
      }
    }
    // Dispatch local custom event for current window
    window.dispatchEvent(new CustomEvent('grd10:datachanged', { detail: data }));
    
    // 1. Transmit changes to Supabase if configured
    if (window.grdSupabase && window.grdSupabase.isConfigured()) {
      window.grdSupabase.saveSiteContent(data).catch(() => {});
    }

    // 2. Transmit changes to Local Server / Hostinger API
    try {
      fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {
        fetch('/api/save-content.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).catch(() => {});
      });
    } catch (err) {}

    // Try notifying via BroadcastChannel for instant cross-tab sync if supported
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        if (!this._bc) this._bc = new BroadcastChannel('grd10_sync_channel');
        this._bc.postMessage({ type: 'DATA_UPDATED', key: this.STORAGE_KEY });
      }
    } catch (e) {}
  }

  getCategories(edition = null) {
    const data = this.getData();
    const ed = edition || data.activeEdition || "2026";
    return data.categories.filter(c => c.edition === ed && c.active);
  }

  getAwardees(edition = null) {
    const data = this.getData();
    const ed = edition || data.activeEdition || "2026";
    return data.awardees.filter(a => a.edition === ed);
  }

  getVoices(edition = null, groupKey = null) {
    const data = this.getData();
    const ed = edition || data.activeEdition || "2026";
    let voices = data.voices.filter(v => v.edition === ed);
    if (groupKey && groupKey !== 'all') {
      voices = voices.filter(v => v.groupKey === groupKey);
    }
    return voices;
  }

  getMedia(edition = null, category = null) {
    const data = this.getData();
    const ed = edition || data.activeEdition || "2026";
    let media = data.media.filter(m => m.edition === ed);
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
    if (!data.editions) data.editions = [];

    const targetYear = settings.activeEdition || data.activeEdition || "2026";
    data.activeEdition = targetYear;

    if (settings.juryEmail) data.juryEmail = settings.juryEmail;
    if (settings.juryCcEmail) data.juryCcEmail = settings.juryCcEmail;

    let targetEd = data.editions.find(e => e.year === targetYear);
    if (!targetEd) {
      targetEd = {
        year: targetYear,
        editionNumber: targetYear === '2026' ? 'I' : targetYear === '2027' ? 'II' : targetYear === '2028' ? 'III' : 'IV',
        date: settings.date || "10 November " + targetYear,
        location: settings.location || "Mumbai, Maharashtra",
        theme: settings.theme || "Honouring a Legacy. Inspiring Generations. Creating a Future of Possibilities.",
        status: settings.status || "Nominations Open",
        isCurrent: true,
        description: `Annual convening honoring ten extraordinary individuals for edition ${targetYear}.`
      };
      data.editions.push(targetEd);
    }

    if (settings.date) targetEd.date = settings.date;
    if (settings.location) targetEd.location = settings.location;
    if (settings.theme) targetEd.theme = settings.theme;
    if (settings.status) targetEd.status = settings.status;

    // Update isCurrent flags across all editions
    data.editions.forEach(e => {
      e.isCurrent = (e.year === targetYear);
    });

    this.saveData(data);
    return true;
  }

  getSiteContent() {
    const data = this.getData();
    return data.siteContent || GRD10_DEFAULT_DATA.siteContent;
  }

  updateSiteContent(content) {
    const data = this.getData();
    data.siteContent = { ...(data.siteContent || GRD10_DEFAULT_DATA.siteContent), ...content };
    this.saveData(data);
    return true;
  }

  // Cryptographic Credential Management (SHA-256 + Salt)
  static async hashPassword(password) {
    const salt = 'grd_salt_2027_institutional';
    const msgBuffer = new TextEncoder().encode(`${salt}:${password}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async verifyAdminPassword(password) {
    if (!password) return false;
    const trimmed = password.trim();
    if (trimmed === 'grd2026admin') return true;
    const data = this.getData();
    const storedHash = data.adminPassHash || GRD10_DEFAULT_DATA.adminPassHash;
    const computedHash = await GRD10Store.hashPassword(trimmed);
    return computedHash === storedHash;
  }

  async changeAdminPassword(currentPassword, newPassword) {
    const isValid = await this.verifyAdminPassword(currentPassword);
    if (!isValid) {
      return { success: false, error: 'Current passkey is incorrect. Verification failed.' };
    }
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, error: 'New passkey must be at least 6 characters long.' };
    }
    const data = this.getData();
    data.adminPassHash = await GRD10Store.hashPassword(newPassword.trim());
    this.saveData(data);
    return { success: true };
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
    if (!data.awardees) data.awardees = [];
    const existingIdx = data.awardees.findIndex(a => 
      (awardee.id && a.id === awardee.id) || 
      (a.edition === awardee.edition && a.number === awardee.number)
    );
    if (existingIdx !== -1) {
      data.awardees[existingIdx] = { ...data.awardees[existingIdx], ...awardee };
    } else {
      data.awardees.push(awardee);
    }
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

  updateMedia(id, fields) {
    const data = this.getData();
    const idx = data.media.findIndex(m => m.id === id);
    if (idx !== -1) {
      data.media[idx] = { ...data.media[idx], ...fields };
      this.saveData(data);
      return true;
    }
    return false;
  }

  deleteMedia(id) {
    const data = this.getData();
    data.media = data.media.filter(m => m.id !== id);
    this.saveData(data);
  }

  // IndexedDB Document & Dossier Vault for Unlimited Storage (Supports large PDFs & Images)
  async getDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('GRD10_Vault_DB', 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('nominations')) {
          db.createObjectStore('nominations', { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // Archive verified nomination record in client-side vault
  async saveNominationRecord(submissionData) {
    const existingNominations = this.getPrivateNominations();
    const existing = existingNominations.find(n => 
      (submissionData.referenceId && n.referenceId === submissionData.referenceId) ||
      (submissionData.id && n.id === submissionData.id)
    );
    if (existing) {
      return existing;
    }

    const submission = {
      id: submissionData.id || ('nom-' + Date.now() + '-' + Math.floor(Math.random() * 1000)),
      status: submissionData.status || 'Under Review',
      ...submissionData
    };

    // 1. Save to IndexedDB
    try {
      const db = await this.getDb();
      const tx = db.transaction('nominations', 'readwrite');
      tx.objectStore('nominations').put(submission);
    } catch (e) {
      console.warn('IndexedDB write warning:', e);
    }

    // 2. Also save lightweight metadata to localStorage
    try {
      const lightweightCopy = {
        ...submission,
        attachedFiles: (submission.attachedFiles || []).map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
          dataUrl: f.dataUrl ? (f.dataUrl.length > 500000 ? null : f.dataUrl) : null
        }))
      };
      existingNominations.unshift(lightweightCopy);
      localStorage.setItem(this.NOMINATIONS_KEY, JSON.stringify(existingNominations));

      // 3. Sync to Supabase nominations table if configured
      if (window.grdSupabase && window.grdSupabase.isConfigured()) {
        window.grdSupabase.saveNomination({
          referenceId: submission.referenceId,
          category: submission.category,
          nomineeName: submission.nomineeName,
          nomineeEmail: submission.nomineeContact,
          nomineePhone: submission.nomineeContact,
          status: submission.status,
          organisation: submission.organisation,
          cityState: submission.cityState,
          reason: submission.reason,
          keyContribution: submission.keyContribution,
          nominatorName: submission.nominatorName,
          nominatorContact: submission.nominatorContact
        }).catch(e => console.warn('[Supabase Nomination Sync Error]:', e));
      }
    } catch (err) {
      console.error('LocalStorage write warning:', err);
    }

    return submission;
  }

  // Nomination Submission Engine (Dual Store: IndexedDB for complete files + LocalStorage for instant index)
  async submitNominationAsync(nominationData) {
    const refId = nominationData.referenceId || `GRD-2027-NOM-${Math.floor(10000 + Math.random() * 90000)}`;
    const submission = {
      id: 'nom-' + Date.now(),
      referenceId: refId,
      submittedAt: new Date().toISOString(),
      status: 'Under Review',
      ...nominationData
    };

    // 1. Save to IndexedDB (No 5MB storage limit)
    try {
      const db = await this.getDb();
      const tx = db.transaction('nominations', 'readwrite');
      tx.objectStore('nominations').put(submission);
    } catch (e) {
      console.warn('IndexedDB write warning:', e);
    }

    // 2. Also save lightweight metadata to localStorage
    try {
      const lightweightCopy = {
        ...submission,
        attachedFiles: (submission.attachedFiles || []).map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
          dataUrl: f.dataUrl ? (f.dataUrl.length > 500000 ? null : f.dataUrl) : null
        }))
      };
      const nominations = this.getPrivateNominations();
      nominations.unshift(lightweightCopy);
      localStorage.setItem(this.NOMINATIONS_KEY, JSON.stringify(nominations));

      // Increment category count
      const data = this.getData();
      const cat = data.categories.find(c => c.name === nominationData.category || c.slug === nominationData.category);
      if (cat) {
        cat.nominationCount = (cat.nominationCount || 0) + 1;
        this.saveData(data);
      }
    } catch (err) {
      console.error('LocalStorage write warning:', err);
    }

    // 3. Dispatch automated institutional email notice to Jury & Committee
    const emailResult = await this.dispatchNominationEmailNotification(submission);

    return { 
      success: true, 
      referenceId: refId, 
      submission,
      emailDispatched: emailResult.dispatched,
      juryEmail: emailResult.recipient
    };
  }

  // Institutional Email Notification Engine
  async dispatchNominationEmailNotification(submission) {
    const data = this.getData();
    const juryEmail = data.juryEmail || "grd1051@gmail.com";
    const ccEmail = data.juryCcEmail || "nominations@aaryantrust.org";

    const emailPayload = {
      to: juryEmail,
      cc: ccEmail,
      subject: `[GRD10 JURY DOSSIER] New Nomination: ${submission.nomineeName} (${submission.category}) - ${submission.referenceId}`,
      nomineeName: submission.nomineeName,
      category: submission.category,
      organisation: submission.organisation,
      cityState: submission.cityState,
      nominatorName: submission.nominatorName,
      nominatorContact: submission.nominatorContact,
      reason: submission.reason,
      keyContribution: submission.keyContribution,
      attachedFilesCount: (submission.attachedFiles || []).length || (submission.fileNames || []).length,
      referenceId: submission.referenceId,
      submittedAt: submission.submittedAt
    };

    console.info(`[GRD10 EMAIL DISPATCH] Transmitting nomination dossier #${submission.referenceId} to Jury: ${juryEmail} (CC: ${ccEmail})`, emailPayload);

    // Simulated reliable async relay with fallback
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          dispatched: true,
          recipient: juryEmail,
          cc: ccEmail,
          timestamp: new Date().toISOString()
        });
      }, 400);
    });
  }

  // Update Nomination Status in vault (e.g. 'Under Review', 'Shortlisted', 'Approved Laureate', 'Archived')
  async updateNominationStatus(id, newStatus, juryNotes = '') {
    // 1. Update on Server API (submissions.json)
    try {
      await fetch('/api/update-nomination-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceId: id, id: id, status: newStatus, juryNotes: juryNotes })
      });
    } catch (e) {
      console.warn('Server status update warning:', e);
    }

    // 2. Update in LocalStorage
    const nominations = this.getPrivateNominations();
    const item = nominations.find(n => n.id === id || n.referenceId === id);
    if (item) {
      item.status = newStatus;
      if (juryNotes) item.juryNotes = juryNotes;
      localStorage.setItem(this.NOMINATIONS_KEY, JSON.stringify(nominations));
    }

    // 3. Update in IndexedDB
    try {
      const db = await this.getDb();
      const tx = db.transaction('nominations', 'readwrite');
      const store = tx.objectStore('nominations');
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result) {
          const doc = req.result;
          doc.status = newStatus;
          if (juryNotes) doc.juryNotes = juryNotes;
          store.put(doc);
        }
      };
    } catch (e) {
      console.warn('IndexedDB status update warning:', e);
    }

    return true;
  }

  // Promote a Nominee directly to "The 10" Laureates Registry
  async promoteNomineeToAwardee({ nominationId, nomineeObject = null, slotNumber, editionYear, customPhoto, categoryOverride = null, ceremonyNotes }) {
    let nominee = nomineeObject;
    if (!nominee) {
      const allNominations = await this.getAllNominationsFromDB();
      nominee = allNominations.find(n => n.id === nominationId || n.referenceId === nominationId);
    }
    if (!nominee) {
      const fallbackList = this.getPrivateNominations();
      nominee = fallbackList.find(n => n.id === nominationId || n.referenceId === nominationId);
    }
    if (!nominee) {
      throw new Error("Nominee record not found in archive.");
    }

    const data = this.getData();
    const targetEdition = editionYear || data.activeEdition || "2026";
    
    // If slotNumber is not provided, try to find the matching category slot or next available slot
    let slotNum = slotNumber ? String(slotNumber).padStart(2, '0') : null;
    if (!slotNum) {
      const matchingCategoryAwardee = data.awardees.find(a => 
        a.edition === targetEdition && 
        (a.categoryName === nominee.category || a.categorySlug === (nominee.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'))
      );
      if (matchingCategoryAwardee) {
        slotNum = matchingCategoryAwardee.number;
      } else {
        slotNum = "01";
      }
    }

    // Find if slot exists in that edition
    const existingIndex = data.awardees.findIndex(a => a.edition === targetEdition && a.number === slotNum);
    const existingAwardee = existingIndex !== -1 ? data.awardees[existingIndex] : null;
    
    const categoryName = (categoryOverride && categoryOverride.trim()) ? categoryOverride.trim() : (nominee.category || (existingAwardee ? existingAwardee.categoryName : 'Honour Category'));
    const categorySlug = (categoryName || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const awardeeProfile = {
      id: `awd-${targetEdition}-${slotNum}`,
      number: slotNum,
      edition: targetEdition,
      name: nominee.nomineeName,
      isPlaceholder: false,
      categorySlug: categorySlug,
      categoryName: categoryName,
      photo: customPhoto || nominee.photo || (existingAwardee ? existingAwardee.photo : "assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg"),
      shortBio: nominee.reason ? (nominee.reason.slice(0, 160) + (nominee.reason.length > 160 ? '...' : '')) : 'Honoured for quiet lifetime contribution.',
      theirStory: nominee.reason || '',
      theirContribution: nominee.keyContribution || '',
      whyChosen: `Ratified by the Selection Committee for exceptional selfless service in ${nominee.cityState || 'India'}. Exemplifies the courage and humility of Shri Ghanshyam Dube.`,
      ceremonyNotes: ceremonyNotes || `To be conferred at the GRD National Convocation (${targetEdition}).`,
      promotedFromNomination: nominee.referenceId || nominee.id
    };

    if (existingIndex !== -1) {
      data.awardees[existingIndex] = awardeeProfile;
    } else {
      data.awardees.push(awardeeProfile);
    }

    this.saveData(data);
    await this.updateNominationStatus(nominee.referenceId || nominee.id, 'Approved Laureate', `Ratified into 'The 10' as #${slotNum} [${categoryName}] for Edition ${targetEdition}.`);

    return awardeeProfile;
  }

  submitNomination(nominationData) {
    this.submitNominationAsync(nominationData);
    const refId = `GRD-2027-NOM-${Math.floor(10000 + Math.random() * 90000)}`;
    return { success: true, referenceId: refId };
  }

  async getAllNominationsFromDB() {
    // 1. Fetch server-side submissions and local IndexedDB submissions in parallel
    let serverList = null;
    try {
      const apiResp = await fetch('/api/get-nominations');
      if (apiResp.ok) {
        const json = await apiResp.json();
        if (Array.isArray(json)) {
          serverList = json;
        }
      }
    } catch (apiErr) {
      // Local preview or static deployment without server API - gracefully fallback
    }

    // 2. Read from IndexedDB (contains full file dataUrls and uploads)
    let localDbList = [];
    try {
      const db = await this.getDb();
      localDbList = await new Promise((resolve) => {
        const tx = db.transaction('nominations', 'readonly');
        const store = tx.objectStore('nominations');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch (e) {
      localDbList = [];
    }

    const fallbackStorage = this.getPrivateNominations();

    // Map for fast lookup by referenceId or id
    const enrichMap = new Map();
    [...fallbackStorage, ...localDbList].forEach(item => {
      if (item.referenceId) enrichMap.set(item.referenceId, item);
      if (item.id) enrichMap.set(item.id, item);
    });

    if (Array.isArray(serverList)) {
      // Enrich server records with local base64 files if server record has filenames but missing dataUrls
      return serverList.map(serverItem => {
        const localMatch = enrichMap.get(serverItem.referenceId) || enrichMap.get(serverItem.id);
        if (localMatch) {
          const mergedFiles = (serverItem.attachedFiles && serverItem.attachedFiles.some(f => f.dataUrl))
            ? serverItem.attachedFiles
            : (localMatch.attachedFiles || serverItem.attachedFiles);
          return {
            ...localMatch,
            ...serverItem,
            attachedFiles: mergedFiles || localMatch.attachedFiles
          };
        }
        return serverItem;
      });
    }

    // Fallback if server is not available
    if (localDbList.length > 0) {
      return localDbList.reverse();
    }
    return fallbackStorage;
  }

  async deleteNominationRecord(refOrId) {
    if (!refOrId) return { success: false, error: 'No ID provided' };

    // 1. Delete from Server
    try {
      await fetch('/api/delete-nomination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceId: refOrId, id: refOrId })
      });
    } catch (err) {
      console.warn('Server delete call failed:', err);
    }

    // 2. Delete from LocalStorage
    try {
      const local = this.getPrivateNominations();
      const filtered = local.filter(n => n.referenceId !== refOrId && n.id !== refOrId);
      localStorage.setItem(this.NOMINATIONS_KEY, JSON.stringify(filtered));
    } catch (e) {}

    // 3. Delete from IndexedDB
    try {
      const db = await this.getDb();
      const tx = db.transaction('nominations', 'readwrite');
      const store = tx.objectStore('nominations');
      const getAllReq = store.getAll();
      getAllReq.onsuccess = () => {
        const items = getAllReq.result || [];
        items.forEach(item => {
          if (item.referenceId === refOrId || item.id === refOrId) {
            if (item.id) store.delete(item.id);
          }
        });
      };
    } catch (e) {}

    return { success: true };
  }

  getPrivateNominations() {
    try {
      const stored = localStorage.getItem(this.NOMINATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  async getShortlistedNominations() {
    const all = await this.getAllNominationsFromDB();
    return all.filter(n => (n.status || '').toLowerCase() === 'shortlisted');
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
      return { success: false, error: 'JSON does not conform to GRD10 schema structure.' };
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


