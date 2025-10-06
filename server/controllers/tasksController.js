import pool from '../db/pool.js';

export const getTasks = async (req, res) => {
  try {
    const userId = req.query.user_id || req.user?.id;
    const { rows } = await pool.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTask = async (req, res) => {
  const { user_id, title, description, status, due_date } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks (user_id, title, description, status, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, title, description, status, due_date]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { status, title, description, due_date } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE tasks SET status = COALESCE($1, status), title = COALESCE($2, title), description = COALESCE($3, description), due_date = COALESCE($4, due_date), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [status, title, description, due_date, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
