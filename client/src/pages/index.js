/**
 * Pages Barrel File
 * ---------------------------------------------------------
 * Centralizes exports for all page-level components.
 *
 * Responsibilities:
 * - Simplifies imports for the main App router
 * - Provides a single entry point for all pages
 *
 * Example usage in App.js:
 *   import { LoginsCreate, LoginsFindAll } from '../pages'
 */

import LoginsCreate from "./LoginsCreate"
import LoginsFindByWebsite from "./LoginsFindByWebsite"
import LoginsFindAll from "./LoginsFindAll"
import LoginsUpdate from "./LoginsUpdate"

export { LoginsCreate, LoginsFindByWebsite, LoginsFindAll, LoginsUpdate }