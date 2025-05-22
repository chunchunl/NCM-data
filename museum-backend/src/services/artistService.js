import db from '../config/database.js';

export async function fetchArtistById(id) {
  const [rows] = await db.query('SELECT * FROM artists WHERE id = ?', [id]);
  return rows[0];
}

export async function fetchArtistExperiences(artistId) {
  const [rows] = await db.query('SELECT experience FROM artist_experiences WHERE artist_id = ? ORDER BY sort_order ASC', [artistId]);
  return rows.map(row => row.experience);
}