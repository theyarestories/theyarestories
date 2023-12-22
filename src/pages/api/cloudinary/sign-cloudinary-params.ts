import { SignApiOptions, v2 as cloudinary } from "cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
  signature?: string;
  error?: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: string;
}

export default function signCloudinaryParams(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const body = JSON.parse(req.body) || {};
  const { paramsToSign } = body;

  try {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );
    res.status(200).json({
      signature,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}
