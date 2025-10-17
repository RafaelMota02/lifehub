import bcrypt from 'bcrypt';
import pool from '../db/pool.js';

export const exportUserData = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get user profile
    const userQuery = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [userId]);
    const user = userQuery.rows[0];

    // Get all user data
    const [tasks, finances, moods, notes] = await Promise.all([
      pool.query('SELECT title, description, status, created_at FROM tasks WHERE user_id = $1', [userId]),
      pool.query('SELECT amount, description, type, category, date FROM finances WHERE user_id = $1', [userId]),
      pool.query('SELECT mood_level, notes, date FROM moods WHERE user_id = $1', [userId]),
      pool.query('SELECT title, content, created_at FROM notes WHERE user_id = $1', [userId])
    ]);

    const data = {
      profile: user,
      tasks: tasks.rows,
      finances: finances.rows,
      moods: moods.rows,
      notes: notes.rows,
      exportedAt: new Date().toISOString()
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="lifehub-data-${userId}.json"`);
    res.json(data);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
};

export const deleteAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    // Delete all user data in correct order (foreign key constraints)
    await pool.query('DELETE FROM task_tags WHERE task_id IN (SELECT id FROM tasks WHERE user_id = $1)', [userId]);
    await pool.query('DELETE FROM achievements WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM finances WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM moods WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM notes WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM tasks WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, email } = req.body;

  try {
    // Check if new email/username is already taken
    const checkQuery = await pool.query(
      'SELECT id FROM users WHERE (email = $1 OR username = $2) AND id != $3',
      [email, username, userId]
    );

    if (checkQuery.rows.length > 0) {
      return res.status(400).json({ error: 'Email or username already in use' });
    }

    const { rows } = await pool.query(
      'UPDATE users SET username = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING username, email',
      [username, email, userId]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    // Get current hashed password
    const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    const user = rows[0];

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hashedPassword, userId]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const submitFeedback = async (req, res) => {
  const userId = req.user.id;
  const { subject, message, type, priority, includeContact } = req.body;

  try {
    // Get user email for feedback if contact is included
    const { rows } = await pool.query('SELECT email, username FROM users WHERE id = $1', [userId]);
    const user = rows[0];

    // In a real application, you might want to:
    // 1. Store feedback in a feedback table
    // 2. Send an email with the feedback
    // 3. Send a notification to admins
    // For now, we'll just log it and return success
    const feedbackData = {
      userId,
      username: user.username,
      subject,
      message,
      type,
      priority
    };

    if (includeContact) {
      feedbackData.email = user.email;
    }

    feedbackData.timestamp = new Date().toISOString();

    console.log('Feedback received:', feedbackData);

    // Optionally, you could store feedback in a database table
    // await pool.query('INSERT INTO feedback (user_id, subject, message, type, priority, include_contact, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())', [userId, subject, message, type, priority, includeContact]);

    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};
