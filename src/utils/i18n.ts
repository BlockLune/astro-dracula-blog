import { MISC } from "@/config";

export const languages = {
  en: "EN",
  zh: "中",
  id: "ID",
};

export const defaultLang: Lang = "en";

export const ui = {
  en: {
    loadMore: "Load More",
    loading: "Loading...",
    errorLoadingSomePosts:
      "Some posts failed to load. Results might be incomplete.",
    errorLoadingPosts: "Failed to load more posts. Please try again later.",
    errorLoadingSearchData:
      "Failed to load search data. Please try again later.",
    noMorePosts: "No more posts to load.",
    noPostsFound: "No posts found.",
    "nav.home": "Home",
    "nav.tags": "Tags",
    "nav.tags.description":
      "Here is the tag index of this site, where you can browse and quickly find posts and content related to topics you are interested in.",
    "nav.about": "About",
    "search.placeholder.firstPart": "Search in ",
    "search.placeholder.secondPart.post": " posts...",
    "search.placeholder.secondPart.tag": " tags...",
    "search.noResults": "No results found",
    "postsWithTag.firstPart": "Posts with tag",
    "postsWithTag.secondPart": "",
    "postsWithTag.description.firstPart": "Here are all posts with tag",
    "postsWithTag.description.secondPart": ".",
    toc: "Table of Content",
    pageNotFound: "PAGE NOT FOUND",
    pageNotFoundDescription:
      "Sorry, the page you are looking for does not exist. Please check the URL or go back to the homepage.",
    goBackHome: "Go Back Home",
    publishedAt: "Published at",
    updatedAt: "Updated at",
    "post.newlyUpdatedMsg": `Updated within ${MISC.dateTag.daysToBeGreen} days`,
    "post.oldPostWarningMsg": `Last update over ${MISC.dateTag.daysToBeRed} days ago`,
    "post.license": "Licensed under",
    "post.notSupportedLang": "Language not supported",
    "post.notSupportedLangDescription":
      "Sorry, your language is unavailable for this post.",
  },
  zh: {
    loadMore: "加载更多",
    loading: "加载中...",
    errorLoadingSomePosts: "部分文章加载失败，结果可能不完整。",
    errorLoadingPosts: "无法加载更多文章，请稍后再试。",
    errorLoadingSearchData: "无法加载搜索数据，请稍后再试。",
    noMorePosts: "没有更多文章可加载。",
    noPostsFound: "没有找到文章。",
    "nav.home": "首页",
    "nav.tags": "标签",
    "nav.tags.description":
      "这里是本站的标签索引，您可以在这里浏览并快速找到与您感兴趣主题相关的文章和内容。",
    "nav.about": "关于",
    "search.placeholder.firstPart": "在 ",
    "search.placeholder.secondPart.post": " 篇文章中搜索...",
    "search.placeholder.secondPart.tag": " 个标签中搜索...",
    "search.noResults": "没有找到结果",
    "postsWithTag.firstPart": "带有",
    "postsWithTag.secondPart": "标签的文章",
    "postsWithTag.description.firstPart": "这里是所有带有",
    "postsWithTag.description.secondPart": "标签的文章。",
    toc: "目录",
    pageNotFound: "未找到此页面",
    pageNotFoundDescription: "抱歉，您请求的页面未找到。请检查网址或返回主页。",
    goBackHome: "返回首页",
    publishedAt: "发表于",
    updatedAt: "更新于",
    "post.newlyUpdatedMsg": `更新于 ${MISC.dateTag.daysToBeGreen} 日内`,
    "post.oldPostWarningMsg": `更新于 ${MISC.dateTag.daysToBeRed} 日前`,
    "post.license": "许可证",
    "post.notSupportedLang": "语言暂不支持",
    "post.notSupportedLangDescription": "抱歉，此文章暂不支持您的语言。",
  },
  id: {
    loadMore: "Muat Lebih Banyak",
    loading: "Memuat...",
    errorLoadingSomePosts:
      "Beberapa pos gagal dimuat. Hasil mungkin tidak lengkap.",
    errorLoadingPosts:
      "Gagal memuat lebih banyak pos. Silakan coba lagi nanti.",
    errorLoadingSearchData:
      "Gagal memuat data pencarian. Silakan coba lagi nanti.",
    noMorePosts: "Tidak ada lagi pos untuk dimuat.",
    noPostsFound: "Tidak ditemukan pos.",
    "nav.home": "Beranda",
    "nav.tags": "Tag",
    "nav.tags.description":
      "Ini adalah indeks tag situs ini, di mana Anda dapat menjelajah dan dengan cepat menemukan pos dan konten terkait topik yang Anda minati.",
    "nav.about": "Tentang",
    "search.placeholder.firstPart": "Cari di ",
    "search.placeholder.secondPart.post": " pos...",
    "search.placeholder.secondPart.tag": " tag...",
    "search.noResults": "Tidak ditemukan hasil",
    "postsWithTag.firstPart": "Pos dengan tag",
    "postsWithTag.secondPart": "",
    "postsWithTag.description.firstPart": "Berikut adalah semua pos dengan tag",
    "postsWithTag.description.secondPart": ".",
    toc: "Daftar Isi",
    pageNotFound: "HALAMAN TIDAK DITEMUKAN",
    pageNotFoundDescription:
      "Maaf, halaman yang Anda cari tidak ada. Silakan periksa URL atau kembali ke beranda.",
    goBackHome: "Kembali ke Beranda",
    publishedAt: "Diterbitkan pada",
    updatedAt: "Diperbarui pada",
    "post.newlyUpdatedMsg": `Diperbarui dalam ${MISC.dateTag.daysToBeGreen} hari`,
    "post.oldPostWarningMsg": `Pembaruan terakhir lebih dari ${MISC.dateTag.daysToBeRed} hari yang lalu`,
    "post.license": "Dilisensikan di bawah",
    "post.notSupportedLang": "Bahasa tidak didukung",
    "post.notSupportedLangDescription":
      "Maaf, bahasa Anda tidak tersedia untuk pos ini.",
  },
} as const;

export type Lang = keyof typeof languages;
export const supportedLangs = Object.keys(languages) as Lang[];

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    return `/${l}${path}`;
  };
}

export function getLangFromUrl(url: string): [Lang, string] {
  const [, lang, ...rest] = url.split("/");
  const urlWithoutLang = rest.join("/");
  if (lang in ui) return [lang as Lang, urlWithoutLang];
  return [defaultLang as Lang, urlWithoutLang];
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof lang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
