import ApiClient from "@/helpers/api-client/apiClient";
import { ApiError } from "@/interfaces/api-client/Error";
import { Result, err, ok } from "neverthrow";

interface DetectionResult {
  data: {
    detections: { language: string; isReliable: boolean; confidence: number }[];
  };
}

export class LanguageDetectorApiClient {
  private readonly apiBaseUrl = "https://ws.detectlanguage.com";
  private readonly version = "0.2";
  private readonly apiKey = process.env.NEXT_PUBLIC_DETECT_LANGUAGE_API_KEY;
  private readonly languageDetectorApiClient = new ApiClient();

  async detectLanguage(text: string): Promise<Result<string, ApiError>> {
    const result = await this.languageDetectorApiClient.post<
      { q: string },
      DetectionResult
    >(
      `${this.apiBaseUrl}/${this.version}/detect`,
      { q: text },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (result.isErr()) {
      return err(result.error);
    }

    if (result.value.data.detections.length === 0) {
      return err({
        errorMessage: `0 detections for text: ${text}`,
        metadata: result.value,
      });
    }

    const reliableLanguage = result.value.data.detections.find(
      (language) => language.isReliable
    );
    if (!reliableLanguage) {
      return err({
        errorMessage: `Detected languages, but they weren't reliable.`,
        metadata: result.value,
      });
    }

    return ok(reliableLanguage.language);
  }
}
