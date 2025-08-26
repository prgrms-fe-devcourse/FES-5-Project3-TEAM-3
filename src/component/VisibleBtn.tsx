import { useState } from "react";

function VisibleBtn() {

  const [visible,setVisible] = useState(false)

  const handleClick = () => {
    setVisible(!visible)
  }
  return (
    <button type="button"
      onClick={handleClick}
      className="cursor-pointer">
      {
        visible ?
         <img src="/icon/invisible.svg" alt="비밀번호 비공개" />:
        <img src="/icon/visible.svg" alt="비밀번호 공개" />
      }
    </button>
  );
}
export default VisibleBtn