import { Button } from "antd";
import { useTranslations } from "next-intl";

export default function Home() {
  //i18n
  const t = useTranslations('HomePage');
  return (
    <div>
      <main>
        {/* Example i18n */}
        <h1>{t('title')}</h1>
        <Button>Test</Button>
      </main>
    </div>
  )
}
