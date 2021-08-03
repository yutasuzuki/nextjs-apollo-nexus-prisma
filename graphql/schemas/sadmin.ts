import { Sadmin as S } from 'nexus-prisma'
import { objectType, extendType, stringArg, nonNull, interfaceType } from 'nexus'
import admin from "libs/firebase-admin"
import { EXPIRES_IN } from '../../constants'

const ISadminUser = interfaceType({
  name: 'ISadminUser',
  definition(t) {
    t.nonNull.field(S.id.name, {
      type: S.id.type
    })
    t.string('uid')
    t.string('email')
  },
  resolveType() {
    return null
  },
})


export const SadminUser = objectType({
  name: 'SadminUser',
  definition(t) {
    t.implements(ISadminUser)
  }
})

export const AuthSadminUser = objectType({
  name: 'AuthSadminUser',
  definition(t) {
    t.implements(ISadminUser)
    t.string('token')
  }
})

export const SadminQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('sadmin', {
      type: SadminUser,
      async resolve(_root, _args, { prisma, sadmin }) {
        if (!sadmin) {
          return null
        }
        const { uid } = await admin.auth().verifySessionCookie(sadmin, true)
        return prisma.sadmin.findUnique({
          where: { uid }
        })
      },
    })
  },
})

export const SadminMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signupSadmin', {
      type: AuthSadminUser,
      args: {
        token: nonNull(stringArg()),
      },
      async resolve(root, args, { prisma }) {
        try {
          const token = await admin.auth().createSessionCookie(args?.token, { expiresIn: EXPIRES_IN })
          const { uid, email } = await admin.auth().verifySessionCookie(token, true)
          const res = await prisma.sadmin.create({
            data: { uid, email }
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
    t.field('signinSadmin', {
      type: AuthSadminUser,
      args: {
        token: nonNull(stringArg()),
      },
      async resolve(root, args, { prisma }) {
        try {
          const token = await admin.auth().createSessionCookie(args?.token, { expiresIn: EXPIRES_IN })
          const { uid } = await admin.auth().verifySessionCookie(token, true)
          const res = await prisma.sadmin.findUnique({
            where: { uid }
          })
          if (!res) return null
          return {
            ...res,
            token
          }
        } catch(error) {
          console.error(error)
          return null
        }
      },
    })
  },
})
