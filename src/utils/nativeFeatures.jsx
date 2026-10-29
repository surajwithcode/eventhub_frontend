import { Toast } from '@capacitor/toast';

export const showNativeToast = async (msg) => {
  await Toast.show({
    text: msg,
    duration: 'short',
    position: 'bottom'
  });
};