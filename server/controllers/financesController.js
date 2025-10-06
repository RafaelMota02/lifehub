import pool from '../db/pool.js';

export const getFinancialEntries = async (req, res) => {
  try {
    // Get user ID from authenticated user
    const userId = req.user.id;
    
    const { rows } = await pool.query(
      `SELECT * FROM finances 
       WHERE user_id = $1 
       ORDER BY date DESC`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFinancialEntry = async (req, res) => {
  const { amount, type, category, description } = req.body;
  const userId = req.user.id; // Get user ID from authenticated user
  
  try {
    const { rows } = await pool.query(
      `INSERT INTO finances (user_id, amount, type, category, description, date) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *`,
      [userId, amount, type, category, description]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFinancialEntry = async (req, res) => {
  const { id } = req.params;
  const { amount, type, category, description } = req.body;
  const userId = req.user.id;

  try {
    // Check if the entry exists and belongs to the user
    const checkEntry = await pool.query(
      'SELECT * FROM finances WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkEntry.rows.length === 0) {
      return res.status(404).json({ error: 'Entry not found or access denied' });
    }

    // Update the entry
    const { rows } = await pool.query(
      `UPDATE finances 
       SET amount = $1, type = $2, category = $3, description = $4, date = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`,
      [amount, type, category, description, id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFinancialEntry = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if the entry exists and belongs to the user
    const checkEntry = await pool.query(
      'SELECT * FROM finances WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkEntry.rows.length === 0) {
      return res.status(404).json({ error: 'Entry not found or access denied' });
    }

    await pool.query(
      'DELETE FROM finances WHERE id = $1',
      [id]
    );
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: error.message });
  }
};
