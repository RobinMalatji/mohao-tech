import { canonicalSiteUrl } from "@/lib/site";

/** Public IndexNow key (hosted at /{key}.txt). Not a secret. */
export const indexNowKey = "b7e4c91a6d2f48e0a3c5d8f1b6e9a047";

export async function notifyIndexNow(urls: string[]) {
  if (process.env.VERCEL_ENV !== "production") {
    return;
  }

  const uniqueUrls = [...new Set(urls)].filter((url) =>
    url.startsWith(canonicalSiteUrl),
  );

  if (uniqueUrls.length === 0) {
    return;
  }

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "mohaotech.com",
        key: indexNowKey,
        keyLocation: `${canonicalSiteUrl}/${indexNowKey}.txt`,
        urlList: uniqueUrls,
      }),
    });

    if (!response.ok) {
      console.error(
        `IndexNow submission failed (${response.status}): ${await response.text()}`,
      );
    }
  } catch (error) {
    console.error("IndexNow submission error", error);
  }
}
