export type FormComponent =
  | 'text'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'switch'
  | 'textarea'
  | 'autocomplete'
  | 'file'
  | 'slider'
  | 'chips'
  | 'color-picker'
  | 'radios'
  | 'treeview';

export interface FormField<T = Record<string, any>> {
  name: string;
  label: string;
  type: FormComponent;
  required?: boolean;
  placeholder?: string;
  options?: Record<string, any>[];
  rules?: Array<(value: any) => boolean | string>;
  attrs?: Record<string, any>;
  multiple?: boolean; // Indicates if the field supports multiple selections (e.g., for select components)
  chips?: boolean;
  activeStrategy?: 'single-independent' | 'independent';
  itemValue?: (item: T) => void;
  itemTitle?: (item: T) => void;
}
