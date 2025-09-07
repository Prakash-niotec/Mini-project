
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /report/records - All parking records
router.get('/records', async (req, res) => {
	const [rows] = await pool.query(`
		SELECT r.record_id, r.person_id, r.vehicle_id, r.action, r.recorded_by, r.occurred_at
		FROM Parking_Record r
		ORDER BY r.occurred_at DESC
		LIMIT 100
	`);
	res.json(rows);
});

// GET /report/frequent-customers - Most frequent customers
router.get('/frequent-customers', async (req, res) => {
	const [rows] = await pool.query(`
		SELECT p.person_id, p.full_name, p.nic, COUNT(*) as visits
		FROM Parking_Record r
		JOIN Person p ON r.person_id = p.person_id
		WHERE p.role IN ('Customer', 'VIP')
		GROUP BY p.person_id
		ORDER BY visits DESC
		LIMIT 10
	`);
	res.json(rows);
});

// GET /report/active-vehicles - Vehicles currently parked
router.get('/active-vehicles', async (req, res) => {
	const [rows] = await pool.query(`
		SELECT v.vehicle_id, v.plate_number, p.full_name, p.nic
		FROM Vehicle v
		JOIN Person p ON v.person_id = p.person_id
		WHERE v.vehicle_id IN (
			SELECT vehicle_id FROM Parking_Record WHERE action = 'IN'
			AND record_id > IFNULL((SELECT MAX(record_id) FROM Parking_Record pr2 WHERE pr2.vehicle_id = Parking_Record.vehicle_id AND pr2.action = 'OUT'), 0)
		)
	`);
	res.json(rows);
});

module.exports = router;
