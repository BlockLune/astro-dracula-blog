---
abbrlink: 4ef0ac98
categories:
  - CS
  - Web
date: 2023-04-15 13:16:06
tags:
  - hexo
  - blog-setup
  - web
  - github-pages
  - next-theme
title: Set up a blog with Hexo
toc: true
---

This is a simple record of my further attempt to set up a blog with Hexo. I built one on GitHub Page before, using Hexo with the Icarus theme. This time I want to try something different. I also cleaned up my old blog and selectively migrated some old posts here.

<!--more-->

![Hexo](https://webp.blocklune.cc/blog-imgs/cs/web/set-up-a-blog-with-hexo/1.png)

## Installation

You need to install [Node.js](http://nodejs.org/) and [Git](http://git-scm.com/) before installing Hexo.

After that, you could run the command below to install Hexo.

```bash
npm install -g hexo-cli
```

The `-g` flag indicates that Hexo is installed globally.

Learn more in _[Hexo Docs](https://hexo.io/docs/)_.

## Setup

You need to make a directory `<folder>` to store your Hexo blog. Here I use `fishpond`.

```bash
hexo init fishpond
cd fishpond
npm install
```

Learn more in _[Hexo Docs](https://hexo.io/docs/setup)_.

## Theme

Before starting to use your blog, you may choose a [theme](https://hexo.io/themes/) you like.

![Hexo themes](https://webp.blocklune.cc/blog-imgs/cs/web/set-up-a-blog-with-hexo/2.png)

Here I choose the [NexT](https://theme-next.js.org/) theme. To install it, run:

```bash
npm install hexo-theme-next --save
```

After installing your own theme, you could uninstall the default theme `hexo-theme-landscape`:

```bash
npm uninstall hexo-theme-landscape --save
```

Also, clean the folder of the default theme landscape in `theme/`.

To enable NexT, open Hexo's config file and set the variable `theme` to `next`.

```yaml
theme: next
```

## Basic configuration

### Hexo configuration

To configure your Hexo blog, modify the `_config.yml` file.

Learn more in _[Hexo Docs](https://hexo.io/docs/configuration.html)_.

### NexT theme configuration

Before configuring, you are recommended to copy the configuration file (so that you don't change the node module). Run:

```bash
cp node_modules/hexo-theme-next/_config.yml _config.next.yml
```

Then you can follow _[Configuration | NexT (theme-next.js.org)](https://theme-next.js.org/docs/getting-started/configuration.html)_ and customize the NexT theme as your wish.

## Plugins

You can install plugins to make your blog more powerful. The plugins are actually all packages managed by npm, so to list all the plugins you have installed, just run:

```bash
npm list --depth 0
```

Here are some of the plugins I'm using:

### hexo-abbrlink

[hexo-abbrlink](https://github.com/rozbo/hexo-abbrlink) is a Hexo plugin to generate static post link based on title and data in the post front.

To install it, run:

```bash
npm install hexo-abbrlink --save
```

To configure it, modify `_config.yml`:

```yaml
# URLs
permalink: "posts/:abbrlink.html"

# Extensions
## Plugins: https://hexo.io/plugins/
### hexo-abbrlink: https://github.com/rozbo/hexo-abbrlink
abbrlink:
  alg: crc32 # support crc16(default) and crc32
  rep: hex # support dec(default) and hex
```

### hexo-auto-category

[hexo-auto-category](https://github.com/xu-song/hexo-auto-category) is a Hexo plugin which generates categories automatically from folder structure for each post.

To install it, run:

```bash
npm install hexo-auto-category --save
```

To configure it, modify `_config.yml`:

```yaml
# Extensions
## Plugins: https://hexo.io/plugins/
### hexo-auto-category: https://github.com/xu-song/hexo-auto-category
auto_category:
  enable: true
  depth: 3
```

### hexo-blockquote2note

[hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note) is a little plugin that renders blocks of quotes in Markdown to [the note tag of the NexT theme](https://theme-next.js.org/docs/tag-plugins/note). If you also use the NexT theme, it maybe helpful.

To install it, run:

```bash
npm install hexo-blockquote2note --save
```

Preview: _[Introducing hexo-blockquote2note](posts/55f9ebd1)_

### hexo-generator-feed

[hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed) helps generate Atom 1.0 or RSS 2.0 feed.

To install it, run:

```bash
npm install hexo-generator-feed --save
```

To configure it, modify `_config.yml`. Here is my configuration:

```yaml
# Extensions
## Plugins: https://hexo.io/plugins/
### hexo-generator-feed: https://github.com/hexojs/hexo-generator-feed
feed:
  enable: true
  type: rss2
  path: rss.xml
  limit: 0
  order_by: -date
  content: false
  content_limit: 100
  content_limit_delim: "<!--more-->"
```

### hexo-generator-searchdb

[hexo-generator-searchdb](https://github.com/next-theme/hexo-generator-searchdb) provides a local search service.

To install it, run:

```bash
npm install hexo-generator-searchdb --save
```

### hexo-generator-sitemap

[hexo-generator-sitemap](https://github.com/hexojs/hexo-generator-sitemap) generates sitemap.

To install it, run:

```bash
npm install hexo-generator-sitemap --save
```

Configuration:

```yaml
### hexo-generator-sitemap
sitemap:
  path:
    - sitemap.xml
    - sitemap.txt
  tags: false
  categories: false
```

### hexo-pangu

[hexo-pangu](https://github.com/next-theme/hexo-pangu) severs side [pangu.js](https://github.com/vinta/pangu.js) filter for Hexo.

To install it, run:

```bash
npm install hexo-pangu --save
```

## Deployment

### Manual deployment

[hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git) helps deploy your blog to your GitHub Page.

To install it, run:

```bash
npm install hexo-deployer-git --save
```

Modify `_config.yml`:

```yaml
deploy:
  type: git
  repo: <repository url>
  branch: <branch>
  message: <message>
```

Learn more in _[One-Command Deployment | Hexo](https://hexo.io/docs/one-command-deployment)_.

### Automatic deployment

#### Using GitHub Action to Deploy to GitHub Pages

By using GitHub Action, our workflow of writing posts will be like this:

1. Writes a post.
2. Uses `git push` to push your new post to your **source repo**.
3. A GitHub Action automatically starts, generating our blog pages.
4. Your **GitHub Page repo** updates automatically.

Here are the steps:

1. Create a new repository to store your source `*.md` posts. We call this `source repo`. It is recommended to make it **private**.

2. Add a `./.github/workflows/auto_build_and_deploy.yml` file. It may look like this:

```yaml
# Based on https://hexo.io/docs/github-pages.html

name: Auto build and deploy

on:
  push:
    branches:
      - <source_repo_branch>

jobs:
  pages:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          ref: <source_repo_branch>

      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "16" # run `node --version` to show your nodejs version

      - name: Install Hexo
        run: |
          export TZ='Asia/Shanghai'
          npm install -g hexo-cli

      - name: Cache NPM dependencies
        uses: actions/cache@v2
        id: cache
        with:
          path: node_modules
          key: ${{runner.OS}}-${{hashFiles('**/package-lock.json')}}

      - name: Install Dependencies
        if: steps.cache.outputs.cache-hit != 'true'
        run: npm install --save

      - name: Build
        run: |
          hexo clean
          hexo g

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          token: <your_token>
          repository-name: <your_github_name>/<your_github_name>.github.io
          branch: <github_page_repo_branch>
          folder: ./public
          commit-message: "${{ github.event.head_commit.message }} Updated By Github Actions"
```

`<your_token>`: Generate it [here](https://github.com/settings/tokens). Make sure that its scope includes `workflow`.

Learn more in _[Creating a personal access token - GitHub Docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)_.

3. Configure the local git repo.

```bash
# initialize
$ git init

# (optional) create a branch in source repo and change to it
$ git checkout －b <source_repo_branch>

# connect to the remote repo
$ git remote add <server_short_name> <server_url>

# add and commit
$ git add .
$ git commit -m "Initial commit"

# push
$ git push -u <server_short_name> <source_repo_branch>
# if you didn't change to another branch, # the default branch is 'main'
```

Learn more in _[GitHub Pages | Hexo](https://hexo.io/docs/github-pages.html)_.

### Deploying to Netlify

Go to the [create a new site page](https://app.netlify.com/start), select your source repo from GitHub, and follow the prompts.

Learn more in _[One-Command Deployment | Hexo](https://hexo.io/docs/one-command-deployment.html#Netlify)_

#### Using Vercel

See

- _[Hexo 静态博客的 Vercel 部署](https://blog.yfi.moe/post/hexo-vercel-deploy/)_
- _[How to Create & Deploy a Hexo Blog to Vercel](https://vercel.com/guides/deploying-hexo-with-vercel)_
- _[One-Command Deployment | Hexo](https://hexo.io/docs/one-command-deployment.html#Vercel)_

## Q&A

### Where is my index.html in /categories and /tags ?

To generate index.html in `/categories`, run:

```bash
hexo new page "categories"
```

or

```bash
hexo n page "categories"
```

Then, edit `source/categories/index.md` like this:

```markdown
---
title: categories
date: 2023-04-12 00:00:00
type: "categories"
---
```

You can generate the index.html file in `/tags` similarly.

## Why did the straight quotes in the text automatically become curved quotes?

If you also use marked (the default) renderer, add the config below to your `_config.yml`:

```yaml
marked:
  smartypants: false
```

Also see _[6.4.0 版本之后的两个问题 · Issue #462 · theme-next/hexo-theme-next](https://github.com/theme-next/hexo-theme-next/issues/462)_.

## Old content

Here are some old content migrated from my previous Icarus blog.

- Use Bulma to beautify your blog

  See _[活用 Bulma 美化 Icarus 文章 - iMaeGoo's Blog](https://www.imaegoo.com/2020/icarus-with-bulma/)_

- Change fonts of Icarus.

  Modify the `<blog_path>/node_modules/hexo-theme-icarus/include/style/base.styl`:

  ```stylus
  $family-sans-serif ?= Ubuntu, Roboto, 'Open Sans', 'Microsoft YaHei', sans-serif
  $family-code ?= 'Source Code Pro', monospace, 'Microsoft YaHei'
  ```

> [!Caution]
> This operation modifies the node module! So it's NOT recommended.

- Officially supported tags in Icarus

  See _[Custom Hexo Tag Helpers - Icarus](https://ppoffice.github.io/hexo-theme-icarus/uncategorized/custom-hexo-tag-helpers/)_
