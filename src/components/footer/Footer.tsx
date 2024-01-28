import { useTranslations } from "next-intl";
import Container from "../container/Container";

type Props = {};

function Footer({}: Props) {
  const t = useTranslations("Footer");

  return (
    <footer className="">
      <Container className="!py-0">
        <p className="text-sm text-center bg-green-200 py-3">
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
      </Container>
    </footer>
  );
}

export default Footer;
