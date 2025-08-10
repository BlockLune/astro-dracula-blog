export const SITE = {
  title: {
    en: "BlockLune's Blog",
    zh: "BlockLune's Blog",
  },
  description: {
    en: "A blog about development and life, powered by Astro.",
    zh: "一个关于开发和生活的博客，由 Astro 驱动。",
  },
  url: "https://blocklune.cc",
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
  name: "BlockLune",
  link: "https://github.com/BlockLune",
  email: "i@blocklune.cc",
  bio: {
    en: "A student majoring in computer science and technology.",
    zh: "一名计算机科学与技术专业的学生。",
  },
};

export const SOCIALS = [
  {
    name: "Github",
    href: "https://github.com/BlockLune",
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
