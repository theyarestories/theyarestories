import { useRouter } from "next/router";

export default function useIsRtl(): boolean {
  const { locale } = useRouter();

  return locale === "ar";
}
