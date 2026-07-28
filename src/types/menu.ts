import type { IconName } from '../icons'

export interface MenuItem {
  label?: string
  icon?: IconName
  danger?: boolean
  divider?: boolean
  disabled?: boolean
  key?: string
  shortcut?: string
  heading?: boolean
  children?: MenuItem[]
}
