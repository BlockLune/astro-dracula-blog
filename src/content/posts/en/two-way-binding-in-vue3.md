---
abbrlink: 8fc81ed9
categories:
  - CS
  - Web
date: 2024-01-26 13:24:50
tags:
  - vue
  - typescript
title: Two Way Binding in Vue3
---

A simple two way binding example in vue3.

<!--more-->

`Child.vue`:

```vue
<script lang="ts" setup>
const name = defineModel<string>("name");
const age = defineModel<number>("age");

const updateAgeInChild = () => {
  ++age.value;
};
</script>

<template>
  <h1>Child:</h1>
  <p>name: {{ name }}</p>
  <p>age: {{ age }}</p>
  <input type="text" v-model="name" />
  <button @click="updateAgeInChild()">Add age in Child</button>
</template>
```

`Parent.vue`:

```vue
<script lang="ts" setup>
import { ref } from "vue";
import Child from "./Child.vue";

const name = ref("BlockLune");
const age = ref(0);

const updateAgeInParent = () => {
  ++age.value;
};
</script>

<template>
  <Child v-model:name="name" v-model:age="age" />
  <h1>Parent:</h1>
  <p>name: {{ name }}</p>
  <p>age: {{ age }}</p>
  <input type="text" v-model="name" />
  <button @click="updateAgeInParent">Add in Parent</button>
</template>
```

`App.vue`:

```vue
<script setup>
import Parent from "./Parent.vue";
</script>

<template>
  <Parent />
</template>
```

Learn more at _[Component v-model | Vue.js](https://vuejs.org/guide/components/v-model.html)._ Note the _[Under the Hood](https://vuejs.org/guide/components/v-model.html#under-the-hood)_ part.
