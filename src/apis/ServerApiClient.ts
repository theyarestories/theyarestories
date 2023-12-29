import { ApiError } from "@/interfaces/api-client/Error";
import ApiClient from "@/helpers/api-client/apiClient";
import { Result, err, ok } from "neverthrow";
import {
  DBStory,
  RegisteringStory,
  SharePlatform,
} from "@/interfaces/database/Story";
import { ServerAdvancedResponse } from "@/interfaces/server/ServerAdvancedResponse";
import { ServerApiResponse } from "@/interfaces/server/ServerApiResponse";

export class ServerApiClient {
  private readonly apiBaseUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api`;
  private readonly apiVersion = 1;
  private readonly serverApiClient = new ApiClient();

  async getStories(): Promise<Result<DBStory[], ApiError>> {
    const result = await this.serverApiClient.get<
      ServerAdvancedResponse<DBStory[]>
    >(
      `${this.apiBaseUrl}/v${this.apiVersion}/stories?isApproved=false&sort=-_id&limit=50`
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.data);
  }

  async getStoryById(storyId: string): Promise<Result<DBStory, ApiError>> {
    const result = await this.serverApiClient.get<ServerApiResponse<DBStory>>(
      `${this.apiBaseUrl}/v${this.apiVersion}/stories/${storyId}`
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.data);
  }

  async createStory(
    story: RegisteringStory
  ): Promise<Result<DBStory, ApiError>> {
    const result = await this.serverApiClient.post<
      RegisteringStory,
      ServerApiResponse<DBStory>
    >(`${this.apiBaseUrl}/v${this.apiVersion}/stories`, story);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.data);
  }

  async incrementStoryShares(storyId: string, platform: SharePlatform) {
    const result = await this.serverApiClient.put<
      { platform: SharePlatform },
      ServerApiResponse<DBStory>
    >(`${this.apiBaseUrl}/v${this.apiVersion}/stories/${storyId}/share`, {
      platform,
    });

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.data);
  }
}
