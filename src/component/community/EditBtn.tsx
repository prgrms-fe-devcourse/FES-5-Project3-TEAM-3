interface Props {
  state: boolean;
  setState: (s: boolean) => void;
  onSave: () => Promise<void>;
}
function EditBtn({ state, setState, onSave }: Props) {
  const handleEdit = () => {
    setState(!state);
  };
  return (
    <>
      {state ? (
        <>
          <button type="button" className="cursor-pointer" onClick={onSave}>
            완료
          </button>
          <button type="button" className="cursor-pointer" onClick={handleEdit}>
            취소
          </button>
        </>
      ) : (
        <button className="cursor-pointer">
          <img src="/icon/modify.svg" alt="수정하기" className="w-3 h-3" onClick={handleEdit} />
        </button>
      )}
    </>
  );
}
export default EditBtn;
