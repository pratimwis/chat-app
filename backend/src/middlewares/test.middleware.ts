import { Request,Response,NextFunction } from "express";

export const testMiddeware = (req:Request, res:Response, next:NextFunction) => {
  console.log('Test middleware executed');
  next();
}