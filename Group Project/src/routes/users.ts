import {Router, Request, Response} from "express";
// import pool from "../db"; database connection

const router = Router();

router.get("/users", (_req: Request, res: Response) => {
    res.json({data: "Here is user data"});
})



export default router;