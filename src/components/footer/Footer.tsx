import { useTranslations } from "next-intl";

type Props = {};

function Footer({}: Props) {
  const t = useTranslations("Footer");

  return (
    <footer className="py-3">
      <p className="text-sm text-center">
        {t.rich("join_discord", {
          link: (value) => (
            <a
              className="border-b border-gray-900 text-bold"
              href="https://discord.gg/Fpy9f8JX"
              rel="noopener noreferrer"
              target="_blank"
            >
              {value}
            </a>
          ),
        })}
      </p>
    </footer>
  );
}

export default Footer;
