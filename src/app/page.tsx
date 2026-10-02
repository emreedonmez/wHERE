"use client";

import dynamic from "next/dynamic";
import {
  useState,
  useSyncExternalStore,
} from "react";

import Leaderboard from "@/components/Leaderboard";
import Statistics from "@/components/Statistics";
import { CITIES, type City } from "@/data/cities";
import {
  addLeaderboardEntry,
  getTopLeaderboard,
  type LeaderboardEntry,
} from "@/lib/leaderboard";
import {
  calculateDistance,
  calculateScore,
} from "@/lib/distance";
import {
  getStatistics,
  updateStatistics,
  type GameStatistics,
} from "@/lib/statistics";

const GAME_NAME = "wHERE?";

const MapComponent = dynamic(
  () => import("@/components/MapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
          <p className="text-sm font-medium text-slate-600">
            Loading map...
          </p>
        </div>
      </div>
    ),
  },
);

type GameStatus =
  | "idle"
  | "playing"
  | "nameEntry"
  | "leaderboard"
  | "statistics";

const HIGH_SCORE_KEY =
  "turkey-map-game-high-score";

const HIGH_SCORE_EVENT =
  "turkey-map-game-high-score-change";

const TOTAL_ROUNDS = 5;

function subscribeToHighScore(
  callback: () => void,
) {
  window.addEventListener(
    HIGH_SCORE_EVENT,
    callback,
  );

  window.addEventListener(
    "storage",
    callback,
  );

  return () => {
    window.removeEventListener(
      HIGH_SCORE_EVENT,
      callback,
    );

    window.removeEventListener(
      "storage",
      callback,
    );
  };
}

function getHighScoreSnapshot(): number {
  const savedHighScore =
    window.localStorage.getItem(
      HIGH_SCORE_KEY,
    );

  if (!savedHighScore) {
    return 0;
  }

  const parsedScore =
    Number(savedHighScore);

  return Number.isFinite(parsedScore)
    ? parsedScore
    : 0;
}

function getHighScoreServerSnapshot(): number {
  return 0;
}

function useHighScore(): number {
  return useSyncExternalStore(
    subscribeToHighScore,
    getHighScoreSnapshot,
    getHighScoreServerSnapshot,
  );
}

function saveHighScore(score: number): void {
  window.localStorage.setItem(
    HIGH_SCORE_KEY,
    String(score),
  );

  window.dispatchEvent(
    new Event(HIGH_SCORE_EVENT),
  );
}

function shuffleCities(
  cities: City[],
): City[] {
  return [...cities].sort(
    () => Math.random() - 0.5,
  );
}

export default function Home() {
  const highScore = useHighScore();

  const [isDarkMode, setIsDarkMode] =
    useState(false);

  const [gameStatus, setGameStatus] =
    useState<GameStatus>("idle");

  const [roundCities, setRoundCities] =
    useState<City[]>([]);

  const [currentRound, setCurrentRound] =
    useState(0);

  const [totalScore, setTotalScore] =
    useState(0);

  const [bestRoundScore, setBestRoundScore] =
    useState(0);

  const [hasGuessed, setHasGuessed] =
    useState(false);

  const [lastDistance, setLastDistance] =
    useState<number | null>(null);

  const [lastRoundScore, setLastRoundScore] =
    useState<number | null>(null);

  const [guessedLocation, setGuessedLocation] =
    useState<{
      latitude: number;
      longitude: number;
    } | null>(null);

  const [username, setUsername] =
    useState("");

  const [usernameError, setUsernameError] =
    useState("");

  const [
    leaderboardEntries,
    setLeaderboardEntries,
  ] = useState<LeaderboardEntry[]>([]);

  const [
    currentLeaderboardRank,
    setCurrentLeaderboardRank,
  ] = useState<number | null>(null);

  const [
    currentLeaderboardEntryId,
    setCurrentLeaderboardEntryId,
  ] = useState<string | null>(null);

  const [statistics, setStatistics] =
    useState<GameStatistics>({
      gamesPlayed: 0,
      totalScore: 0,
      bestScore: 0,
      bestRoundScore: 0,
    });

  const currentCity =
    roundCities[currentRound];

  function startGame() {
    const selectedCities =
      shuffleCities(CITIES).slice(
        0,
        TOTAL_ROUNDS,
      );

    setRoundCities(selectedCities);
    setCurrentRound(0);
    setTotalScore(0);
    setBestRoundScore(0);
    setHasGuessed(false);
    setLastDistance(null);
    setLastRoundScore(null);
    setGuessedLocation(null);
    setUsername("");
    setUsernameError("");
    setCurrentLeaderboardRank(null);
    setCurrentLeaderboardEntryId(null);
    setLeaderboardEntries([]);
    setGameStatus("playing");
  }

  function toggleTheme() {
    setIsDarkMode(
      (previousMode) => !previousMode,
    );
  }

  function openLeaderboard() {
    const topEntries =
      getTopLeaderboard();

    setLeaderboardEntries(topEntries);
    setCurrentLeaderboardRank(null);
    setCurrentLeaderboardEntryId(null);
    setGameStatus("leaderboard");
  }

  function openStatistics() {
    const savedStatistics =
      getStatistics();

    setStatistics(savedStatistics);
    setGameStatus("statistics");
  }

  function goHome() {
    setGameStatus("idle");
  }

  function handleMapGuess(
    latitude: number,
    longitude: number,
  ) {
    if (
      gameStatus !== "playing" ||
      hasGuessed ||
      !currentCity
    ) {
      return;
    }

    const distance =
      calculateDistance(
        {
          latitude,
          longitude,
        },
        {
          latitude:
            currentCity.latitude,
          longitude:
            currentCity.longitude,
        },
      );

    const roundScore =
      calculateScore(distance);

    const newTotalScore =
      totalScore + roundScore;

    const newBestRoundScore =
      Math.max(
        bestRoundScore,
        roundScore,
      );

    setGuessedLocation({
      latitude,
      longitude,
    });

    setLastDistance(distance);
    setLastRoundScore(roundScore);
    setBestRoundScore(
      newBestRoundScore,
    );
    setHasGuessed(true);
    setTotalScore(newTotalScore);

    if (
      currentRound ===
        TOTAL_ROUNDS - 1 &&
      newTotalScore > highScore
    ) {
      saveHighScore(newTotalScore);
    }
  }

  function handleNextRound() {
    if (!hasGuessed) {
      return;
    }

    if (
      currentRound ===
      TOTAL_ROUNDS - 1
    ) {
      setGameStatus("nameEntry");
      return;
    }

    setCurrentRound(
      (previousRound) =>
        previousRound + 1,
    );

    setHasGuessed(false);
    setLastDistance(null);
    setLastRoundScore(null);
    setGuessedLocation(null);
  }

  function handleUsernameSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanUsername = username
      .trim()
      .replace(/\s+/g, " ");

    if (cleanUsername.length < 2) {
      setUsernameError(
        "Username must contain at least 2 characters.",
      );
      return;
    }

    if (cleanUsername.length > 20) {
      setUsernameError(
        "Username must be 20 characters or less.",
      );
      return;
    }

    const result =
      addLeaderboardEntry(
        cleanUsername,
        totalScore,
      );

    const updatedStatistics =
      updateStatistics(
        totalScore,
        bestRoundScore,
      );

    setStatistics(updatedStatistics);

    setLeaderboardEntries(
      result.leaderboard,
    );

    setCurrentLeaderboardRank(
      result.rank,
    );

    setCurrentLeaderboardEntryId(
      result.entry.id,
    );

    setUsernameError("");
    setGameStatus("leaderboard");
  }

  function getScoreMessage(
    score: number,
  ): string {
    if (score === 100) {
      return "Perfect! You were very close.";
    }

    if (score >= 75) {
      return "Great guess!";
    }

    if (score >= 50) {
      return "Not bad!";
    }

    if (score >= 25) {
      return "You could have been closer.";
    }

    return "That was a difficult guess!";
  }

  function renderThemeButton() {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={
          isDarkMode
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
        title={
          isDarkMode
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
        className={
          isDarkMode
            ? "rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-lg transition hover:bg-slate-700"
            : "rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-lg transition hover:bg-slate-200"
        }
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
    );
  }

  if (gameStatus === "statistics") {
    return (
      <Statistics
        statistics={statistics}
        isDarkMode={isDarkMode}
        onPlayAgain={startGame}
        onBackHome={goHome}
      />
    );
  }

  if (gameStatus === "leaderboard") {
    return (
      <Leaderboard
        entries={leaderboardEntries}
        currentEntryId={
          currentLeaderboardEntryId
        }
        currentRank={
          currentLeaderboardRank
        }
        isDarkMode={isDarkMode}
        onPlayAgain={startGame}
        onBackHome={goHome}
      />
    );
  }

  if (gameStatus === "idle") {
    return (
      <main
        className={
          isDarkMode
            ? "theme-dark flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-5 py-10 transition-colors duration-300"
            : "theme-light flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-white to-blue-100 px-5 py-10 transition-colors duration-300"
        }
      >
        <section
          className={
            isDarkMode
              ? "w-full max-w-2xl rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12"
              : "w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12"
          }
        >
          <div className="mb-6 flex justify-end">
            {renderThemeButton()}
          </div>

          <div className="mb-2 text-6xl">
            🌍
          </div>

          <div className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-blue-500">
            {GAME_NAME}
          </div>

          <h1
            className={
              isDarkMode
                ? "mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl"
                : "mb-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl"
            }
          >
            Where is the city?
          </h1>

          <p
            className={
              isDarkMode
                ? "mx-auto mb-8 max-w-xl text-base leading-7 text-slate-300 sm:text-lg"
                : "mx-auto mb-8 max-w-xl text-base leading-7 text-slate-600 sm:text-lg"
            }
          >
            Try to find the location of a randomly
            selected city in Turkey on the map.
            The closer you click to the correct
            location, the higher your score will be.
          </p>

          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div
              className={
                isDarkMode
                  ? "rounded-2xl bg-white/10 p-4"
                  : "rounded-2xl bg-slate-100 p-4"
              }
            >
              <div
                className={
                  isDarkMode
                    ? "text-2xl font-bold text-white"
                    : "text-2xl font-bold text-slate-900"
                }
              >
                5
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                Rounds
              </div>
            </div>

            <div
              className={
                isDarkMode
                  ? "rounded-2xl bg-white/10 p-4"
                  : "rounded-2xl bg-slate-100 p-4"
              }
            >
              <div
                className={
                  isDarkMode
                    ? "text-2xl font-bold text-white"
                    : "text-2xl font-bold text-slate-900"
                }
              >
                100
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                Max. Round Score
              </div>
            </div>

            <div
              className={
                isDarkMode
                  ? "rounded-2xl bg-white/10 p-4"
                  : "rounded-2xl bg-slate-100 p-4"
              }
            >
              <div
                className={
                  isDarkMode
                    ? "text-2xl font-bold text-white"
                    : "text-2xl font-bold text-slate-900"
                }
              >
                81
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                Cities
              </div>
            </div>

            <div
              className={
                isDarkMode
                  ? "rounded-2xl bg-white/10 p-4"
                  : "rounded-2xl bg-slate-100 p-4"
              }
            >
              <div
                className={
                  isDarkMode
                    ? "text-2xl font-bold text-white"
                    : "text-2xl font-bold text-slate-900"
                }
              >
                {highScore}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                High Score
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={startGame}
              className="rounded-2xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-500 active:scale-[0.98]"
            >
              Start Game
            </button>

            <button
              type="button"
              onClick={openLeaderboard}
              className={
                isDarkMode
                  ? "rounded-2xl bg-slate-800 px-6 py-4 text-lg font-bold text-white transition hover:bg-slate-700 active:scale-[0.98]"
                  : "rounded-2xl bg-slate-200 px-6 py-4 text-lg font-bold text-slate-900 transition hover:bg-slate-300 active:scale-[0.98]"
              }
            >
              View Leaderboard
            </button>

            <button
              type="button"
              onClick={openStatistics}
              className={
                isDarkMode
                  ? "rounded-2xl bg-slate-800 px-6 py-4 text-lg font-bold text-white transition hover:bg-slate-700 active:scale-[0.98]"
                  : "rounded-2xl bg-slate-200 px-6 py-4 text-lg font-bold text-slate-900 transition hover:bg-slate-300 active:scale-[0.98]"
              }
            >
              View Statistics
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (gameStatus === "nameEntry") {
    return (
      <main
        className={
          isDarkMode
            ? "theme-dark flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-5 py-10"
            : "theme-light flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-white to-blue-100 px-5 py-10"
        }
      >
        <section
          className={
            isDarkMode
              ? "w-full max-w-xl rounded-3xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12"
              : "w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl sm:p-12"
          }
        >
          <div className="mb-4 flex justify-between">
            <div className="text-sm font-bold uppercase tracking-[0.35em] text-blue-500">
              {GAME_NAME}
            </div>

            {renderThemeButton()}
          </div>

          <div className="mb-4 text-6xl">
            🏆
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
            Game Complete
          </p>

          <h1
            className={
              isDarkMode
                ? "mt-2 text-4xl font-black text-white"
                : "mt-2 text-4xl font-black text-slate-900"
            }
          >
            Your Score
          </h1>

          <div className="my-6 text-7xl font-black text-blue-500">
            {totalScore}
          </div>

          <p
            className={
              isDarkMode
                ? "mb-6 text-slate-300"
                : "mb-6 text-slate-600"
            }
          >
            Enter a username to save your score
            to the leaderboard.
          </p>

          <form
            onSubmit={handleUsernameSubmit}
            className="space-y-4"
          >
            <label
              htmlFor="username"
              className="sr-only"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(
                  event.target.value,
                );
                setUsernameError("");
              }}
              placeholder="Enter your username"
              maxLength={20}
              autoComplete="off"
              autoFocus
              className={
                isDarkMode
                  ? "w-full rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-center text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  : "w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              }
            />

            {usernameError && (
              <p className="text-sm font-medium text-red-500">
                {usernameError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-500 active:scale-[0.98]"
            >
              Save Score & View Leaderboard
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main
      className={
        isDarkMode
          ? "theme-dark min-h-screen bg-slate-950 px-3 py-3 text-slate-900 transition-colors duration-300 sm:px-6 sm:py-6"
          : "theme-light min-h-screen bg-slate-100 px-3 py-3 text-slate-900 transition-colors duration-300 sm:px-6 sm:py-6"
      }
    >
      <div className="mx-auto max-w-7xl">
        <header
          className={
            isDarkMode
              ? "mb-4 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between"
              : "mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between"
          }
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-500">
              {GAME_NAME}
            </p>

            <h1
              className={
                isDarkMode
                  ? "mt-2 text-xl font-black text-white sm:text-2xl"
                  : "mt-2 text-xl font-black text-slate-900 sm:text-2xl"
              }
            >
              Target:{" "}
              <span className="text-blue-500">
                {currentCity.name}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {renderThemeButton()}

            <div className="grid grid-cols-3 gap-2 text-center">
              <div
                className={
                  isDarkMode
                    ? "rounded-xl bg-slate-800 px-4 py-2"
                    : "rounded-xl bg-slate-100 px-4 py-2"
                }
              >
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Round
                </div>

                <div
                  className={
                    isDarkMode
                      ? "font-bold text-white"
                      : "font-bold text-slate-900"
                  }
                >
                  {currentRound + 1}/{TOTAL_ROUNDS}
                </div>
              </div>

              <div
                className={
                  isDarkMode
                    ? "rounded-xl bg-slate-800 px-4 py-2"
                    : "rounded-xl bg-slate-100 px-4 py-2"
                }
              >
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Score
                </div>

                <div
                  className={
                    isDarkMode
                      ? "font-bold text-white"
                      : "font-bold text-slate-900"
                  }
                >
                  {totalScore}
                </div>
              </div>

              <div
                className={
                  isDarkMode
                    ? "rounded-xl bg-slate-800 px-4 py-2"
                    : "rounded-xl bg-slate-100 px-4 py-2"
                }
              >
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  High Score
                </div>

                <div
                  className={
                    isDarkMode
                      ? "font-bold text-white"
                      : "font-bold text-slate-900"
                  }
                >
                  {highScore}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section
          className={
            isDarkMode
              ? "overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
              : "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          }
        >
          <div
            className={
              isDarkMode
                ? "border-b border-slate-800 bg-slate-900 p-4"
                : "border-b border-slate-200 bg-white p-4"
            }
          >
            <p
              className={
                isDarkMode
                  ? "text-center text-sm font-medium text-slate-300"
                  : "text-center text-sm font-medium text-slate-600"
              }
            >
              Click on the map where you think{" "}
              {currentCity.name} is located.
            </p>
          </div>

          <div className="h-[62vh] min-h-[420px] w-full">
            <MapComponent
              key={`${currentCity.name}-${currentRound}-${isDarkMode}`}
              targetCity={currentCity}
              onGuess={handleMapGuess}
              guessedLocation={guessedLocation}
              showAnswer={hasGuessed}
              disabled={hasGuessed}
              isDarkMode={isDarkMode}
            />
          </div>

          {hasGuessed &&
            lastDistance !== null &&
            lastRoundScore !== null && (
              <div
                className={
                  isDarkMode
                    ? "border-t border-slate-800 bg-slate-950 p-5"
                    : "border-t border-slate-200 bg-slate-50 p-5"
                }
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <div
                    className={
                      isDarkMode
                        ? "rounded-2xl bg-slate-900 p-4 text-center"
                        : "rounded-2xl bg-white p-4 text-center"
                    }
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Distance
                    </div>

                    <div
                      className={
                        isDarkMode
                          ? "mt-1 text-2xl font-black text-white"
                          : "mt-1 text-2xl font-black text-slate-900"
                      }
                    >
                      {lastDistance.toFixed(1)} km
                    </div>
                  </div>

                  <div
                    className={
                      isDarkMode
                        ? "rounded-2xl bg-slate-900 p-4 text-center"
                        : "rounded-2xl bg-white p-4 text-center"
                    }
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Round Score
                    </div>

                    <div className="mt-1 text-2xl font-black text-blue-500">
                      +{lastRoundScore}
                    </div>
                  </div>

                  <div
                    className={
                      isDarkMode
                        ? "rounded-2xl bg-slate-900 p-4 text-center"
                        : "rounded-2xl bg-white p-4 text-center"
                    }
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Total Score
                    </div>

                    <div
                      className={
                        isDarkMode
                          ? "mt-1 text-2xl font-black text-white"
                          : "mt-1 text-2xl font-black text-slate-900"
                      }
                    >
                      {totalScore}
                    </div>
                  </div>
                </div>

                <div
                  className={
                    isDarkMode
                      ? "mt-4 rounded-2xl bg-blue-950/50 p-4 text-center"
                      : "mt-4 rounded-2xl bg-blue-50 p-4 text-center"
                  }
                >
                  <p
                    className={
                      isDarkMode
                        ? "font-semibold text-blue-300"
                        : "font-semibold text-blue-900"
                    }
                  >
                    {getScoreMessage(
                      lastRoundScore,
                    )}
                  </p>

                  <p
                    className={
                      isDarkMode
                        ? "mt-1 text-sm text-blue-400"
                        : "mt-1 text-sm text-blue-700"
                    }
                  >
                    The red marker shows the correct
                    location. The blue marker shows
                    your guess.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNextRound}
                  className="mt-4 w-full rounded-2xl bg-slate-900 px-6 py-4 font-bold text-white transition hover:bg-slate-800 active:scale-[0.99]"
                >
                  {currentRound ===
                  TOTAL_ROUNDS - 1
                    ? "Enter Username"
                    : "Next Round →"}
                </button>
              </div>
            )}
        </section>

        {!hasGuessed && (
          <p className="mt-3 text-center text-xs text-slate-500">
            Tip: You can zoom, zoom out, and drag the
            map.
          </p>
        )}
      </div>
    </main>
  );
}