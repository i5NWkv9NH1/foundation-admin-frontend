// validationRules.ts
export const validationRules = {
  username: [
    (v: string) => !!v || 'Username is required',
    // (v: string) =>
    //   v.length >= 6 || 'Username must be at least 6 characters long',
    (v: string) => v.length <= 10 || 'Username must be at most 10 characters long',
    (v: string) => /^[a-zA-Z0-9_]+$/.test(v) || 'Username can only contain letters, numbers, and underscores',
    (v: string) => !/\s/.test(v) || 'Username cannot contain spaces'
  ],
  password: [(v: string) => !!v || 'Password is required', (v: string) => v.length >= 6 || 'Password must be at least 6 characters long', (v: string) => v.length <= 20 || 'Password must be at most 20 characters long', (v: string) => !/\s/.test(v) || 'Password cannot contain spaces'],
  // confirmPassword: [(v: string) => !!v || 'Please confirm your password', (v: string, password: string) => v === password || 'Passwords do not match'],
  captcha: [(v: string) => !!v || 'Captcha is required', (v: string) => v.length === 4 || 'Captcha must be 4 characters long']
};
