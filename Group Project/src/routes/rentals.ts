import { Router, Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import pool from "../db";

const router = Router();

const RENTAL_STATUSES = [
  "pending",
  "active",
  "completed",
  "cancelled",
];

// GET all rentals
router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rentals");

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Database error",
    });
  }
});

// POST create a new rental
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      user_id,
      car_id,
      start_date,
      end_date,
      total_cost,
      status,
    } = req.body;

    if (
      !user_id ||
      !car_id ||
      !start_date ||
      !end_date ||
      total_cost === undefined
    ) {
      return res.status(400).json({
        error:
          "user_id, car_id, start_date, end_date, and total_cost are required",
      });
    }

    const rentalStatus = status || "pending";

    if (!RENTAL_STATUSES.includes(rentalStatus)) {
      return res.status(400).json({
        error:
          "status must be pending, active, completed, or cancelled",
      });
    }

    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({
        error: "end_date must be after start_date",
      });
    }

    const sql = `
      INSERT INTO rentals
      (user_id, car_id, start_date, end_date, total_cost, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute<ResultSetHeader>(sql, [
      user_id,
      car_id,
      start_date,
      end_date,
      total_cost,
      rentalStatus,
    ]);

    const [newRental] = await pool.query(
      "SELECT * FROM rentals WHERE rental_id = ?",
      [result.insertId],
    );

    return res.status(201).json({
      message: "Rental created successfully",
      rental: newRental,
    });
  } catch (err: any) {
    console.error(err);

    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        error: "The user_id or car_id does not exist",
      });
    }

    return res.status(500).json({
      error: "Database error",
    });
  }
});

// PUT update a rental by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const rentalId = Number(req.params.id);

    if (!Number.isInteger(rentalId) || rentalId <= 0) {
      return res.status(400).json({
        error: "Invalid rental ID",
      });
    }

    const {
      user_id,
      car_id,
      start_date,
      end_date,
      total_cost,
      status,
    } = req.body;

    if (
      !user_id ||
      !car_id ||
      !start_date ||
      !end_date ||
      total_cost === undefined ||
      !status
    ) {
      return res.status(400).json({
        error:
          "user_id, car_id, start_date, end_date, total_cost, and status are required",
      });
    }

    if (!RENTAL_STATUSES.includes(status)) {
      return res.status(400).json({
        error:
          "status must be pending, active, completed, or cancelled",
      });
    }

    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({
        error: "end_date must be after start_date",
      });
    }

    const sql = `
      UPDATE rentals
      SET user_id = ?,
          car_id = ?,
          start_date = ?,
          end_date = ?,
          total_cost = ?,
          status = ?
      WHERE rental_id = ?
    `;

    const [result] = await pool.execute<ResultSetHeader>(sql, [
      user_id,
      car_id,
      start_date,
      end_date,
      total_cost,
      status,
      rentalId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Rental not found",
      });
    }

    const [updatedRental] = await pool.query(
      "SELECT * FROM rentals WHERE rental_id = ?",
      [rentalId],
    );

    return res.status(200).json({
      message: "Rental updated successfully",
      rental: updatedRental,
    });
  } catch (err: any) {
    console.error(err);

    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        error: "The user_id or car_id does not exist",
      });
    }

    return res.status(500).json({
      error: "Database error",
    });
  }
});

// DELETE a rental by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const rentalId = Number(req.params.id);

    if (!Number.isInteger(rentalId) || rentalId <= 0) {
      return res.status(400).json({
        error: "Invalid rental ID",
      });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM rentals WHERE rental_id = ?",
      [rentalId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Rental not found",
      });
    }

    return res.status(200).json({
      message: "Rental deleted successfully",
    });
  } catch (err: any) {
    console.error(err);

    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        error:
          "This rental cannot be deleted because it has related records",
      });
    }

    return res.status(500).json({
      error: "Database error",
    });
  }
});

export default router;