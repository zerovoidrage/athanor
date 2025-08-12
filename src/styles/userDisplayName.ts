// Константы стилей для отображения имени пользователя
export const USER_DISPLAY_NAME_STYLES = {
  className: "text-body text-white-700 text-center p-2 mb-2",
  inlineStyle: { color: '#8F8F8F' }
} as const;

// Если нужно изменить стили, редактируйте только этот объект
export const getUserDisplayNameStyles = () => USER_DISPLAY_NAME_STYLES;
