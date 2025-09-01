const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /vehicle - List all vehicles (with optional person_id filter)
router.get('/', async (req, res) => {
	const { person_id } = req.query;
	let sql = 'SELECT * FROM Vehicle';
	let params = [];
	if (person_id) {
		sql += ' WHERE person_id = ?';
		params.push(person_id);
	}
	const [rows] = await pool.query(sql, params);
	res.json(rows);
});

// POST /vehicle - Add a new vehicle
router.post('/', async (req, res) => {
	const { plate_number, person_id } = req.body;
	try {
		const [result] = await pool.query(
			'INSERT INTO Vehicle (plate_number, person_id) VALUES (?, ?)',
			[plate_number, person_id]
		);
		res.status(201).json({ vehicle_id: result.insertId });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// PUT /vehicle/:id - Edit a vehicle
router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { plate_number } = req.body;
	try {
		await pool.query(
			'UPDATE Vehicle SET plate_number = ? WHERE vehicle_id = ?',
			[plate_number, id]
		);
		res.json({ message: 'Updated' });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = router;
