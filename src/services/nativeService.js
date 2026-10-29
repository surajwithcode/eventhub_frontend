import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Toast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';

export const takePhoto = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
      });
      return image.webPath;
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      return new Promise((resolve) => {
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) resolve(URL.createObjectURL(file));
          else resolve(null);
        };
        input.click();
      });
    }
  } catch (error) {
    await showToast('Photo capture cancelled');
    return null;
  }
};

export const showToast = async (message) => {
  if (Capacitor.isNativePlatform()) {
    await Toast.show({
      text: message,
      duration: 'short',
      position: 'bottom',
    });
  } else {
    const toastElem = document.createElement('div');
    toastElem.innerText = message;
    toastElem.style.cssText = `
      position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
      background: #333; color: #fff; padding: 10px 20px; border-radius: 20px;
      z-index: 9999; font-size: 14px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toastElem);
    setTimeout(() => toastElem.remove(), 2500);
  }
};
