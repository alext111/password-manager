/**
 * Jest Configuration
 * ---------------------------------------------------------
 * This file configures the Jest testing framework for
 * backend integration and unit tests
 *
 * Responsibilities:
 * - Specify the environment in which tests run
 * - Enable consistent behavior for Node.js backend testing
 *
 * Notes:
 * - 'testEnvironment: node' ensures that Jest uses a
 *   Node.js environment instead of the default browser-like
 *   jsdom environment.
 * - This is required for testing Express APIs, MongoDB,
 *   and other server-side code.
 */

module.exports = {
    testEnvironment: 'node'
  }