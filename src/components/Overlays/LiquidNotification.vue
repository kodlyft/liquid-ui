<template>
  <div class="lq-notif lq-glass-strong lq-specular" :class="{ 'is-grouped': grouped > 0 }">
    <div class="lq-notif__head">
      <span class="lq-notif__app" :style="{ background: appColor }">
        <span v-html="iconSvg(appIcon, 12)" />
      </span>
      <span class="lq-notif__app-name">{{ appName }}</span>
      <span class="lq-notif__time">{{ time }}</span>
    </div>
    <div class="lq-notif__body">
      <img v-if="avatar" :src="avatar" class="lq-notif__avatar" />
      <div class="lq-notif__text">
        <div v-if="title" class="lq-notif__title">{{ title }}</div>
        <div v-if="message" class="lq-notif__message">{{ message }}</div>
      </div>
    </div>
    <div v-if="grouped > 0" class="lq-notif__stack">+{{ grouped }} more</div>
  </div>
</template>

<script setup lang="ts">
import { iconSvg, type IconName } from '../../icons'

interface Props {
  appIcon?: IconName
  appName?: string
  appColor?: string
  title?: string
  message?: string
  time?: string
  avatar?: string
  grouped?: number
}

withDefaults(defineProps<Props>(), {
  appIcon: 'message',
  appName: 'Messages',
  appColor: 'var(--green)',
  title: '',
  message: '',
  time: 'now',
  avatar: '',
  grouped: 0,
})
</script>
