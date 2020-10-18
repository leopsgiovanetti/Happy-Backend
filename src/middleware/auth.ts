import JWT from 'jsonwebtoken';
import { promisify } from 'util';
import {Request, Response, NextFunction} from 'express';

interface Decoded {
    id: number;
    iat: number;
    exp: number;
}

export default async function auth(request: Request, response: Response, next: NextFunction){
    const authHeader = request.headers.authorization;
    console.log(authHeader);

    if (!authHeader){
        return response.status(401).send({ error: "No token provided" });
    }

    const [scheme, token] = authHeader.split(" ");

    try {
        const decoded:any = await promisify(JWT.verify)(token, "secret");
        
        request.userId = decoded.id;
        console.log(request.userId)
        next();

    } catch (error) {
        return response.status(401).send({ error: "Token invalid" });
    }

}