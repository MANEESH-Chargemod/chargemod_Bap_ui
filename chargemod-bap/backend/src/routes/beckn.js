import express from 'express';

const router = express.Router();

// Beckn protocol endpoints (placeholder for now)
router.post('/search', (req, res) => {
  res.json({ message: 'Beckn search endpoint' });
});

router.post('/select', (req, res) => {
  res.json({ message: 'Beckn select endpoint' });
});

router.post('/init', (req, res) => {
  res.json({ message: 'Beckn init endpoint' });
});

router.post('/confirm', (req, res) => {
  res.json({ message: 'Beckn confirm endpoint' });
});

export default router;



