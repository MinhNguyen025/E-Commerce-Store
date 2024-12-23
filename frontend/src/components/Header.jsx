import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import logo from "../images/logo.jpg";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth); // Lấy thông tin user từ Redux

  return (
    <header className="bg-black text-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 ml-20">
          <img src={logo} alt="Logo" className="h-12 w-12 items-center" />
          <span className="text-2xl font-bold">Innovate your life!</span>
        </Link>

        {/* Cart (chỉ hiển thị khi user là user thường và đã đăng nhập) */}
        {!userInfo?.isAdmin && userInfo && (
          <div className="flex items-center space-x-6 mr-60">
            {/* Cart */}
            <Link to="/cart" className="relative flex items-center">
              <FaShoppingCart size={24} />
              {cartItems?.length > 0 && (
                <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
