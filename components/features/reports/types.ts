import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { User } from "@/lib/types";

export type ReportBuilderProps = {
  lang: Locale;
  users: User[];
  dict: Dictionary["reports"];
  common: Pick<Dictionary["common"], "all" | "from" | "to" | "date" | "status">;
};
