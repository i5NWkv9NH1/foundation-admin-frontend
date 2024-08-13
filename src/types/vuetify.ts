export type Align = 'center' | 'end' | 'start';
export type HeaderKey = string | 'data-table-group' | 'data-table-select' | 'data-table-expand';

export interface HeaderProps {
  [key: string]: any;
}
export type SelectItemKey<T = Record<string, any>> = boolean | null | undefined | string | readonly (string | number)[] | ((item: T, fallback?: any) => any);

export interface CellProps {
  (data: { index: number; item: any; value: any; internalItem: any }): Record<string, any>;
  [key: string]: any;
}

export type SortFunction<T> = (a: T, b: T) => number;
export type FilterFunction = (value: any) => boolean;

export interface TreeViewActionArgs {
  // default item.id
  id: unknown;
  // is opened / selected / actived
  value: boolean;
  path: unknown[];
}
export interface TreeViewSlots {
  isActive: boolean;
  isSelected: boolean;
  isIndeterminate: boolean;
  select: (value: boolean) => void;
}
export type Density = 'default' | 'comfortable' | 'compact';
export interface TableHeader {
  key?: HeaderKey;
  value?: any; // Adjust based on actual type used in `SelectItemKey<Record<string, any>>`
  title?: string;
  fixed?: boolean;
  align?: Align;
  width?: string | number;
  minWidth?: string;
  maxWidth?: string;
  nowrap?: boolean;
  headerProps?: HeaderProps;
  cellProps?: CellProps | HeaderProps;
  sortable?: boolean;
  sort?: SortFunction<any>;
  sortRaw?: SortFunction<any>;
  filter?: FilterFunction;
  mobile?: boolean;
  children?: TableHeader[];
}
