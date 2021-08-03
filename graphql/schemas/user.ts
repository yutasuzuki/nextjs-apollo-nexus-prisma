import { User as U } from 'nexus-prisma'
import { objectType, extendType, stringArg, nonNull, interfaceType, intArg } from 'nexus'
import admin from "libs/firebase-admin"
import { EXPIRES_IN } from '../../constants'

const IUser = interfaceType({
  name: 'IUser',
  definition(t) {
    t.field(U.id.name, {
      type: U.id.type
    })
    t.string('uid')
    t.string('email')
    t.string('name')
    t.boolean('admin')
    t.string('createdAt')
    t.string('updatedAt')
  },
  resolveType() {
    return null
  },
})


export const User = objectType({
  name: 'User',
  definition(t) {
    t.implements(IUser)
    t.field(U.company)
  }
})

export const AuthUser = objectType({
  name: 'AuthUser',
  definition(t) {
    t.implements(IUser)
    t.string('token')
  }
})

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: User,
      async resolve(_root, _args, { prisma, user }) {
        if (user) {
          const { uid } = await admin.auth().verifySessionCookie(user, true)
          if (!uid) return null
          return prisma.user.findUnique({
            where: { uid },
            include: { company: true },
          })
        } else {
          return null
        }
      },
    })
  },
})

export const UserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signupUser', {
      type: AuthUser,
      args: {
        companyId: nonNull(intArg()),
        name: nonNull(stringArg()),
        token: nonNull(stringArg()),
      },
      async resolve(root, args, { prisma }) {
        try {
          const { token: t, name, companyId } = args
          const token = await admin.auth().createSessionCookie(t, { expiresIn: EXPIRES_IN })
          const { uid, email } = await admin.auth().verifySessionCookie(token, true)
          await prisma.userSignupRequest.deleteMany({
            where: { email }
          })
          const res = await prisma.user.create({
            data: { uid, email, name, companyId, admin: false }
          })
          return {
            ...res,
            token
          }
        } catch(error) {
          console.log(error)
          return null
        }
      },
    })
    t.field('signinUser', {
      type: AuthUser,
      args: {
        token: nonNull(stringArg()),
      },
      async resolve(root, args, { prisma }) {
        try {
          const token = await admin.auth().createSessionCookie(args?.token, { expiresIn: EXPIRES_IN })
          const { uid } = await admin.auth().verifySessionCookie(token, true)
          const res = await prisma.user.findUnique({
            where: { uid }
          })
          return {
            ...res,
            token
          }
        } catch(error) {
          console.log(error)
          return null
        }
      },
    })
  },
})
