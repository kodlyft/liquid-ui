import type { App, Plugin } from 'vue'
import './style.css'

// Actions
import LiquidButton from './components/Button/LiquidButton.vue'
import LiquidIconButton from './components/Button/LiquidIconButton.vue'

// Forms
import LiquidToggle from './components/Forms/LiquidToggle.vue'
import LiquidCheck from './components/Forms/LiquidCheck.vue'
import LiquidSegmented from './components/Forms/LiquidSegmented.vue'
import LiquidSlider from './components/Forms/LiquidSlider.vue'
import LiquidStepper from './components/Forms/LiquidStepper.vue'
import LiquidInput from './components/Forms/LiquidInput.vue'
import LiquidSearchBar from './components/Forms/LiquidSearchBar.vue'
import LiquidAutocomplete from './components/Forms/LiquidAutocomplete.vue'

// Display
import LiquidCard from './components/Display/LiquidCard.vue'
import LiquidBadge from './components/Display/LiquidBadge.vue'
import LiquidAvatar from './components/Display/LiquidAvatar.vue'
import LiquidListRow from './components/Display/LiquidListRow.vue'
import LiquidProgress from './components/Display/LiquidProgress.vue'
import LiquidSpinner from './components/Display/LiquidSpinner.vue'

// Overlays
import LiquidModal from './components/Overlays/LiquidModal.vue'
import LiquidContextMenu from './components/Overlays/LiquidContextMenu.vue'
import LiquidContextMenuTrigger from './components/Overlays/LiquidContextMenuTrigger.vue'
import LiquidToast from './components/Overlays/LiquidToast.vue'
import LiquidNotification from './components/Overlays/LiquidNotification.vue'
import LiquidPopover from './components/Overlays/LiquidPopover.vue'

// Special
import LiquidTabBar from './components/Special/LiquidTabBar.vue'
import LiquidAudioPlayer from './components/Special/LiquidAudioPlayer.vue'
import LiquidKeyboard from './components/Special/LiquidKeyboard.vue'

// Utilities + types
export { iconSvg, type IconName } from './icons'
export type { MenuItem } from './types/menu'
export type { AutocompleteOption } from './components/Forms/LiquidAutocomplete.vue'

export {
  LiquidButton,
  LiquidIconButton,
  LiquidToggle,
  LiquidCheck,
  LiquidSegmented,
  LiquidSlider,
  LiquidStepper,
  LiquidInput,
  LiquidSearchBar,
  LiquidAutocomplete,
  LiquidCard,
  LiquidBadge,
  LiquidAvatar,
  LiquidListRow,
  LiquidProgress,
  LiquidSpinner,
  LiquidModal,
  LiquidContextMenu,
  LiquidContextMenuTrigger,
  LiquidToast,
  LiquidNotification,
  LiquidPopover,
  LiquidTabBar,
  LiquidAudioPlayer,
  LiquidKeyboard,
}

const components = {
  LiquidButton,
  LiquidIconButton,
  LiquidToggle,
  LiquidCheck,
  LiquidSegmented,
  LiquidSlider,
  LiquidStepper,
  LiquidInput,
  LiquidSearchBar,
  LiquidAutocomplete,
  LiquidCard,
  LiquidBadge,
  LiquidAvatar,
  LiquidListRow,
  LiquidProgress,
  LiquidSpinner,
  LiquidModal,
  LiquidContextMenu,
  LiquidContextMenuTrigger,
  LiquidToast,
  LiquidNotification,
  LiquidPopover,
  LiquidTabBar,
  LiquidAudioPlayer,
  LiquidKeyboard,
}

export const LiquidUI: Plugin = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
}

export default LiquidUI
