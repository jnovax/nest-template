import { Request } from "express";

export function isObjectEmpty(obj) {
    for (const _ in obj) {
        return false;
    }
    return true;
}

export class RequestUtils {
    static matchMethod(req: Request, method: string): boolean {
        return req.method === method;
    }

    static matchContentType(req: Request, contentType: string): boolean {
        return req.headers['content-type']?.startsWith(contentType);
    }
}