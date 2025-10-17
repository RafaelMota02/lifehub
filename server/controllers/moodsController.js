import pool from '../db/pool.js';

export const getMoodEntries = async (req, res) => {
  try {
    const userId = req.query.user_id || req.user?.id;
    const { rows } = await pool.query('SELECT * FROM moods WHERE user_id = $1 ORDER BY date DESC', [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMoodEntry = async (req, res) => {
  const { user_id, mood_level, date, notes } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO moods (user_id, mood_level, date, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, mood_level, date || new Date().toISOString().split('T')[0], notes]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
