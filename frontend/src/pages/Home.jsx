import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import PopularProducts from "../components/PopularProducts";
import Product from "./Products/Product";
import AdBanner from "../components/AdBanner";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword, limit: 8 });

  return (
    <>
      {!keyword ? <PopularProducts /> : null}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          {/* Tiêu đề và nút "Shop" */}
          <div className="flex justify-between items-center px-[4rem] mt-[4rem]">
            <h1 className="text-4xl font-bold text-white ml-20">Special Products</h1>
            <Link
              to="/shop"
              className="bg-red-600 text-white font-bold rounded-full py-2 px-10 hover:bg-red-700"
            >
              Shop
            </Link>
          </div>
          {/* Grid container cho danh sách sản phẩm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center mt-[2rem] px-[2rem] ml-20 mb-16">
            {data.products.slice(4, 8).map((product) => (
              <div key={product._id} className="flex justify-center">
                <Product product={product} />
              </div>
            ))}
          </div>
          <AdBanner/>
        </>
      )}
    </>
  );
};

export default Home;
