// Historical space events by day of year
export interface SpaceEvent {
  id: string;
  date: string; // MM-DD format
  year: number;
  title: string;
  description: string;
  category: "launch" | "landing" | "discovery" | "milestone" | "tragedy";
  imageSearchQuery?: string;
}

export const spaceEvents: SpaceEvent[] = [
  // January
  { id: "e1", date: "01-01", year: 2019, title: "New Horizons Flyby of Arrokoth", description: "The farthest exploration of a solar system object", category: "discovery", imageSearchQuery: "Arrokoth New Horizons" },
  { id: "e2", date: "01-04", year: 2004, title: "Spirit Rover Lands on Mars", description: "First of the twin Mars Exploration Rovers touches down", category: "landing", imageSearchQuery: "Spirit rover landing" },
  { id: "e3", date: "01-14", year: 2005, title: "Huygens Probe Lands on Titan", description: "First landing in the outer solar system", category: "landing", imageSearchQuery: "Huygens Titan" },
  { id: "e4", date: "01-19", year: 2006, title: "New Horizons Launches to Pluto", description: "Fastest spacecraft ever launched begins 9-year journey", category: "launch", imageSearchQuery: "New Horizons launch" },
  { id: "e5", date: "01-27", year: 1967, title: "Apollo 1 Fire", description: "Three astronauts lost during launch pad test", category: "tragedy", imageSearchQuery: "Apollo 1 memorial" },
  { id: "e6", date: "01-28", year: 1986, title: "Challenger Disaster", description: "Space Shuttle Challenger breaks apart 73 seconds after launch", category: "tragedy", imageSearchQuery: "Challenger memorial" },
  { id: "e7", date: "01-31", year: 1958, title: "Explorer 1 Launches", description: "First U.S. satellite discovers Van Allen radiation belts", category: "launch", imageSearchQuery: "Explorer 1" },
  
  // February
  { id: "e8", date: "02-01", year: 2003, title: "Columbia Disaster", description: "Space Shuttle Columbia lost during reentry", category: "tragedy", imageSearchQuery: "Columbia memorial" },
  { id: "e9", date: "02-14", year: 1990, title: "Pale Blue Dot Photo", description: "Voyager 1 photographs Earth from 6 billion km", category: "milestone", imageSearchQuery: "Pale Blue Dot" },
  { id: "e10", date: "02-18", year: 2021, title: "Perseverance Lands on Mars", description: "NASA's most advanced rover lands in Jezero Crater", category: "landing", imageSearchQuery: "Perseverance landing" },
  { id: "e11", date: "02-20", year: 1962, title: "John Glenn Orbits Earth", description: "First American to orbit Earth aboard Friendship 7", category: "milestone", imageSearchQuery: "John Glenn Mercury" },
  
  // March
  { id: "e12", date: "03-02", year: 1972, title: "Pioneer 10 Launches", description: "First spacecraft to travel through the asteroid belt", category: "launch", imageSearchQuery: "Pioneer 10" },
  { id: "e13", date: "03-18", year: 1965, title: "First Spacewalk", description: "Alexei Leonov performs first EVA in history", category: "milestone", imageSearchQuery: "Alexei Leonov spacewalk" },
  
  // April
  { id: "e14", date: "04-12", year: 1961, title: "Yuri Gagarin Orbits Earth", description: "First human in space aboard Vostok 1", category: "milestone", imageSearchQuery: "Yuri Gagarin" },
  { id: "e15", date: "04-12", year: 1981, title: "First Space Shuttle Launch", description: "Columbia begins the Space Shuttle era", category: "launch", imageSearchQuery: "STS-1 Columbia" },
  { id: "e16", date: "04-19", year: 2021, title: "Ingenuity's First Flight", description: "First powered flight on another planet", category: "milestone", imageSearchQuery: "Ingenuity helicopter" },
  { id: "e17", date: "04-24", year: 1990, title: "Hubble Space Telescope Deployed", description: "World's most famous telescope begins operations", category: "launch", imageSearchQuery: "Hubble deployment" },
  
  // May
  { id: "e18", date: "05-05", year: 1961, title: "Alan Shepard in Space", description: "First American in space aboard Freedom 7", category: "milestone", imageSearchQuery: "Alan Shepard Mercury" },
  { id: "e19", date: "05-25", year: 2008, title: "Phoenix Lands on Mars", description: "First successful landing in Mars polar region", category: "landing", imageSearchQuery: "Phoenix Mars lander" },
  { id: "e20", date: "05-30", year: 2020, title: "SpaceX Crew Dragon Demo-2", description: "First crewed commercial spacecraft to ISS", category: "milestone", imageSearchQuery: "Crew Dragon Demo-2" },
  
  // June
  { id: "e21", date: "06-16", year: 1963, title: "Valentina Tereshkova in Space", description: "First woman in space aboard Vostok 6", category: "milestone", imageSearchQuery: "Valentina Tereshkova" },
  { id: "e22", date: "06-18", year: 1983, title: "Sally Ride in Space", description: "First American woman in space aboard Challenger", category: "milestone", imageSearchQuery: "Sally Ride" },
  
  // July
  { id: "e23", date: "07-04", year: 1997, title: "Mars Pathfinder Lands", description: "First rover (Sojourner) explores Mars surface", category: "landing", imageSearchQuery: "Mars Pathfinder Sojourner" },
  { id: "e24", date: "07-14", year: 2015, title: "New Horizons Reaches Pluto", description: "First spacecraft to explore Pluto up close", category: "discovery", imageSearchQuery: "New Horizons Pluto" },
  { id: "e25", date: "07-16", year: 1969, title: "Apollo 11 Launches", description: "Mission to first Moon landing begins", category: "launch", imageSearchQuery: "Apollo 11 launch" },
  { id: "e26", date: "07-20", year: 1969, title: "First Moon Landing", description: "Neil Armstrong and Buzz Aldrin walk on the Moon", category: "landing", imageSearchQuery: "Apollo 11 Moon landing" },
  { id: "e27", date: "07-20", year: 1976, title: "Viking 1 Lands on Mars", description: "First successful Mars landing", category: "landing", imageSearchQuery: "Viking 1 Mars" },
  
  // August
  { id: "e28", date: "08-06", year: 2012, title: "Curiosity Lands on Mars", description: "Car-sized rover lands using sky crane", category: "landing", imageSearchQuery: "Curiosity landing" },
  { id: "e29", date: "08-20", year: 1977, title: "Voyager 2 Launches", description: "Grand Tour of outer planets begins", category: "launch", imageSearchQuery: "Voyager 2 launch" },
  { id: "e30", date: "08-25", year: 1989, title: "Voyager 2 at Neptune", description: "First and only Neptune flyby", category: "discovery", imageSearchQuery: "Voyager Neptune" },
  { id: "e31", date: "08-25", year: 2012, title: "Voyager 1 Enters Interstellar Space", description: "First human-made object to leave the solar system", category: "milestone", imageSearchQuery: "Voyager interstellar" },
  
  // September
  { id: "e32", date: "09-05", year: 1977, title: "Voyager 1 Launches", description: "Begins journey to Jupiter, Saturn, and beyond", category: "launch", imageSearchQuery: "Voyager 1 launch" },
  { id: "e33", date: "09-15", year: 2017, title: "Cassini Grand Finale", description: "Cassini plunges into Saturn after 13 years", category: "milestone", imageSearchQuery: "Cassini end of mission" },
  
  // October
  { id: "e34", date: "10-04", year: 1957, title: "Sputnik 1 Launches", description: "First artificial satellite begins the Space Age", category: "launch", imageSearchQuery: "Sputnik" },
  { id: "e35", date: "10-15", year: 1997, title: "Cassini Launches to Saturn", description: "Begins 7-year journey to the ringed planet", category: "launch", imageSearchQuery: "Cassini launch" },
  
  // November
  { id: "e36", date: "11-03", year: 1957, title: "Laika in Space", description: "First animal to orbit Earth aboard Sputnik 2", category: "milestone", imageSearchQuery: "Laika Sputnik 2" },
  { id: "e37", date: "11-12", year: 2014, title: "Philae Lands on Comet", description: "First landing on a comet (67P)", category: "landing", imageSearchQuery: "Philae comet landing" },
  { id: "e38", date: "11-26", year: 2011, title: "Curiosity Launches", description: "Mars Science Laboratory begins journey to Mars", category: "launch", imageSearchQuery: "Curiosity launch" },
  
  // December
  { id: "e39", date: "12-07", year: 1972, title: "Blue Marble Photo", description: "Apollo 17 captures iconic Earth photo", category: "milestone", imageSearchQuery: "Blue Marble Apollo 17" },
  { id: "e40", date: "12-11", year: 1972, title: "Last Moon Landing", description: "Apollo 17 astronauts explore the lunar surface", category: "landing", imageSearchQuery: "Apollo 17 Moon" },
  { id: "e41", date: "12-25", year: 2021, title: "James Webb Launches", description: "Most powerful space telescope begins journey to L2", category: "launch", imageSearchQuery: "James Webb launch" }
];

// Get events for a specific date (MM-DD format)
export const getEventsForDate = (monthDay: string): SpaceEvent[] => {
  return spaceEvents.filter(e => e.date === monthDay);
};

// Get events for a specific month
export const getEventsForMonth = (month: string): SpaceEvent[] => {
  return spaceEvents.filter(e => e.date.startsWith(month));
};

// Get all unique categories
export const getCategories = (): string[] => {
  const categories = new Set(spaceEvents.map(e => e.category));
  return Array.from(categories).sort();
};
