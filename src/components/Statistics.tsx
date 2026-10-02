"use client";

import {
  getAverageScore,
  type GameStatistics,
} from "@/lib/statistics";

const GAME_NAME = "wHERE?";

type StatisticsProps = {
  statistics: GameStatistics;
  isDarkMode: boolean;
  onPlayAgain: () => void;
  onBackHome: () => void;
};

export default function Statistics({
  statistics,
  isDarkMode,
  onPlayAgain,
  onBackHome,
}: StatisticsProps) {
  const averageScore =
    getAverageScore(statistics);

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
              📊
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
              Player Statistics
            </p>

            <h1
              className={
                isDarkMode
                  ? "mt-2 text-3xl font-black text-white sm:text-4xl"
                  : "mt-2 text-3xl font-black text-slate-900 sm:text-4xl"
              }
            >
              Your Statistics
            </h1>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
            <div
              className={
                isDarkMode
                  ? "rounded-2xl bg-slate-800/80 p-6 text-center"
                  : "rounded-2xl bg-slate-50 p-6 text-center"
              }
            >
              <div className="text-4xl">
                🎮
              </div>

              <div
                className={
                  isDarkMode
                    ? "mt-3 text-4xl font-black text-white"
                    : "mt-3 text-4xl font-black text-slate-900"
                }
              >
                {statistics.gamesPlayed}
              </div>

              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                Games Played
              </p>
            </div>

            <div
              className={
                isDarkMode
                  ? "rounded-2xl bg-slate-800/80 p-6 text-center"
                  : "rounded-2xl bg-slate-50 p-6 text-center"
              }
            >
              <div className="text-4xl">
                🏆
              </div>

              <div className="mt-3 text-4xl font-black text-blue-500">
                {statistics.bestScore}
              </div>

              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                Best Score
              </p>
            </div>

            <div
              className={
                isDarkMode
                  ? "rounded-2xl bg-slate-800/80 p-6 text-center"
                  : "rounded-2xl bg-slate-50 p-6 text-center"
              }
            >
              <div className="text-4xl">
                📈
              </div>

              <div className="mt-3 text-4xl font-black text-emerald-500">
                {averageScore.toFixed(1)}
              </div>

              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                Average Score
              </p>
            </div>

            <div
              className={
                isDarkMode
                  ? "rounded-2xl bg-slate-800/80 p-6 text-center"
                  : "rounded-2xl bg-slate-50 p-6 text-center"
              }
            >
              <div className="text-4xl">
                🎯
              </div>

              <div className="mt-3 text-4xl font-black text-purple-500">
                {statistics.bestRoundScore}
              </div>

              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                Best Round Score
              </p>
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-200 p-5 dark:border-slate-800 sm:grid-cols-2 sm:p-8">
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
        </section>
      </div>
    </main>
  );
}