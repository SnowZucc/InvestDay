import { apiHandler } from "../../../helpers/api/api-handler";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
import { User } from "../../../types/user.type";
// listen for get request
export default apiHandler(getAll);

async function getAll(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }

  let prisma = new PrismaClient();

  // check user
  const users: User[] = await prisma.user.findMany();

  for (let i = 0; i < users.length; i++) {
    delete users[i].password;
  }
  // return basic user details and token
  return res.status(200).json(users);
}