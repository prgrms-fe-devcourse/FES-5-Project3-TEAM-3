import { changePassword } from '@/utils/supabase/changePassword';
import tw from '@/utils/tw';
import gsap from 'gsap';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import VisibleBtn from '../Login/VisibleBtn';

type ChangePasswordOptions = {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  allowOutsideClose?: boolean;
  allowEscapeClose?: boolean;
};

interface ChangePasswordProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  options?: ChangePasswordOptions;
}

const MIN_PASSWORD_LEN = 6;

function ChangePasswordModal({ open, onClose, onSuccess, options }: ChangePasswordProps) {
  // Default Values
  const {
    title = '비밀번호 변경',
    confirmText = '변경하기',
    cancelText = '취소',
    allowOutsideClose = true,
    allowEscapeClose = true,
  } = options ?? {};

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const openingGuardRef = useRef(0);

  const [render, setRender] = useState(open);
  const [mounted, setMounted] = useState<boolean>(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  // 입력값 state
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const currentId = useId();
  const nextId = useId();
  const confirmId = useId();
  const currentRef = useRef<HTMLInputElement | null>(null);
  const nextRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  // Mount state
  useEffect(() => {
    setMounted(true);
    setContainer(document.body);
  }, []);

  // Reduced Motion
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = prefersReduced ? 0 : 0.24; // panel
  const DURATION_OV = prefersReduced ? 0 : 0.2; // overlay

  useEffect(() => {
    if (open) openingGuardRef.current = performance.now();
  }, [open]);

  useLayoutEffect(() => {
    if (!render) return;

    gsap.set(overlayRef.current, { autoAlpha: 0 });
    gsap.set(dialogRef.current, { autoAlpha: 0, y: 8, scale: 0.95 });

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    if (overlayRef.current) {
      tl.fromTo(
        overlayRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: DURATION_OV, ease: 'power2.out' },
        0
      );
    }

    if (dialogRef.current) {
      tl.fromTo(
        dialogRef.current,
        { autoAlpha: 0, y: 8, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: DURATION, ease: 'power2.out' },
        0.02
      );
    }

    tl.eventCallback('onReverseComplete', () => {
      setRender(false);
      // form reset
      setCurrent('');
      setNext('');
      setConfirm('');
      setError('');
      setBusy(false);
    });

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [render, DURATION, DURATION_OV]);

  useEffect(() => {
    if (open) {
      if (!render) {
        setRender(true);
      } else {
        tlRef.current?.play(0);
      }
    } else {
      tlRef.current ? tlRef.current.reverse() : setRender(false);
    }
  }, [open, render]);

  // Focusing & Escape Close
  useEffect(() => {
    if (!open) return;

    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => {
      (confirmBtnRef.current ?? cancelBtnRef.current)?.focus();
    }, 0);

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && allowEscapeClose) {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        const focusable: HTMLElement[] = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) || []
        ).filter((el) => !el.hasAttribute('disabled'));

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKey);

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', handleKey);
      prev?.focus?.();
    };
  }, [open, allowEscapeClose, onClose]);

  // Outside Click Close
  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!allowOutsideClose) return;
    if (performance.now() - openingGuardRef.current < 100) return;

    if (e.target === overlayRef.current) onClose();
  };

  // form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Error Handling
    if (!current) return setError('현재 비밀번호를 입력해주세요.');
    if (!next) return setError('새 비밀번호를 입력해주세요.');
    if (next.length < MIN_PASSWORD_LEN)
      return setError(`비밀번호는 ${MIN_PASSWORD_LEN}자 이상이어야 합니다.`);
    if (next !== confirm) return setError('입력하신 새 비밀번호와 확인 내역이 일치하지 않습니다.');
    if (current === next) return setError('새로운 비밀번호는 기존 비밀번호와 달라야합니다.');

    // change password
    setBusy(true);
    try {
      await changePassword({ current, next });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message ?? '비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  };

  if (!mounted || !container) return null;
  if (!render) return null;

  // Buttons Style
  const confirmBtnClass =
    'bg-success-500 text-secondary-50 hover:bg-success-600 focus-visible:outline-success-700';

  return createPortal(
    <div
      ref={overlayRef}
      onMouseDown={onOverlayClick}
      className="fixed inset-0 z-[1000] flex justify-center items-center bg-black/40 backdrop-blur-xs"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="pw-title"
        className="w-[95vw] max-w-lg rounded-2xl bg-background-base shadow-2xl ring-2 ring-primary-900/5"
      >
        <div className="flex flex-col p-6 gap-4">
          <h2 id="pw-title" className="text-xl font-bold tracking-tight mb-2">
            {title}
          </h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-4 items-center">
              <label htmlFor={currentId} className="text-sm text-text-secondary w-32">
                현재 비밀번호
              </label>
              <div className="w-full px-6 py-4 flex justify-between items-center gap-2 bg-secondary-50 border border-gray-500 rounded-2xl outline-0 focus-within:ring-1 focus-within:ring-secondary-800">
                <img src="/icon/password.svg" alt="패스워드 아이콘" />
                <input
                  type="password"
                  id={currentId}
                  ref={currentRef}
                  value={current}
                  autoComplete="current-password"
                  className="outline-none w-full"
                  placeholder="현재 비밀번호를 입력해 주세요"
                  required
                  onChange={(e) => setCurrent(e.target.value)}
                  disabled={busy}
                />
                <VisibleBtn ref={currentRef} />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <label htmlFor={nextId} className="text-sm text-text-secondary  w-32">
                새 비밀번호
              </label>
              <div className="w-full px-6 py-4 flex justify-between items-center gap-2 bg-secondary-50 border border-gray-500 rounded-2xl outline-0 focus-within:ring-1 focus-within:ring-secondary-800">
                <img src="/icon/password.svg" alt="패스워드 아이콘" />
                <input
                  type="password"
                  id={nextId}
                  ref={nextRef}
                  value={next}
                  autoComplete="new-password"
                  className="outline-none w-full"
                  placeholder="새로운 비밀번호를 입력해 주세요"
                  required
                  onChange={(e) => setNext(e.target.value)}
                  disabled={busy}
                />
                <VisibleBtn ref={nextRef} />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <label htmlFor={confirmId} className="text-sm text-text-secondary w-32">
                새 비밀번호 확인
              </label>
              <div className="w-full px-6 py-4 flex justify-between items-center gap-2 bg-secondary-50 border border-gray-500 rounded-2xl outline-0 focus-within:ring-1 focus-within:ring-secondary-800">
                <img src="/icon/password.svg" alt="패스워드 아이콘" />
                <input
                  type="password"
                  id={confirmId}
                  ref={confirmRef}
                  value={confirm}
                  autoComplete="new-password"
                  className="outline-none w-full"
                  placeholder="새 비밀번호를 한 번 더 입력해 주세요"
                  required
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={busy}
                />
                <VisibleBtn ref={confirmRef} />
              </div>
            </div>
            {error && (
              <p
                id="pw-change-error"
                role="alert"
                aria-live="polite"
                className="text-error-500 pt-4"
              >
                {error}
              </p>
            )}
          </form>
        </div>

        <div className="flex justify-between items-center gap-2 p-6 pt-0">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onClose}
            disabled={busy}
            className="w-1/2 inline-flex justify-center items-center rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-text-primary cursor-pointer hover:bg-secondary-100"
          >
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={handleSubmit}
            disabled={busy}
            className={tw(
              'w-1/2 inline-flex justify-center items-center rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
              confirmBtnClass
            )}
          >
            {busy ? '변경 중...' : confirmText}
          </button>
        </div>
      </div>
    </div>,
    container
  );
}
export default ChangePasswordModal;
