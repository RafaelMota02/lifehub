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
  const finalDueDate = due_date === '' ? null : due_date;
  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks (user_id, title, description, status, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, title, description, status, finalDueDate]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { status, title, description, due_date } = req.body;

  console.log('=== UPDATE TASK REQUEST ===');
  console.log('Task ID:', id);
  console.log('Request body:', req.body);
  console.log('User ID:', req.user?.id);

  try {
    // Build dynamic update query with only provided fields
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
      console.log('Adding status update:', status);
    }
    if (title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      values.push(title);
      paramIndex++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(description);
      paramIndex++;
    }
    if (due_date !== undefined) {
      const finalDue = due_date === '' ? null : due_date;
      updates.push(`due_date = $${paramIndex}`);
      values.push(finalDue);
      paramIndex++;
    }

    // Always update the timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    console.log('Adding updated_at = CURRENT_TIMESTAMP');

    if (updates.length === 1) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id); // Add id at the end
    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    console.log('=== EXECUTING QUERY ===');
    console.log('Query:', query);
    console.log('Values:', values);

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      console.log('=== NO ROWS UPDATED ===');
      return res.status(404).json({ error: 'Task not found' });
    }

    console.log('=== UPDATE SUCCESSFUL ===');
    console.log('Updated task:', rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error('=== UPDATE TASK ERROR ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
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
