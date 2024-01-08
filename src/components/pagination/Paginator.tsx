import useIsRtl from "@/hooks/useIsRtl";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import ReactPaginate from "react-paginate";

type Props = {
  pageCount: number;
  page: number;
  onPageChange(selectedItem: { selected: number }): void;
};

function Paginator({ pageCount, page, onPageChange }: Props) {
  const isRtl = useIsRtl();
  const t = useTranslations("Pagination");

  return (
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
      pageCount={pageCount}
      marginPagesDisplayed={1}
      forcePage={page}
      onPageChange={onPageChange}
      renderOnZeroPageCount={null}
    />
  );
}

export default Paginator;
