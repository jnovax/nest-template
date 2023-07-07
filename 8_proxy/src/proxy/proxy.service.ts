import { Injectable } from '@nestjs/common';
import type * as http from 'http';
import { request } from 'undici';
import { RequestUtils } from '../utils';
import { createPathRewriter } from './path.rewrite';

@Injectable()
export class ProxyService {
    async proxyThrough(req, res, options: ProxyOptions) {
        try {
            const opts = {
                method: req.method,
                query: req.query,
                headers: req.headers,
                body: undefined
            };

            delete opts.headers['content-length'];

            if (RequestUtils.matchMethod(req, 'POST') || RequestUtils.matchMethod(req, 'PUT') || RequestUtils.matchMethod(req, 'PATCH')) {
                if (RequestUtils.matchContentType(req, 'multipart/form-data')) {
                    delete opts.headers['content-type'];

                    let data = new FormData();
                    Object.entries(req.body).forEach(([key, value]) => {
                        data.append(key, value as string);
                    });
                    Object.values(req.files).forEach((item: Express.Multer.File) => {
                        data.append(item.fieldname, new Blob([item.buffer]), item.originalname);
                    });
                    opts.body = data;
                }
                else if (RequestUtils.matchContentType(req, 'application/json')) {
                    opts.headers['content-type'] = 'application/json';
                    opts.body = JSON.stringify(req.body);
                }
            }
            if (options.contentType) {
                opts.headers['content-type'] = options.contentType;
            }

            let requestPath = req.path;
            if (options.pathRewrite) {
                const pathRewriter = createPathRewriter(options.pathRewrite);
                requestPath = pathRewriter(requestPath);
            }

            const { body, statusCode } = await request(`${options.target}${requestPath}`, opts);

            res.status(statusCode);
            body.pipe(res);
        }
        catch (error) {
            console.log(error);
            res.json({
                "statusCode": 400,
                "message": `Cannot ${req.method} ${req.path}`,
                "error": error.message
            });
        }
    }
}

export interface ProxyOptions<TReq = http.IncomingMessage, TRes = http.ServerResponse> {
    target: string,
    contentType?: string,
    pathRewrite?:
    | { [regexp: string]: string }
    | ((path: string, req: TReq) => string | undefined)
    | ((path: string, req: TReq) => Promise<string>);
}