import { Link } from 'react-router';

interface Props {
  image: string;
  content: string;
  title: string;
  wineId:string
}

function Items({ image, content, title,wineId }: Props) {
  return (
    <Link to={`/wines/detail/${wineId}`}>
      <div className="w-74 h-88 flex flex-col bg-white p-4 gap-4  rounded-lg cursor-pointer  hover:-translate-y-1 shadow-md hover:duration-200">
        <img
          className="min-w-34 h-50 object-contain p-2 bg-background-base rounded-lg"
          src={image ? image : '/imgae/noImage.png'}
          alt={title}
        />
        <div className="flex flex-col justify-center gap-2">
          <h2 className="text-lg truncate text-text-primary ">{title}</h2>
          <p className="text-sm text-text-secondary line-clamp-3">{content}</p>
        </div>
      </div>
    </Link>
  );
}
export default Items;
