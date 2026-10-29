import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Trang chủ",
    posts: "Bài viết",
    tags: "Chủ đề",
    about: "Giới thiệu",
    archives: "Lưu trữ",
    search: "Tìm kiếm",
  },
  post: {
    publishedAt: "Đăng ngày",
    updatedAt: "Cập nhật",
    sharePostIntro: "Chia sẻ bài viết:",
    sharePostOn: "Chia sẻ lên {{platform}}",
    sharePostViaEmail: "Gửi bài viết qua email",
    tagLabel: "Chủ đề",
    backToTop: "Lên đầu trang",
    goBack: "Quay lại",
    editPage: "Sửa trang",
    previousPost: "Bài trước",
    nextPost: "Bài tiếp",
  },
  pagination: {
    prev: "Trước",
    next: "Sau",
    page: "Trang",
  },
  home: {
    socialLinks: "Liên hệ",
    featured: "Nên đọc trước",
    recentPosts: "Bài mới",
    allPosts: "Xem tất cả bài viết",
  },
  footer: {
    copyright: "Bản quyền",
    allRightsReserved: "Genius Data.",
  },
  pages: {
    tagTitle: "Chủ đề",
    tagDesc: "Các bài viết thuộc chủ đề",

    tagsTitle: "Chủ đề",
    tagsDesc: "Tất cả chủ đề trên Góc Nghiên Cứu.",

    postsTitle: "Bài viết",
    postsDesc: "Hướng dẫn thực hành về phương pháp nghiên cứu và khảo sát.",

    archivesTitle: "Lưu trữ",
    archivesDesc: "Tất cả bài viết theo thời gian.",

    searchTitle: "Tìm kiếm",
    searchDesc: "Tìm bài viết theo từ khoá...",
  },
  a11y: {
    skipToContent: "Bỏ qua, tới nội dung",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    toggleTheme: "Đổi giao diện sáng/tối",
    searchPlaceholder: "Tìm bài viết...",
    noResults: "Không tìm thấy kết quả",
    goToPreviousPage: "Về trang trước",
    goToNextPage: "Sang trang sau",
  },
  notFound: {
    title: "404",
    message: "Không tìm thấy trang",
    goHome: "Về trang chủ",
  },
} satisfies UIStrings;
