import { ApiError } from "@/interfaces/api-client/Error";
import ApiClient from "@/helpers/api-client/apiClient";
import { Result, err, ok } from "neverthrow";
import { Story } from "@/interfaces/database/Story";
import { ServerAdvancedResponse } from "@/interfaces/server/ServerAdvancedResponse";

export class ServerApiClient {
  private readonly apiBaseUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api`;
  private readonly apiVersion = 1;
  private readonly serverApiClient = new ApiClient();

  async getStories(): Promise<Result<Story[], ApiError>> {
    const result = await this.serverApiClient.get<
      ServerAdvancedResponse<Story[]>
    >(
      `${this.apiBaseUrl}/v${this.apiVersion}/stories?isApproved=false&sort=-_id&limit=50`
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.data);
  }
}
