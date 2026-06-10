import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        report: "DriveEasy Report",
        revenue: "sample",
        rentals: "sample"
    });
});

export default router;
