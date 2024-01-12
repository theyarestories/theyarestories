import { ServerApiClient } from "@/apis/ServerApiClient";
import { RegisteringStory } from "@/interfaces/database/DBStory";
import { HttpStatusCode } from "axios";
import { NextApiResponse, NextApiRequest } from "next";

interface ExtendedRequest extends NextApiRequest {
  body: {
    storyId: string;
    story: RegisteringStory;
  };
}

export default async function handler(
  req: ExtendedRequest,
  res: NextApiResponse
) {
  const serverApiClient = new ServerApiClient();

  const result = await serverApiClient.approveStory(
    req.cookies.token || "",
    req.body.storyId,
    req.body.story
  );

  if (result.isErr()) {
    return res
      .status(result.error.errorStatus || HttpStatusCode.InternalServerError)
      .json({ success: false, data: null });
  }

  return res
    .status(HttpStatusCode.Ok)
    .json({ success: true, data: result.value });
}
