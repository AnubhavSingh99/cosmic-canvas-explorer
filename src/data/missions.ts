// Curated mission data for NASA Explorer
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "launch" | "milestone" | "discovery" | "status";
  imageSearchQuery?: string;
}

export interface Mission {
  id: string;
  name: string;
  fullName: string;
  summary: string;
  launchYear: number;
  endYear?: number;
  target: string;
  agency: string;
  status: "active" | "completed" | "lost" | "planned";
  imageSearchQuery: string;
  timeline: TimelineEvent[];
}

export const missions: Mission[] = [
  {
    id: "apollo-11",
    name: "Apollo 11",
    fullName: "Apollo 11 Lunar Landing Mission",
    summary: "The first crewed mission to land on the Moon. Astronauts Neil Armstrong and Buzz Aldrin became the first humans to walk on the lunar surface on July 20, 1969, while Michael Collins orbited above.",
    launchYear: 1969,
    endYear: 1969,
    target: "Moon",
    agency: "NASA",
    status: "completed",
    imageSearchQuery: "Apollo 11",
    timeline: [
      {
        id: "a11-1",
        date: "1969-07-16",
        title: "Launch from Kennedy Space Center",
        description: "Saturn V rocket lifts off carrying Armstrong, Aldrin, and Collins toward the Moon.",
        type: "launch",
        imageSearchQuery: "Apollo 11 launch"
      },
      {
        id: "a11-2",
        date: "1969-07-19",
        title: "Lunar Orbit Insertion",
        description: "Apollo 11 enters orbit around the Moon after a 3-day journey.",
        type: "milestone",
        imageSearchQuery: "Apollo 11 lunar orbit"
      },
      {
        id: "a11-3",
        date: "1969-07-20",
        title: "Eagle Lands on the Moon",
        description: "The Lunar Module 'Eagle' lands in the Sea of Tranquility. Armstrong announces: 'The Eagle has landed.'",
        type: "milestone",
        imageSearchQuery: "Apollo 11 landing"
      },
      {
        id: "a11-4",
        date: "1969-07-20",
        title: "First Steps on the Moon",
        description: "Neil Armstrong becomes the first human to walk on the Moon, followed by Buzz Aldrin 19 minutes later.",
        type: "discovery",
        imageSearchQuery: "Apollo 11 moonwalk"
      },
      {
        id: "a11-5",
        date: "1969-07-24",
        title: "Safe Return to Earth",
        description: "The crew splashes down in the Pacific Ocean, completing humanity's greatest voyage.",
        type: "status",
        imageSearchQuery: "Apollo 11 splashdown"
      }
    ]
  },
  {
    id: "curiosity",
    name: "Curiosity",
    fullName: "Mars Science Laboratory Curiosity Rover",
    summary: "A car-sized rover exploring Gale Crater on Mars since 2012. Curiosity has discovered evidence of ancient water and organic molecules, fundamentally changing our understanding of Mars's habitability.",
    launchYear: 2011,
    target: "Mars",
    agency: "NASA/JPL",
    status: "active",
    imageSearchQuery: "Curiosity rover Mars",
    timeline: [
      {
        id: "cur-1",
        date: "2011-11-26",
        title: "Launch from Cape Canaveral",
        description: "Atlas V rocket launches Curiosity on its 8-month journey to Mars.",
        type: "launch",
        imageSearchQuery: "Curiosity launch"
      },
      {
        id: "cur-2",
        date: "2012-08-06",
        title: "Seven Minutes of Terror",
        description: "Curiosity lands on Mars using the innovative sky crane system in Gale Crater.",
        type: "milestone",
        imageSearchQuery: "Curiosity landing Mars"
      },
      {
        id: "cur-3",
        date: "2013-03-12",
        title: "Evidence of Ancient Water",
        description: "Analysis of rock samples confirms Mars once had conditions suitable for microbial life.",
        type: "discovery",
        imageSearchQuery: "Curiosity water discovery"
      },
      {
        id: "cur-4",
        date: "2014-09-11",
        title: "Reaches Mount Sharp",
        description: "Curiosity arrives at the base of Aeolis Mons (Mount Sharp), its primary science destination.",
        type: "milestone",
        imageSearchQuery: "Curiosity Mount Sharp"
      },
      {
        id: "cur-5",
        date: "2018-06-07",
        title: "Organic Molecules Detected",
        description: "NASA announces discovery of complex organic molecules in ancient Martian rocks.",
        type: "discovery",
        imageSearchQuery: "Curiosity organic molecules"
      },
      {
        id: "cur-6",
        date: "2024-01-01",
        title: "Still Exploring",
        description: "After 12+ years, Curiosity continues to climb Mount Sharp and make discoveries.",
        type: "status",
        imageSearchQuery: "Curiosity rover 2024"
      }
    ]
  },
  {
    id: "perseverance",
    name: "Perseverance",
    fullName: "Mars 2020 Perseverance Rover",
    summary: "NASA's most advanced Mars rover, searching for signs of ancient microbial life and collecting samples for future return to Earth. Accompanied by the Ingenuity helicopter, the first aircraft on another planet.",
    launchYear: 2020,
    target: "Mars",
    agency: "NASA/JPL",
    status: "active",
    imageSearchQuery: "Perseverance rover Mars",
    timeline: [
      {
        id: "per-1",
        date: "2020-07-30",
        title: "Launch During Pandemic",
        description: "Perseverance launches from Cape Canaveral despite global pandemic challenges.",
        type: "launch",
        imageSearchQuery: "Perseverance launch"
      },
      {
        id: "per-2",
        date: "2021-02-18",
        title: "Landing in Jezero Crater",
        description: "Perseverance lands in an ancient lake bed, a prime location to search for biosignatures.",
        type: "milestone",
        imageSearchQuery: "Perseverance landing"
      },
      {
        id: "per-3",
        date: "2021-04-19",
        title: "Ingenuity's First Flight",
        description: "The Ingenuity helicopter achieves the first powered, controlled flight on another planet.",
        type: "discovery",
        imageSearchQuery: "Ingenuity helicopter Mars"
      },
      {
        id: "per-4",
        date: "2021-09-06",
        title: "First Sample Collected",
        description: "Perseverance successfully drills and stores its first rock sample for future return.",
        type: "milestone",
        imageSearchQuery: "Perseverance sample collection"
      },
      {
        id: "per-5",
        date: "2022-04-01",
        title: "Ancient River Delta Explored",
        description: "Rover begins investigating sedimentary rocks in the Jezero delta formation.",
        type: "discovery",
        imageSearchQuery: "Perseverance delta"
      },
      {
        id: "per-6",
        date: "2024-01-01",
        title: "Sample Cache Complete",
        description: "Over 20 samples collected and cached for the Mars Sample Return mission.",
        type: "status",
        imageSearchQuery: "Perseverance samples"
      }
    ]
  },
  {
    id: "voyager-1",
    name: "Voyager 1",
    fullName: "Voyager 1 Interstellar Mission",
    summary: "The farthest human-made object from Earth, now in interstellar space. Launched in 1977, Voyager 1 explored Jupiter and Saturn before heading toward the stars, carrying the Golden Record for any future finders.",
    launchYear: 1977,
    target: "Outer Planets / Interstellar",
    agency: "NASA/JPL",
    status: "active",
    imageSearchQuery: "Voyager 1",
    timeline: [
      {
        id: "voy-1",
        date: "1977-09-05",
        title: "Launch from Cape Canaveral",
        description: "Voyager 1 begins its grand tour of the outer solar system.",
        type: "launch",
        imageSearchQuery: "Voyager launch"
      },
      {
        id: "voy-2",
        date: "1979-03-05",
        title: "Jupiter Flyby",
        description: "Voyager 1 discovers Jupiter's ring system and volcanic activity on Io.",
        type: "discovery",
        imageSearchQuery: "Voyager Jupiter"
      },
      {
        id: "voy-3",
        date: "1980-11-12",
        title: "Saturn Encounter",
        description: "Close flyby of Saturn reveals complexity of its rings and examines Titan's atmosphere.",
        type: "discovery",
        imageSearchQuery: "Voyager Saturn"
      },
      {
        id: "voy-4",
        date: "1990-02-14",
        title: "Pale Blue Dot",
        description: "Voyager 1 takes the famous 'Pale Blue Dot' image of Earth from 6 billion km away.",
        type: "milestone",
        imageSearchQuery: "Pale Blue Dot"
      },
      {
        id: "voy-5",
        date: "2012-08-25",
        title: "Enters Interstellar Space",
        description: "Voyager 1 becomes the first human-made object to enter interstellar space.",
        type: "discovery",
        imageSearchQuery: "Voyager interstellar"
      },
      {
        id: "voy-6",
        date: "2024-01-01",
        title: "Still Transmitting",
        description: "Over 46 years later, Voyager 1 continues sending data from 24+ billion km away.",
        type: "status",
        imageSearchQuery: "Voyager 1 distance"
      }
    ]
  },
  {
    id: "hubble",
    name: "Hubble",
    fullName: "Hubble Space Telescope",
    summary: "The most famous space telescope in history. Since 1990, Hubble has revolutionized astronomy with stunning images and discoveries, from the age of the universe to exoplanet atmospheres.",
    launchYear: 1990,
    target: "Earth Orbit / Deep Space",
    agency: "NASA/ESA",
    status: "active",
    imageSearchQuery: "Hubble Space Telescope",
    timeline: [
      {
        id: "hub-1",
        date: "1990-04-24",
        title: "Shuttle Discovery Deployment",
        description: "Hubble is deployed from Space Shuttle Discovery into low Earth orbit.",
        type: "launch",
        imageSearchQuery: "Hubble launch shuttle"
      },
      {
        id: "hub-2",
        date: "1993-12-02",
        title: "First Servicing Mission",
        description: "Astronauts install corrective optics to fix the flawed primary mirror.",
        type: "milestone",
        imageSearchQuery: "Hubble servicing mission"
      },
      {
        id: "hub-3",
        date: "1995-12-18",
        title: "Hubble Deep Field",
        description: "10-day exposure reveals thousands of galaxies in a tiny patch of sky.",
        type: "discovery",
        imageSearchQuery: "Hubble Deep Field"
      },
      {
        id: "hub-4",
        date: "1998-01-01",
        title: "Accelerating Universe",
        description: "Hubble observations help discover that the universe's expansion is accelerating.",
        type: "discovery",
        imageSearchQuery: "Hubble supernova"
      },
      {
        id: "hub-5",
        date: "2009-05-11",
        title: "Final Servicing Mission",
        description: "SM4 installs new instruments, extending Hubble's life by decades.",
        type: "milestone",
        imageSearchQuery: "Hubble SM4"
      },
      {
        id: "hub-6",
        date: "2024-01-01",
        title: "34 Years of Discovery",
        description: "Hubble continues operating alongside its successor, the James Webb Space Telescope.",
        type: "status",
        imageSearchQuery: "Hubble 2024"
      }
    ]
  },
  {
    id: "jwst",
    name: "James Webb",
    fullName: "James Webb Space Telescope",
    summary: "The most powerful space telescope ever built, observing the universe in infrared light. Webb can see the first galaxies, peer inside stellar nurseries, and analyze exoplanet atmospheres like never before.",
    launchYear: 2021,
    target: "L2 Point / Deep Space",
    agency: "NASA/ESA/CSA",
    status: "active",
    imageSearchQuery: "James Webb Space Telescope",
    timeline: [
      {
        id: "jwst-1",
        date: "2021-12-25",
        title: "Christmas Day Launch",
        description: "Ariane 5 rocket launches Webb on its million-mile journey to L2.",
        type: "launch",
        imageSearchQuery: "James Webb launch"
      },
      {
        id: "jwst-2",
        date: "2022-01-08",
        title: "Mirror Deployment Complete",
        description: "All 18 gold-plated mirror segments successfully unfold in space.",
        type: "milestone",
        imageSearchQuery: "James Webb mirror"
      },
      {
        id: "jwst-3",
        date: "2022-07-12",
        title: "First Full-Color Images",
        description: "NASA releases Webb's first stunning images, including the deepest infrared view of the universe.",
        type: "discovery",
        imageSearchQuery: "James Webb first images"
      },
      {
        id: "jwst-4",
        date: "2022-09-01",
        title: "Exoplanet Atmosphere Analysis",
        description: "Webb detects CO2 in an exoplanet atmosphere for the first time.",
        type: "discovery",
        imageSearchQuery: "James Webb exoplanet"
      },
      {
        id: "jwst-5",
        date: "2023-01-01",
        title: "Most Distant Galaxies",
        description: "Webb discovers galaxies from just 300 million years after the Big Bang.",
        type: "discovery",
        imageSearchQuery: "James Webb deep field"
      },
      {
        id: "jwst-6",
        date: "2024-01-01",
        title: "Revolutionizing Astronomy",
        description: "Webb continues to rewrite textbooks with unprecedented discoveries.",
        type: "status",
        imageSearchQuery: "James Webb 2024"
      }
    ]
  },
  {
    id: "cassini",
    name: "Cassini",
    fullName: "Cassini-Huygens Mission to Saturn",
    summary: "A joint NASA/ESA mission that spent 13 years studying Saturn, its rings, and moons. Cassini discovered ocean worlds at Enceladus and Titan, forever changing our search for life beyond Earth.",
    launchYear: 1997,
    endYear: 2017,
    target: "Saturn",
    agency: "NASA/ESA/ASI",
    status: "completed",
    imageSearchQuery: "Cassini Saturn",
    timeline: [
      {
        id: "cas-1",
        date: "1997-10-15",
        title: "Launch to Saturn",
        description: "Cassini begins its 7-year journey to the ringed planet.",
        type: "launch",
        imageSearchQuery: "Cassini launch"
      },
      {
        id: "cas-2",
        date: "2004-07-01",
        title: "Saturn Orbit Insertion",
        description: "Cassini becomes the first spacecraft to orbit Saturn.",
        type: "milestone",
        imageSearchQuery: "Cassini Saturn orbit"
      },
      {
        id: "cas-3",
        date: "2005-01-14",
        title: "Huygens Lands on Titan",
        description: "The Huygens probe lands on Titan, revealing a world of methane lakes.",
        type: "discovery",
        imageSearchQuery: "Huygens Titan landing"
      },
      {
        id: "cas-4",
        date: "2005-07-14",
        title: "Enceladus Water Plumes",
        description: "Cassini discovers water ice geysers erupting from Enceladus's south pole.",
        type: "discovery",
        imageSearchQuery: "Enceladus plumes"
      },
      {
        id: "cas-5",
        date: "2017-04-22",
        title: "Grand Finale Begins",
        description: "Cassini begins 22 daring dives between Saturn and its rings.",
        type: "milestone",
        imageSearchQuery: "Cassini grand finale"
      },
      {
        id: "cas-6",
        date: "2017-09-15",
        title: "Final Plunge into Saturn",
        description: "Cassini ends its mission by diving into Saturn's atmosphere, transmitting data until the end.",
        type: "status",
        imageSearchQuery: "Cassini end of mission"
      }
    ]
  },
  {
    id: "new-horizons",
    name: "New Horizons",
    fullName: "New Horizons Pluto Mission",
    summary: "The first spacecraft to explore Pluto and the Kuiper Belt. New Horizons revealed Pluto as a complex world with mountains, glaciers, and a heart-shaped nitrogen ice plain.",
    launchYear: 2006,
    target: "Pluto / Kuiper Belt",
    agency: "NASA",
    status: "active",
    imageSearchQuery: "New Horizons Pluto",
    timeline: [
      {
        id: "nh-1",
        date: "2006-01-19",
        title: "Fastest Launch Ever",
        description: "New Horizons launches as the fastest spacecraft ever, heading to Pluto.",
        type: "launch",
        imageSearchQuery: "New Horizons launch"
      },
      {
        id: "nh-2",
        date: "2007-02-28",
        title: "Jupiter Gravity Assist",
        description: "Flyby of Jupiter boosts speed and tests instruments on Jovian moons.",
        type: "milestone",
        imageSearchQuery: "New Horizons Jupiter"
      },
      {
        id: "nh-3",
        date: "2015-07-14",
        title: "Pluto Flyby",
        description: "New Horizons reveals Pluto's heart-shaped glacier and complex geology.",
        type: "discovery",
        imageSearchQuery: "New Horizons Pluto flyby"
      },
      {
        id: "nh-4",
        date: "2019-01-01",
        title: "Arrokoth Encounter",
        description: "Flyby of Arrokoth (formerly Ultima Thule), the most distant object ever explored.",
        type: "discovery",
        imageSearchQuery: "Arrokoth New Horizons"
      },
      {
        id: "nh-5",
        date: "2024-01-01",
        title: "Into the Kuiper Belt",
        description: "New Horizons continues exploring the outer solar system, now over 50 AU from the Sun.",
        type: "status",
        imageSearchQuery: "New Horizons Kuiper Belt"
      }
    ]
  }
];

// Get all unique targets/planets
export const getTargets = (): string[] => {
  const targets = new Set(missions.map(m => m.target));
  return Array.from(targets).sort();
};

// Get missions by target
export const getMissionsByTarget = (target: string): Mission[] => {
  return missions.filter(m => m.target === target);
};

// Get mission by ID
export const getMissionById = (id: string): Mission | undefined => {
  return missions.find(m => m.id === id);
};

// Get missions related to a search term
export const getMissionsForImage = (title: string, description: string): Mission[] => {
  const text = `${title} ${description}`.toLowerCase();
  return missions.filter(m => 
    text.includes(m.name.toLowerCase()) || 
    text.includes(m.target.toLowerCase()) ||
    m.timeline.some(t => text.includes(t.title.toLowerCase()))
  );
};
