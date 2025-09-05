import { countryInfo } from '../wine/filterSearch/filterInfo';

interface Props {
  id: number;
  image: string[];
  title: string;
  content: string;
  icon: string;
  flavor: string[];
}

function UserCollection({ id, image, title, content, icon, flavor }: Props) {
  const country = countryInfo[icon] ?? '';
  const mainFlavor = flavor.slice(0, 3).join(',  ');

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="bg-primary-50 backdrop-blur rounded-2xl w-full max-w-[540px] md:max-w-[420px] sm:max-w-[340px] px-5 py-7 lg:h-158 flex items-center justify-center shadow-xl">
        <div className="border-3 border-secondary-300 rounded-2xl p-4 w-full lg:w-110 h-auto lg:h-145">
          <div className="text-sm text-gray-500">{id + 1}</div>
          <div className="flex flex-col items-center text-center gap-2">
            <img className="w-[120px] h-[280px] sm:w-[140px] sm:h-[340px] lg:w-[152px] lg:h-[376px] object-contain" src={image[0]} alt={title} />
            <p className="text-xs font-[Allura]">{title}</p>
            <h5 className="font-semibold text-base sm:text-lg">{title}</h5>
            <p className="w-full max-w-[304px] text-gray-600 text-center text-sm sm:text-base">{content}</p>
            <div className="flex gap-2 items-center mt-2">
              <img className="w-6 h-6" src={country.icon} alt="" />

              <p className="text-sm sm:text-base">{mainFlavor}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserCollection;
