import { ServerApiClient } from "@/apis/ServerApiClient";
import { HttpStatusCode } from "axios";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const serverApiClient = new ServerApiClient();

  const userResult = await serverApiClient.getUserByToken(
    req.cookies.token || ""
  );

  if (userResult.isErr()) {
    return res
      .status(
        userResult.error.errorStatus || HttpStatusCode.InternalServerError
      )
      .json({ success: false, data: null });
  }

  return res.status(200).json({ success: true, data: userResult.value.data });
}
