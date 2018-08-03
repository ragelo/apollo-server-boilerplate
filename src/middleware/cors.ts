import {NextFunction, Request, Response} from 'express';


const allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
const allowedHeaders: string[] = ['Accept', 'Authorization', 'Content-Type'];

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  let allowOrigin = '*';
  const requestOrigin = req.headers['origin'];
  if (requestOrigin) {
    allowOrigin = requestOrigin.toString();
  }

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));

  const requestMethod = req.headers['access-control-request-method'];
  if (requestMethod && allowedMethods.find((method: string) => method === requestMethod)) {
    res.setHeader('Access-Control-Allow-Method', requestMethod.toString());
  }

  res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};
