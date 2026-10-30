import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://gocnghiencuu.com/",
    title: "Góc Nghiên Cứu",
    description:
      "Công cụ tính cỡ mẫu, Cronbach's alpha và hướng dẫn thu mẫu khảo sát miễn phí cho sinh viên làm khoá luận, học viên cao học và người làm nghiên cứu.",
    author: "Ban biên tập Góc Nghiên Cứu",
    profile: "https://gocnghiencuu.com/about/",
    ogImage: "default-og.png",
    lang: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    dir: "ltr",
    googleVerification: "e95tgeuTukw0ZwNNlfND3Ho7UVcpzN5bbgE6OWzEmkU",
    // GA4 measurement ID from analytics.google.com (Admin > Data streams); empty = no analytics tag.
    gaMeasurementId: "",
  },
  posts: {
    perPage: 8,
    perIndex: 6,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    // The OG renderer only gets the latin font subset; use the static image instead.
    dynamicOgImage: false,
    showArchives: false,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [{ name: "github", url: "https://github.com/growth547/goc-nghien-cuu" }],
  shareLinks: [
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "mail", url: "mailto:?subject=Bai%20viet%20huu%20ich&body=" },
  ],
});
