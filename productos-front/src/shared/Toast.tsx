import { useEffect, useState } from 'react';

interface Toast { message: string; type: 'success' | 'error'; }
let showToastFn: (msg: string, type?: 'success' | 'error') => void = () => {};
export const showToast = (msg: string, type: 'success' | 'error' = 'success') => showToastFn(msg, type);

export default function Toast() {
  const [toast, setToast] = useState<Toast | null>(null);
  useEffect(() => {
    showToastFn = (message, type = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    };
  }, []);
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', padding: '.875rem 1.5rem',
      borderRadius: '8px', fontFamily: 'monospace', fontSize: '.9rem', zIndex: 9999,
      background: toast.type === 'success' ? 'rgba(46,213,115,.15)' : 'rgba(255,71,87,.15)',
      border: `1px solid ${toast.type === 'success' ? '#2ed573' : '#ff4757'}`,
      color: toast.type === 'success' ? '#2ed573' : '#ff4757',
    }}>
      {toast.message}
    </div>
  );
}