import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import stocksService from "../../../services/stocks/stocks.service";
import { Request } from "../../../types/request.type";
import requestIp from 'request-ip';
//import stocksService from "../../../services/stocks/stocks.service";

// you can use the api now

export default apiHandler(info);

async function info(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  const { symbol, time } = req.query;

  //get ip address from request;
  const clientIp = requestIp.getClientIp(req);

  if (typeof symbol != "string") throw "Invalid request";
  enum times {
    minute = "1min" as any,
    minute_5 = "5min" as any,
    minute_15 = "15min" as any,
    minute_30 = "30min" as any,
    hour_1 = "1hour" as any,
    hour_4 = "4hour" as any,
  }
  const resp = await stocksService.getRecentPrices(
    symbol,
    time as unknown as times,
    req.auth.sub,
    clientIp as string,
  );

  return res.status(200).json(resp);
}
