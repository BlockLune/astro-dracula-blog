---
title: RLCraft 新手教程
tags:
  - game
  - minecraft
  - rlcraft
date: 2022-08-26 19:40:18
updated: 2023-07-19 15:18:38
---

这是一篇关于 RLCraft 的入门教程。[RLCraft](https://www.curseforge.com/minecraft/modpacks/rlcraft) 是一个著名的 Minecraft 整合包，以高难度著称。我在游玩过程中记录下这篇入门教程，主要原因在于我没有在网上找到比较好的中文 RLCraft 文字教程，所以希望记录下自己的游玩发现，也供未来又开坑的自己参考。

<!--more-->

## 安装与资源配置

首先，我们来安装 RLCraft，并进行一些配置，以提升美观度、略微降低难度（我太菜了）。

### 安装整合包本体

目前，RLCraft 借助 CurseForge 进行分发。有多种方式安装这个整合包：

- (官方推荐) [借助 CurseForge APP 进行安装](#借助-curseforge-app-进行安装)
- 借助第三方启动器进行安装
  - (我自己更倾向的) [借助 PCL2 进行安装](#借助-pcl-进行安装)
  - 借助 HMCL 进行安装
  - ...

![RLCraft on CurseForge](https://webp.blocklune.cc/blog-imgs/game/minecraft/rlcraft-新手教程-零：安装和资源导航/1.png)

#### 借助 CurseForge APP 进行安装

进入 [https://www.curseforge.com/download/app](https://www.curseforge.com/download/app)，点击 **Download on Overwolf**，安装并启动 CurseForge APP。

![下载 CurseForge APP](https://webp.blocklune.cc/blog-imgs/game/minecraft/rlcraft-新手教程-零：安装和资源导航/2.png)

打开后，选择 Minecraft，在顶部搜索栏中搜索 `RLCraft`，点击右侧的`安装`并等待（此处图片我已安装完成，故显示为`播放`）。

![在 CurseForge APP 内安装 RLCraft](https://webp.blocklune.cc/blog-imgs/game/minecraft/rlcraft-新手教程-零：安装和资源导航/3.png)

安装完成后，点击`播放`，即可启动游戏。

#### 借助 PCL 进行安装

先新建一个目录用于存放游戏文件，我的是`D:\Games\RLCraft\`。

进入界面左下角的`版本选择`，点击`添加已有文件夹`，选择上边你刚刚新建的目录。

点击右侧的`下载游戏`，点击`整合包`，搜索 `RLCraft`，点击 `RLCraft`，选择 `1.12.2`，选择你想要的版本，输入一个名字，开始下载。

回到主界面，点击`启动游戏`即可。

### 安装光影

当前版本（RLCraft v2.9.3，2023 年 6 月 28 日更新）需要最新的 Optifine 或 G5 版本。未来版本的要求请以下载界面的要求为准。

- Optifine G5 下载地址: _[https://optifine.net/adloadx?f=OptiFine_1.12.2_HD_U_G5.jar](https://optifine.net/adloadx?f=OptiFine_1.12.2_HD_U_G5.jar)_

![RLCraft OptiFine 需求](https://webp.blocklune.cc/blog-imgs/game/minecraft/rlcraft-新手教程-零：安装和资源导航/4.png)

下载完成后，你会得到名为 `OptiFine_1.12.2_HD_U_G5.jar` 的 jar 文件。**直接将该文件放入游戏根目录下的 `mods` 文件夹内**，即完成了 Optifine 的安装。

附：一个我挺喜欢的光影 Complementary Reimagined (_[CurseForge](https://www.curseforge.com/minecraft/customization/complementary-reimagined)_)

### 汉化

_[RLCraft 1.12.2 - Release v2.9.3 正式版，深度汉化任务书+物品+钓鱼，附汉化替换下载](https://www.bilibili.com/read/cv22766528)_

### 可选：增减模组

由于我比较菜，所以我在游玩中通过增减一些模组来简化游戏难度。

#### 增加的模组

- _[Chunk Pre-generator](https://www.mcmod.cn/class/3425.html)_: 区块预生成器
- _[Faster Ladder Climbing](https://www.mcmod.cn/class/3832.html)_: 更快的爬梯
- _[GraveStone](https://www.mcmod.cn/class/1350.html)_: 墓碑（对我这种小白真的降低了很多难度，没有了死亡掉落物消失的烦恼，但代价是掉落物更难拾取了，因为要把墓碑挖掉）
- _[I18nUpdateMod](https://www.mcmod.cn/class/1188.html)_: 自动汉化更新
- _[Inventory HUD+](https://www.mcmod.cn/class/3395.html)_: 物品栏 HUD+
- _[Jade](https://www.mcmod.cn/class/3482.html)_: 玉模组，用来显示你看向的方块的方块信息（需要 [Hwyla](https://www.mcmod.cn/class/668.html) 作为前置）
- _[[JECh] Just Enough Characters](https://www.mcmod.cn/class/840.html)_: 通用拼音搜索，让 JEI 能直接拼音搜索
- _[JEI Integration](https://www.mcmod.cn/class/2077.html)_: JEI 扩展
- _[[JER] Just Enough Resources](https://www.mcmod.cn/class/855.html)_: 增强 JEI，使之能查看怪物物品掉落、查看宝箱物品几率、查看矿物生成概率、查看作物掉落等
- _[Lan Server Properties](https://www.mcmod.cn/class/2754.html)_: 自定义局域网联机
- _[[XMM]Xaero's Minimap](https://www.mcmod.cn/class/1701.html)_: Xaero 的小地图
- _[[XWM]Xaero's World Map](https://www.mcmod.cn/class/1483.html)_: Xaero 的世界地图

#### 删减/关闭的模组

- Chunk Animator: 我不太喜欢区块加载动画
- _[Fancy Block Particles](https://www.mcmod.cn/class/1135.html)_: 梦幻方块效果

### 可选：修改伽马值

**注意：这个操作产生的效果在光影启用的情况下是无效的。**

通过修改 MC 根目录下的 `options.txt` 内的 `gamma` 项，可以获得所谓的"永久夜视"效果，也就是晚上的时候不会那么黑，改为 `10.0`就行了。具体操作可以看下边 [@黑山大叔](https://space.bilibili.com/19428259) 的视频:

- _[超实用系列-修改 gamma 黑夜变亮-Minecraft 我的世界](https://www.bilibili.com/video/BV1b4411f79o)_

## 游戏开始

由于 RLCraft 的一些设定，游戏初期的生存策略与节奏和原版 Minecraft 完全不同。

### 燧石装备

由于 NTP 模组（[No Tree Punching，无树可撸](https://www.mcmod.cn/class/2138.html)）的存在，初入 RLCraft，你的第一件事情不再是获取原木，而是撸树叶获取木棍，然后在河边找到沙砾获取燧石。你可以按住鼠标左键徒手破坏树叶和沙砾，然后用右键点击掉落物以拿起它（或者你也可以按下 shift 来吸取附近的掉落物）。

手拿燧石右击石头/圆石等坚硬方块（?）上表面，你可以获取燧石碎块，然后打开背包，在 2\*2 的合成栏上边放燧石碎块，下边放木棍，获取一把粗糙的小刀。（图源 RLCraft Wiki）

![粗糙的小刀](https://webp.blocklune.cc/blog-imgs/game/minecraft/rlcraft-新手教程一：过渡到你的正常生存/1.png)

使用粗糙的小刀破坏草，可以获得植物纤维，在背包合成栏用三个植物纤维合成一个植物绳。然后再使用燧石碎块、植物绳、木棍合成粗糙的斧头。恭喜你获取了这个游戏的第一把斧头，用这把斧头你就可以开采原木了 —— 当心，树倒下来可能会砸死你！

![植物绳](https://webp.blocklune.cc/blog-imgs/game/minecraft/rlcraft-新手教程一：过渡到你的正常生存/2.png)

![粗糙的斧头](https://webp.blocklune.cc/blog-imgs/game/minecraft/rlcraft-新手教程一：过渡到你的正常生存/3.png)

你不再能够直接使用背包合成栏分解原木，而是需要把原木竖直放在地上，并用斧头右击其上表面，以获取两块木板。木棍也可以用类似的方式获取——将木板放在地上，然后用斧头右击。

你可以看 jei 获取更多燧石工具的制作方法，但你更可以开始制作原版的木制工具。用木镐挖石头会掉落石子，四个石子 2\*2 摆放可以获取圆石，而挖圆石则会直接掉落圆石。

恭喜你进入石器时代！现在，你可以开始下矿了！但要时刻注意的一点是照明 —— 恐怖生物会在黑暗中生成... 别自己怎么死的都不知道。你会发现木棍加煤炭不再能合成原版火把，它们现在只能合成"熄灭的火把"。要想点亮它们，你需要一颗打火石 —— 将熄灭的火把和打火石放在合成栏里，你就可以获得点燃的火把。但这火把仍然会熄灭 —— 比如一场雨过后，比如燃烧很久之后...制作原版火把相对复杂，但你可以在村庄等地方找到一些。

虽然还有很多路要走，但你现在基本上可以短暂地享受一会儿类原版的 MC 了。

### 定居下来

RLCraft 的无限随机重生机制只有在你**激活过指路石（传送石碑）**或**在床上睡过一觉**之后才会结束。利用随机出生点，你可以选择搜刮一系列物资，然后激活指路石，然后找床睡觉，再破坏床，回到随机重生的状态。等你找到合适的定居点，再可以利用指路石传回来拿这些物资。

定居点的选择：

- 不能过高（例如山顶）：气温低、风元素等
- 不要是沙漠：气温高
- 远离龙
- 靠近指路石
- ...

### 前期经验获取方式

在 RLCraft 中，你必须获取经验提升你的等级，才能解锁破坏某些方块或使用更高级的工具，例如铁质装备需要你的相应属性（攻击、防御等）达到 8 级，而钻石装备需要 16 级等等。下边介绍几种经验获取方法：

#### 经验田

当农耕点到二级，就可以种植小麦了。种植一大片小麦田，收割的时候就会获得大量经验。类似的，养殖动物也可以获得大量经验。

下图为我的 30 级经验田。这片田大约是 13 格水的满浇灌面积的大小（1 格水最多能浇灌 9\*9-1=80 面积的田，所以总共大约为 1000 格），能提供我从 0 级升到大约 30 级所需的经验。（注意一下不要让水源露天，否则冬天会结冰，图中忘记了）

![经验田](https://webp.blocklune.cc/blog-imgs/game/minecraft/rlcraft-新手教程一：过渡到你的正常生存/4.png)

### 更多参考资料

- _[Getting Started | RLCraft Wiki | Fandom](https://rlcraft.fandom.com/wiki/Getting_Started)_
