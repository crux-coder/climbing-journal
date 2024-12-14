import { NextFunction, Request, Response } from "express";
import AuthModel, { SigninRequest, SignupRequest } from "src/auth/auth.model";
import { z } from "zod";

const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string(),
  last_name: z.string(),
});

const SigninpRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    SigninpRequestSchema.parse(req.body);
    const body = req.body as SigninRequest;
    const { user, session } = await AuthModel.signin(body);

    if (!session) {
      throw new Error("Session not found");
    }

    res.cookie("sb_access_token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.cookie("sb_refresh_token", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ user, session });
  } catch (error) {
    next(error);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    SignupRequestSchema.parse(req.body);
    const body = req.body as SignupRequest;
    const { user, session } = await AuthModel.signup({
      email: body.email,
      password: body.password,
      options: {
        data: {
          first_name: body.first_name,
          last_name: body.last_name,
        },
      },
    });

    res.status(201).json({ user, session });
  } catch (error) {
    next(error);
  }
};
