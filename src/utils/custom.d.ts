declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      // Auth namespace
      auth: {
        token: string;
      };
    }
  }
}

export {};
