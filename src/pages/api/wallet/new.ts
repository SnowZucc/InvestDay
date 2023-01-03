import { apiHandler } from "../../../helpers/api/api-handler";
import jwt from "jsonwebtoken";
import { Request } from "../../../types/request.type";

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import getConfig from "next/config";
import transactionsService from "../../../services/transactions/transactions.service";
const { serverRuntimeConfig } = getConfig();

// listen for get request
export default apiHandler(getAll);

async function getAll(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }

  let prisma = new PrismaClient();
  const wallets = await prisma.wallet.findMany({
    where: {
      userId: req.auth.sub,
    },
  });
  if (wallets.length < 3) {
    const newWallet = await prisma.wallet.create({
      data: {
        userId: req.auth.sub,
      },
    });
    transactionsService.createAdmin(newWallet.id.toString(), 10000);

    return res.status(200).json(newWallet);
  } else {
    throw "You already have the maximum number of wallets";
  }
  // check user
}
