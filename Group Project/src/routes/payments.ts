import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "GET all payments" });
});

router.get("/:id", (req, res) => {
    res.json({ message: `GET payment ${req.params.id}` });
});

router.post("/", (req, res) => {
    res.json({ message: "POST create payment" });
});

export default router;
