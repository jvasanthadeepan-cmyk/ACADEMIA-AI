/**
 * ACADEMIA AI Backend - Express Edition
 * Optimized for Render + PostgreSQL
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

// --- User Profile Endpoints ---

app.get('/api/profile/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/profile', async (req, res) => {
    try {
        const { email, full_name, college_name, course, year_of_study, target_career } = req.body;
        const result = await pool.query(
            `INSERT INTO users (email, full_name, college_name, course, year_of_study, target_career, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, 'social_login_placeholder')
       ON CONFLICT (email) DO UPDATE SET
       full_name = EXCLUDED.full_name,
       college_name = EXCLUDED.college_name,
       course = EXCLUDED.course,
       year_of_study = EXCLUDED.year_of_study,
       target_career = EXCLUDED.target_career
       RETURNING *`,
            [email, full_name, college_name, course, year_of_study, target_career]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Study Tasks Endpoints ---

app.get('/api/tasks/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await pool.query('SELECT * FROM study_tasks WHERE user_id = $1 ORDER BY deadline ASC', [user_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const { user_id, subject, topic, deadline, status } = req.body;
        const result = await pool.query(
            'INSERT INTO study_tasks (user_id, subject, topic, deadline, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, subject, topic, deadline, status]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Focus Sessions Endpoints ---

app.post('/api/focus-sessions', async (req, res) => {
    try {
        const { user_id, duration_minutes } = req.body;
        const result = await pool.query(
            'INSERT INTO focus_sessions (user_id, duration_minutes) VALUES ($1, $2) RETURNING *',
            [user_id, duration_minutes]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Start Server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
