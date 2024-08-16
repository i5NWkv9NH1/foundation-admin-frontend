export function highlightActionColor(value: string) {
  // * example
  // * `view:sys:users`
  const strArr = value.split(':');
  const [action, ..._modules] = strArr;
  switch (action) {
    case 'view' || 'VIEW':
      return 'primary';
    case 'create' || 'CREATE':
      return 'success';
    case 'update' || 'UPDATE':
      return 'wanring';
    case 'delete' || 'DELETE':
      return 'error';
    default:
      return 'secondary';
  }
}
export const highlights = {
  action: highlightActionColor
};
