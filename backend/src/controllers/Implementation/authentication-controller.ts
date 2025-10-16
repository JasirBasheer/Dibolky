import { Request, Response } from "express";
import { IAuthenticationController } from "../Interface/IAuthenticationController";
import { inject, injectable } from "tsyringe";
import { IAuthenticationService } from "../../services/Interface/IAuthenticationService";
import { blacklistToken } from "../../config/redis.config";
import {
  HTTPStatusCodes,
  ResponseMessage,
  SendResponse,
} from "mern.common";
import { resetPasswordParamsSchema } from "@/validators";

@injectable()
export class AuthenticationController implements IAuthenticationController {
  constructor(
    @inject("AuthenticationService")
    private readonly _authenticationService: IAuthenticationService
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body;

    let tokens = await this._authenticationService.login(email, password, role);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: false,
      secure: false,
      maxAge: 2 * 60 * 1000,
    });
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    let token: string = req.cookies.accessToken ?? null;
    await blacklistToken(req.tokenDetails, token);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, role } = req.body;
    await this._authenticationService.resetPassword(email, role);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token } = resetPasswordParamsSchema.parse(req.params);
    const { newPassword } = req.body;

    await this._authenticationService.changePassword(token, newPassword);
    SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS);
  };
}
