import dotenv from 'dotenv';
import connectDB from './db/index.js'; // Make sure this path is correct
import { startCodeforcesWorker } from './workers/cf.worker.js'; // Adjust path if needed

// 1. The worker process needs access to environment variables too!
dotenv.config({
    path: './.env'
});

console.log("Booting up background worker process...");

// 2. Connect to the Database
connectDB()
  .then(() => {
    console.log("✅ Worker connected to MongoDB successfully!");
    
    // 3. ONLY start listening for jobs AFTER the DB is ready
    startCodeforcesWorker();
  })
  .catch((err) => {
    console.error("❌ Worker failed to connect to MongoDB", err);
    process.exit(1); // Kill the worker if it can't reach the DB
  });