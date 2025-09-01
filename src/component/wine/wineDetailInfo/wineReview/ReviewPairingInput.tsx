import { useState } from 'react';
import ReviewTagInput from './ReviewTagInput';

function ReviewPairingInput() {
  const options: string[] = [
    '고기-소,돼지',
    '고기-닭',
    '햄,소세지',
    '해산물',
    '치즈,유제품',
    '채소',
    '파스타,피자',
    '디저트',
    '빵,간단안주',
    '견과류',
    '기타',
  ];
  const [selected, setSelected] = useState('');

  return (
    <div className="flex flex-col">
      <div className="flex  items-center gap-2 p-1 mb-2 text-text-primary">
        페어링
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-40 bg-white rounded-lg p-1"
        >
          <option value="" disabled hidden>
            카테고리
          </option>
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <ReviewTagInput type="페어링" category={selected} />
    </div>
  );
}

export default ReviewPairingInput;
