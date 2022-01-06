import { objectType, extendType, stringArg, nonNull, interfaceType, intArg } from 'nexus'
import admin from 'libs/firebase-admin'
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

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: UserObject,
      async resolve(_root, _args, { prisma, token }) {
        try {
          const { uid } = await admin.auth().verifyIdToken(token)
          if (!uid) return null
          return prisma.user.findUnique({
            where: { uid },
            include: { company: true },
          })
        } catch(error) {
          console.log(error)
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
      type: UserObject,
      args: {
        companyId: nonNull(intArg()),
        name: nonNull(stringArg()),
      },
      async resolve(root, args, { prisma, token }) {
        try {
          const { name, companyId } = args
          const { uid, email } = await admin.auth().verifyIdToken(token)
          await prisma.userSignupRequest.deleteMany({
            where: { email }
          })
          return prisma.user.create({
            data: { uid, email, name, companyId, admin: false }
          })
        } catch(error) {
          console.log(error)
          return null
        }
      },
    })
    t.field('signinUser', {
      type: UserObject,
      async resolve(root, args, { prisma, token }) {
        try {
          const { uid } = await admin.auth().verifyIdToken(token)
          return prisma.user.findUnique({
            where: { uid }
          })
        } catch(error) {
          console.log(error)
          return null
        }
      },
    })
  },
})
