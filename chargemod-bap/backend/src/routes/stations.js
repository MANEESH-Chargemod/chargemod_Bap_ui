import express from 'express';
import { getAllStations, searchStations, getStationById } from '../controllers/stations.js';

const router = express.Router();

router.get('/', getAllStations);
router.post('/search', searchStations);
router.get('/:stationId', getStationById);

export default router;