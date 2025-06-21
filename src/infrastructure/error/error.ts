import { ZodError } from "zod";
import { Response } from "express";

export class HandleError {
    static handle(error: any, res: Response): void {

        if (error instanceof ZodError) {
            const messageString = error.errors.map(err => err.message).join(", ");
            res.status(400).json({ success: false, message: messageString });
            return;
        }

        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
            return;
        }

        if (error instanceof ZodError) {
            console.log("Zod error");
            const messages = error.errors.map((err) => err.message);
            console.log("messages : ",messages);
            return;
            res.status(400).json({ success: false, message: messages });
            return;
        }

        if (error.name === "UnauthorizedError") {
            res.status(401).json({ success: false, message: "Unauthorized access." });
            return;
        }

        if (error.name === "ForbiddenError") {
            res.status(403).json({ success: false, message: "Forbidden action." });
            return;
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });
        return;
    }
}