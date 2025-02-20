import { Response } from "express";

export class HandleError {
    static handle(error : any, res : Response){
        console.error("Controller Error:", error);

        // If it's a validation error
        if (error instanceof Error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        // If it's an unauthorized access error
        if (error.name === "UnauthorizedError") {
            return res.status(401).json({ success: false, message: "Unauthorized access." });
        }

        // If it's a forbidden action
        if (error.name === "ForbiddenError") {
            return res.status(403).json({ success: false, message: "Forbidden action." });
        }

        // Unexpected server error
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}