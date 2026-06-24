import {Router, Request, Response} from "express";
// import pool from "../db"; database connection

const router = Router();

router.get("/rentals", (_req: Request, res: Response) => {
    res.json({data: "Here is rental data"});
})



export default router;