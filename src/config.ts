export const SITE = {
  title: {
    en: "Romiafan's Blog",
    zh: "Romiafan's Blog",
    id: "Blog Romiafan",
  },
  description: {
    en: "A blog about development and life, powered by Astro.",
    zh: "一个关于开发和生活的博客，由 Astro 驱动。",
    id: "Blog tentang Developer dan kehidupan, diberdayakan oleh Astro.",
  },
  url: "https://romiafan.com",
  og: {
    imageUrl: "/ogimage.jpg",
  },
  analytics: {
    umami: {
      id: "ab70a625-ed64-484a-9c34-803e1c598bf9",
    },
  },
  searchEngine: {
    bing: "90E919A44E934714DF5640B4D8631CC9",
    baidu: "codeva-IdRrdx3ejJ",
    sogou: "d61GLZA6rw",
    threeSixZero: "3df8dc4fd80a1899f65048a77e408c40",
  },
};

export const AUTHOR = {
  name: "Romiafan",
  link: "https://github.com/romiafan",
  email: "romiafan@gmail.com",
  bio: {
    en: "A Freelancer and IT Enthusiast.",
    zh: "一名自由职业者和IT爱好者。",
    id: "Seorang Freelancer dan Penggemar IT.",
  },
};

export const SOCIALS = [
  {
    name: "Github",
    href: "https://github.com/romiafan",
    linkTitle: `${AUTHOR.name} on Github`,
  },
  {
    name: "Email",
    href: `mailto:${AUTHOR.email}`,
    linkTitle: `Send an email to ${AUTHOR.name}`,
  },
];

export const MISC = {
  more: {
    marks: ["<!--more-->", "<!-- more -->"],
  },
  dateTag: {
    daysToBeGreen: 7,
    daysToBeRed: 365,
  },
  license: {
    enabled: true,
    default: {
      name: "CC BY-NC-SA 4.0",
      link: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    },
  },
  toc: {
    minHeadings: 3,
  },
  postStack: {
    initialLimit: 10,
    limitIncrement: 10,
    searchResultsLimit: 5,
  },
};
