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
 *   import { CredentialsCreate, CredentialsFindByWebsite } from '../pages'
 */

import CredentialsCreate from "./CredentialsCreate"
import CredentialsFindByWebsite from "./CredentialsFindByWebsite"
import CredentialsFindAll from "./CredentialsFindAll"
import CredentialsUpdate from "./CredentialsUpdate"
import Login from "./Login"
import Register from "./Register"

export { CredentialsCreate, CredentialsFindByWebsite, CredentialsFindAll, CredentialsUpdate, Login, Register }