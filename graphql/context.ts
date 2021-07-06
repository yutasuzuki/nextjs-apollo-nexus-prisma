import { prisma } from "./client";
import { PrismaClient } from "@prisma/client"

export interface Context {
  prisma: PrismaClient
  auth: string
}

export const context = ({ req }) => {
  // const token = localStorage.getItem('token')
  // req.headers.authorization = `Bearer ${token}`
  // console.log('req.req', req)
  return { prisma, auth: 'hoge' };
}