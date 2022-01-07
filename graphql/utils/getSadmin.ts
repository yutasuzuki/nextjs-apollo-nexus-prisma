import { Sadmin } from '@prisma/client'
import { Context } from 'graphql/context'
import admin from 'libs/firebase-admin'

type GetSadmin = (ctx: Pick<Context, 'prisma' | 'token'>) => Promise<Sadmin>
export const getSadmin: GetSadmin = async ({ prisma, token }) => {
  try {
    const { uid } = await admin.auth().verifyIdToken(token)
    return prisma.sadmin.findUnique({
      where: { uid }
    })
  } catch(error) {
    return undefined
  }
}