## ADDED Requirements

### Requirement: Firebase SDK initialization from environment variables
The system SHALL initialize the Firebase app using configuration values from Vite environment variables (`VITE_FIREBASE_*`). A shared module SHALL export the initialized Realtime Database instance.

#### Scenario: Firebase initializes on import
- **WHEN** any module imports the Firebase database instance
- **THEN** the Firebase app is initialized with credentials from `import.meta.env` and the Realtime Database instance is available

### Requirement: Environment variable template
The project SHALL include a `.env.example` file listing all required `VITE_FIREBASE_*` variables. The actual `.env` file SHALL be listed in `.gitignore`.

#### Scenario: New developer setup
- **WHEN** a developer clones the project
- **THEN** they find `.env.example` with all required Firebase variable names and can copy it to `.env` with their values

### Requirement: Permissive security rules with TODO marker
The Firebase Realtime Database rules SHALL allow open read and write access for demo purposes. The rules file SHALL contain a TODO comment indicating these rules must be hardened for production.

#### Scenario: Open access rules
- **WHEN** the rules are deployed
- **THEN** any client can read and write to any path in the database

#### Scenario: TODO marker present
- **WHEN** the rules file is reviewed
- **THEN** it contains a comment marking the open rules as temporary and requiring hardening
