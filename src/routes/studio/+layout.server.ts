import { dev } from "$app/environment";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const prerender = false;

export const load: LayoutServerLoad = async () => {
  if (!dev) {
    throw error(404, "Studio is only available in development mode");
  }
  return {};
};
