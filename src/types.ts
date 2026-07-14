export interface HeroStat {
  name: string;
  value: number; // 0 to 100
  color: string; // Tailwind bg color class
}

export interface ComicPanelData {
  description: string;
  bubbleText: string;
  image?: string; // custom uploaded picture base64 data URL or external URL
}

export interface ComicConfig {
  friendName: string;
  age: number;
  heroTitle: string;
  coverId: string; // 'spiderman' | 'avengers' | 'xmen' | 'cap'
  musicType: 'youtube' | 'mp3' | 'none';
  musicUrl: string; // YouTube Video ID or direct MP3 link
  endButtonText: string;
  endButtonUrl: string;
  
  // Custom panels
  panel1: ComicPanelData; // Origin Story
  panel2: {
    description: string;
    powerName: string;
    stats: HeroStat[];
    image?: string; // custom profile/hero picture
  }; // Superhero stats
  panel3: ComicPanelData; // Avengers Assembly
  panel4: {
    title: string;
    description: string;
    image?: string; // custom celebration picture
  }; // Splash celebration
}

export interface ComicCoverTemplate {
  id: string;
  title: string;
  coverImage: string;
  accentColor: string;
  subTitle: string;
  historicalDesc: string;
}

export const COVER_TEMPLATES: ComicCoverTemplate[] = [
  {
    id: 'spiderman',
    title: 'THE AMAZING SPIDER-MAN',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/a/a3/Amazing_Fantasy_15.jpg',
    accentColor: '#ef4444', // Red
    subTitle: 'INTRODUCING THE SENSATIONAL NEW SUPERHERO!',
    historicalDesc: 'Based on Amazing Fantasy #15 (1962) - First appearance of Spider-Man.'
  },
  {
    id: 'avengers',
    title: 'THE AVENGERS',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/5/5e/TheAvengers1.jpg',
    accentColor: '#eab308', // Gold/Yellow
    subTitle: 'EARTH\'S MIGHTIEST HEROES ASSEMBLE!',
    historicalDesc: 'Based on The Avengers #1 (1963) - First Avengers team-up.'
  },
  {
    id: 'xmen',
    title: 'GIANT-SIZE X-MEN',
    coverImage: 'https://upload.wikimedia.org/wikipedia/en/c/c5/GiantSizeXmen1.jpg',
    accentColor: '#3b82f6', // Blue
    subTitle: 'DEADLY GENESIS! AN ALL-NEW, ALL-DIFFERENT TEAM!',
    historicalDesc: 'Based on Giant-Size X-Men #1 (1975) - Wolverine & Storm join.'
  },
  {
    id: 'cap',
    title: 'CAPTAIN AMERICA',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Captain_America_Comics_1.jpg',
    accentColor: '#10b981', // Green
    subTitle: '45 PAGES OF CAPTAIN AMERICA FIGHTING EVIL!',
    historicalDesc: 'Based on Captain America Comics #1 (1941) - Historic golden age cover.'
  }
];

export const DEFAULT_CONFIG: ComicConfig = {
  friendName: 'Alex',
  age: 21,
  heroTitle: 'THE INCREDIBLE ALEX',
  coverId: 'spiderman',
  musicType: 'youtube',
  musicUrl: '8MgnYm0Gv2k', // Avengers Theme video ID
  endButtonText: 'CLAIM YOUR ULTIMATE REWARD!',
  endButtonUrl: 'https://marvel.com',
  panel1: {
    description: 'IT WAS AN ORDINARY BIRTHDAY IN THE METROPOLIS, UNTIL A SUDDEN RUSH OF TIME-SPACE ENERGY COLLIDED WITH AN INFUSION OF SUGAR, COFFEE, AND ACCUMULATED WISDOM...',
    bubbleText: 'BY THE HOARY HOSTS OF HOGGOTH! I CAN FEEL MY BIRTHDAY LEVELS INCREASING BY 1000%!'
  },
  panel2: {
    description: 'THE SECTOR SCANNERS REVEAL AN ENTIRELY UNIQUE GENETIC SIGNATURE! OUR TARGET HAS EVOLVED PAST NORMAL HUMAN CAPABILITIES.',
    powerName: 'UNLIMITED AWESOMENESS & COFFEE TRANSCENDENCE',
    stats: [
      { name: 'BIRTHDAY SPIRIT', value: 95, color: 'bg-red-500' },
      { name: 'HUMOR LEVEL', value: 88, color: 'bg-amber-500' },
      { name: 'COFFEE INTAKE', value: 99, color: 'bg-amber-900' },
      { name: 'SUPERPOWER LEVEL', value: 92, color: 'bg-blue-500' },
      { name: 'LAZINESS CONTROL', value: 45, color: 'bg-purple-500' }
    ]
  },
  panel3: {
    description: 'FROM THE S.H.I.E.L.D. HELICARRIER TO THE AVENGERS COMPOUND, THE CALL GOES OUT! RECRUITMENT PROTOCOLS ARE INITIATED FOR THE COOLEST PERSON ON EARTH!',
    bubbleText: 'WE HAVE BEEN WATCHING YOUR CAREER WITH GREAT INTEREST, CADET. ASSEMBLE!'
  },
  panel4: {
    title: 'HAPPY BIRTHDAY!',
    description: 'THE WHOLE UNIVERSE CELEBRATES YOUR EXCELLENCE TODAY! MAY YOUR LUCK BE EXTRAORDINARY, YOUR GIFTS AWESOME, AND YOUR SPECIAL ACTION LINK WAITING BELOW TO BE CLICKED!'
  }
};
