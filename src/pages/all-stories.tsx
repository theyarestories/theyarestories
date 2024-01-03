import { ServerApiClient } from "@/apis/ServerApiClient";
import Container from "@/components/container/Container";
import Layout from "@/components/layout/Layout";
import StoriesList from "@/components/stories/StoriesList";
import isStringPositiveInteger from "@/helpers/number/isStringPositiveInteger";
import sortAndTranslateStories from "@/helpers/stories/sortAndTranslateStories";
import useIsRtl from "@/hooks/useIsRtl";
import { DBStory } from "@/interfaces/database/DBStory";
import { ServerAdvancedResponse } from "@/interfaces/server/ServerAdvancedResponse";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const serverApiClient = new ServerApiClient();

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

  const updateStoriesWithQuery = async (page: number) => {
    const storiesResult = await serverApiClient.getStories({
      page,
      limit: storiesWithPagination.pagination.limit,
    });

    if (storiesResult.isOk()) {
      setStoriesWithPagination(storiesResult.value);
    }
  };

  useEffect(() => {
    const pageParam = router.query.page;
    if (typeof pageParam === "string" && isStringPositiveInteger(pageParam)) {
      updateStoriesWithQuery(Number(pageParam));
    }
  }, [router.query.page]);

  return (
    <Layout pageTitle={t("page_title")} pageDescription={t("page_description")}>
      <Container>
        <div className="space-y-4">
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
  let pageParam = query.page;
  if (typeof pageParam !== "string") pageParam = "1";
  const storiesResult = await serverApiClient.getStories({
    page: Number(pageParam),
    limit: 20,
  });
  if (storiesResult.isErr()) {
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
