import { Context } from 'graphql/context'
import admin from 'libs/firebase-admin'

type AuthMiddleware = (root: {}, arg: any, context: Context) => Promise<boolean>

export const userAuthMiddleware: AuthMiddleware = async (root, args, { prisma, token }) => {
  try {
    const { uid } = await admin.auth().verifyIdToken(token)
    const result = await prisma.user.findUnique({ where: { uid } })
    return !!result
  } catch(e) {
    return false
  }
}

export const sadminAuthMiddleware: AuthMiddleware = async (root, args, { prisma, token }) => {
  try {
    const { uid } = await admin.auth().verifyIdToken(token)
    const result = await prisma.sadmin.findUnique({ where: { uid } })
    return !!result
  } catch(e) {
    return false
  }
}