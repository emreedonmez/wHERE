export type GameStatistics = {
  gamesPlayed: number;
  totalScore: number;
  bestScore: number;
  bestRoundScore: number;
};

const STATISTICS_KEY =
  "turkey-map-game-statistics";

const DEFAULT_STATISTICS: GameStatistics = {
  gamesPlayed: 0,
  totalScore: 0,
  bestScore: 0,
  bestRoundScore: 0,
};

function isValidStatistics(
  data: unknown,
): data is GameStatistics {
  if (
    typeof data !== "object" ||
    data === null
  ) {
    return false;
  }

  const candidate =
    data as Record<string, unknown>;

  return (
    typeof candidate.gamesPlayed === "number" &&
    typeof candidate.totalScore === "number" &&
    typeof candidate.bestScore === "number" &&
    typeof candidate.bestRoundScore === "number" &&
    candidate.gamesPlayed >= 0 &&
    candidate.totalScore >= 0 &&
    candidate.bestScore >= 0 &&
    candidate.bestRoundScore >= 0
  );
}

export function getStatistics(): GameStatistics {
  const storedData =
    window.localStorage.getItem(
      STATISTICS_KEY,
    );

  if (!storedData) {
    window.localStorage.setItem(
      STATISTICS_KEY,
      JSON.stringify(DEFAULT_STATISTICS),
    );

    return DEFAULT_STATISTICS;
  }

  try {
    const parsedData: unknown =
      JSON.parse(storedData);

    if (!isValidStatistics(parsedData)) {
      throw new Error(
        "Invalid statistics data",
      );
    }

    return parsedData;
  } catch {
    window.localStorage.setItem(
      STATISTICS_KEY,
      JSON.stringify(DEFAULT_STATISTICS),
    );

    return DEFAULT_STATISTICS;
  }
}

export function updateStatistics(
  gameScore: number,
  bestRoundScore: number,
): GameStatistics {
  const currentStatistics =
    getStatistics();

  const updatedStatistics: GameStatistics = {
    gamesPlayed:
      currentStatistics.gamesPlayed + 1,

    totalScore:
      currentStatistics.totalScore +
      gameScore,

    bestScore: Math.max(
      currentStatistics.bestScore,
      gameScore,
    ),

    bestRoundScore: Math.max(
      currentStatistics.bestRoundScore,
      bestRoundScore,
    ),
  };

  window.localStorage.setItem(
    STATISTICS_KEY,
    JSON.stringify(updatedStatistics),
  );

  return updatedStatistics;
}

export function getAverageScore(
  statistics: GameStatistics,
): number {
  if (statistics.gamesPlayed === 0) {
    return 0;
  }

  return (
    statistics.totalScore /
    statistics.gamesPlayed
  );
}