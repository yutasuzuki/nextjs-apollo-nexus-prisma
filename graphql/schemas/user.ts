import { objectType, extendType, stringArg, nonNull, interfaceType, intArg } from 'nexus'
import admin from "libs/firebase-admin"
import { FIREBASE_EXPIRES_IN } from '../../constants'
import { CompanyObject } from './company'

const IUser = interfaceType({
  name: 'IUser',
  definition(t) {
    t.nonNull.field('id', {
      type: 'Int'
    })
    t.string('uid')
    t.string('email')
    t.string('name')
    t.boolean('admin')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('deletedAt', { type: 'DateTime' })
    t.field('company', {
      type: CompanyObject
    })
  },
  resolveType() {
    return null
  },
})


export const UserObject = objectType({
  name: 'User',
  definition(t) {
    t.implements(IUser)
  }
})

export const AuthUserObject = objectType({
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
      type: UserObject,
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
      type: AuthUserObject,
      args: {
        companyId: nonNull(intArg()),
        name: nonNull(stringArg()),
        token: nonNull(stringArg()),
      },
      async resolve(root, args, { prisma }) {
        try {
          const { token: t, name, companyId } = args
          const token = await admin.auth().createSessionCookie(t, { expiresIn: FIREBASE_EXPIRES_IN })
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
      type: AuthUserObject,
      args: {
        token: nonNull(stringArg()),
      },
      async resolve(root, args, { prisma }) {
        try {
          const token = await admin.auth().createSessionCookie(args?.token, { expiresIn: FIREBASE_EXPIRES_IN })
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
