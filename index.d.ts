import { NextFunction, Request, Response } from "express";

declare global {
  enum RESPONSE_CODES {
    P_ERROR__FORBIDDEN = "P_ERROR_F",
    P_ERROR__NOT_FOUND = "P_ERROR_NF",
    P_ERROR__UNAUTHORIZED = "P_ERROR_UNAUTHORIZED",
    S_ERROR_INTERNAL = "S_ERROR_INTERNAL",
    REQ_VALID_ERROR = "REQ_VALID_ERROR",
    DB_ERROR_MYSQL = "DB_ERROR_MYSQL",
    DB_ERROR_SEQUELIZE = "DB_ERROR_SEQUELIZE",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    BASIC_SUCCESS = "BASIC_SUCCESS",
    SUCCESS = "SUCCESS",
    BASIC_SUCCESS__CREATED = "BASIC_SUCCESS_CREATED",
    SUCCESS__CREATED = "SUCCESS_C",
  }
  const sendResponse: (
    formedResponse: FormedResponse,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
  type ResponseToSent = {
    timestamp: number;
    status: number;
    errorCode: RESPONSE_CODES | null;
    message: string;
    data: null | unknown;
  };
  type FormedResponse = {
    responseCode: RESPONSE_CODES;
    data?: { data: unknown; message: string };
    message?: string;
    details?: { body: [{ message: string }] };
    dbData?: { sqlMessage: string };
  };
}
export { RESPONSE_CODES, ResponseToSent, FormedResponse, sendResponse };
