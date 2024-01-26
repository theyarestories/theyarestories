import { ServerApiClient } from "@/apis/ServerApiClient";
import ThemeButton from "@/components/button/ThemeButton";
import InputContainer from "@/components/input/InputContainer";
import ThemeMDEditor from "@/components/md-editor/ThemeMDEditor";
import ThemeSelect from "@/components/select/ThemeSelect";
import allLanguages from "@/config/all-languages/allLanguages";
import { ApiError } from "@/interfaces/api-client/Error";
import { DBStory, RegisteringStory } from "@/interfaces/database/DBStory";
import { Result, err, ok } from "neverthrow";
import { useTranslations } from "next-intl";
import { ChangeEventHandler, FormEvent, useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import { LanguageDetectorApiClient } from "@/apis/LanguageDetectorApiClient";
import ErrorMessage from "@/components/alerts/ErrorMessage";
import {
  CldImage,
  CldUploadWidget,
  CldUploadWidgetProps,
} from "next-cloudinary";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { cities } from "@/config/palestine/cities";
import consts from "@/config/consts";
import { DBImage } from "@/interfaces/database/DBImage";
import { storyTags } from "@/config/story-tags/storyTags";
import classNames from "@/helpers/style/classNames";
import { useRouter } from "next/router";
import { LanguageOption } from "@/interfaces/languages/LanguageOption";
import mapLanguagesToOptions from "@/helpers/translations/mapLanguagesToOptions";
import ProtagonistCombobox from "./ProtagonistCombobox";
import ApiClient from "@/helpers/api-client/apiClient";
import { MixpanelApiClient } from "@/apis/MixpanelApiClient";
import { MixpanelEvent } from "@/interfaces/mixpanel/MixpanelEvent";
import { EventType } from "@/interfaces/database/DBEvent";

type CityOption = {
  name: string;
  value: string;
};

type StoryFields = {
  protagonist: string;
  city: CityOption;
  story: string;
  job?: string;
  avatar: DBImage | null;
  age: string;
  tags: string[];
};

type Props = {
  mode: "add" | "edit" | "approve";
  unapprovedStory?: DBStory;
};

const languagesOptions = mapLanguagesToOptions(allLanguages);

const serverApiClient = new ServerApiClient();
const apiClient = new ApiClient();
const languageDetectorApiClient = new LanguageDetectorApiClient();
const mixpanelApiClient = new MixpanelApiClient();

function StoryForm({ mode, unapprovedStory }: Props) {
  // Dependencies
  const router = useRouter();
  const t = useTranslations("StoryForm");

  // States
  let initialSelectedLanguage = languagesOptions[0];
  if (mode === "approve" && unapprovedStory) {
    const storyLanguage = languagesOptions.find(
      (option) => option.code === unapprovedStory.translationLanguage
    );
    if (storyLanguage) initialSelectedLanguage = storyLanguage;
  }
  const [selectedLanguage, setSelectedLanguage] = useState(
    initialSelectedLanguage
  );
  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);
  const [cityOptions, setCityOptions] = useState(
    cities.map((city) => ({
      name: t(city.name),
      value: city.name,
    }))
  );
  let storyFieldsInitalState: StoryFields = {
    protagonist: "",
    city: cityOptions[0],
    story: "",
    avatar: null,
    job: "",
    age: "",
    tags: [],
  };
  if (mode === "approve" && unapprovedStory) {
    storyFieldsInitalState = {
      protagonist: unapprovedStory.protagonist,
      city:
        cityOptions.find((option) => option.name === unapprovedStory.city) ||
        cityOptions[0],
      story: unapprovedStory.story,
      avatar: unapprovedStory.avatar,
      job: unapprovedStory.job,
      age: Number.isInteger(unapprovedStory.age)
        ? String(unapprovedStory.age)
        : "",
      tags: unapprovedStory.tags,
    };
  }
  const [storyFields, setStoryFields] = useState<StoryFields>(
    storyFieldsInitalState
  );
  const [storyFieldsErrors, setStoryFieldsErrors] = useState({
    protagonistError: "",
    cityError: "",
    storyError: "",
    imagesError: "",
    jobError: "",
    ageError: "",
    languageError: "",
  });
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Helpers
  const validateStoryFields = async (
    storyFields: StoryFields,
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

    // age
    let ageError = "";
    if (
      storyFields.age &&
      (Number(storyFields.age) > consts.maxAge ||
        Number(storyFields.age) < consts.minAge)
    ) {
      ageError = t("age_error", {
        minAge: consts.minAge,
        maxAge: consts.maxAge,
      });
    }

    const allErrors = {
      protagonistError,
      cityError,
      storyError,
      ageError,
    };
    setStoryFieldsErrors((prevErrors) => ({ ...prevErrors, ...allErrors }));
    const isValid = !Object.values(allErrors).some(Boolean);

    if (isValid) return ok(true);
    else return err(false);
  };

  const mapFieldsToStory = (
    storyFields: StoryFields,
    selectedLanguage: LanguageOption
  ): RegisteringStory => {
    const story: RegisteringStory = {
      protagonist: storyFields.protagonist,
      protagonistTranslations: [storyFields.protagonist],
      city: storyFields.city.name,
      story: storyFields.story,
      translationLanguage: selectedLanguage.code,
      translations: [
        {
          fromLanguage: selectedLanguage.code,
          translationLanguage: selectedLanguage.code,
          protagonist: storyFields.protagonist,
          story: storyFields.story,
          job: storyFields.job,
        },
      ],
      tags: storyFields.tags,
      ...(storyFields.avatar && { avatar: storyFields.avatar }),
      ...(storyFields.job && { job: storyFields.job }),
      ...(storyFields.age && { age: Number(storyFields.age) }),
    };

    return story;
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
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

  const handleTagClick = (tag: string) => {
    setStoryFields((prevStoryFields) => {
      let newTags: string[] = [];
      if (prevStoryFields.tags.includes(tag)) {
        newTags = prevStoryFields.tags.filter((prevTag) => prevTag !== tag);
      } else {
        newTags = prevStoryFields.tags.concat([tag]);
      }
      return {
        ...prevStoryFields,
        tags: newTags,
      };
    });
  };

  const removeImage = () => {
    setStoryFields((prevFields) => ({ ...prevFields, avatar: null }));
  };

  const [handleSubmitState, handleSubmit] = useAsyncFn(
    async (
      event: FormEvent<HTMLFormElement>,
      mode: Props["mode"],
      storyFields: StoryFields,
      selectedLanguage: LanguageOption,
      story?: DBStory
    ): Promise<Result<DBStory, ApiError>> => {
      event.preventDefault();
      setIsSubmittedOnce(true);
      setIsSubmitSuccess(false);

      // 1. validate fields
      const validationResult = await validateStoryFields(
        storyFields,
        selectedLanguage
      );
      if (validationResult.isErr()) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return err({ errorMessage: "Story fields are not valid" });
      }

      // 2. map story fields to story
      const mappedStory = mapFieldsToStory(storyFields, selectedLanguage);

      switch (mode) {
        case "add": {
          // 3. create the story
          const createResult = await serverApiClient.createStory(mappedStory);
          if (createResult.isErr()) {
            throw new Error(createResult.error.errorMessage);
          }

          // 4. Reset all fields
          setIsSubmitSuccess(true);
          setIsSubmittedOnce(false);
          setStoryFields(storyFieldsInitalState);

          // 5. Send Mixpanel event
          mixpanelApiClient.event(MixpanelEvent["Write Story"], {
            "Story Language": selectedLanguage.name,
            "Story Protagonist": storyFields.protagonist,
          });

          return ok(createResult.value);
        }
        case "approve": {
          // 3. approve the story
          const approveResult = await apiClient.put<
            {
              storyId: string;
              story: RegisteringStory;
            },
            { success: boolean; data: DBStory }
          >("/api/stories/approve-story", {
            storyId: story?._id || "",
            story: mappedStory,
          });
          if (approveResult.isErr()) {
            throw new Error(approveResult.error.errorMessage);
          }

          // 5. Send database event
          serverApiClient.createEvent({
            type: EventType.write_story,
            metadata: {
              storyId: story?._id,
              storyLanguage: selectedLanguage.name,
              storyProtagonist: storyFields.protagonist,
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

  // Effects
  useEffect(
    function validateFieldsOnChange() {
      if (isSubmittedOnce) {
        validateStoryFields(storyFields, selectedLanguage);
      }
    },
    [isSubmittedOnce, storyFields, selectedLanguage]
  );

  useEffect(
    function setInitialLanguage() {
      if (router.locale && mode === "add") {
        const initialLanguage = languagesOptions.find(
          (language) => language.code === router.locale
        );
        if (initialLanguage) setSelectedLanguage(initialLanguage);
      }
    },
    [router.locale, mode]
  );

  useEffect(() => {
    setCityOptions(
      cities.map((city) => ({
        name: t(city.name),
        value: city.name,
      }))
    );
  }, [router.locale, t]);

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
          storyFields,
          selectedLanguage,
          unapprovedStory
        )
      }
      noValidate
    >
      {/* Language select */}
      <InputContainer label={t("language")} required>
        <ThemeSelect<LanguageOption>
          options={languagesOptions}
          selected={selectedLanguage}
          handleChange={setSelectedLanguage}
        />
      </InputContainer>

      <hr />

      <div className="grid sm:grid-cols-2 gap-3">
        {/* name */}
        <InputContainer
          label={t("name")}
          error={storyFieldsErrors.protagonistError}
          required
        >
          <ProtagonistCombobox
            name="protagonist"
            value={storyFields.protagonist}
            onChange={handleChange}
            selectedLanguage={selectedLanguage}
          />
        </InputContainer>

        {/* age */}
        <InputContainer label={t("age")} error={storyFieldsErrors.ageError}>
          <input
            className="w-full input text-start"
            type="number"
            name="age"
            min={consts.minAge}
            max={consts.maxAge}
            value={storyFields.age}
            onChange={handleChange}
          />
        </InputContainer>

        {/* city */}
        <InputContainer
          label={t("city")}
          error={storyFieldsErrors.cityError}
          required
        >
          <ThemeSelect<CityOption>
            options={cityOptions}
            selected={
              cityOptions.find(
                (city) => city.value === storyFields.city.value
              ) || null
            }
            handleChange={(option) =>
              setStoryFields((prev) => ({ ...prev, city: option }))
            }
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
      </div>

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
            className="object-cover border rounded-sm animate-pulse-bg"
            src={storyFields.avatar.cloudinaryId}
            alt={""}
            width={160}
            height={160}
            crop="fill"
            gravity="auto"
          />
        </div>
      )}

      <InputContainer label={t("tags")} description={t("tags_description")}>
        <div role="group" className="flex flex-wrap gap-1">
          {storyTags.map((tag) => (
            <button
              type="button"
              key={tag}
              role="checkbox"
              aria-checked={storyFields.tags.includes(tag)}
              className={classNames(
                "py-1 px-2 border rounded-3xl cursor-pointer",
                storyFields.tags.includes(tag) ? "bg-green-200" : ""
              )}
              onClick={() => handleTagClick(tag)}
              // tabIndex={0}
            >
              {t(tag)}
            </button>
          ))}
        </div>
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

export default StoryForm;
