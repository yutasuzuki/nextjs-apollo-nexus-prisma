import { objectType, extendType, stringArg, nonNull, interfaceType, intArg } from 'nexus'
import admin from "libs/firebase-admin"
import { FIREBASE_EXPIRES_IN } from '../../constants'
import { UserObject } from './user'
import { USER_QUERY } from 'graphql/queries'
import { User } from 'interfaces'

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

export const AuthCompanyObject = objectType({
  name: 'AuthCompany',
  definition(t) {
    t.implements(ICompany)
    t.string('token')
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
    // t.list.field('companyUsers', {
    //   type: UserObject,
    //   async resolve(_root, _args, { prisma, user, gqlClient }) {
    //     if (user) {
    //       const { user } = await gqlClient.request<{ user: User }>(USER_QUERY)
    //       return prisma.user.findMany({
    //         where: {
    //           companyId: user.company.id
    //         }
    //       })
    //     } else {
    //       return []
    //     }
    //   },
    // })
  },
})

export const CompanyMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signupCompany', {
      type: AuthCompanyObject,
      args: {
        token: nonNull(stringArg()),
        name: nonNull(stringArg()),
        companyName: nonNull(stringArg()),
      },
      async resolve(root, args, { prisma }) {
        try {
          const { token: t, name, companyName } = args
          const token = await admin.auth().createSessionCookie(t, { expiresIn: FIREBASE_EXPIRES_IN })
          const { uid, email } = await admin.auth().verifySessionCookie(token, true)
          const company = await prisma.company.create({
            data: {
              email,
              name: companyName
            }
          })
          const res = await prisma.user.create({
            data: {
              uid,
              email,
              name: args.name,
              companyId: company.id,
              admin: true
            }
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
