// File: src/pages/Auth/Login.jsx

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { setCartItemsFromDB } from "../../redux/features/cart/cartSlice";
import { useGetUserCartQuery } from "../../redux/api/usersApiSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  // Hook để lấy giỏ hàng của user
  const { data: cartData, refetch } = useGetUserCartQuery(userInfo?._id, {
    skip: !userInfo,
  });

  const handleLoginSuccess = async (user) => {
    // user chứa thông tin userInfo (_id, username, email...)
    const userId = user._id;
    try {
      // Gọi API để lấy giỏ hàng từ backend
      await refetch();
      
      if (cartData) {
        // Cập nhật cart vào Redux với cấu trúc đầy đủ
        dispatch(setCartItemsFromDB(cartData));
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }

    // Fetch cart xong thì chuyển hướng
    navigate(redirect);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      // Lưu thông tin đăng nhập vào Redux
      dispatch(setCredentials({ ...res }));
      // Sau khi login thành công thì load giỏ hàng và navigate
      await handleLoginSuccess(res);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div>
      <section className="pl-[10rem] flex items-center justify-between min-h-screen">
        {/* Form Sign In */}
        <div className="w-full lg:w-1/2 mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4">Sign In</h1>

          <form onSubmit={submitHandler} className="container max-w-md">
            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem] flex items-center justify-center"
            >

              {isLoading && (
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-opacity-50 mr-2"></span>
              )}
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4">
            <p className="text-white">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-red-500 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex lg:items-center lg:justify-center lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
            alt="Login"
            className="rounded-lg h-[80%] w-[80%] object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default Login;
