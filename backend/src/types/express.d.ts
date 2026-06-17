import type { UserRecord } from "../types/index.js";

declare global {
  namespace Express {
    interface Locals {
      user: UserRecord;
    }
  }
}

export {};
