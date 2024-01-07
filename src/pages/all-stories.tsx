import { ServerApiClient } from "@/apis/ServerApiClient";
import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import StoriesList from "@/components/stories/StoriesList";
import isStringPositiveInteger from "@/helpers/number/isStringPositiveInteger";
import sortAndTranslateStories from "@/helpers/stories/sortAndTranslateStories";
import useIsRtl from "@/hooks/useIsRtl";
import { DBStory } from "@/interfaces/database/DBStory";
import { StoryFilters } from "@/interfaces/server/StoryFilters";
import { ServerAdvancedResponse } from "@/interfaces/server/ServerAdvancedResponse";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { ChangeEventHandler, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import classNames from "@/helpers/style/classNames";
import initHighlightNode from "@/helpers/highlight/initHighlightNode";
import { H as HNode } from "@highlight-run/node";

const serverApiClient = new ServerApiClient();

function getStoryFiltersFromQuery(query: ParsedUrlQuery): StoryFilters {
  const filters: StoryFilters = {};

  // Extract params
  const { page, search } = query;

  // page param
  if (typeof page === "string" && isStringPositiveInteger(page)) {
    filters.page = Number(page);
  }

  // search param
  if (typeof search === "string") {
    filters.search = search;
  }

  return filters;
}

export default function AllStoriesPage({
  storiesWithPagination: serverStoriesWithPagination,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const isRtl = useIsRtl();
  const t = useTranslations("AllStoriesPage");

  const [storiesWithPagination, setStoriesWithPagination] = useState(
    serverStoriesWithPagination
  );

  const handlePaginationChange = (value: { selected: number }) => {
    router.push({ query: { page: value.selected + 1 } }, undefined, {
      shallow: true,
    });
  };

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    router.push({ query: { search: event.target.value } }, undefined, {
      shallow: true,
    });
  };

  const updateStoriesWithQuery = async (query: ParsedUrlQuery) => {
    const filters = getStoryFiltersFromQuery(query);

    const storiesResult = await serverApiClient.getStories({
      ...filters,
      limit: storiesWithPagination.pagination.limit,
    });

    if (storiesResult.isOk() && storiesResult.value.data.length > 0) {
      setStoriesWithPagination(storiesResult.value);
    }
  };

  useEffect(() => {
    updateStoriesWithQuery(router.query);
  }, [router.query.page, router.query.search]);

  return (
    <Layout pageTitle={t("page_title")} pageDescription={t("page_description")}>
      <Container>
        <div className="space-y-4">
          {/* Search form */}
          <form className="relative flex items-center">
            <MagnifyingGlassIcon
              className={classNames(
                "w-5 text-gray-500 absolute",
                isRtl ? "right-2" : "left-2"
              )}
            />
            <input
              className="input w-full ps-9"
              type="search"
              onChange={handleSearchChange}
              placeholder={t("search_stories") + "..."}
              aria-label={t("search_stories")}
            />
          </form>

          <StoriesList stories={storiesWithPagination.data} />

          {storiesWithPagination.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <ReactPaginate
                className="storiesPaginator"
                pageClassName="storiesPaginator__page"
                pageLinkClassName="storiesPaginator__pageLink"
                activeClassName="storiesPaginator__page--active"
                disabledClassName="storiesPaginator__page--disabled"
                activeLinkClassName="storiesPaginator__pageLink--active"
                disabledLinkClassName="storiesPaginator__pageLink--disabled"
                previousClassName="storiesPaginator__prev"
                nextClassName="storiesPaginator__next"
                previousLinkClassName="storiesPaginator__prevLink"
                nextLinkClassName="storiesPaginator__nextLink"
                breakClassName="storiesPaginator__break"
                previousLabel={
                  isRtl ? (
                    <ArrowRightIcon className="w-4" />
                  ) : (
                    <ArrowLeftIcon className="w-4" />
                  )
                }
                previousAriaLabel={t("previous")}
                nextLabel={
                  isRtl ? (
                    <ArrowLeftIcon className="w-4" />
                  ) : (
                    <ArrowRightIcon className="w-4" />
                  )
                }
                nextAriaLabel={t("next")}
                pageCount={storiesWithPagination.pagination.totalPages}
                marginPagesDisplayed={1}
                forcePage={(Number(router.query.page) || 1) - 1}
                onPageChange={handlePaginationChange}
                renderOnZeroPageCount={null}
              />
            </div>
          )}
        </div>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = (async ({ req, query, locale }) => {
  initHighlightNode();
  const filters = getStoryFiltersFromQuery(query);

  const storiesResult = await serverApiClient.getStories({
    ...filters,
    limit: 20,
  });
  if (storiesResult.isErr()) {
    HNode.consumeError(
      {
        name: "Error",
        message: storiesResult.error.errorMessage || "",
      },
      undefined,
      undefined,
      { payload: JSON.stringify(storiesResult.error) }
    );
    throw new Error(storiesResult.error.errorMessage);
  }

  // sort stories by user's preferred language
  const homeLanguage = req.cookies.home_language;
  storiesResult.value.data = sortAndTranslateStories(
    storiesResult.value.data,
    homeLanguage,
    locale
  );

  return { props: { storiesWithPagination: storiesResult.value } };
}) satisfies GetServerSideProps<{
  storiesWithPagination: ServerAdvancedResponse<DBStory[]>;
}>;
