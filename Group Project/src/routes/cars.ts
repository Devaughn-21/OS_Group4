import { Router, Request, Response } from "express";
import pool from "../db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const router = Router();

const CATEGORIES = ["economy", "standard", "luxury", "SUV"];

router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM cars");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      make,
      model,
      year,
      color,
      license_plate,
      category,
      daily_rate,
      is_available,
      mileage,
    } = req.body;

    if (
      !make ||
      !model ||
      !year ||
      !license_plate ||
      !category ||
      daily_rate === undefined
    ) {
      return res.status(400).json({
        error:
          "make, model, year, license_plate, category, and daily_rate are required",
      });
    }

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: `category must be one of: ${CATEGORIES.join(", ")}`,
      });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO cars
      (make, model, year, color, license_plate, category, daily_rate, is_available, mileage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        make,
        model,
        year,
        color ?? null,
        license_plate,
        category,
        daily_rate,
        is_available ?? true,
        mileage ?? null,
      ],
    );

    return res.status(201).json({
      car_id: result.insertId,
      make,
      model,
      year,
      color: color ?? null,
      license_plate,
      category,
      daily_rate,
      is_available: is_available ?? true,
      mileage: mileage ?? null,
    });
  } catch (err: any) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "A car with that license plate already exists",
      });
    }

    return res.status(500).json({
      error: "Database error",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      make,
      model,
      year,
      color,
      license_plate,
      category,
      daily_rate,
      is_available,
      mileage,
    } = req.body;

    if (
      !make ||
      !model ||
      !year ||
      !license_plate ||
      !category ||
      daily_rate === undefined
    ) {
      return res.status(400).json({
        error:
          "make, model, year, license_plate, category, and daily_rate are required",
      });
    }

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: `category must be one of: ${CATEGORIES.join(", ")}`,
      });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE cars
       SET make = ?,
           model = ?,
           year = ?,
           color = ?,
           license_plate = ?,
           category = ?,
           daily_rate = ?,
           is_available = ?,
           mileage = ?
       WHERE car_id = ?`,
      [
        make,
        model,
        year,
        color ?? null,
        license_plate,
        category,
        daily_rate,
        is_available ?? true,
        mileage ?? null,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Car not found",
      });
    }

    return res.status(200).json({
      car_id: Number(id),
      make,
      model,
      year,
      color: color ?? null,
      license_plate,
      category,
      daily_rate,
      is_available: is_available ?? true,
      mileage: mileage ?? null,
    });
  } catch (err: any) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "A car with that license plate already exists",
      });
    }

    return res.status(500).json({
      error: "Database error",
    });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body as Record<string, unknown>;

    const allowedFileds = [
      "make",
      "model",
      "year",
      "color",
      "license_plate",
      "category",
      "daily_rate",
      "is_available",
      "milage",
    ];
    const updates = Object.keys(body).filter((key) =>
      allowedFileds.includes(key),
    );

    if (updates.length === 0) {
      return res.status(400).json({ error: "No valid field provided" });
    }

    if ("category" in body && !CATEGORIES.includes(body.category as string)) {
      return res
        .status(400)
        .json({ error: `category must be on of: ${CATEGORIES.join(", ")}` });
    }

    const setClause = updates.map((key) => `${key} = ?`).join(", ");
    const values = updates.map((key) => body[key]);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE cars SET ${setClause} WHERE car_id = ?`,
      [...values, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM cars WHERE car_id = ?",
      [id],
    );
    res.json(rows[0]);
  } catch (err: any) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "A car with that license plate already exists" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM cars WHERE car_id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
