import { ApiError } from "@/interfaces/api-client/Error";
import ApiClient from "@/helpers/api-client/apiClient";
import { Result, err, ok } from "neverthrow";
import {
  DBStory,
  RegisteringStory,
  RegisteringTranslatedFields,
  SharePlatform,
} from "@/interfaces/database/DBStory";
import { ServerAdvancedResponse } from "@/interfaces/server/ServerAdvancedResponse";
import { ServerApiResponse } from "@/interfaces/server/ServerApiResponse";
import { SignInRequest } from "@/interfaces/server/SignInRequest";
import { AuthResponse } from "@/interfaces/server/AuthResponse";
import { DBUser } from "@/interfaces/database/DBUser";
import { StoryFilters } from "@/interfaces/server/StoryFilters";
import { DBEvent, RegisteringEvent } from "@/interfaces/database/DBEvent";

export class ServerApiClient {
  private readonly apiBaseUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api`;
  private readonly apiVersion = 1;
  private readonly serverApiClient = new ApiClient();

  async getStories(
    {
      page = 1,
      limit = 20,
      isApproved,
      isAscending = false,
      isHighlighted,
      tags,
      search,
    }: StoryFilters = {
      page: 1,
      limit: 20,
      isAscending: false,
    }
  ): Promise<Result<ServerAdvancedResponse<DBStory[]>, ApiError>> {
    // Build the query
    let query = [];
    if (typeof isAscending === "boolean") {
      query.push(`sort=${isAscending ? "" : "-"}_id`);
    }
    if (typeof isApproved === "boolean") {
      query.push(`isApproved=${String(isApproved)}`);
    }
    if (typeof isHighlighted === "boolean") {
      query.push(`isHighlighted=${String(isHighlighted)}`);
    }
    if (limit) {
      query.push(`limit=${limit}`);
    }
    if (page) {
      query.push(`page=${page}`);
    }
    if (tags) {
      query.push(`tags[in]=${tags.join(",")}`);
    }
    if (search) {
      query.push(`text[search]=${search}`);
    }

    const result = await this.serverApiClient.get<
      ServerAdvancedResponse<DBStory[]>
    >(`${this.apiBaseUrl}/v${this.apiVersion}/stories?${query.join("&")}`);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
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

  async incrementStoryViews(storyId: string) {
    const result = await this.serverApiClient.put<
      {},
      ServerApiResponse<DBStory>
    >(`${this.apiBaseUrl}/v${this.apiVersion}/stories/${storyId}/view`, {});

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.data);
  }

  async translateStory(
    storyId: string,
    translatedFields: RegisteringTranslatedFields
  ) {
    const result = await this.serverApiClient.put<
      { translatedFields: RegisteringTranslatedFields },
      ServerApiResponse<DBStory>
    >(`${this.apiBaseUrl}/v${this.apiVersion}/stories/${storyId}/translate`, {
      translatedFields,
    });

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.data);
  }

  async signIn(credentials: SignInRequest) {
    const result = await this.serverApiClient.post<SignInRequest, AuthResponse>(
      `${this.apiBaseUrl}/v${this.apiVersion}/auth/login`,
      credentials
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }

  async getUserByToken(token: string) {
    const result = await this.serverApiClient.get<ServerApiResponse<DBUser>>(
      `${this.apiBaseUrl}/v${this.apiVersion}/auth/me`,
      { headers: { Cookie: `token=${token}` } }
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }

  async createEvent(event: RegisteringEvent) {
    const result = await this.serverApiClient.post<
      RegisteringEvent,
      ServerApiResponse<DBEvent>
    >(`${this.apiBaseUrl}/v${this.apiVersion}/events`, event);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }
}
