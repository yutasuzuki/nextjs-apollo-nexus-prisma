import { objectType, extendType, stringArg, nonNull, interfaceType } from 'nexus'
import admin from "libs/firebase-admin"
import { UserObject } from './user'
import { sadminAuthMiddleware } from 'graphql/middlewares/authMiddleware'

export const ICompany = interfaceType({
  name: 'ICompany',
  definition(t) {
    t.nonNull.field('id', {
      type: 'Int'
    })
    t.string('email')
    t.string('name')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.field('deletedAt', { type: 'DateTime' })
  },
  resolveType() {
    return null
  },
})


export const CompanyObject = objectType({
  name: 'Company',
  definition(t) {
    t.implements(ICompany)
  }
})

export const CompanyQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('company', {
      type: CompanyObject,
      args: {
        id: nonNull(stringArg())
      },
      async resolve(_root, { id }, { prisma }) {
        try {
          return prisma.company.findUnique({
            where: { id: Number(id) }
          })
        } catch(error) {
          return null
        }
      },
    })
    t.list.field('companies', {
      type: CompanyObject,
      async resolve(_root, _args, { prisma }) {
        try {
          return prisma.company.findMany()
        } catch(error) {
          return []
        }
      },
    })
  },
})

export const CompanyMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signupCompany', {
      type: UserObject,
      args: {
        name: nonNull(stringArg()),
        companyName: nonNull(stringArg()),
      },
      async resolve(root, args, { prisma, token }) {
        try {
          const { name, companyName } = args
          const { uid, email } = await admin.auth().verifyIdToken(token)
          const company = await prisma.company.create({
            data: {
              email,
              name: companyName
            }
          })
          return prisma.user.create({
            data: {
              uid,
              email,
              name,
              companyId: company.id,
              admin: true
            }
          })
        } catch(error) {
          console.log(error)
          return null
        }
      },
    })
  },
})
