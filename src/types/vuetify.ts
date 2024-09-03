import { StyleValue, TransitionProps } from 'vue'
import { PaginationMeta } from './response'

export type Align = 'center' | 'end' | 'start'
export type HeaderKey = string | 'data-table-group' | 'data-table-select' | 'data-table-expand'

export interface HeaderProps {
  [key: string]: any
}
export type SelectItemKey<T = Record<string, any>> = boolean | null | undefined | string | readonly (string | number)[] | ((item: T, fallback?: any) => any)

export interface CellProps {
  (data: { index: number; item: any; value: any; internalItem: any }): Record<string, any>
  [key: string]: any
}

export type SortFunction<T> = (a: T, b: T) => number
export type FilterFunction = (value: any) => boolean

export interface TreeViewActionArgs {
  // default item.id
  id: unknown
  // is opened / selected / actived
  value: boolean
  path: unknown[]
}
export interface TreeViewSlots {
  isActive: boolean
  isSelected: boolean
  isIndeterminate: boolean
  select: (value: boolean) => void
}
export type Density = 'default' | 'comfortable' | 'compact'
export interface TableHeader {
  key?: HeaderKey
  value?: any // Adjust based on actual type used in `SelectItemKey<Record<string, any>>`
  title?: string
  fixed?: boolean
  align?: Align
  width?: string | number
  minWidth?: string
  maxWidth?: string
  nowrap?: boolean
  headerProps?: HeaderProps
  cellProps?: CellProps | HeaderProps
  sortable?: boolean
  sort?: SortFunction<any>
  sortRaw?: SortFunction<any>
  filter?: FilterFunction
  mobile?: boolean
  children?: TableHeader[]
}
export interface TableMeta extends PaginationMeta {
  loading: boolean
  search?: string
}
export interface TableCallbackOptions {
  page: number
  itemsLength?: number
  itemsPerPage: number
  search?: string
}
export interface TableRowAction {
  title: string
  icon?: string
  color?: string
  cb: Function
  permission?: string | string[]
}

export type ExpandProps = {
  expandOnClick: boolean
  expanded: readonly string[]
  'onUpdate:expanded': ((value: any[]) => void) | undefined
}

declare const block: readonly ['top', 'bottom']
declare const inline: readonly ['start', 'end', 'left', 'right']
type Tblock = (typeof block)[number]
type Tinline = (typeof inline)[number]
type Anchor = Tblock | Tinline | 'center' | 'center center' | `${Tblock} ${Tinline | 'center'}` | `${Tinline} ${Tblock | 'center'}`
export type SnackbarLocation = Anchor

export type SnackbarPosition = 'static' | 'relative' | 'fixed' | 'absolute' | 'sticky'

export type SnackbarVariant = 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'

export type SnackbarLocationStrategy = 'static' | 'connected' | ((element: HTMLElement) => void)

export interface SnackbarOptions {
  text: string
  multiLine?: boolean
  timer?: string | boolean
  timeout?: string | number
  vertical?: boolean
  location?: SnackbarLocation
  position?: SnackbarPosition
  absolute?: boolean
  rounded?: string | number | boolean
  tile?: boolean
  color?: string
  variant?: SnackbarVariant
  theme?: string
  closeOnBack?: boolean
  contained?: boolean
  contentClass?: any
  contentProps?: any
  disabled?: boolean
  opacity?: string | number
  zIndex?: string | number
  target?: Element | 'parent' | 'cursor' | (string & {}) | Component | [number, number]
  closeOnContentClick?: boolean
  style?: StyleValue
  class?: any
  height?: string | number
  maxHeight?: string | number
  maxWidth?: string | number
  minHeight?: string | number
  minWidth?: string | number
  width?: string | number
  eager?: boolean
  locationStrategy?: SnackbarLocationStrategy
  origin?: SnackbarLocation | 'auto' | 'overlap'
  offset?: string | number | number[]
  transition?: string | boolean | (TransitionProps & { component: Component })
  attach?: string | boolean | Element
  // slots?: {
  //   activator?: (arg: { isActive: boolean; props: Record<string, any> }) => VNodeChild;
  //   default?: () => VNodeChild;
  //   actions?: (arg: { isActive: Ref<boolean> }) => VNodeChild;
  //   text?: () => VNodeChild;
  // };
}
