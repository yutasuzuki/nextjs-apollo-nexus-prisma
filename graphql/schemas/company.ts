import { Company as C } from 'nexus-prisma'
import { objectType, extendType, stringArg, nonNull, interfaceType, intArg } from 'nexus'
import admin from "libs/firebase-admin"
import { EXPIRES_IN } from '../../constants'
import { User } from './user'
import { USER_QUERY } from 'graphql/queries'
import { User as U } from 'interfaces'

export const ICompany = interfaceType({
  name: 'ICompany',
  definition(t) {
    t.field(C.id.name, {
      type: C.id.type
    })
    t.string('email')
    t.string('name')
  },
  resolveType() {
    return null
  },
})


export const Company = objectType({
  name: 'Company',
  definition(t) {
    t.implements(ICompany)
  }
})

export const AuthCompany = objectType({
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
      type: Company,
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
      type: Company,
      async resolve(_root, _args, { prisma }) {
        try {
          return prisma.company.findMany()
        } catch(error) {
          return []
        }
      },
    })
    t.list.field('companyUsers', {
      type: User,
      async resolve(_root, _args, { prisma, user, gqlClient }) {
        if (user) {
          const { user } = await gqlClient.request<{ user: U }>(USER_QUERY)
          return prisma.user.findMany({
            where: {
              companyId: user.companyId
            }
          })
        } else {
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
      type: AuthCompany,
      args: {
        token: nonNull(stringArg()),
        name: nonNull(stringArg()),
        companyName: nonNull(stringArg()),
      },
      async resolve(root, args, { prisma }) {
        try {
          const { token: t, name, companyName } = args
          const token = await admin.auth().createSessionCookie(t, { expiresIn: EXPIRES_IN })
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
