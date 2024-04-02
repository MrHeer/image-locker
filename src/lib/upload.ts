export function upload(acceptType: string): Promise<File> {
  return new Promise((resolve, reject) => {
    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.accept = acceptType;
    uploadInput.addEventListener('change', (event) => {
      event.preventDefault();
      const { files } = event.target as HTMLInputElement;
      if (files?.[0]) {
        resolve(files[0]);
      } else {
        reject(new Error('No file selected.'));
      }
    });
    uploadInput.addEventListener('cancel', () => {
      reject(new Error('No file selected.'));
    });
    uploadInput.click();
  });
}
