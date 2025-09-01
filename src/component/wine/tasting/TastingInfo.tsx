import TastingGraph from './TastingGraph';

interface TastingInfoProps {
  tasting?: {
    sweetness: number | null;
    acidic: number | null;
    tannic: number | null;
    body: number | null;
  };
  style: 'review' | 'info';
  type?: 'readonly' | 'select';
  className?: string;
}

function TastingInfo({
  tasting = { sweetness: 0, acidic: 0, tannic: 0, body: 0 },
  style,
  type = 'readonly',
  className,
}: TastingInfoProps) {
  const { sweetness, acidic, tannic, body } = tasting;
  return (
    <ul
      className={`flex flex-col ${type === 'select' ? 'gap-3' : 'gap-1'} mb-4 font-normal text-text-secondary`}
    >
      <TastingGraph
        name="당도"
        type={type}
        rating={sweetness}
        style={style}
        className={className}
      />
      <TastingGraph name="산미" type={type} rating={acidic} style={style} className={className} />
      <TastingGraph name="탄닌" type={type} rating={tannic} style={style} className={className} />
      <TastingGraph name="바디" type={type} rating={body} style={style} className={className} />
    </ul>
  );
}

export default TastingInfo;
