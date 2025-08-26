import TastingGraph from './TastingGraph';

interface TastingInfoProps {
  tasting: {
    sweetness: number | null;
    acidic: number | null;
    tannic: number | null;
    body: number | null;
  };
  style: 'review' | 'info';
}

function TastingInfo({ tasting: { sweetness, acidic, tannic, body }, style }: TastingInfoProps) {
  return (
    <ul className="flex flex-col gap-1 mb-4 font-normal">
      <li className="flex gap-4 items-center" key="sweetness">
        <span className="align-bottom text-nowrap">당도</span>
        <TastingGraph rating={sweetness} style={style} />
      </li>
      <li className="flex gap-4 items-center" key="acidic">
        <span className="align-bottom text-nowrap">산미</span>
        <TastingGraph rating={acidic} style={style} />
      </li>

      <li className="flex gap-4 items-center" key="tannic">
        <span className="align-bottom text-nowrap">탄닌</span>
        <TastingGraph rating={tannic} style={style} />
      </li>

      <li className="flex gap-4 items-center" key="body">
        <span className="align-bottom text-nowrap">바디</span>
        <TastingGraph rating={body} style={style} />
      </li>
    </ul>
  );
}

export default TastingInfo;
