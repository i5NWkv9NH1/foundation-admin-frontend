export type FormComponent = 'text' | 'number' | 'select' | 'checkbox' | 'date' | 'switch' | 'textarea' | 'autocomplete' | 'file' | 'slider' | 'chips' | 'color-picker' | 'radios' | 'treeview' | 'button' | 'btn' | 'avatar' | 'tree-activator' | 'tree-selector'

export interface FormField<T = Record<string, any>> {
  name: string
  label: string
  type: FormComponent
  required?: boolean
  placeholder?: string
  variant?: any
  readonly?: boolean
  disabled?: boolean
  options?: Record<string, any>[]
  inline?: boolean
  rules?: Array<(value: any) => boolean | string>
  attrs?: {
    items?: Record<string, any>[] | any[]
    [key: string]: any
  }
  multiple?: boolean // Indicates if the field supports multiple selections (e.g., for select components)
  returnObject?: boolean
  chips?: boolean
  activeStrategy?: 'single-independent' | 'independent'
  itemValue?: (item: T) => void
  itemTitle?: (item: T) => void
  reverse?: boolean
  controlVariant?: 'default' | 'split' | 'stacked'
  hideInput?: boolean
  inset?: boolean
}

export type DeleteMode = 'single' | 'multiple'
