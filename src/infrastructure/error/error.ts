import { Response } from "express";

export class HandleError {
    static handle(error : any, res : Response) : void {
        console.error("Controller Error:", error);

        if (error instanceof Error) {
            console.log("sending one")
            res.status(400).json({ success: false, message: error.message });
            return ;
        }
        
        if (error.name === "UnauthorizedError") {
            console.log("sending two")
            res.status(401).json({ success: false, message: "Unauthorized access." });
            return ;
        }
        
        if (error.name === "ForbiddenError") {
            console.log("sending three")
            res.status(403).json({ success: false, message: "Forbidden action." });
            return ;
        }
        
        console.log("sending four")
        res.status(500).json({ success: false, message: "Internal Server Error" });
        return ;
    }
}