import type messages from "./messages/en.json";
import type { routing } from "./i18n/routing";

// Typed translations: a key that doesn't exist in messages/en.json fails the typecheck.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
