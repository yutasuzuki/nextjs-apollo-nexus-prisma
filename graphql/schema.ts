import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from './schemas'

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(process.cwd(), "graphql", "_generated", "nexus-typegen.ts"),
    schema: join(process.cwd(), "graphql", "_generated", "schema.graphql"),
  },
  contextType: {
    module: join(process.cwd(), "graphql", "context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
})