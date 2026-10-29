export const setItem = (key, value) => {
  try {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(key, stringValue);
  } catch (e) {
    console.error('Storage Set Error', e);
  }
};

export const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (e) {
    console.error('Storage Get Error', e);
    return null;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Storage Remove Error', e);
  }
};

// Logout ke liye sabhi Auth keys clear karne ka function
export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (e) {
    console.error('Storage Clear Error', e);
  }
};