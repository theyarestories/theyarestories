import { LanguageDetectorApiClient } from "@/apis/LanguageDetectorApiClient";
import { ServerApiClient } from "@/apis/ServerApiClient";
import ThemeButton from "@/components/button/ThemeButton";
import Container from "@/components/container/Container";
import InputContainer from "@/components/input/InputContainer";
import Layout from "@/components/layout/Layout";
import ThemeMDEditor from "@/components/md-editor/ThemeMDEditor";
import ThemeSelect from "@/components/select/ThemeSelect";
import allLanguages from "@/config/all-languages/allLanguages";
import consts from "@/config/consts";
import getTranslatedStory from "@/helpers/stories/getTranslatedStory";
import mapLanguageCodesToOptions from "@/helpers/stories/mapLanguageCodesToOptions";
import storyHasLanguage from "@/helpers/stories/storyHasLanguage";
import getLanguageByCode from "@/helpers/translations/getLanguageByCode";
import mapLanguagesToOptions from "@/helpers/translations/mapLanguagesToOptions";
import { ApiError } from "@/interfaces/api-client/Error";
import { DBStory } from "@/interfaces/database/DBStory";
import { LanguageOption } from "@/interfaces/languages/LanguageOption";
import { Result, err, ok } from "neverthrow";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
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
  protagonist: string;
  story: string;
  job: string;
};

const serverApiClient = new ServerApiClient();
const languageDetectorApiClient = new LanguageDetectorApiClient();

const languagesOptions = mapLanguagesToOptions(allLanguages);

function TranslateStoryPage({
  story,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const t = useTranslations("TranslateStoryPage");

  const initialFromLanguage = Object.keys(story.translations)[0];
  const [fromLanguage, setFromLanguage] = useState(
    getLanguageByCode(languagesOptions, initialFromLanguage)
  );
  const [toLanguage, setToLanguage] = useState<LanguageOption | null>(null);

  let translatedStory = story;
  if (fromLanguage) {
    translatedStory = getTranslatedStory(story, fromLanguage.code);
  }

  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  const initialTranslationFields = {
    protagonist: "",
    story: "",
    job: "",
  };
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
      storyId: string,
      toLanguage: LanguageOption | null,
      translationFields: TranslationFields
    ): Promise<Result<DBStory, ApiError>> => {
      event.preventDefault();
      setIsSubmittedOnce(true);

      // 1. validate fields
      const validationResult = await validateTranslationFields(
        translationFields,
        toLanguage
      );
      if (validationResult.isErr()) {
        return err({ errorMessage: "Story fields are not valid" });
      }

      // 2. Submit the translation
      const translateResult = await serverApiClient.translateStory(
        storyId,
        toLanguage?.code || "",
        { ...translationFields, translationLanguage: toLanguage?.code || "" }
      );
      if (translateResult.isErr()) {
        throw new Error(translateResult.error.errorMessage);
      }

      setTranslationFields(initialTranslationFields);
      setToLanguage(null);

      return ok(translateResult.value);
    }
  );

  useEffect(
    function getFromLanguageFromQuery() {
      if (router.query.lang) {
        const fromLanguage = getLanguageByCode(
          languagesOptions,
          router.query.lang as string
        );

        if (
          fromLanguage &&
          Object.keys(story.translations).includes(fromLanguage.code)
        ) {
          setFromLanguage(fromLanguage);
        }
      }
    },
    [router.query, languagesOptions]
  );

  useEffect(
    function validateFieldsOnChange() {
      if (isSubmittedOnce) {
        validateTranslationFields(translationFields, toLanguage);
      }
    },
    [isSubmittedOnce, translationFields, toLanguage]
  );

  return (
    <Layout
      pageTitle={t("page_title", { protagonist: translatedStory.protagonist })}
      pageDescription={t("page_description", {
        protagonist: translatedStory.protagonist,
      })}
      withStickyFooter={false}
    >
      <Container>
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="title-1 !font-normal leading-6">
              {t.rich("heading", {
                protagonist: translatedStory.protagonist,
                b: (value) => <b className="font-semibold">{value}</b>,
              })}
            </h1>
            <p className="text-gray-600">{t("subheading")}</p>
          </div>

          <form
            className="space-y-3"
            onSubmit={(event) =>
              handleSubmit(event, story._id, toLanguage, translationFields)
            }
            noValidate
          >
            {/* Language select */}
            <div className="flex gap-3">
              <div className="flex-1">
                <InputContainer label={t("from_language")} required>
                  <ThemeSelect<LanguageOption>
                    options={mapLanguageCodesToOptions(
                      Object.keys(translatedStory.translations),
                      languagesOptions
                    )}
                    selected={fromLanguage}
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
                      (lang) => lang.code !== fromLanguage?.code
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
              successMessage={
                handleSubmitState.value && handleSubmitState.value.isOk()
                  ? t("submit_success", { reviewHours: consts.reviewHours })
                  : ""
              }
              errorMessage={
                handleSubmitState.error ? t("something_went_wrong") : ""
              }
            >
              {t("submit")}
            </ThemeButton>
          </form>
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({ params, query }) => {
  const storyResult = await serverApiClient.getStoryById(
    params?.storyId as string
  );

  if (storyResult.isErr()) {
    return {
      notFound: true,
    };
  }

  // Translate
  const langParam = query.lang;
  let translatedStory = storyResult.value;
  if (
    typeof langParam === "string" &&
    storyHasLanguage(storyResult.value, langParam)
  ) {
    translatedStory = getTranslatedStory(storyResult.value, langParam);
  }

  return { props: { story: translatedStory } };
}) satisfies GetServerSideProps<{
  story: DBStory;
}>;

export default TranslateStoryPage;
