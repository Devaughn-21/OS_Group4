import { Router, Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import pool from "../db";

const router = Router();

// GET all users
router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST create a new user
router.post("/", async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, phone, license_number } = req.body;

    if (!first_name || !last_name || !email || !license_number) {
      return res.status(400).json({
        error: "first_name, last_name, email, and license_number are required",
      });
    }

    const sql = `
      INSERT INTO users
      (first_name, last_name, email, phone, license_number)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute<ResultSetHeader>(sql, [
      first_name,
      last_name,
      email,
      phone || null,
      license_number,
    ]);

    const [newUser] = await pool.query(
      "SELECT * FROM users WHERE user_id = ?",
      [result.insertId],
    );

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (err: any) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "A user with this email already exists",
      });
    }

    return res.status(500).json({ error: "Database error" });
  }
});

// PUT update a user by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const { first_name, last_name, email, phone, license_number } = req.body;

    if (!first_name || !last_name || !email || !license_number) {
      return res.status(400).json({
        error: "first_name, last_name, email, and license_number are required",
      });
    }

    const sql = `
      UPDATE users
      SET first_name = ?,
          last_name = ?,
          email = ?,
          phone = ?,
          license_number = ?
      WHERE user_id = ?
    `;

    const [result] = await pool.execute<ResultSetHeader>(sql, [
      first_name,
      last_name,
      email,
      phone || null,
      license_number,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const [updatedUser] = await pool.query(
      "SELECT * FROM users WHERE user_id = ?",
      [userId],
    );

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err: any) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "A user with this email already exists",
      });
    }

    return res.status(500).json({ error: "Database error" });
  }
});

// DELETE a user by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM users WHERE user_id = ?",
      [userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err: any) {
    console.error(err);

    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        error:
          "This user cannot be deleted because they have related rental records",
      });
    }

    return res.status(500).json({ error: "Database error" });
  }
});

export default router;
