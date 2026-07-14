import app from "../src/app";

export default async function handler(req: any, res: any) {
  return app(req, res);
}
