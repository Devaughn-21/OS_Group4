import {Router, Request, Response} from "express";
// import pool from "../db"; database connection

const router = Router();

router.get("/payments", (_req: Request, res: Response) => {
    res.json({data: "Here is payment data"});
})



export default router;