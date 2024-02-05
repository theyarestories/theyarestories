import { LanguageDetectorApiClient } from "@/apis/LanguageDetectorApiClient";
import { MixpanelApiClient } from "@/apis/MixpanelApiClient";
import { ServerApiClient } from "@/apis/ServerApiClient";
import ThemeButton from "@/components/button/ThemeButton";
import InputContainer from "@/components/input/InputContainer";
import ThemeMDEditor from "@/components/md-editor/ThemeMDEditor";
import ThemeSelect from "@/components/select/ThemeSelect";
import allLanguages from "@/config/all-languages/allLanguages";
import consts from "@/config/consts";
import ApiClient from "@/helpers/api-client/apiClient";
import getTranslatedStory from "@/helpers/stories/getTranslatedStory";
import mapLanguageCodesToOptions from "@/helpers/stories/mapLanguageCodesToOptions";
import storyHasLanguage from "@/helpers/stories/storyHasLanguage";
import getLanguageByCode from "@/helpers/translations/getLanguageByCode";
import mapLanguagesToOptions from "@/helpers/translations/mapLanguagesToOptions";
import { ApiError } from "@/interfaces/api-client/Error";
import { EventType } from "@/interfaces/database/DBEvent";
import {
  DBStory,
  DBTranslation,
  RegisteringTranslation,
} from "@/interfaces/database/DBStory";
import { LanguageOption } from "@/interfaces/languages/LanguageOption";
import { MixpanelEvent } from "@/interfaces/mixpanel/MixpanelEvent";
import { Result, err, ok } from "neverthrow";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useAsyncFn } from "react-use";

const Markdown = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Skeleton count={4} />,
  }
);

type TranslationFields = {
  author: string;
  protagonist: string;
  story: string;
  job: string;
};

type Props = {
  story: DBStory;
  mode: "add" | "approve";
  unapprovedTranslation?: DBTranslation;
};

const serverApiClient = new ServerApiClient();
const apiClient = new ApiClient();
const languageDetectorApiClient = new LanguageDetectorApiClient();
const mixpanelApiClient = new MixpanelApiClient();

const languagesOptions = mapLanguagesToOptions(allLanguages);

function TranslateForm({ story, mode, unapprovedTranslation }: Props) {
  const router = useRouter();
  const t = useTranslations("TranslateForm");

  let initialFromLanguage = getLanguageByCode(story.translationLanguage);
  if (mode === "approve" && unapprovedTranslation) {
    initialFromLanguage = getLanguageByCode(unapprovedTranslation.fromLanguage);
  }
  const [fromLanguage, setFromLanguage] = useState(initialFromLanguage);

  let initialToLanguage = null;
  if (mode === "approve" && unapprovedTranslation) {
    initialToLanguage = getLanguageByCode(
      unapprovedTranslation.translationLanguage
    );
  }
  const [toLanguage, setToLanguage] = useState<LanguageOption | null>(
    initialToLanguage
  );

  let translatedStory = story;
  if (fromLanguage) {
    translatedStory = getTranslatedStory(story, fromLanguage.code);
  }

  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  let initialTranslationFields = {
    author: mixpanelApiClient.getUserId(),
    protagonist: "",
    story: "",
    job: "",
  };
  if (mode === "approve" && unapprovedTranslation) {
    initialTranslationFields = {
      author: unapprovedTranslation.author,
      protagonist: unapprovedTranslation.protagonist,
      story: unapprovedTranslation.story,
      job: unapprovedTranslation.job || "",
    };
  }
  const [translationFields, setTranslationFields] = useState<TranslationFields>(
    initialTranslationFields
  );
  const [translationFieldsErrors, setTranslationFieldsErrors] = useState({
    languageError: "",
    protagonistError: "",
    storyError: "",
    jobError: "",
  });

  const validateTranslationFields = async (
    translationFields: TranslationFields,
    toLanguage: LanguageOption | null
  ): Promise<Result<true, false>> => {
    // lannguage
    let languageError = "";
    if (!toLanguage) {
      languageError = t("language_required");
    }

    // protagonist
    let protagonistError = "";
    if (!translationFields.protagonist) {
      protagonistError = t("name_required");
    }

    // job
    let jobError = "";
    if (story.job && !translationFields.job) {
      jobError = t("job_required");
    }

    // story
    let storyError = "";
    if (!translationFields.story) {
      storyError = t("story_required");
    }
    const languageResult = await languageDetectorApiClient.detectLanguage(
      translationFields.story
    );
    if (
      toLanguage &&
      languageResult.isOk() &&
      languageResult.value !== toLanguage.code
    ) {
      storyError = t("wrong_language");
    }

    const allErrors = {
      languageError,
      protagonistError,
      jobError,
      storyError,
    };
    setTranslationFieldsErrors((prevErrors) => ({
      ...prevErrors,
      ...allErrors,
    }));
    const isValid = !Object.values(allErrors).some(Boolean);

    if (isValid) return ok(true);
    else return err(false);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTranslationFields((prevFields) => ({
      ...prevFields,
      [event.target.name]: event.target.value,
    }));
  };

  const [handleSubmitState, handleSubmit] = useAsyncFn(
    async (
      event: FormEvent<HTMLFormElement>,
      mode: Props["mode"],
      storyId: string,
      fromLanguage: LanguageOption | null,
      toLanguage: LanguageOption | null,
      translationFields: TranslationFields,
      translation?: DBTranslation
    ): Promise<Result<DBStory, ApiError>> => {
      event.preventDefault();
      setIsSubmittedOnce(true);
      setIsSubmitSuccess(false);

      // 1. validate fields
      const validationResult = await validateTranslationFields(
        translationFields,
        toLanguage
      );
      if (validationResult.isErr()) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return err({ errorMessage: "Story fields are not valid" });
      }

      const registeringTranslation: RegisteringTranslation = {
        ...translationFields,
        fromLanguage: fromLanguage?.code || "",
        translationLanguage: toLanguage?.code || "",
      };

      switch (mode) {
        case "add": {
          // 2. Submit the translation
          const translateResult = await serverApiClient.translateStory(
            storyId,
            registeringTranslation
          );
          if (translateResult.isErr()) {
            throw new Error(translateResult.error.errorMessage);
          }

          // 3. Reset all fields
          setIsSubmitSuccess(true);
          setIsSubmittedOnce(false);
          setTranslationFields(initialTranslationFields);
          setToLanguage(null);

          // 4. Send Mixpanel event
          mixpanelApiClient.event(MixpanelEvent["Translate Story"], {
            "Translation Language": toLanguage?.name,
            "Story ID": storyId,
            "Story Protagonist": translationFields.protagonist,
          });

          return ok(translateResult.value);
        }
        case "approve": {
          // 2. approve the translation
          const approveResult = await apiClient.put<
            {
              storyId: string;
              translationId: string;
              translation: RegisteringTranslation;
            },
            { success: boolean; data: DBStory }
          >("/api/stories/approve-translation", {
            storyId: story?._id || "",
            translationId: translation?._id || "",
            translation: registeringTranslation,
          });
          if (approveResult.isErr()) {
            throw new Error(approveResult.error.errorMessage);
          }

          // 3. Send database event
          serverApiClient.createEvent({
            type: EventType.translate_story,
            metadata: {
              translationId: translation?._id,
              translationLanguage: toLanguage?.code,
              storyId: storyId,
              storyProtagonist: translationFields.protagonist,
            },
          });

          setIsSubmitSuccess(true);
          router.push("/admin");
          return ok(approveResult.value.data);
        }
        default: {
          throw new Error(`Story form is submitted with unknown mode: ${mode}`);
        }
      }
    }
  );

  useEffect(
    function getFromLanguageFromQuery() {
      if (router.query.lang && mode === "add") {
        const fromLanguage = getLanguageByCode(router.query.lang as string);

        if (fromLanguage && storyHasLanguage(story, fromLanguage.code)) {
          setFromLanguage(fromLanguage);
        }
      }
    },
    [router.query, languagesOptions, mode]
  );

  useEffect(
    function validateFieldsOnChange() {
      if (isSubmittedOnce) {
        validateTranslationFields(translationFields, toLanguage);
      }
    },
    [isSubmittedOnce, translationFields, toLanguage]
  );

  // Success message
  let successMessage = "";
  if (isSubmitSuccess) {
    switch (mode) {
      case "add":
        successMessage = t("submit_success", {
          reviewHours: consts.reviewHours,
        });
        break;
      case "approve":
        successMessage = t("approve_success");
        break;
    }
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) =>
        handleSubmit(
          event,
          mode,
          story._id,
          fromLanguage,
          toLanguage,
          translationFields,
          unapprovedTranslation
        )
      }
      noValidate
    >
      {/* Language select */}
      <div className="flex gap-3">
        <div className="flex-1">
          <InputContainer label={t("from_language")} required>
            <ThemeSelect<LanguageOption>
              options={mapLanguageCodesToOptions(
                translatedStory.translations.map(
                  (translation) => translation.translationLanguage
                ),
                languagesOptions
              )}
              selected={
                languagesOptions.find(
                  (lang) => lang.code === fromLanguage?.code
                ) || null
              }
              handleChange={setFromLanguage}
              placeholder={t("select_language")}
            />
          </InputContainer>
        </div>
        <div className="flex-1">
          <InputContainer
            label={t("to_language")}
            required
            error={translationFieldsErrors.languageError}
          >
            <ThemeSelect<LanguageOption>
              options={languagesOptions.filter(
                (lang) => !storyHasLanguage(story, lang.code)
              )}
              selected={toLanguage}
              handleChange={setToLanguage}
              placeholder={t("select_language")}
            />
          </InputContainer>
        </div>
      </div>

      <hr />

      {/* name */}
      <InputContainer
        label={t("name")}
        error={translationFieldsErrors.protagonistError}
        required
      >
        <input
          className="w-full input read-only:bg-gray-300"
          type="text"
          value={translatedStory.protagonist}
          readOnly
          tabIndex={-1}
        />
        <input
          className="w-full input"
          type="text"
          name="protagonist"
          value={translationFields.protagonist}
          placeholder={
            toLanguage
              ? t("name_placeholder", { language: toLanguage.name })
              : t("name_placeholder_fallback")
          }
          onChange={handleChange}
        />
      </InputContainer>

      {/* job */}
      {translatedStory.job && (
        <InputContainer
          label={t("job")}
          error={translationFieldsErrors.jobError}
          required
        >
          <input
            className="w-full input read-only:bg-gray-300"
            type="text"
            value={translatedStory.job}
            readOnly
            tabIndex={-1}
          />
          <input
            className="w-full input"
            type="text"
            name="job"
            value={translationFields.job}
            placeholder={
              toLanguage
                ? t("job_placeholder", { language: toLanguage.name })
                : t("job_placeholder_fallback")
            }
            onChange={handleChange}
          />
        </InputContainer>
      )}

      {/* story */}
      <InputContainer
        label={t("story")}
        error={translationFieldsErrors.storyError}
        required
      >
        <Markdown
          className="leading-7 rounded-sm border p-2 bg-gray-300 max-h-48 overflow-auto"
          source={translatedStory.story}
        />
        <ThemeMDEditor
          value={translationFields.story}
          onChange={(value) =>
            setTranslationFields((prev) => ({ ...prev, story: value }))
          }
        />
      </InputContainer>

      <ThemeButton
        className="w-full"
        type="submit"
        loading={handleSubmitState.loading}
        disabled={handleSubmitState.loading}
        successMessage={successMessage}
        errorMessage={handleSubmitState.error ? t("something_went_wrong") : ""}
      >
        {mode === "approve" ? t("approve") : t("submit")}
      </ThemeButton>
    </form>
  );
}

export default TranslateForm;
