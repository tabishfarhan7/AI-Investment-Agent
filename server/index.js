import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load our environment variables from the .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors());
app.use(express.json()); // Allows our server to read JSON bodies in standard POST requests

// Base check-in route to verify the server is up
app.get('/health', (req, res) => {
  res.json({ status: 'active', message: 'Investment Agent backend is running.' });
});

// The Server-Sent Events (SSE) Stream Route
app.get('/api/research/:company', (req, res) => {
  const { company } = req.params;

  // 1. Establish the SSE Connection Protocol by setting specific HTTP Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // 2. Send an initial message to the client acknowledging the connection
  res.write(`data: ${JSON.stringify({ status: 'connected', message: `Initiating research for ${company}` })}\n\n`);

  // Simulate a background agent workflow step for testing purposes
  let step = 0;
  const interval = setInterval(() => {
    step++;
    if (step === 1) {
      res.write(`data: ${JSON.stringify({ node: 'fundamentals', status: 'processing', message: 'Analyzing balance sheet and P/E ratios...' })}\n\n`);
    } else if (step === 2) {
      res.write(`data: ${JSON.stringify({ node: 'news', status: 'processing', message: 'Scouting recent news channels and product sentiment...' })}\n\n`);
    } else {
      // Wrap up the stream mock
      res.write(`data: ${JSON.stringify({ node: 'judge', status: 'complete', verdict: 'INVEST', confidence: 85 })}\n\n`);
      clearInterval(interval);
      res.end(); // Closes the continuous connection cleanly
    }
  }, 2000);

  // 3. Clean up memory if the user closes their browser window early
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Investment Agent Backend listening securely on port ${PORT}`);
});