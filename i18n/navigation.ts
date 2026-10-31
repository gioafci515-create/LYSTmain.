import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Language-aware versions of Link, redirect, usePathname and useRouter: "/login" stays in the
// current language ("/en/login" on English pages). Use these instead of next/link and next/navigation.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
