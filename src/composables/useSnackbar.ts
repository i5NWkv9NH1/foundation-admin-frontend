import { useAppStore } from '@/stores';
import { SnackbarOptions } from '@/types';

// Default Snackbar settings
const defaultTimeout = 4000;
const defaultLocation: SnackbarOptions['location'] = 'top center';

// Define colors for different message types
const colors: Record<string, string> = {
  info: 'blue',
  success: 'green',
  error: 'red',
  warning: 'orange'
};

export function useSnackbar() {
  const { addSnackbar } = useAppStore();

  function showSnackbar(options: SnackbarOptions) {
    const { color, timeout, location, closeOnBack, closeOnContentClick, ...rest } = options;
    const _color = colors[color || 'info'];

    const mergedOptions: SnackbarOptions = {
      ...rest,
      color: _color,
      timeout: timeout || defaultTimeout,
      location: location || defaultLocation,
      closeOnBack: closeOnBack || true,
      closeOnContentClick: closeOnContentClick || true
    };

    addSnackbar(mergedOptions);
  }

  // Convenience methods for different message types
  function showInfoMessage(text: string, timeout?: number) {
    showSnackbar({ text, color: 'info', timeout });
  }

  function showSuccessMessage(text: string, timeout?: number) {
    showSnackbar({ text, color: 'success', timeout });
  }

  function showErrorMessage(text: string, timeout?: number) {
    showSnackbar({ text, color: 'error', timeout });
  }

  function showWarningMessage(text: string, timeout?: number) {
    showSnackbar({ text, color: 'warning', timeout });
  }

  return {
    showSnackbar,
    showInfoMessage,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage
  };
}
