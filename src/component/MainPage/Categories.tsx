import { Link } from 'react-router';

interface Props {
  src: string;
  alt: string;
  category: string;
}

function Categories({ src, alt, category }: Props) {
  return (
    <Link to={`/search?keyword=${encodeURIComponent(alt)}`}>
      <div className="flex flex-col justify-center items-center text-center">
        <img className="w-16 h-16 sm:w-20 sm:h-20" src={src} alt={alt} />
        <p className="font-light text-secondary-700 text-sm sm:text-base mt-2">{category}</p>
      </div>
    </Link>
  );
}
export default Categories;
