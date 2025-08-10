---
abbrlink: 6633c011
categories:
  - CS
  - Web
date: 2024-10-17 17:06:23
tags:
  - vue
  - typescript
  - javascript
  - web
  - modal-animation
title: 使用 Vue 和 @vueuse/motion 制作带动画的模态框
---

本文介绍了如何使用 [Vue](https://cn.vuejs.org/) 和 [@vueuse/motion](https://motion.vueuse.org/) 创建一个带有动画的模态框。你可以在 [这里](https://github.com/BlockLune/modal-animation-demo/tree/main/modal-animation-demo-vue) 找到最终代码。

<!--more-->

首先，让我们来创建一个 Modal，核心部分如下（略去了自定义类的具体内容，可以在最终代码处查看）：

```vue
<!-- Modal.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
const isOpen = ref(false);
const openModal = () => {
  isOpen.value = true;
};
const closeModal = () => {
  isOpen.value = false;
};
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeModal();
  }
};
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <button class="btn" @click="openModal">Open</button>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-background" />
    <div v-if="isOpen" class="modal-container" @click.self="closeModal">
      <div class="modal">
        <p class="modal-text">Hello, world!</p>
        <button class="btn" @click="closeModal">Close</button>
      </div>
    </div>
  </Teleport>
</template>
```

几个注意点如下：

- 使用 [`Teleport`](https://cn.vuejs.org/guide/built-ins/teleport) 来将最后的模态框 “传送” 到 DOM 中更合理的位置去；
- 拆分了模态框背景（标注为 `modal-background`）和模态容器（标注为 `modal-container`），这是因为我打算创建的模态框的动画是从下往上上浮显示、同时带有一个透明度的变化，而背景的动画我只希望其带有一个透明度的变化；
- 使用 `position: fixed;` 和 `inset: 0;` 来让模态框背景和模态容器正确定位；
- 使用 `@click.self` 来为模态框外侧区域（ `modal-container` 的区域）添加一个点击事件，此处为关闭模态框；
- 使用 `onMounted` 和 `onUnmounted` 来在组件加载和卸载时分别添加和移除一个事件监听器，用于在 Esc 键被按下时关闭模态框；

下面让我们来制作动画。背景动画比较简单，我们直接使用 Vue 提供的 [`Transition`](https://cn.vuejs.org/guide/built-ins/transition) 组件将原来的 `modal-background` 包裹，并添加相应的 CSS 即可：

```vue
<template>
  <!-- ... -->
  <Transition name="fade">
    <div v-if="isOpen" class="modal-background" @click="closeModal" />
  </Transition>
  <!-- ... -->
</template>

<style>
/* ... */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
```

然后是模态框主体的动画，这里使用了 [@vueuse/motion](https://motion.vueuse.org/) 。首先，添加这个包：

```bash
pnpm install @vueuse/motion
```

接着编辑 `main.ts`：

```ts
import { createApp } from "vue";
import { MotionPlugin } from "@vueuse/motion";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);
app.use(MotionPlugin);
app.mount("#app");
```

OK，可以开始使用了。但是简单地为 `modal-container` 添加 `v-motion` 并不足够：

```vue
<!-- error -->
<template>
  <!-- ... -->
  <div
    v-if="isOpen"
    class="modal-container"
    @click.self="closeModal"
    v-motion
    :initial="{ opacity: 0, y: 100 }"
    :enter="{ opacity: 1, y: 0 }"
    :leave="{ opacity: 0, y: 100 }"
  >
    <div class="modal">
      <p class="modal-text">Hello, world!</p>
      <button class="btn" @click="closeModal">Close</button>
    </div>
  </div>
  <!-- ... -->
</template>
```

如果是这样，你会发现进入动画非常顺利地播放了，但退出动画完全没有生效！为什么会这样？

原因在于我们是通过 `v-if` 来控制是否显示这个组件的。在进入时，首先 `v-if` 后跟的值 `isOpen` 为真，接着进入动画正常播放；但是在退出时，`isOpen` 变为假，`v-if` 检测到后直接将该组件从 DOM 中移除了，退出动画根本没有时间播放！

如何解决呢？这个 [Demo](https://vueuse-motion-demo.netlify.app/) 演示了这一点，可以配合 `Transition` 使用：

```vue
<script setup lang="ts">
import { useMotions } from "@vueuse/motion";
const motions = useMotions();
// ...
</script>

<template>
  <!-- ... -->
  <Transition :css="false" @leave="(_, done) => motions.modal.leave(done)">
    <div
      v-if="isOpen"
      class="modal-container"
      @click.self="closeModal"
      v-motion="'modal'"
      :initial="{ opacity: 0, y: 100 }"
      :enter="{ opacity: 1, y: 0 }"
      :leave="{ opacity: 0, y: 100 }"
    >
      <div class="modal">
        <p class="modal-text">Hello, world!</p>
        <button class="btn" @click="closeModal">Close</button>
      </div>
    </div>
  </Transition>
  <!-- ... -->
</template>
```

这样退出动画也能顺利播放了。
