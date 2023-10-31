import Image from "next/image";
import { Inter } from "next/font/google";
import { useTranslations } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const t = useTranslations("Index");

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {t("title")}
    </main>
  );
}
