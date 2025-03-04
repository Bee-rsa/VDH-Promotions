import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    console.log("Fetching products with:", { collection, ...queryParams });
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, collection, searchParams]);

  useEffect(() => {
    console.log("Redux State - Products:", products);
  }, [products]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col -mt-1 bg-black lg:flex-row">
      {/* Mobile Filter button */}
{/* Mobile Filter button */}
<button
  onClick={toggleSidebar}
  className={`lg:hidden border p-2 rounded-md bg-gray-700 text-white focus:outline-none flex justify-center items-center ml-auto px-4 pr-6 w-auto z-50 ${isSidebarOpen ? 'hidden' : ''}`}
>
  <FaFilter className="mr-2 text-white" /> Filters
</button>




{/* Filter Sidebar */}
<div
  ref={sidebarRef}
  className={`flex-shrink-0 !w-64 fixed inset-y-0 z-50 left-0 bg-white overflow-y-auto transition-transform duration-300 ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } lg:static lg:translate-x-0`}
>
  <FilterSidebar />
</div>

      
      <div className="flex-grow p-4">

        {/* Sort Options */}
        <SortOptions />

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
