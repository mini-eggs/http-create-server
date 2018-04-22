import {
  createServer as createNodeServer,
  IncomingMessage,
  ServerResponse
} from "http";

export interface TRequest extends IncomingMessage {
  body: any;
}

export interface TResponse extends ServerResponse {
  json(js: any): void;
}

export type THandle = (req: TRequest, res: TResponse) => void;

export type TRoute = {
  test: RegExp;
  method: string;
  handle: THandle;
};

export interface ICreateServer {
  routes?: Array<TRoute>;
  port?: number;
  defaultHandle?: THandle;
  onListen?(): void;
}

const parse = (req: TRequest) =>
  new Promise((resolve, reject) => {
    let chunks = "";
    req.on("data", (chunk: Buffer) => {
      chunks += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(chunks.toString()));
      } catch (_) {
        resolve({
          /* not valid json, but this isn't necessarily an error. */
        });
      }
    });
    req.on("error", (err: Error) => {
      reject(err);
    });
  });

const mainHandle = (routes: Array<TRoute>, defaultHandle: THandle) => async (
  req: TRequest,
  res: TResponse
) => {
  try {
    req.body = await parse(req);
    res.json = (js: any) => {
      res.end(JSON.stringify(js));
    };

    const handle = routes.reduce(
      (total, { test, method, handle }) =>
        test.test(req.url) && req.method === method ? handle : total,
      defaultHandle
    );

    handle(req, res);
  } catch (err) {
    defaultHandle(req, res);
  }
};

const defaultProps: ICreateServer = {
  routes: [],
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
  defaultHandle: (req, res) => {
    res.end("Not found.");
  },
  onListen: () => {
    console.log("Server has been started.");
  }
};

export const createServer = (props: ICreateServer): (() => void) => {
  const args = { ...defaultProps, ...props };
  const handle = mainHandle(args.routes, args.defaultHandle);
  const server = createNodeServer(handle);
  return () => server.listen(args.port, args.onListen) || undefined;
};
