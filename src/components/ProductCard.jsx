import React from "react";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";

const ProductCard = ({ mehsul }) => {
  const defaultImageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3EŞəkil yoxdur%3C/text%3E%3C/svg%3E";
  if (!mehsul) return null;

  const imageUrl =
    mehsul.images && mehsul.images[0] ? mehsul.images[0].url : defaultImageUrl;

  return (
    <Link to={`/product/${mehsul._id}`} className="group">
      {/* Əsas konteyner üçün dəyişikliklər */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white text-gray-800 shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:border-indigo-100 h-full flex flex-col">
        
        {/* Şəkil bölməsi */}
        <div className="relative w-full h-[280px] flex justify-center items-center bg-white p-4">
          <img
            className="max-h-full max-w-full object-contain rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
            src={imageUrl}
            alt={mehsul.name || "product image"}
          />
        </div>

        {/* Etiket - Daha yumşaq gradient */}
        <span className="absolute top-4 left-4 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
          🚀 Yeni Gəliş!
        </span>

        {/* Məhsul detalları */}
        <div className="p-6 flex flex-col justify-between flex-grow bg-white rounded-b-2xl">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 transition-all duration-300 group-hover:text-indigo-600">
              {mehsul.name}
            </h3>

            {/* Reyting bölməsi */}
            <div className="flex items-center gap-2 mt-2">
              <StarRatings
                rating={mehsul.ratings || 0}
                starRatedColor="gold"
                numberOfStars={5}
                starDimension="18px"
                starSpacing="4px"
              />
              <span className="text-sm text-gray-500">
                ({mehsul.ratings || "Reyting yoxdur"})
              </span>
            </div>

            {/* Stok - Daha aydın görünüş */}
            <p className="text-sm text-gray-600 mt-1 bg-indigo-50 px-3 py-1 rounded-full inline-block">
              {mehsul.stock ? `Stokda: ${mehsul.stock} ədəd` : "Stokda yoxdur"}
            </p>
          </div>

          {/* Qiymət - Daha minimal dizayn */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-2xl font-bold text-indigo-600 transition-all duration-300 group-hover:text-indigo-800">
              {mehsul.price} <span className="text-lg">₼</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;