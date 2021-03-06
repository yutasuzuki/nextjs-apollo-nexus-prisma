import { objectType, extendType, stringArg, nonNull, interfaceType, intArg, list } from 'nexus'
import { MailService } from 'services/MailService/MailService'
import { CryptoService } from 'services/CryptoService/CryptoService'
import { CompanyObject } from './company'
import { USER_QUERY } from 'graphql/queries'
import { User } from 'interfaces'


const IUserSignupRequest = interfaceType({
  name: 'IUserSignupRequest',
  definition(t) {
    t.nonNull.field('id', {
      type: 'Int'
    })
    t.string('email')
    t.string('hash')
    t.int('companyId')
  },
  resolveType() {
    return null
  },
  extensions() {

  }
})

export const SignupRequestUser = objectType({
  name: 'SignupRequestUser',
  definition(t) {
    t.implements(IUserSignupRequest)
    t.field('company', {
      type: CompanyObject
    })
  }
})

export const SignupRequestStatus = objectType({
  name: 'SignupRequestStatus',
  definition(t) {
    t.boolean('status')
    t.string('message')
  }
})

export const UserSignupRequestQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('signupRequestUser', {
      type: SignupRequestUser,
      args: {
        hash: nonNull(stringArg()),
      },
      async resolve(_root, { hash }, { prisma }) {
        try {
          return prisma.userSignupRequest.findUnique({
            where: {
              hash
            },
            include: {
              company: true
            }
          })
        } catch (error) {
          console.log(error)
          return null
        }
      },
    })
    t.field('signupRequestUsers', {
      type: list(SignupRequestUser),
      async resolve(_root, _args, { prisma, gqlClient }) {
        try {
          const { user } = await gqlClient.request<{ user: User }>(USER_QUERY)
          return prisma.userSignupRequest.findMany({
            where: {
              companyId: user.companyId,
              deletedAt: null
            }
          })
        } catch (error) {
          console.log(error)
          return []
        }
      },
    })
  },
})

export const UserSignupRequestMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addUserSignupRequest', {
      type: SignupRequestStatus,
      args: {
        email: nonNull(stringArg()),
      },
      async resolve(root, args, { prisma, gqlClient }) {
        try {
          const u = await prisma.user.findUnique({
            where: {
              email: args.email
            }
          })
          if (u) {
            return { status: false, message: '?????????????????????????????????????????????' }
          }
          const { user } = await gqlClient.request<{ user: User }>(USER_QUERY)
          const hash = CryptoService.hashing(JSON.stringify({ email: args.email, companyId: user.company?.id })).replace(/\+/g, '')
          await MailService.sendSignupUser(args.email, hash).catch(() => {
            return { status: false, message: '???????????????????????????????????????' }
          })
          await prisma.userSignupRequest.create({
            data: {
              email: args.email,
              companyId: user.company?.id,
              hash
            }
          })
          return { status: true }
        } catch(error) {
          console.log(error)
          return { status: false, message: '??????????????????????????????' }
        }
      },
    })
  },
})
