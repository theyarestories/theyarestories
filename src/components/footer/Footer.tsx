import { useTranslations } from "next-intl";
import Container from "../container/Container";

type Props = {};

function Footer({}: Props) {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-green-200">
      <Container className="!py-3">
        <p className="text-sm text-center">
          {t.rich("join_discord", {
            link: (value) => (
              <a
                className="border-b border-gray-900 text-bold"
                href="https://discord.gg/vAvQ8Qsv"
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
