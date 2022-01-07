import { objectType, extendType, stringArg, nonNull, interfaceType } from 'nexus'
import admin from 'libs/firebase-admin'
import { getSadmin } from 'graphql/utils/getSadmin'
import { sadminAuthMiddleware } from 'graphql/middlewares/authMiddleware'

const ISadminUser = interfaceType({
  name: 'ISadminUser',
  definition(t) {
    t.nonNull.field('id', {
      type: 'Int'
    })
    t.string('uid')
    t.string('email')
  },
  resolveType() {
    return null
  },
})


export const SadminUserObject = objectType({
  name: 'SadminUser',
  definition(t) {
    t.implements(ISadminUser)
  }
})

export const AuthSadminUserObject = objectType({
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
      type: SadminUserObject,
      authorize: sadminAuthMiddleware,
      async resolve(_root, _args, { prisma, token }) {
        try {
          return getSadmin({ prisma, token })
        } catch(error) {
          console.log(error)
          return null
        }
      },
    })
  },
})

export const SadminMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signupSadmin', {
      type: AuthSadminUserObject,
      async resolve(root, args, { prisma, token }) {
        try {
          const { uid, email } = await admin.auth().verifyIdToken(token)
          return prisma.sadmin.create({
            data: { uid, email }
          })
        } catch(error) {
          console.log(error)
          return null
        }
      },
    })
    t.field('signinSadmin', {
      type: AuthSadminUserObject,
      async resolve(root, args, { prisma, token }) {
        try {
          return getSadmin({ prisma, token })
        } catch(error) {
          console.error(error)
          return null
        }
      },
    })
  },
})
