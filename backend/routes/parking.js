const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /parking/in - Register vehicle IN
router.post('/in', async (req, res) => {
	const { nic, plate_number, vip_code, recorded_by } = req.body;
	const conn = await pool.getConnection();
	try {
		await conn.beginTransaction();

		// 1. Validate recorded_by is Security
		const [securityRows] = await conn.query('SELECT role FROM Person WHERE person_id = ?', [recorded_by]);
		if (!securityRows.length || securityRows[0].role !== 'Security') {
			throw new Error('recorded_by must be Security');
		}

		// 2. Find or create person by NIC
		let person_id;
		let personRole = 'Customer';
		let personRow;
		if (vip_code) personRole = 'VIP';
		const [personRows] = await conn.query('SELECT * FROM Person WHERE nic = ?', [nic]);
		if (personRows.length) {
			person_id = personRows[0].person_id;
			personRow = personRows[0];
			if (vip_code && personRow.role !== 'VIP') {
				throw new Error('Person.role must be VIP for VIP entry');
			}
		} else {
			const [result] = await conn.query('INSERT INTO Person (nic, full_name, role) VALUES (?, ?, ?)', [nic, nic, personRole]);
			person_id = result.insertId;
			personRow = { person_id, role: personRole };
		}

		// 3. If VIP, ensure VIP_Customer exists
		if (vip_code) {
			const [vipRows] = await conn.query('SELECT * FROM VIP_Customer WHERE person_id = ?', [person_id]);
			if (!vipRows.length) {
				await conn.query('INSERT INTO VIP_Customer (person_id, vip_code) VALUES (?, ?)', [person_id, vip_code]);
			}
		}

		// 4. Find or create vehicle by plate_number and person_id
		let vehicle_id;
		const [vehicleRows] = await conn.query('SELECT * FROM Vehicle WHERE plate_number = ?', [plate_number]);
		if (vehicleRows.length) {
			if (vehicleRows[0].person_id !== person_id) {
				throw new Error('Vehicle does not belong to this person');
			}
			vehicle_id = vehicleRows[0].vehicle_id;
		} else {
			const [result] = await conn.query('INSERT INTO Vehicle (plate_number, person_id) VALUES (?, ?)', [plate_number, person_id]);
			vehicle_id = result.insertId;
		}

		// 5. Insert Parking_Record (action IN)
		await conn.query('INSERT INTO Parking_Record (person_id, vehicle_id, action, recorded_by) VALUES (?, ?, \'IN\', ?)', [person_id, vehicle_id, recorded_by]);

		await conn.commit();
		res.status(201).json({ message: 'Vehicle IN registered', person_id, vehicle_id });
	} catch (err) {
		await conn.rollback();
		res.status(400).json({ error: err.message });
	} finally {
		conn.release();
	}
});

// POST /parking/out - Register vehicle OUT
router.post('/out', async (req, res) => {
	const { nic, plate_number, vip_code, recorded_by } = req.body;
	const conn = await pool.getConnection();
	try {
		await conn.beginTransaction();

		// 1. Validate recorded_by is Security
		const [securityRows] = await conn.query('SELECT role FROM Person WHERE person_id = ?', [recorded_by]);
		if (!securityRows.length || securityRows[0].role !== 'Security') {
			throw new Error('recorded_by must be Security');
		}

		// 2. Find person by NIC
		const [personRows] = await conn.query('SELECT * FROM Person WHERE nic = ?', [nic]);
		if (!personRows.length) throw new Error('Person not found');
		const person_id = personRows[0].person_id;

		// 3. Find vehicle by plate_number
		const [vehicleRows] = await conn.query('SELECT * FROM Vehicle WHERE plate_number = ?', [plate_number]);
		if (!vehicleRows.length) throw new Error('Vehicle not found');
		const vehicle_id = vehicleRows[0].vehicle_id;
		if (vehicleRows[0].person_id !== person_id) {
			throw new Error('Vehicle does not belong to this person');
		}

		// 4. Insert Parking_Record (action OUT)
		await conn.query('INSERT INTO Parking_Record (person_id, vehicle_id, action, recorded_by) VALUES (?, ?, \'OUT\', ?)', [person_id, vehicle_id, recorded_by]);

		await conn.commit();
		res.status(201).json({ message: 'Vehicle OUT registered', person_id, vehicle_id });
	} catch (err) {
		await conn.rollback();
		res.status(400).json({ error: err.message });
	} finally {
		conn.release();
	}
});

// GET /parking/current - List currently parked vehicles
router.get('/current', async (req, res) => {
	// Vehicles with last action IN and not OUT
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
