import { Request, Response, Router } from "express";
import userRoute from "./user";

const router = Router();

// api health
router.get("/health", (req: Request, res: Response) => res.send("API is Working."));

router.use("/user", userRoute);


export default router;
