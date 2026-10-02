"use client";

import type { LeaderboardEntry } from "@/lib/leaderboard";

const GAME_NAME = "wHERE?";

type LeaderboardProps = {
  entries: LeaderboardEntry[];
  currentEntryId: string | null;
  currentRank: number | null;
  isDarkMode: boolean;
  onPlayAgain: () => void;
  onBackHome: () => void;
};

export default function Leaderboard({
  entries,
  currentEntryId,
  currentRank,
  isDarkMode,
  onPlayAgain,
  onBackHome,
}: LeaderboardProps) {
  const currentEntry =
    entries.find(
      (entry) => entry.id === currentEntryId,
    ) ?? null;

  return (
    <main
      className={
        isDarkMode
          ? "min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-8 transition-colors duration-300"
          : "min-h-screen bg-linear-to-br from-slate-100 via-white to-blue-100 px-4 py-8 transition-colors duration-300"
      }
    >
      <div className="mx-auto max-w-3xl">
        <section
          className={
            isDarkMode
              ? "overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
              : "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          }
        >
          <div
            className={
              isDarkMode
                ? "border-b border-white/10 p-6 text-center sm:p-8"
                : "border-b border-slate-200 p-6 text-center sm:p-8"
            }
          >
            <div className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-blue-500">
              {GAME_NAME}
            </div>

            <div className="mb-3 text-5xl">
              🏆
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
              Final Results
            </p>

            <h1
              className={
                isDarkMode
                  ? "mt-2 text-3xl font-black text-white sm:text-4xl"
                  : "mt-2 text-3xl font-black text-slate-900 sm:text-4xl"
              }
            >
              Leaderboard
            </h1>

            {currentEntry && (
              <div
                className={
                  isDarkMode
                    ? "mx-auto mt-6 max-w-md rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5"
                    : "mx-auto mt-6 max-w-md rounded-2xl border border-blue-200 bg-blue-50 p-5"
                }
              >
                <p
                  className={
                    isDarkMode
                      ? "text-sm text-slate-300"
                      : "text-sm text-slate-600"
                  }
                >
                  Your Result
                </p>

                <div className="mt-2 flex items-center justify-center gap-3">
                  <span className="text-2xl font-black text-blue-500">
                    #{currentRank}
                  </span>

                  <span
                    className={
                      isDarkMode
                        ? "text-xl font-bold text-white"
                        : "text-xl font-bold text-slate-900"
                    }
                  >
                    {currentEntry.username}
                  </span>

                  <span className="text-xl font-black text-blue-500">
                    {currentEntry.score}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-2">
              {entries.map(
                (entry, index) => {
                  const isCurrentUser =
                    entry.id === currentEntryId;

                  const rank = index + 1;

                  return (
                    <div
                      key={entry.id}
                      className={
                        isCurrentUser
                          ? isDarkMode
                            ? "flex items-center gap-3 rounded-2xl border border-blue-500/40 bg-blue-500/10 px-4 py-4"
                            : "flex items-center gap-3 rounded-2xl border border-blue-300 bg-blue-50 px-4 py-4"
                          : isDarkMode
                            ? "flex items-center gap-3 rounded-2xl bg-slate-800/70 px-4 py-4"
                            : "flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4"
                      }
                    >
                      <div className="w-10 shrink-0 text-center text-lg font-black">
                        {rank === 1
                          ? "🥇"
                          : rank === 2
                            ? "🥈"
                            : rank === 3
                              ? "🥉"
                              : `#${rank}`}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span
                          className={
                            isDarkMode
                              ? "truncate font-bold text-white"
                              : "truncate font-bold text-slate-900"
                          }
                        >
                          {entry.username}
                        </span>

                        {isCurrentUser && (
                          <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            YOU
                          </span>
                        )}
                      </div>

                      <div
                        className={
                          isDarkMode
                            ? "text-xl font-black text-blue-400"
                            : "text-xl font-black text-blue-600"
                        }
                      >
                        {entry.score}
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            {currentRank !== null &&
              currentRank > 10 && (
                <div
                  className={
                    isDarkMode
                      ? "mt-4 rounded-2xl bg-slate-800/70 p-4 text-center text-sm text-slate-300"
                      : "mt-4 rounded-2xl bg-slate-100 p-4 text-center text-sm text-slate-600"
                  }
                >
                  Your score is outside the Top 10.
                  Your current rank is{" "}
                  <strong>#{currentRank}</strong>.
                </div>
              )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onPlayAgain}
                className="rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-500 active:scale-[0.98]"
              >
                Play Again
              </button>

              <button
                type="button"
                onClick={onBackHome}
                className={
                  isDarkMode
                    ? "rounded-2xl bg-slate-800 px-6 py-4 font-bold text-white transition hover:bg-slate-700 active:scale-[0.98]"
                    : "rounded-2xl bg-slate-200 px-6 py-4 font-bold text-slate-900 transition hover:bg-slate-300 active:scale-[0.98]"
                }
              >
                Back to Home
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}