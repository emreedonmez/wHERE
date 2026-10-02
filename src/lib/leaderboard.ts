export type LeaderboardEntry = {
  id: string;
  username: string;
  score: number;
  isBot: boolean;
};

export type LeaderboardResult = {
  entry: LeaderboardEntry;
  leaderboard: LeaderboardEntry[];
  rank: number;
};

const LEADERBOARD_KEY =
  "turkey-map-game-leaderboard";

const MAX_STORED_ENTRIES = 100;

const BOT_ENTRIES: LeaderboardEntry[] = [
  {
    id: "bot-001",
    username: "MapMaster",
    score: 492,
    isBot: true,
  },
  {
    id: "bot-002",
    username: "GeoWizard",
    score: 478,
    isBot: true,
  },
  {
    id: "bot-003",
    username: "AnatoliaPro",
    score: 461,
    isBot: true,
  },
  {
    id: "bot-004",
    username: "AtlasHunter",
    score: 447,
    isBot: true,
  },
  {
    id: "bot-005",
    username: "TravelFox",
    score: 425,
    isBot: true,
  },
  {
    id: "bot-006",
    username: "GuessMaster",
    score: 401,
    isBot: true,
  },
  {
    id: "bot-007",
    username: "NorthStar",
    score: 389,
    isBot: true,
  },
  {
    id: "bot-008",
    username: "PixelPilot",
    score: 362,
    isBot: true,
  },
  {
    id: "bot-009",
    username: "RouteKing",
    score: 340,
    isBot: true,
  },
  {
    id: "bot-010",
    username: "MapExplorer",
    score: 318,
    isBot: true,
  },
];

function sortLeaderboard(
  entries: LeaderboardEntry[],
): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return a.username.localeCompare(
      b.username,
    );
  });
}

function isValidEntry(
  entry: unknown,
): entry is LeaderboardEntry {
  if (
    typeof entry !== "object" ||
    entry === null
  ) {
    return false;
  }

  const candidate =
    entry as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.username === "string" &&
    typeof candidate.score === "number" &&
    typeof candidate.isBot === "boolean"
  );
}

export function getLeaderboard(): LeaderboardEntry[] {
  const storedData =
    window.localStorage.getItem(
      LEADERBOARD_KEY,
    );

  if (!storedData) {
    const initialLeaderboard =
      sortLeaderboard(BOT_ENTRIES);

    window.localStorage.setItem(
      LEADERBOARD_KEY,
      JSON.stringify(initialLeaderboard),
    );

    return initialLeaderboard;
  }

  try {
    const parsedData: unknown =
      JSON.parse(storedData);

    if (
      !Array.isArray(parsedData) ||
      !parsedData.every(isValidEntry)
    ) {
      throw new Error(
        "Invalid leaderboard data",
      );
    }

    return sortLeaderboard(parsedData);
  } catch {
    const resetLeaderboard =
      sortLeaderboard(BOT_ENTRIES);

    window.localStorage.setItem(
      LEADERBOARD_KEY,
      JSON.stringify(resetLeaderboard),
    );

    return resetLeaderboard;
  }
}

export function getTopLeaderboard(): LeaderboardEntry[] {
  return getLeaderboard().slice(0, 10);
}

export function addLeaderboardEntry(
  username: string,
  score: number,
): LeaderboardResult {
  const cleanUsername = username
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 20);

  const currentLeaderboard =
    getLeaderboard();

  const entry: LeaderboardEntry = {
    id:
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    username: cleanUsername,
    score,
    isBot: false,
  };

  const updatedLeaderboard = sortLeaderboard([
    ...currentLeaderboard,
    entry,
  ]).slice(0, MAX_STORED_ENTRIES);

  window.localStorage.setItem(
    LEADERBOARD_KEY,
    JSON.stringify(updatedLeaderboard),
  );

  const rank =
    updatedLeaderboard.findIndex(
      (leaderboardEntry) =>
        leaderboardEntry.id === entry.id,
    ) + 1;

  return {
    entry,
    leaderboard: updatedLeaderboard.slice(
      0,
      10,
    ),
    rank,
  };
}