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
    t.string(U.email.name)
  }
})

export const Auth = objectType({
  name: 'Auth',
  description: U.$description,
  definition(t) {
    t.string('name'),
    t.string('text'),
    t.field('user', {
      type: User,
    })
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
    t.field('updateUser', {
      type: Auth,
      args: {
        // id: nonNull(intArg()),
        name: nonNull(stringArg()),
      },
      resolve(_root, _args, ctx) {
        console.log('updateUser')
        console.log('_root', _root)
        console.log('_args', _args)
        console.log('ctx', ctx)
        return {
          text: 'hoge',
          user: {
            id: 1,
            name: 'yuta',
            email: 'yuta@example.com'
          }
        }
      },
    }),
    t.field('signupUser', {
      type: U.$name,
      args: {
        // id: nonNull(intArg()),
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        console.log(_root)
        console.log(args)
        // console.log(ctx.prisma)
        return {
          id: 1,
          name: 'hoge',
          email: 'hoge'
        }
      },
    })
  },
})