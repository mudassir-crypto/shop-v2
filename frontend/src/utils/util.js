export const validate = (string) => {
  return string.replace(/["'<>]/g, '').trim()
} 