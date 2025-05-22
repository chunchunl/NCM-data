import express from 'express';
import { getArtistById, getArtistExperiences } from '../controllers/artistController.js';
const router = express.Router();

router.get('/:id', getArtistById);
router.get('/:id/experiences', getArtistExperiences);

export default router;