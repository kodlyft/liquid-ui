;(function () {
  // ============================================================
  // Liquid UI -- Overlay components
  // LiquidModal, LiquidContextMenu, LiquidToast, LiquidNotification, LiquidPopover
  // ============================================================

  const { defineComponent, ref, computed, onMounted, onUnmounted, watch, Transition } = Vue

  // ---------- LiquidModal ----------
  const LiquidModal = defineComponent({
    name: 'LiquidModal',
    props: {
      modelValue: { type: Boolean, default: false },
      title: { type: String, default: '' },
      message: { type: String, default: '' },
      confirmText: { type: String, default: 'OK' },
      cancelText: { type: String, default: 'Cancel' },
      destructive: { type: Boolean, default: false },
      icon: { type: String, default: '' }, // icon name to show at top
      iconColor: { type: String, default: '' },
      actions: { type: Boolean, default: true }, // built-in Cancel/OK bar
      dismissible: { type: Boolean, default: true },
      size: { type: String, default: 'alert' }, // alert | sm | md | lg | full
    },
    emits: ['update:modelValue', 'confirm', 'cancel'],
    template: `
    <teleport to="body">
      <transition name="lq-modal">
        <div v-if="modelValue" class="lq-modal-overlay" @click.self="onDismiss">
          <div
            :class="['lq-modal', 'lq-glass-strong', 'lq-specular', 'lq-modal--' + size, { 'lq-modal--no-actions': !actions }]"
            role="dialog"
            aria-modal="true">
            <div v-if="icon" class="lq-modal__icon" :style="{ color: iconColor || 'currentColor' }" v-html="iconSvg(icon, 28)"></div>
            <h3 v-if="title" class="lq-modal__title">{{ title }}</h3>
            <p v-if="message" class="lq-modal__message">{{ message }}</p>
            <div v-if="$slots.default" class="lq-modal__body"><slot/></div>
            <div v-if="actions" class="lq-modal__actions">
              <button class="lq-modal__btn lq-modal__btn--cancel" @click="onCancel">{{ cancelText }}</button>
              <div class="lq-modal__btn-sep"></div>
              <button
                :class="['lq-modal__btn', destructive ? 'lq-modal__btn--destructive' : 'lq-modal__btn--confirm']"
                @click="onConfirm">{{ confirmText }}</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  `,
    setup(props, { emit }) {
      const onConfirm = () => {
        emit('confirm')
        emit('update:modelValue', false)
      }
      const onCancel = () => {
        emit('cancel')
        emit('update:modelValue', false)
      }
      const onDismiss = () => {
        if (props.dismissible) onCancel()
      }
      const onKeydown = (event) => {
        if (event.key === 'Escape' && props.modelValue && props.dismissible) onCancel()
      }
      onMounted(() => document.addEventListener('keydown', onKeydown))
      onUnmounted(() => document.removeEventListener('keydown', onKeydown))
      return { onConfirm, onCancel, onDismiss, iconSvg: window.IconSvg }
    },
  })

  const LiquidContextMenu = defineComponent({
    name: 'LiquidContextMenu',
    props: {
      items: { type: Array, required: true },
      position: { type: String, default: 'bottom' }, // for static demo positioning
    },
    emits: ['select', 'close'],
    template: `
    <div class="lq-menu lq-glass-strong lq-specular" role="menu">
      <template v-for="(item, i) in items" :key="i">
        <div v-if="item.divider" class="lq-menu__divider" role="separator"></div>

        <div v-else-if="item.heading" class="lq-menu__heading">{{ item.label }}</div>

        <div
          v-else-if="item.children && item.children.length"
          class="lq-menu__group"
          @mouseenter="submenu = i"
          @mouseleave="submenu = submenu === i ? null : submenu">
          <button
            :class="['lq-menu__item', { 'is-disabled': item.disabled, 'is-open': submenu === i }]"
            :disabled="item.disabled"
            role="menuitem"
            aria-haspopup="menu"
            @click.stop="submenu = submenu === i ? null : i">
            <span class="lq-menu__label">{{ item.label }}</span>
            <span class="lq-menu__chevron" aria-hidden="true">&rsaquo;</span>
          </button>
          <div v-if="submenu === i" class="lq-menu__submenu">
            <liquid-context-menu :items="item.children" @select="$emit('select', $event)"/>
          </div>
        </div>

        <button
          v-else
          :class="['lq-menu__item', { 'is-danger': item.danger, 'is-disabled': item.disabled }]"
          :disabled="item.disabled"
          role="menuitem"
          @click="$emit('select', item)">
          <span class="lq-menu__label">{{ item.label }}</span>
          <span v-if="item.shortcut" class="lq-menu__shortcut">{{ item.shortcut }}</span>
          <span v-if="item.icon" class="lq-menu__icon" v-html="iconSvg(item.icon, 16)"></span>
        </button>
      </template>
    </div>
  `,
    setup() {
      const submenu = ref(null)
      return { submenu, iconSvg: window.IconSvg }
    },
  })

  const LiquidContextMenuTrigger = defineComponent({
    name: 'LiquidContextMenuTrigger',
    props: {
      items: { type: Array, required: true },
      disabled: { type: Boolean, default: false },
    },
    emits: ['select', 'open', 'close'],
    template: `
    <div class="lq-menu-trigger" @contextmenu="onContextMenu">
      <slot/>
      <teleport to="body">
        <div
          v-if="open"
          ref="layer"
          class="lq-menu-layer"
          :style="{ left: x + 'px', top: y + 'px' }"
          @contextmenu.prevent.stop>
          <liquid-context-menu :items="items" @select="onSelect" @close="close"/>
        </div>
      </teleport>
    </div>
  `,
    setup(props, { emit }) {
      const MARGIN = 8
      const open = ref(false)
      const layer = ref(null)
      const x = ref(0)
      const y = ref(0)

      const clamp = () => {
        const element = layer.value
        if (!element) return
        const rect = element.getBoundingClientRect()
        if (rect.right > window.innerWidth - MARGIN) {
          x.value = Math.max(MARGIN, window.innerWidth - rect.width - MARGIN)
        }
        if (rect.bottom > window.innerHeight - MARGIN) {
          y.value = Math.max(MARGIN, window.innerHeight - rect.height - MARGIN)
        }
      }

      const close = () => {
        if (!open.value) return
        open.value = false
        emit('close')
      }

      const onContextMenu = (event) => {
        if (props.disabled) return
        event.preventDefault()
        event.stopPropagation()
        x.value = event.clientX
        y.value = event.clientY
        open.value = true
        emit('open')
        Vue.nextTick(clamp)
      }

      const onSelect = (item) => {
        emit('select', item)
        close()
      }

      const onPointerDown = (event) => {
        if (layer.value && layer.value.contains(event.target)) return
        close()
      }
      const onKeydown = (event) => {
        if (event.key === 'Escape') close()
      }

      watch(open, (isOpen) => {
        const method = isOpen ? 'addEventListener' : 'removeEventListener'
        document[method]('pointerdown', onPointerDown, true)
        document[method]('keydown', onKeydown, true)
        window[method]('blur', close)
        window[method]('scroll', close, true)
        window[method]('resize', close)
      })

      onUnmounted(close)

      return { open, layer, x, y, onContextMenu, onSelect, close }
    },
  })

  const LiquidToast = defineComponent({
    name: 'LiquidToast',
    props: {
      modelValue: { type: Boolean, default: true },
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      icon: { type: String, default: '' },
      variant: { type: String, default: 'glass' }, // glass | success | warning | danger
      closable: { type: Boolean, default: true },
    },
    emits: ['update:modelValue', 'dismiss'],
    template: `
    <transition name="lq-toast">
      <div
        v-if="modelValue"
        :class="['lq-toast', 'lq-toast--' + variant, 'lq-specular']"
        role="status">
        <span v-if="icon" class="lq-toast__icon" v-html="iconSvg(icon, 18)"></span>
        <div class="lq-toast__body">
          <div v-if="title" class="lq-toast__title">{{ title }}</div>
          <div v-if="description" class="lq-toast__desc">{{ description }}</div>
        </div>
        <button v-if="closable" class="lq-toast__close" @click="dismiss" aria-label="Dismiss">
          <span v-html="iconSvg('close', 14)"></span>
        </button>
      </div>
    </transition>
  `,
    setup(props, { emit }) {
      const dismiss = () => {
        emit('update:modelValue', false)
        emit('dismiss')
      }
      return { dismiss, iconSvg: window.IconSvg }
    },
  })

  const LiquidNotification = defineComponent({
    name: 'LiquidNotification',
    props: {
      appIcon: { type: String, default: 'message' },
      appName: { type: String, default: 'Messages' },
      appColor: { type: String, default: 'var(--green)' },
      title: { type: String, default: '' },
      message: { type: String, default: '' },
      time: { type: String, default: 'now' },
      avatar: { type: String, default: '' },
      grouped: { type: Number, default: 0 }, // > 0 = show "+N more" stacked look
    },
    template: `
    <div class="lq-notif lq-glass-strong lq-specular" :class="{ 'is-grouped': grouped > 0 }">
      <div class="lq-notif__head">
        <span class="lq-notif__app" :style="{ background: appColor }">
          <span v-html="iconSvg(appIcon, 12)"></span>
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
  `,
    setup() {
      return { iconSvg: window.IconSvg }
    },
  })

  const LiquidPopover = defineComponent({
    name: 'LiquidPopover',
    props: {
      open: { type: Boolean, default: false },
      placement: { type: String, default: 'top' }, // top | bottom
    },
    template: `
    <span class="lq-popover-host">
      <slot name="trigger"/>
      <transition name="lq-pop">
        <span v-if="open" :class="['lq-popover', 'lq-glass-strong', 'lq-specular', 'lq-popover--' + placement]">
          <slot/>
        </span>
      </transition>
    </span>
  `,
  })

  window.LiquidModal = LiquidModal
  window.LiquidContextMenu = LiquidContextMenu
  window.LiquidContextMenuTrigger = LiquidContextMenuTrigger
  window.LiquidToast = LiquidToast
  window.LiquidNotification = LiquidNotification
  window.LiquidPopover = LiquidPopover
})()
