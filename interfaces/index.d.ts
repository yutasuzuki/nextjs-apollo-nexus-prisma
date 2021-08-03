import { User as U, Company as C } from '@prisma/client'

export type User = (U & {
  company?: C,
})