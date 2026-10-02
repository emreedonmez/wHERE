# Design Document — Turkey Map Game

## Overview

Turkey Map Game is a browser-based geography puzzle game built with Next.js, React, TypeScript, Tailwind CSS, React Leaflet, Leaflet, and OpenStreetMap/CARTO map tiles.

The purpose of the project is to create a simple but complete interactive geography game in which the player must identify the location of randomly selected Turkish cities on a map. Each game contains five rounds. The player receives a score based on the geographical distance between the selected location and the actual coordinates of the target city.

The application is entirely client-side. It does not require a backend server or database. Game data that needs to persist between sessions is stored using the browser's LocalStorage API.

## Architecture

The application follows a component-based architecture instead of placing all functionality inside a single page.

The main application logic is located in `src/app/page.tsx`. This file controls the game state and coordinates the different stages of the application, including the home screen, gameplay, username entry, leaderboard, and statistics screens.

Interactive map functionality is isolated in `src/components/MapComponent.tsx`. This component uses React Leaflet to display the map and detect clicks. It receives game information through React props rather than directly managing the global game state.

The leaderboard interface is implemented in `src/components/Leaderboard.tsx`, while player statistics are implemented in `src/components/Statistics.tsx`.

Geographical data is separated into `src/data/cities.ts`. This file contains the names and coordinates of all 81 Turkish provinces.

Mathematical calculations are located in `src/lib/distance.ts`. This keeps the distance and scoring logic independent from the user interface.

Persistent leaderboard data is handled by `src/lib/leaderboard.ts`, while historical player statistics are handled by `src/lib/statistics.ts`.

This separation of responsibilities makes the code easier to read, debug, modify, and explain.

## Game Flow

When the application starts, the user sees the home screen.

The player can start a new game, view the local leaderboard, view statistics, or switch between light and dark themes.

When the player starts a game, five different cities are randomly selected from the complete list of 81 cities.

For each round, the application displays a target such as:

```text
Target: Erzurum
```

The player then clicks on the interactive map.

Leaflet returns the latitude and longitude of the clicked position. These coordinates are compared with the coordinates stored for the target city.

After the calculation, the application displays the player's guess and the correct location using separate map markers.

The player also receives a score for that round and can continue to the next round.

After the fifth round, the final score is calculated and the player is asked to enter a username.

The username and final score are then stored in the local leaderboard.

## Distance Calculation

The game uses the Haversine formula to calculate the approximate great-circle distance between two geographical coordinates.

The process is:

```text
Player latitude/longitude
          +
Target latitude/longitude
          ↓
Haversine formula
          ↓
Distance in kilometers
          ↓
Score calculation
```

The implementation uses an Earth radius of approximately 6,371 kilometers.

The result is returned in kilometers and displayed to one decimal place in the interface.

## Scoring System

The score is based on distance from the target.

The current scoring model is:

```text
0–50 km        → 100 points
50–500 km      → gradually decreasing score
500+ km        → 10 points
```

This design rewards accurate geographical guesses while still providing points for guesses that are farther away.

The maximum score for a single round is 100, and a complete five-round game can therefore produce a maximum score of 500.

## Map Design

The project intentionally uses a no-label map.

Standard map tiles containing city and country names would reveal the answer to the player and reduce the importance of geographical knowledge. Therefore, the application uses CARTO's `light_nolabels` and `dark_nolabels` map styles.

The user can switch between light and dark modes. The interface theme and the map tile style change together.

The map is loaded dynamically in the browser because Leaflet is a browser-oriented interactive library and should not be rendered as a normal server component.

## LocalStorage

No backend or database is required for the current project.

The application uses LocalStorage for three types of persistent information:

```text
turkey-map-game-high-score
turkey-map-game-leaderboard
turkey-map-game-statistics
```

The high score stores the player's best total score.

The leaderboard stores username and score entries.

The statistics store the number of completed games, total score across games, best score, and best single-round score.

This approach keeps the project inexpensive and simple to deploy.

## Leaderboard Design

The leaderboard is intentionally local rather than global.

Initial bot entries are included to make the leaderboard immediately populated when the game is first opened.

When a player completes a game and enters a username, the new score is inserted into the stored leaderboard and the entries are sorted by score.

The interface displays the top ten entries. If a player's rank is outside the top ten, the application also displays the player's current rank separately.

This approach provides the experience of a leaderboard without requiring a remote database or authentication system.

## Statistics Design

The statistics feature provides longer-term information about the player's performance.

The following values are tracked:

```text
Games Played
Best Score
Average Score
Best Round Score
```

The average score is calculated from the total scores of completed games.

Statistics are only updated when a complete game has been submitted with a username. This prevents incomplete games from being incorrectly counted as finished sessions.

## Responsive Design

The user interface is designed with Tailwind CSS and responsive utility classes.

The layout adapts to smaller screens by changing grid layouts, spacing, and component widths.

The map occupies a large section of the game screen because map interaction is the primary gameplay mechanic.

The scoreboard, controls, result panels, leaderboard, and statistics pages also adapt to mobile screen sizes.

## Error Prevention and Validation

The application validates user-entered usernames before storing them.

A username must contain at least two characters and may contain no more than twenty characters.

Stored LocalStorage data is also validated before being used. If invalid data is encountered, the application resets the affected data structure to a valid default state.

The game prevents multiple guesses within the same round after a location has already been selected.

## Design Decisions

The decision to use Next.js and React was made to provide a modern component-based application architecture rather than a single HTML document.

TypeScript was selected to provide explicit types for city coordinates, component properties, game state, leaderboard entries, and statistics.

Tailwind CSS was selected to make responsive interface development fast while keeping styling close to the components that use it.

React Leaflet was selected because it provides a natural React interface for Leaflet's interactive map functionality.

LocalStorage was selected instead of a database because the current project does not require accounts, remote synchronization, or server-side data.

The application was deliberately kept client-side to avoid unnecessary infrastructure and recurring costs.

## AI-Assisted Development

AI-based development tools were used as development assistance during the project.

They were used for tasks such as discussing architecture, generating and revising implementation ideas, debugging errors, improving documentation, and reviewing code structure.

The developer remained responsible for selecting the project concept, deciding the implemented features, testing the application, and making the final implementation decisions.