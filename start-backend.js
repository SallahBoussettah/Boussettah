#!/usr/bin/env node

// Load environment variables from .env file
require("dotenv").config({ path: "./backend/.env" });

// Start the server
require("./backend/server.js");
