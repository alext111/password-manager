/**
 * Frontend Entry Point
 * ---------------------------------------------------------
 * Initializes the React application and renders the root component.
 *
 * Responsibilities:
 * - Wraps the main <App /> component in a router for client-side navigation
 * - Mounts the React application into the DOM element with id "root"
 *
 * Notes:
 * - Uses HashRouter to manage routing paths
 * - Ensures the application is ready for navigation between pages
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { HashRouter } from 'react-router-dom'

// Render the root component wrapped in a HashRouter
ReactDOM.render((
    <HashRouter>
        <App />
    </HashRouter>
), document.getElementById('root'));
    