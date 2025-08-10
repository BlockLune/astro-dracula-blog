---
abbrlink: f17b3e8b
categories:
  - CS
  - AI
date: 2022-10-15 20:36:02
tags:
  - ai
  - novelai
  - waifu-generation
  - image-generation
title: 挖老婆矿！—— NovelAI 初试
toc: true
---

最近一段时间，感觉突然之间，就有很多很多将现实图片二次元化啊，按照每句歌词生成一副画作啊的 AI 绘画应用的图文视频出现。和室友聊天还说是不是最近一段时间 AI 技术突破什么瓶颈突飞猛进了。后来才知道，原来是 NovelAI 泄露了... 这样一来，本地部署方便了起来，于是整了一个玩玩。由于跑 AI 嘛，GPU 比较呼啸，跟挖矿一样，我就戏称我这是在“挖老婆矿”了。

<!--more-->

注：这篇文章更偏向于我记录生成时使用的 tag， 不涉及基础操作。我使用的 NovelAI 下载自[这里](https://www.bilibili.com/video/BV1EV4y1L7dX)。

## 一个头像（一堆头像）

我最开始只是用几个 tag 生成。经历了一些粗浅的尝试后，发现生成的质量并不高。但是看到了[一篇文章](https://www.yuque.com/longyuye/lmgcwy/goa36x)，照着里边的 tag 写，才算真正开始了探索。

首先是根据上边那篇文章最后的示例增改了点 tag 形成的 prompt:

```text
blue pen illustration, light blue background, flowers on face, growth, nature, beautiful face, pink hair,shawl hair, zoom in on eyes, apathy, red eye shadow, petite, best quality, masterpiece
```

然后生成出了下面这些相当不错的图案：

![](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/1.png)

![](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/2.png)

下边分类讲讲 tag:

提高总体质量的：

```text
masterpiece, best quality, by famous artist, beautiful face
```

使整体的风格偏向更具插画感：

```text
illustration
```

限定背景的：

```text
xxxx + backgroud  (比如上边的淡蓝色背景就是 light blue background )
```

让生成出来的 waifu 更幼的：

```text
petite
```

让脸上、头发上出现花朵装饰的：

```text
flowers on face
```

让眼睛更大的：

```text
zoom in one eyes
```

尝到了甜头后，我就想换头像了。但我不想完全抛弃现在的头像，于是就试图拿它做派生。

首先描述一下原来的头像，让 AI 知道我大概是想要怎样的一个 "老婆"。~~（虽然其实我描述的时候更感觉是在捏女儿）~~ 顺便一说，我这个原来的头像其实也是 AI 生成的，叫 [WaifuLabs](https://waifulabs.com/generate)，是我把原来生成出来的丢进 PS 去了水印，又自己修缮了一下得到的。

![上边是 WaifuLabs 生成出来时候的样子，下边是我自己 PS 改的](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/3.png)

抛却那些提高质量的，大概给了 `披肩发`、`深灰色头发`、`深灰色眼睛`、`红色眼影`、`白色衬衫`、`微笑` 这些 tag。同时模仿了上边，给了 `面部的花` 之类的 tag：

```text
{{masterpiece,best quality}},shawl hair,dark grey hair, dark grey eyes,red eye shadow,  white shirt,illustration,flower on face,growth, nature,beautiful face, smile, zoom in one eyes
```

以上边的内容为 prompt，同时把我改的那张扔给 NovelAI，根据生成结果又慢慢改，添加 tag，最终的 prompt 如下:

```text
{{masterpiece,best quality,by wlop}},shawl hair,dark grey hair, dark grey eyes,red eye shadow, white shirt,{{{illustration}}},flower on face, growth, nature, beautiful face, small smile, zoom in one eyes, {{{{petite}}}}, dramatic shadows, ink,eye-focus, portrait, red hairclip
```

跑了大概 100 张，然后挑了挑，下边展示的是部分高质量的：

![](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/4.png)

又是一波奇奇怪怪的调整：

![](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/5.png)

最后挑选出了这张我觉得挺有特色的：

![](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/6.png)

然后开始根据这张进行派生：

![](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/7.png)

## 一张壁纸（一堆壁纸）

这事儿开始的挺搞笑的，当时我正在调上边的头像参数，坐我旁边玩 CSGO 的朋友希望我把某把枪拟人，然后发我了下边的图片：

![](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/8.png)

然后我加了点描述词生成了，但生成效果并不好，我就又开始研究我上边的头像了。我完全忘记了我还拿着这张图生成的某张图在做派生呢... 我只是改回了我的 prompt，就意外地得到了下边这张图：

![](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/9.png)

似乎是把枪头画成了那条条纹？我也不知道。反正着实是惊艳到我了，扔到 bigjpg 那边提高了一下分辨率，再扔进 PS 调了一下曲线，嘿嘿，新的手机壁纸有了！

![拉的曲线](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/10.png)

![新的手机壁纸！](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/11.png)

然后又拿这张图和基于上边改的 prompt 做了派生...

```text
{{masterpiece,best quality}},shawl hair,dark grey hair, dark grey eyes,red eye shadow,red scanf,  light grey shirt,{{illustration}},red flower on face,white flower on hair,growth, nature,beautiful face, {{indifferent}}, zoom in one eyes,1girl, red flower background, gold fence background,focus on eye
```

![](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/12.png)

![](https://webp.blocklune.cc/blog-imgs/cs/ai/挖老婆矿！——-novelai-初试/13.png)

相当不错！
