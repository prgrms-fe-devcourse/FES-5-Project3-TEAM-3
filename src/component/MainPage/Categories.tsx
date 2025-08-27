import { Link } from 'react-router';

interface Props {
  src: string;
  alt: string;
  category: string;
}

function Categories({ src, alt, category }: Props) {
  return (
    <Link to="">
      <div className="flex flex-col justify-center text-center">
        <img className="w-25 h-25" src={src} alt={alt} />
        <p className="font-light text-secondary-700 ">{category}</p>
      </div>
    </Link>
  );
}
export default Categories;
