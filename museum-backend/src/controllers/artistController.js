import { fetchArtistById, fetchArtistExperiences } from '../services/artistService.js';

export async function getArtistById(req, res) {
  try {
    const artist = await fetchArtistById(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getArtistExperiences(req, res) {
  try {
    const experiences = await fetchArtistExperiences(req.params.id);
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}