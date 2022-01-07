import { User } from "interfaces"
import { Context } from 'graphql/context'
import admin from 'libs/firebase-admin'

type GetUser = (ctx: Pick<Context, 'prisma' | 'token'>) => Promise<User>
export const getUser: GetUser = async ({ prisma, token }) => {
  try {
    const { uid } = await admin.auth().verifyIdToken(token)
    return prisma.user.findUnique({
      where: { uid },
      include: { company: true },
    })
  } catch(error) {
    return undefined
  }
}