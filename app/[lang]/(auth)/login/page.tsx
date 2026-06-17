import { notFound } from "next/navigation";
import Login from "@/components/login";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function LoginPage({ params }: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <Login lang={lang} dict={dict.login} appName={dict.common.appName} />;
}
