import { Response } from "express";

export class HandleError {
    static handle(error : any, res : Response) : void {
        console.log("Error : ",error);
        if (error instanceof Error) {
            console.log("instance error calling")
            res.status(400).json({ success: false, message: error.message });
            return ;
        }
        
        if (error.name === "UnauthorizedError") {
            res.status(401).json({ success: false, message: "Unauthorized access." });
            return ;
        }
        
        if (error.name === "ForbiddenError") {
            res.status(403).json({ success: false, message: "Forbidden action." });
            return ;
        }
        
        res.status(500).json({ success: false, message: "Internal Server Error" });
        return ;
    }
}