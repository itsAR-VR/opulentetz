declare module "pg" {
  export type PoolConfig = {
    connectionString?: string
    [key: string]: unknown
  }

  export class Pool {
    constructor(config?: PoolConfig)
  }
}

