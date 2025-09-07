const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /vip - List all VIP customers
router.get('/', async (req, res) => {
	const [rows] = await pool.query(
		`SELECT v.vip_id, v.vip_code, v.registered_at, p.person_id, p.nic, p.full_name
		 FROM VIP_Customer v JOIN Person p ON v.person_id = p.person_id`
	);
	res.json(rows);
});

// POST /vip - Add a new VIP (must already exist as Person with role 'VIP')
router.post('/', async (req, res) => {
	const { person_id, vip_code } = req.body;
	try {
		// Check if VIP_Customer already exists for this person or vip_code
		const [existing] = await pool.query(
			'SELECT * FROM VIP_Customer WHERE person_id = ? OR vip_code = ?',
			[person_id, vip_code]
		);
		if (existing.length) {
			return res.status(400).json({ error: 'VIP already exists for this person or VIP code.' });
		}
		const [result] = await pool.query(
			'INSERT INTO VIP_Customer (person_id, vip_code) VALUES (?, ?)',
			[person_id, vip_code]
		);
		res.status(201).json({ vip_id: result.insertId });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = router;
