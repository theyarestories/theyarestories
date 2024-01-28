import consts from "@/config/consts";
import classNames from "@/helpers/style/classNames";
import Container from "./Container";
import { ReactNode } from "react";

type Props = {
  isStickyTop: boolean;
  children: ReactNode;
};

function StickyBar({ isStickyTop, children }: Props) {
  return (
    <div
      style={{
        paddingTop: isStickyTop ? consts.stickyBarHeightInRems + "rem" : 0,
        paddingBottom: isStickyTop ? 0 : consts.stickyBarHeightInRems + "rem",
      }}
    >
      <div
        className={classNames(
          "fixed left-0 right-0 bg-white z-10",
          isStickyTop ? "top-0" : "bottom-0"
        )}
      >
        <Container className="!py-0">
          <div
            className={classNames(isStickyTop ? "border-b" : "border-t")}
            style={{
              height: consts.stickyBarHeightInRems + "rem",
            }}
          >
            {children}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default StickyBar;
