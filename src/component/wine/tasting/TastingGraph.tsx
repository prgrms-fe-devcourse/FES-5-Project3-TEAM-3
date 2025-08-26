import tw from '@/utils/tw';

interface TastingGraphProps {
  rating: number | null;
  style: 'review' | 'info';
}

function TastingGraph({ rating, style }: TastingGraphProps) {
  if (rating === null)
    return <p className="text-sm text-text-secondary">정보가 존재하지 않습니다</p>;
  const colors =
    style === 'info'
      ? ['bg-primary-100', 'bg-primary-200', 'bg-primary-300', 'bg-primary-500', 'bg-primary-800']
      : [
          'bg-secondary-300',
          'bg-secondary-400',
          'bg-secondary-500',
          'bg-secondary-600',
          'bg-secondary-700',
        ];
  const shape = style === 'info' ? 'w-5 h-3 rounded-lg' : 'w-4 w-4 rounded-full';
  return (
    <div className="flex gap-3">
      {colors.map((color, index) => (
        <div
          key={index}
          className={tw(shape, index + 1 <= rating ? color : 'border-1 border-gray-300')}
        ></div>
      ))}
    </div>
  );
}

export default TastingGraph;
