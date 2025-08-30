export const useKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const form = e.currentTarget.form;
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (form) {
      form.requestSubmit();
    }
  }
};
