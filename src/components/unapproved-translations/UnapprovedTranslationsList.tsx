import { ServerApiClient } from "@/apis/ServerApiClient";
import { DBStory } from "@/interfaces/database/DBStory";
import { ServerAdvancedResponse } from "@/interfaces/server/ServerAdvancedResponse";
import { useState } from "react";
import { useUpdateEffect } from "react-use";
import Paginator from "../pagination/Paginator";
import UnapprovedTranslationItem from "./UnapprovedTranslationItem";

type Props = {
  storiesWithPagination: ServerAdvancedResponse<DBStory[]>;
};

const serverApiClient = new ServerApiClient();

function UnapprovedTranslationsList({
  storiesWithPagination: serverStoriesWithPagination,
}: Props) {
  const [storiesWithPagination, setStoriesWithPagination] = useState(
    serverStoriesWithPagination
  );
  const [page, setPage] = useState(1);

  const updateStoriesWithPage = async (page: number) => {
    const storiesResult = await serverApiClient.getStories({
      isApproved: true,
      isTranslationApproved: false,
      page,
      limit: storiesWithPagination.pagination.limit,
    });

    if (storiesResult.isOk() && storiesResult.value.data.length > 0) {
      setStoriesWithPagination(storiesResult.value);
    }
  };

  useUpdateEffect(() => {
    updateStoriesWithPage(page);
  }, [page]);

  return (
    <>
      <div className="stories-grid">
        {storiesWithPagination.data.map((story) => (
          <UnapprovedTranslationItem key={story._id} story={story} />
        ))}
      </div>

      {storiesWithPagination.pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Paginator
            pageCount={storiesWithPagination.pagination.totalPages}
            page={page - 1}
            onPageChange={(value) => setPage(value.selected + 1)}
          />
        </div>
      )}
    </>
  );
}

export default UnapprovedTranslationsList;
