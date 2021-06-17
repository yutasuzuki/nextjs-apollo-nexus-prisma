import { User as U } from 'nexus-prisma'
import { objectType, extendType, stringArg, nonNull, intArg } from 'nexus'


export const User = objectType({
  name: U.$name,
  description: U.$description,
  definition(t) {
    t.field(U.id.name, {
      type: U.id.type,
      description: U.id.description
    })
    t.string(U.name.name) 
    t.string(U.image.name) 
  }
})

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('users', {
      type: U.$name,
      resolve(_root, _args, ctx) {
        return ctx.prisma.user.findMany()
      },
    })
  },
})

export const UserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateUser', {
      type: U.$name,
      args: {
        id: nonNull(intArg()),
        name: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        const data = {
          name: args.name,
        }
        return ctx.prisma.user.update({ data, where: { id: args.id } })
      },
    })
  },
})