# Turkey Map Game

#### Video Demo: [https://youtu.be/USf_qU853Pg]

## Description

Turkey Map Game is a browser-based geography puzzle game built as my CS50x Final Project.

The game challenges players to identify the locations of randomly selected cities in Turkey. Each game contains five rounds. In each round, the application displays the name of a target city and presents the player with an interactive map without city, region, or country labels. The player clicks where they believe the target city is located.

After the player makes a guess, the application calculates the geographical distance between the selected location and the actual location of the target city. The distance is calculated using the Haversine formula.

The closer the player gets to the correct location, the higher the score. After five rounds, the player receives a final score and can enter a username to save the result to the local leaderboard.

The application also provides a high score system and player statistics. Statistics include games played, best score, average score, and best round score.

All persistent game information is stored locally in the browser using the LocalStorage API. No external database or backend server is required.

## Features

- Five-round geography gameplay
- Random selection from all 81 Turkish provinces
- Interactive Leaflet map
- No-label map tiles
- Haversine distance calculation
- Distance-based scoring
- Light and dark themes
- Username submission
- Local leaderboard
- Initial leaderboard bot entries
- High score tracking
- Player statistics
- Responsive interface for desktop and mobile

## Technologies

### Next.js

Next.js is used as the main web framework. The project uses the App Router architecture.

### React

React is used to build reusable user interface components and manage interactive game state.

### TypeScript

TypeScript is used throughout the project to provide type safety for the application state, geographic data, component props, leaderboard entries, and statistics.

### Tailwind CSS

Tailwind CSS is used to create the responsive user interface and provide both light and dark visual themes.

### React Leaflet and Leaflet

React Leaflet connects React to the Leaflet mapping library.

Leaflet provides the interactive map, zooming, dragging, and click-coordinate functionality required by the game.

### OpenStreetMap and CARTO

The map uses CARTO no-label map tiles so that city and country names do not reveal the answer.

The application supports both light and dark no-label map styles.

## Project Structure

```text
turkey-map-game/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── Leaderboard.tsx
│   │   ├── MapComponent.tsx
│   │   └── Statistics.tsx
│   │
│   ├── data/
│   │   └── cities.ts
│   │
│   └── lib/
│       ├── distance.ts
│       ├── leaderboard.ts
│       └── statistics.ts
│
├── .gitignore
├── DESIGN.md
├── README.md
├── package.json
├── package-lock.json
└── ...
```

## Important Files

### `src/app/page.tsx`

Controls the main game flow and application state.

It handles:

- starting a game,
- selecting five random cities,
- tracking rounds,
- calculating the total score,
- collecting the username,
- saving leaderboard results,
- opening statistics,
- switching themes.

### `src/components/MapComponent.tsx`

Contains the interactive Leaflet map.

It detects player clicks and displays the player's guess and correct location.

### `src/components/Leaderboard.tsx`

Displays the local leaderboard and the player's current rank.

### `src/components/Statistics.tsx`

Displays historical player statistics.

### `src/data/cities.ts`

Contains all 81 Turkish provinces and their latitude and longitude coordinates.

### `src/lib/distance.ts`

Contains the Haversine distance calculation and score calculation functions.

### `src/lib/leaderboard.ts`

Stores, validates, sorts, and retrieves leaderboard entries.

### `src/lib/statistics.ts`

Stores and calculates player performance statistics.

## Installation

The project requires Node.js and npm.

Clone or extract the project, then open a terminal in the project directory.

Install the dependencies:

```bash
npm install
```

The application also requires a CARTO basemap API key.

Create a file named `.env.local` in the project root:

```env
NEXT_PUBLIC_CARTO_KEY=YOUR_CARTO_API_KEY
```

Replace `YOUR_CARTO_API_KEY` with the CARTO key used for the project.

Do not commit `.env.local` to a public repository.

## Running the Application

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Production Build

To test the production build:

```bash
npm run build
```

To run the production server after a successful build:

```bash
npm run start
```

## How to Play

1. Click **Start Game**.
2. Read the target city displayed at the top.
3. Click on the map where you think the city is located.
4. Review the distance and round score.
5. Click **Next Round**.
6. Complete all five rounds.
7. Enter a username.
8. View the leaderboard.

The game allows one guess per round.

## Scoring

The scoring system rewards accurate guesses:

```text
0–50 km        → 100 points
50–500 km      → progressively lower score
500+ km        → 10 points
```

A complete five-round game can therefore produce a maximum score of 500.

## Local Data

The application uses browser LocalStorage instead of a backend database.

The following keys are used:

```text
turkey-map-game-high-score
turkey-map-game-leaderboard
turkey-map-game-statistics
```

Because the data is stored locally, leaderboard and statistics data belongs to the current browser rather than a global online database.

## Theme System

The application supports light and dark themes.

The theme button changes both the interface and the map style:

```text
Light Theme → CARTO light_nolabels
Dark Theme  → CARTO dark_nolabels
```

This keeps the map visually consistent with the rest of the application.

## AI-Assisted Development

AI-based development tools were used as development assistance during the project, including for brainstorming, architecture discussions, debugging, code review, and documentation.

The final project concept, feature selection, testing, and implementation decisions were reviewed and determined by the developer.

## Conclusion

Turkey Map Game combines a browser-based interactive map, geographic calculations, client-side persistence, a scoring system, a leaderboard, and player statistics into a complete geography game.

The application intentionally avoids a backend database so that the entire project can operate as a lightweight client-side application while still providing persistent player information through LocalStorage.
