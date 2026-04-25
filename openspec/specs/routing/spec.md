## ADDED Requirements

### Requirement: Two-route SPA structure
The application SHALL serve two views from the same SPA: `/` renders the game host (canvas), `/play` renders the mobile controller. No router library SHALL be used; route detection SHALL be based on `window.location.pathname`.

#### Scenario: Root path shows game host
- **WHEN** the user navigates to `/`
- **THEN** the GameCanvas component is rendered

#### Scenario: Play path shows mobile controller
- **WHEN** the user navigates to `/play`
- **THEN** the MobileController component is rendered

### Requirement: Vite dev server serves index.html for all routes
The Vite configuration SHALL be set up so that `/play` does not return a 404 during development. The SPA fallback SHALL serve `index.html` for all paths.

#### Scenario: Direct navigation to /play in dev
- **WHEN** a user opens `http://localhost:5173/play` directly
- **THEN** the page loads and renders the mobile controller (no 404)
