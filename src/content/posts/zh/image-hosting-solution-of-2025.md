---
title: 2025 年的图床解决方案
tags:
  - cloudflare
  - image-hosting
  - s3
  - s3-image-port
  - webp-cloud-services
date: 2024-12-03 14:45:43
---

作为一个使用 Markdown 进行日常写作的 Blogger，我不可避免地需要使用一个图床服务。过去，我使用过像 [sm.ms](https://sm.ms/)、[路过图床](https://imgse.com/) 等公共图床服务，也使用过基于 GitHub 的自建方案，但这些方案都有各自的问题，包括但不限于国内外连接速度较慢、图片被和谐或丢失等。但现在，我有了一个完整的自建解决方案，它基于 [Cloudflare R2](https://www.cloudflare.com/zh-cn/developer-platform/products/r2/)、[S3 Image Port](https://iport.yfi.moe/) 和 [WebP Cloud Services](https://webp.se)。我在过去的几个月中实践了下面所要说的这个方案，它为我提供了一个稳定、高效的图床服务。一起来看看吧！

<!--more-->

## 是什么

这个方案源于朋友的[《把 S3 ( R2 / OSS / COS ... ) 作为图床使用的图片管理方案》](https://yfi.moe/post/manage-website-images)一文。在文中，作者介绍道他将他的博客图片全部迁移到了 Cloudflare R2 上，并自己写了一个名为 [S3 Image Port](https://github.com/yy4382/s3-image-port) 的前端面板用于管理这些图片。

所谓 S3，指的是 [Amazon Simple Storage Service](https://aws.amazon.com/s3/)，是 Amazon 提供的一种文件存储服务。由于 Amazon 在云领域老大哥的地位，S3 成为了云存储事实上的一种标准。[R2](https://www.cloudflare.com/zh-cn/developer-platform/products/r2/) 则是 Cloudflare 提供的文件存储服务，兼容 S3。

您可以将图片存储在 S3 或者是像是 Cloudflare R2 这样的 S3 兼容服务上，而借助 S3 Image Port 这个项目，您可以便捷地管理这些图片。S3 Image Port 提供了包括上传图片（带图片压缩和格式转换选项）、搜索与筛选图片、一键复制图片的纯 URL 或 Markdown 格式链接等。

WebP 是一种比起传统 JPEG 和 PNG 格式更加高效的图片格式，专门设计用于网络传输。借助 [WebP Cloud Services](https://webp.se)，您可以将您存储在 S3 服务中的图片以 WebP 这样更高效的格式进行分发。

## 为什么

**为什么使用类 S3 服务？** 我的答案是稳定。像是 S3 宣传自己默认有 99.999999999%（11 个 9）的数据耐用性和 99.99% 的可用性 ~~（虽然不知道这样的数据是怎么算出来的，但看着...确实不简单）~~。将图片存储于类似这样的服务中，至少不用（那么）担心图片和谐和数据丢失。

**为什么使用 Cloudflare R2？** 理论上在这个方案中，您可以选择任意兼容 S3 的存储服务（例如阿里云 OSS，腾讯云 COS 等），但 Cloudflare R2 的最大优势在于其没有出口带宽费用（财大气粗 Cloudflare！），特别适合图床这一应用场景。而且借助 Cloudflare 的缓存，在国内外都可以有不错的速度。

**为什么使用 S3 Image Port？** 这个项目是一个开源项目，开源的好处至少在：我可以清楚地知道发生了什么，并且如果有什么我不满意的地方，我可以立刻着手修改它。我加入了这个项目的[贡献者行列](https://github.com/yy4382/s3-image-port/graphs/contributors)，为其添加了一些新功能，并帮助完善了[文档](https://docs.iport.yfi.moe)，还为其绘制了一个简单的 Logo。

**为什么使用 WebP Cloud Services？** 尽管 S3 Image Port 提供了基础的转换图片格式的功能，但像是 WebP Cloud Services 提供的功能更为强大，除了转换，还包括了根据设备选择不同大小的图片等。

**价格方面**：取决于您最后选用的 S3 服务以及使用的频次，花费不尽相同。在我的选择和用量下，到目前为止的几个月都是 **完全免费** 的！

## 怎么做

您可以参考 S3 Image Port 文档站的下面两份文档来配置 Cloudflare R2 + S3 Image Port + WebP Cloud Services 这样一个组合方案：

- [Cloudflare R2 逐步指南 | S3 Image Port Docs](https://docs.iport.yfi.moe/zh/guide/for-cloudflare-r2)
- [利用 WebP Cloud Services 扩展 Public URL 功能 | S3 Image Port Docs](https://docs.iport.yfi.moe/zh/guide/use-webp-cloud-services)
