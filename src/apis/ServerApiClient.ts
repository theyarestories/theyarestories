import { ApiError } from "@/interfaces/api-client/Error";
import ApiClient from "@/helpers/api-client/apiClient";
import { Result, err, ok } from "neverthrow";
import {
  DBStory,
  RegisteringStory,
  RegisteringTranslation,
  SharePlatform,
} from "@/interfaces/database/DBStory";
import { ServerAdvancedResponse } from "@/interfaces/server/ServerAdvancedResponse";
import { ServerApiResponse } from "@/interfaces/server/ServerApiResponse";
import { SignInRequest } from "@/interfaces/server/SignInRequest";
import { AuthResponse } from "@/interfaces/server/AuthResponse";
import { DBUser } from "@/interfaces/database/DBUser";
import { StoryFilters } from "@/interfaces/server/StoryFilters";
import {
  DBEvent,
  EventType,
  RegisteringEvent,
} from "@/interfaces/database/DBEvent";
import { DBEmoji } from "@/interfaces/database/DBEmoji";
import { SignUpRequest } from "@/interfaces/server/SignUpRequest";
import { isBrowser } from "browser-or-node";
import { ForgotPasswordRequest } from "@/interfaces/server/ForgotPasswordRequest";
import { ResetPasswordRequest } from "@/interfaces/server/ResetPasswordRequest";

export class ServerApiClient {
  private readonly apiBaseUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api`;
  private readonly apiVersion = 1;
  private readonly serverApiClient = new ApiClient();

  async getStories({
    page = 1,
    limit = 20,
    isApproved,
    isTranslationApproved,
    isAscending = false,
    isHighlighted,
    isDeleted,
    tags,
    search,
    author,
    translationAuthor,
  }: StoryFilters): Promise<
    Result<ServerAdvancedResponse<DBStory[]>, ApiError>
  > {
    // Add default values
    if (!page) page = 1;
    if (isNaN(limit)) limit = 25;
    if (!isAscending) isAscending = false;
    if (!isDeleted) isDeleted = false;

    // Build the query
    let query = [];
    if (typeof isAscending === "boolean") {
      query.push(`sort=${isAscending ? "" : "-"}_id`);
    }
    if (typeof isApproved === "boolean") {
      query.push(`isApproved=${String(isApproved)}`);
    }
    if (typeof isTranslationApproved === "boolean") {
      query.push(`translations.isApproved=${String(isTranslationApproved)}`);
    }
    if (typeof isHighlighted === "boolean") {
      query.push(`isHighlighted=${String(isHighlighted)}`);
    }
    if (typeof isDeleted === "boolean") {
      query.push(`isDeleted=${String(isDeleted)}`);
    }
    if (!isNaN(limit)) {
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
    if (author) {
      query.push(`author=${author}`);
    }
    if (translationAuthor) {
      query.push(`translations.author=${translationAuthor}`);
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

  async incrementStoryViews(storyId: string, userId: string) {
    const result = await this.serverApiClient.put<
      { userId: string },
      ServerApiResponse<DBStory>
    >(`${this.apiBaseUrl}/v${this.apiVersion}/stories/${storyId}/view`, {
      userId,
    });

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.data);
  }

  async translateStory(
    storyId: string,
    translatedFields: RegisteringTranslation
  ) {
    const result = await this.serverApiClient.put<
      { translatedFields: RegisteringTranslation },
      ServerApiResponse<DBStory>
    >(`${this.apiBaseUrl}/v${this.apiVersion}/stories/${storyId}/translate`, {
      translatedFields,
    });

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.data);
  }

  async getUserByEmail(email: string): Promise<Result<DBUser, ApiError>> {
    const result = await this.serverApiClient.get<
      ServerAdvancedResponse<DBUser[]>
    >(`${this.apiBaseUrl}/v${this.apiVersion}/users?email=${email}`);

    if (result.isErr()) {
      return err(result.error);
    }

    if (result.value.data.length === 0) {
      return err({
        errorMessage: `User with email ${email} doesn't exist`,
      });
    }

    return ok(result.value.data[0]);
  }

  async getUserByUsername(username: string): Promise<Result<DBUser, ApiError>> {
    const result = await this.serverApiClient.get<
      ServerAdvancedResponse<DBUser[]>
    >(`${this.apiBaseUrl}/v${this.apiVersion}/users?username=${username}`);

    if (result.isErr()) {
      return err(result.error);
    }

    if (result.value.data.length === 0) {
      return err({
        errorMessage: `User with username ${username} doesn't exist`,
      });
    }

    return ok(result.value.data[0]);
  }

  async signUp(credentials: SignUpRequest) {
    const result = await this.serverApiClient.post<SignUpRequest, AuthResponse>(
      `${this.apiBaseUrl}/v${this.apiVersion}/auth/register`,
      credentials
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
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

  async signout(): Promise<Result<ServerApiResponse<{}>, ApiError>> {
    const result = await this.serverApiClient.get<ServerApiResponse<{}>>(
      `${this.apiBaseUrl}/v${this.apiVersion}/auth/logout`
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

    return ok(result.value.data);
  }

  async getEventsStatistics() {
    const result = await this.serverApiClient.get<
      ServerApiResponse<{ [key in EventType]: number }>
    >(`${this.apiBaseUrl}/v${this.apiVersion}/events/statistics`);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.data);
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

  async emojiStory(storyId: string, emoji: DBEmoji) {
    const result = await this.serverApiClient.put<
      DBEmoji,
      ServerApiResponse<DBStory>
    >(`${this.apiBaseUrl}/v${this.apiVersion}/stories/${storyId}/emoji`, emoji);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }

  async approveStory(token: string, storyId: string, story: RegisteringStory) {
    const result = await this.serverApiClient.put<
      RegisteringStory,
      ServerApiResponse<DBStory>
    >(
      `${this.apiBaseUrl}/v${this.apiVersion}/stories/${storyId}/approve`,
      story,
      { headers: { Cookie: `token=${token}` } }
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.data);
  }

  async approveTranslation(
    token: string,
    storyId: string,
    translationId: string,
    translation: RegisteringTranslation
  ) {
    const result = await this.serverApiClient.put<
      RegisteringTranslation,
      ServerApiResponse<DBStory>
    >(
      `${this.apiBaseUrl}/v${this.apiVersion}/stories/${storyId}/translations/${translationId}/approve`,
      translation,
      { headers: { Cookie: `token=${token}` } }
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value.data);
  }

  async forgotPassword(credentials: ForgotPasswordRequest) {
    const result = await this.serverApiClient.post<
      ForgotPasswordRequest,
      AuthResponse
    >(
      `${this.apiBaseUrl}/v${this.apiVersion}/auth/forgotpassword`,
      credentials
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }

  async resetPassword(credentials: ResetPasswordRequest, resetToken: string) {
    const result = await this.serverApiClient.put<
      ResetPasswordRequest,
      AuthResponse
    >(
      `${this.apiBaseUrl}/v${this.apiVersion}/auth/resetpassword/${resetToken}`,
      credentials
    );

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }
}
