import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "GET all users" });
});

router.get("/:id", (req, res) => {
    res.json({ message: `GET user ${req.params.id}` });
});

router.post("/", (req, res) => {
    res.json({ message: "POST create user" });
});

router.put("/:id", (req, res) => {
    res.json({ message: `PUT update user ${req.params.id}` });
});

router.delete("/:id", (req, res) => {
    res.json({ message: `DELETE user ${req.params.id}` });
});

export default router;
