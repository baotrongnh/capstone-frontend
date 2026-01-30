import { Button } from "antd";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <main>
        <h1>{t('title')}</h1>
        <Button>asd</Button>
      </main>
    </div>
  )
}
