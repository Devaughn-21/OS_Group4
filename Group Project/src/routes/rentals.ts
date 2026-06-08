import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "GET all rentals" });
});

router.get("/:id", (req, res) => {
    res.json({ message: `GET rental ${req.params.id}` });
});

router.post("/", (req, res) => {
    res.json({ message: "POST create rental" });
});

router.put("/:id", (req, res) => {
    res.json({ message: `PUT update rental ${req.params.id}` });
});

router.delete("/:id/:id_juice", (req, res) => {
    res.json({
        message: `DELETE rental ${req.params.id}`,
        confirmation: req.params.id_juice
    });
});

export default router;
