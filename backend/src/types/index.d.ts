declare module 'xss-clean' {
  import { RequestHandler } from 'express';
  const xss: () => RequestHandler;
  export = xss;
}

declare module 'hpp' {
  import { RequestHandler } from 'express';
  interface HppOptions {
    whitelist?: string[];
  }
  const hpp: (options?: HppOptions) => RequestHandler;
  export = hpp;
}
