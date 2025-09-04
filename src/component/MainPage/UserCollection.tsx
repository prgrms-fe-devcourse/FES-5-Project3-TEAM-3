import { Link } from 'react-router';
import { countryInfo } from '../wine/filterSearch/filterInfo';

interface Props {
  id: string;
  number:number
  image: string[];
  title: string;
  content: string;
  icon: string;
  flavor: string[];
}

function UserCollection({ id,number, image, title, content, icon, flavor }: Props) {
  const country = countryInfo[icon] ?? '';
  const mainFlavor = flavor.slice(0, 3).join(',  ');

  return (
    <Link to={`/wines/detail/${id}`}>
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-primary-50 backdrop-blur rounded-2xl w-121 px-5 py-7 h-158 flex items-center justify-center shadow-xl">
          <div className="border-3 border-secondary-300 rounded-2xl p-4 w-110 h-145">
            <div className="text-sm text-gray-500">{number + 1}</div>
            <div className="flex flex-col items-center text-center gap-2">
              <img
                className="w-[152px] h-[376px] object-contain"
                src={
                  image.length !== 0 ? (image[1] ?? image[0]) : '/image/wineImage.svg'
                }
                alt={title}
              />
              <h5 className="font-semibold">{title}</h5>
              <p className="w-[304px] text-gray-600 text-center text-ellipsis line-clamp-2">
                {content}
              </p>
              <div className="flex gap-2 items-center mt-2">
                <img className="w-6 h-6" src={country.icon} alt="" />

                <p className="">{mainFlavor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
export default UserCollection;
