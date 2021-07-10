import { Sadmin as S } from 'nexus-prisma'
import { objectType, extendType, stringArg, nonNull, intArg } from 'nexus'
import admin from "libs/firebase-admin"
import { EXPIRES_IN } from '../../constants'

export const SignupSadmin = objectType({
  name: S.$name,
  definition(t) {
    t.field(S.id.name, {
      type: S.id.type
    })
    t.string('uid')
    t.string('email')
    t.string('token')
  }
})

export const SadminMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signupSadmin', {
      type: SignupSadmin,
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
  },
})
