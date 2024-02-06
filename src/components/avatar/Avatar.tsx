import consts from "@/config/consts";
import classNames from "@/helpers/style/classNames";
import { DBUser } from "@/interfaces/database/DBUser";
import Image from "next/image";

type Props = {
  user: DBUser;
  size: "sm" | "lg";
  className?: string;
};

function Avatar({ user, size, className = "" }: Props) {
  const sizeInPx =
    size === "sm" ? consts.avatarSmSizeInPx : consts.avatarLgSizeInPx;

  return (
    <Image
      className={classNames(
        "uppercase rounded-full bg-white",
        size === "sm" ? "p-0 border" : "p-0 border-2",
        className
      )}
      src={user.avatar ? user.avatar : "/images/icons/watermelon.svg"}
      alt=""
      width={sizeInPx}
      height={sizeInPx}
    />
  );
}

export default Avatar;
