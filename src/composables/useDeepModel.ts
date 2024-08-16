export function useDeepModel<T>(form: Ref<Record<string, any>>, path: string, defaultValue?: T) {
  const keys = path.split('.');
  const isDeep = keys.length > 1;

  const getValue = computed(() => {
    if (isDeep) {
      return keys.reduce((obj, key) => (obj ? obj[key] : defaultValue), form.value);
    } else {
      return form.value[path] ?? defaultValue;
    }
  });

  const setValue = (newValue: T) => {
    if (isDeep) {
      let obj = form.value;
      const lastKey = keys.pop();

      for (const key of keys) {
        obj = obj[key];
      }

      if (lastKey) {
        obj[lastKey] = newValue;
      }
    } else {
      form.value[path] = newValue;
    }
  };

  return {
    get: getValue,
    set: setValue
  };
}
