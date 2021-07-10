import { prisma } from "./client";
import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next";

export interface Context {
  prisma: PrismaClient
  sadmin: string
}

export const context = ({ req }) => {
  const sadmin = req.headers.sadmin
  return {
    prisma,
    sadmin
  };
}