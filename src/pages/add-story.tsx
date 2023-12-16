import { ServerApiClient } from "@/apis/ServerApiClient";
import ThemeButton from "@/components/button/ThemeButton";
import Container from "@/components/container/Container";
import ThemeInput from "@/components/input/ThemeInput";
import Layout from "@/components/layout/Layout";
import ThemeSelect from "@/components/select/ThemeSelect";
import ThemeTextarea from "@/components/textarea/ThemeTextarea";
import allLanguages from "@/config/languages/allLanguages";
import getHomeLanguage from "@/helpers/translations/getHomeLanguage";
import { ApiError } from "@/interfaces/api-client/Error";
import { DBStory, RegisteringStory } from "@/interfaces/database/Story";
import { Result, err, ok } from "neverthrow";
import { useTranslations } from "next-intl";
import { ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import { useAsyncFn } from "react-use";

type LanguageOption = {
  name: string;
  code: string;
};

const languagesOptions = allLanguages.map((language) => ({
  name:
    language.name === language.nativeName
      ? language.name
      : `${language.name} (${language.nativeName})`,
  code: language.code,
}));

const serverApiClient = new ServerApiClient();

export default function AddStoryPage() {
  const t = useTranslations("AddStoryPage");

  const [selectedLanguage, setSelectedLanguage] = useState(languagesOptions[0]);
  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  const [storyFields, setStoryFields] = useState<RegisteringStory>({
    protagonist: "",
    city: "",
    story: "",
    avatar: "",
    images: [],
    job: "",
    dateOfBirth: "",
    translations: {},
  });
  const [storyFieldsErrors, setStoryFieldsErrors] = useState({
    protagonistError: "",
    cityError: "",
    storyError: "",
    imagesError: "",
    jobError: "",
    dateOfBirthError: "",
  });

  const validateStoryFields = (storyFields: RegisteringStory): boolean => {
    // protagonist
    let protagonistError = "";
    if (!storyFields.protagonist) {
      protagonistError = t("name_required");
    }

    // city
    let cityError = "";
    if (!storyFields.city) {
      cityError = t("city_required");
    }

    // story
    let storyError = "";
    if (!storyFields.story) {
      storyError = t("story_required");
    }

    // date of birth
    let dateOfBirthError = "";
    if (storyFields.dateOfBirth) {
    }

    setStoryFieldsErrors((prevErrors) => ({
      ...prevErrors,
      protagonistError,
      cityError,
      storyError,
      dateOfBirthError,
    }));

    return ![protagonistError, cityError, storyError, dateOfBirthError].some(
      Boolean
    );
  };

  const addTranslationToStory = (
    storyFields: RegisteringStory
  ): RegisteringStory => {
    return {
      ...storyFields,
      translations: {
        [selectedLanguage.code]: {
          protagonist: storyFields.protagonist,
          city: storyFields.city,
          story: storyFields.story,
          job: storyFields.job,
        },
      },
    };
  };

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setStoryFields((prevFields) => ({
      ...prevFields,
      [event.target.name]: event.target.value,
    }));
  };

  const [handleSubmitState, handleSubmit] = useAsyncFn(
    async (
      event: FormEvent<HTMLFormElement>,
      storyFields: RegisteringStory
    ): Promise<Result<DBStory, ApiError>> => {
      event.preventDefault();
      setIsSubmittedOnce(true);

      // 1. add translation to story
      const translatedStory = addTranslationToStory(storyFields);

      // 2. validate fields
      const isStoryValid = validateStoryFields(storyFields);
      if (!isStoryValid) {
        return err({ errorMessage: "Story fields are not valid" });
      }

      // 3. Create the story
      const createResult = await serverApiClient.createStory(translatedStory);
      if (createResult.isErr()) {
        throw new Error(createResult.error.errorMessage);
      }

      return ok(createResult.value);
    }
  );

  useEffect(
    function validateFieldsOnChange() {
      if (isSubmittedOnce) {
        validateStoryFields(storyFields);
      }
    },
    [isSubmittedOnce, storyFields]
  );

  useEffect(function setInitialLanguage() {
    const initialLanguage = languagesOptions.find(
      (language) => language.code === getHomeLanguage()
    );
    if (initialLanguage) setSelectedLanguage(initialLanguage);
  }, []);

  return (
    <Layout pageTitle={t("page_title")} pageDescription={"page_description"}>
      <Container>
        <div className="space-y-4">
          <h1 className="title-1">{t("heading")}</h1>

          <form
            className="space-y-4"
            onSubmit={(event) => handleSubmit(event, storyFields)}
          >
            {/* Language select */}
            <ThemeSelect<LanguageOption>
              label={t("language")}
              options={languagesOptions}
              selected={selectedLanguage}
              setSelected={setSelectedLanguage}
            />

            {/* name */}
            <ThemeInput
              type="text"
              label={t("name")}
              name="protagonist"
              value={storyFields.protagonist}
              onChange={handleChange}
              error={storyFieldsErrors.protagonistError}
            />

            {/* city */}
            <ThemeInput
              type="text"
              label={t("city")}
              name="city"
              value={storyFields.city}
              onChange={handleChange}
              error={storyFieldsErrors.cityError}
            />

            {/* city */}
            <ThemeInput
              type="text"
              label={t("job")}
              name="job"
              value={storyFields.job || ""}
              onChange={handleChange}
              error={storyFieldsErrors.jobError}
            />

            {/* Story */}
            <ThemeTextarea
              label={t("story")}
              name="story"
              value={storyFields.story}
              onChange={handleChange}
              error={storyFieldsErrors.storyError}
            />

            <ThemeButton
              className="w-full"
              type="submit"
              loading={handleSubmitState.loading}
              disabled={handleSubmitState.loading}
              successMessage={
                handleSubmitState.value && handleSubmitState.value.isOk()
                  ? t("submit_success")
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
