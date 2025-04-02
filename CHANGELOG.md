# Changelog

All notable changes to DrugWars JS will be documented in this file.

## [1.6.2] - 2025-04-02

### Added
- Improved mobile experience by removing hover effects on touch devices
- Added active state feedback for menu items on mobile

### Changed
- Updated version badge in README to 1.6.2
- Refactored CSS media queries for better mobile responsiveness

## [1.6.1] - 2025-04-02

### Added
- Version checking system that resets game on version mismatch
- Game state now includes package version information
- Added `checkVersionMismatch` function to detect version differences

### Changed
- Game automatically resets when loading a save from a different version
- Updated `fixGameState` to include version information
- Modified `gameStateAtom` to handle version transitions

## [1.6.0] - 2025-04-02

### Added
- Bank functionality to protect money from theft
- Added deposit and withdraw functions
- Bank account balance tracking
- Updated game UI to include bank options

### Fixed
- Various bug fixes in game logic
- Fixed issues with state management

## [1.5.2] - 2025-04-02

### Added
- Added game logo

### Fixed
- Fixed several minor bugs in game mechanics
- Improved UI rendering

## [1.5.1] - 2025-04-01

### Added
- Mobile-specific background image
- Enhanced mobile responsiveness
- Improved layout for different screen sizes

### Changed
- Updated CSS for better mobile experience
- Optimized UI for touch devices

## [1.5.0] - 2025-04-01

### Added
- Price spikes and drops now work correctly
- Balanced price algorithms for better gameplay
- Enhanced market simulation

### Changed
- Updated constants for more realistic drug prices
- Improved README documentation

## [1.4.0] - 2025-04-01

### Fixed
- Fixed issues with trenchcoat capacity
- Corrected inventory space calculations

### Changed
- Updated game constants for better balance
- Minor documentation improvements

## [1.3.0] - 2025-04-01

### Added
- New random event for finding larger trenchcoats
- Expanded random event system

### Changed
- Updated game constants

## [1.2.0] - 2025-04-01

### Fixed
- Fixed bug with previously selected drug not clearing properly
- Improved drug selection UI

### Changed
- Enhanced UI interaction
- Updated package version

## [1.0.0] - 2025-04-01

### Added
- Initial release of DrugWars JS
- Modern UI with Chakra components
- Calculator-style retro interface
- Six different types of drugs to trade
- Six NYC locations to travel between
- Basic buying and selling mechanics
- Inventory management with trenchcoat space limitation
- 30-day game cycle
- Loan shark mechanics
- Random events system
- State persistence using Jotai
