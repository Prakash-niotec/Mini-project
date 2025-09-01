const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /person - List all people (with optional role filter)
router.get('/', async (req, res) => {
	const { role } = req.query;
	let sql = 'SELECT * FROM Person';
	let params = [];
	if (role) {
		sql += ' WHERE role = ?';
		params.push(role);
	}
	const [rows] = await pool.query(sql, params);
	res.json(rows);
});

// POST /person - Add a new person
router.post('/', async (req, res) => {
	const { nic, full_name, role } = req.body;
	try {
		const [result] = await pool.query(
			'INSERT INTO Person (nic, full_name, role) VALUES (?, ?, ?)',
			[nic, full_name, role]
		);
		res.status(201).json({ person_id: result.insertId });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// PUT /person/:id - Edit a person
router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { full_name, role } = req.body;
	try {
		await pool.query(
			'UPDATE Person SET full_name = ?, role = ? WHERE person_id = ?',
			[full_name, role, id]
		);
		res.json({ message: 'Updated' });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = router;
