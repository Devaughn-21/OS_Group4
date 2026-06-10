import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "GET all cars" });
});

router.get("/:id", (req, res) => {
    res.json({ message: `GET car ${req.params.id}` });
});

router.post("/", (req, res) => {
    res.json({ message: "POST create car" });
});

router.put("/:id", (req, res) => {
    res.json({ message: `PUT update car ${req.params.id}` });
});

router.delete("/:id", (req, res) => {
    res.json({ message: `DELETE car ${req.params.id}` });
});

export default router;
