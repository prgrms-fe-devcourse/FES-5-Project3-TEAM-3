import Pagination from '@/component/Pagination';
import { useState } from 'react';

function WineSeller() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex flex-col gap-12 overflow-scroll">
      <h2 className="w-full inline-flex flex-col justify-start items-start text-2xl font-semibold">
        My Wine Seller
      </h2>
      <Pagination
        page={page}
        onPageChange={setPage}
        totalPages={5}
        siblingCount={1}
        boundaryCount={1}
        showFirstLast={false}
        showPrevNext
        size="md"
      />
    </div>
  );
}
export default WineSeller;
