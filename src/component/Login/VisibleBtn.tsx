import { useState } from 'react';

type Props = {
  ref: React.RefObject<HTMLInputElement | null>;
};

function VisibleBtn({ ref }: Props) {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    const el = ref.current;
    if (!el) return;
    el.type = el.type == 'password' ? 'text' : 'password';
    setVisible(!visible);
  };
  return (
    <button type="button" onClick={handleClick} className="cursor-pointer">
      {visible ? (
        <img src="/icon/invisible.svg" alt="비밀번호 비공개" />
      ) : (
        <img src="/icon/visible.svg" alt="비밀번호 공개" />
      )}
    </button>
  );
}
export default VisibleBtn;
