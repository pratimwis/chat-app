import { Request, Response } from "express";
import { catchErrors } from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constant/http";
import AppErrorCode from "../constant/appErrorCode";

export const testController = catchErrors(
  async (req: Request, res: Response) => {
    const response = true;
    appAssert(response,UNAUTHORIZED,"Access Denied",AppErrorCode.AccessDenied);
    res.json({ success: true });
  }
);
