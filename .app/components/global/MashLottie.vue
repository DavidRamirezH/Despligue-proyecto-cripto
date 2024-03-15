<script lang="ts" setup>
const props = defineProps({
  category: {
    type: String,
    optional: true,
  },
  url: {
    type: [String, Number],
    required: true,
  },
  height: {
    type: String,
    optional: true,
  },
  width: {
    type: String,
    optional: true,
  },
  classes: {
    type: String,
    optional: true,
  },
  max: {
    type: [Number, String],
    optional: true,
  },
})

const style = computed(() => {
  return {
    height: props.height,
    width: props.width,
    margin: 'auto',
  }
})

const randomUrl = computed(() => {
  return `/dotlottie/${props.category ? `${props.category}/` : ''}${props.url}${
    props.max ? `-${Math.floor(Math.random() * Number(props.max)) + 1}` : ''
  }.lottie`
})
</script>

<template>
  <div :class="classes">
    <client-only>
      <dotlottie-player
        :src="randomUrl"
        autoplay="true"
        loop="true"
        :style="style"
      />
    </client-only>
  </div>
</template>
