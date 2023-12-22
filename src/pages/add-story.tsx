import { ServerApiClient } from "@/apis/ServerApiClient";
import ThemeButton from "@/components/button/ThemeButton";
import Container from "@/components/container/Container";
import InputContainer from "@/components/input/InputContainer";
import Layout from "@/components/layout/Layout";
import ThemeMDEditor from "@/components/md-editor/ThemeMDEditor";
import ThemeSelect from "@/components/select/ThemeSelect";
import allLanguages from "@/config/languages/allLanguages";
import getHomeLanguage from "@/helpers/translations/getHomeLanguage";
import { ApiError } from "@/interfaces/api-client/Error";
import { DBStory, RegisteringStory } from "@/interfaces/database/Story";
import { Result, err, ok } from "neverthrow";
import { useTranslations } from "next-intl";
import { ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import { DateTime } from "luxon";
import { LanguageDetectorApiClient } from "@/apis/LanguageDetectorApiClient";
import ErrorMessage from "@/components/alerts/ErrorMessage";
import {
  CldImage,
  CldUploadWidget,
  CldUploadWidgetProps,
} from "next-cloudinary";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
const languageDetectorApiClient = new LanguageDetectorApiClient();

export default function AddStoryPage() {
  const t = useTranslations("AddStoryPage");

  const [selectedLanguage, setSelectedLanguage] = useState(languagesOptions[0]);
  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  const [storyFields, setStoryFields] = useState<RegisteringStory>({
    protagonist: "",
    city: "",
    story: "",
    avatar: null,
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
    languageError: "",
  });

  const validateStoryFields = async (
    storyFields: RegisteringStory,
    selectedLanguage: LanguageOption
  ): Promise<Result<true, false>> => {
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
    const languageResult = await languageDetectorApiClient.detectLanguage(
      storyFields.story
    );
    if (
      languageResult.isOk() &&
      languageResult.value !== selectedLanguage.code
    ) {
      storyError = t("wrong_language");
    }

    // date of birth
    let dateOfBirthError = "";
    if (
      storyFields.dateOfBirth &&
      DateTime.fromISO(storyFields.dateOfBirth) > DateTime.now()
    ) {
      dateOfBirthError = t("future_date");
    }

    const allErrors = {
      protagonistError,
      cityError,
      storyError,
      dateOfBirthError,
    };
    setStoryFieldsErrors((prevErrors) => ({ ...prevErrors, ...allErrors }));
    const isValid = !Object.values(allErrors).some(Boolean);

    if (isValid) return ok(true);
    else return err(false);
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

  const handleImageChange: CldUploadWidgetProps["onUpload"] = (result: any) => {
    if (result.event === "success") {
      setStoryFields((prevFields) => {
        return {
          ...prevFields,
          avatar: {
            cloudinaryId: result.info.public_id,
            url: result.info.secure_url,
          },
        };
      });
    }
  };

  const removeImage = () => {
    setStoryFields((prevFields) => ({ ...prevFields, avatar: null }));
  };

  const [handleSubmitState, handleSubmit] = useAsyncFn(
    async (
      event: FormEvent<HTMLFormElement>,
      storyFields: RegisteringStory,
      selectedLanguage: LanguageOption
    ): Promise<Result<DBStory, ApiError>> => {
      event.preventDefault();
      setIsSubmittedOnce(true);

      // 1. add translation to story
      const translatedStory = addTranslationToStory(storyFields);

      // 2. validate fields
      const validationResult = await validateStoryFields(
        storyFields,
        selectedLanguage
      );
      if (validationResult.isErr()) {
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
        validateStoryFields(storyFields, selectedLanguage);
      }
    },
    [isSubmittedOnce, storyFields, selectedLanguage]
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
            className="space-y-3"
            onSubmit={(event) =>
              handleSubmit(event, storyFields, selectedLanguage)
            }
            noValidate
          >
            {/* Language select */}
            <InputContainer label={t("language")} required>
              <ThemeSelect<LanguageOption>
                options={languagesOptions}
                selected={selectedLanguage}
                setSelected={setSelectedLanguage}
              />
            </InputContainer>

            {/* name */}
            <InputContainer
              label={t("name")}
              error={storyFieldsErrors.protagonistError}
              required
            >
              <input
                className="w-full input"
                type="text"
                name="protagonist"
                value={storyFields.protagonist}
                onChange={handleChange}
              />
            </InputContainer>

            {/* date of birth */}
            <InputContainer
              label={t("date_of_birth")}
              error={storyFieldsErrors.dateOfBirthError}
            >
              <input
                className="w-full input text-start"
                type="date"
                name="dateOfBirth"
                max={DateTime.now().toFormat("yyyy-MM-dd")}
                value={storyFields.dateOfBirth}
                onChange={handleChange}
              />
            </InputContainer>

            {/* city */}
            <InputContainer
              label={t("city")}
              error={storyFieldsErrors.cityError}
              required
            >
              <input
                className="w-full input"
                type="text"
                name="city"
                value={storyFields.city}
                onChange={handleChange}
              />
            </InputContainer>

            {/* job */}
            <InputContainer label={t("job")} error={storyFieldsErrors.jobError}>
              <input
                className="w-full input"
                type="text"
                name="job"
                value={storyFields.job}
                onChange={handleChange}
              />
            </InputContainer>

            <InputContainer
              label={t("story")}
              error={storyFieldsErrors.storyError}
              required
            >
              <ThemeMDEditor
                value={storyFields.story}
                onChange={(value) =>
                  setStoryFields((prev) => ({ ...prev, story: value }))
                }
              />
            </InputContainer>

            {/* <div className="space-y-1"> */}
            <InputContainer label={t("upload_image")}>
              <CldUploadWidget
                signatureEndpoint="/api/cloudinary/sign-cloudinary-params"
                onUpload={handleImageChange}
                options={{
                  maxFiles: 3,
                  folder: "protagonists",
                  maxImageFileSize: 1000000, // bytes
                  multiple: false,
                }}
              >
                {({ open }) => {
                  return (
                    <button
                      className="button gap-2 border"
                      type="button"
                      onClick={() => open()}
                    >
                      <CloudArrowUpIcon className="w-6" />
                      {t("upload")}
                    </button>
                  );
                }}
              </CldUploadWidget>
            </InputContainer>

            {/* Image preview */}
            {storyFields.avatar && (
              <div className="relative inline-block">
                <button
                  className="rounded-full w-6 h-6 p-0.5 border absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 bg-gray-100"
                  type="button"
                  onClick={removeImage}
                >
                  <XMarkIcon className="w-full" />
                </button>
                <CldImage
                  className="object-cover border rounded-sm"
                  src={storyFields.avatar.url}
                  alt={""}
                  width={160}
                  height={160}
                  crop="fill"
                  gravity="auto"
                />
              </div>
            )}

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

            {storyFieldsErrors.languageError && (
              <ErrorMessage message={storyFieldsErrors.languageError} />
            )}
          </form>
        </div>
      </Container>
    </Layout>
  );
}
