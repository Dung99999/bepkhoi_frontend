import React from "react";
import "../../styles/global.css";
import slider from "../../styles/LandingPage/Slider/slider.jpg";
import restaurant from "../../styles/LandingPage/nha-hang.jpg";
import restaurantIcon1 from "../../styles/LandingPage/TraiNghiem/restaurant-icon-png-plate-1 1.png";
import restaurantIcon2 from "../../styles/LandingPage/TraiNghiem/trainghiem2.png";
import restaurantIcon3 from "../../styles/LandingPage/TraiNghiem/cash.png";
// PRODUCT IMAGE
import trauGacBep from "../../styles/LandingPage/Product/trau_gac_bep.jpg";
import thangCo from "../../styles/LandingPage/Product/ThangCo.jpg";
import comLam from "../../styles/LandingPage/Product/ComLam.jpg";
import vitQuay from "../../styles/LandingPage/Product/VItQuayCaoBang.jpg";
import bunBoHue from "../../styles/LandingPage/Product/BunBoHue.jpg";
import banhXeo from "../../styles/LandingPage/Product/BanhXeo.jpg";
import goiCaTrich from "../../styles/LandingPage/Product/GoiCaTrich.jpg";
import lauHaiSan from "../../styles/LandingPage/Product/LauHaiSan.jpg";
// AVATAR FEEDBACK
import avatar1 from "../../styles/LandingPage/AvatarFeedBack/AnhDoNgocHung.jpg";
import avatar2 from "../../styles/LandingPage/AvatarFeedBack/AnhNguyenLongNhat.jpg";
import avatar3 from "../../styles/LandingPage/AvatarFeedBack/AnhLeTien.jpg";
import avatar4 from "../../styles/LandingPage/AvatarFeedBack/AnhBuiTuanAnh.jpg";
import avatar5 from "../../styles/LandingPage/AvatarFeedBack/BanNguyenThao.jpg";
import avatar6 from "../../styles/LandingPage/AvatarFeedBack/BanNguyenDucAnh.jpg";
import avatar7 from "../../styles/LandingPage/AvatarFeedBack/BanPhanNgocMai.jpg";
import avatar8 from "../../styles/LandingPage/AvatarFeedBack/AnhVietHoang.jpg";
// LIEN HE DAT BAN
import contact from "../../styles/LandingPage/LienHeDatBan/Backdrop.jpg";

const HomeLanding: React.FC = () => {
  return (
    // Div get all content
    <div className="w-full h-[20vw] md:w-full md:h-auto translate-y-[-1vw] flex flex-col items-center">
      {/* Div get a slider */}
      <div className="w-[99vw] h-[50vw] md:h-[20vw] bg-white relative">
        <img src={slider} alt="Slider" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black opacity-20"></div>
        {/* Div on top of the slider */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex flex-col w-[80vw] md:w-[50vw] items-center justify-center bg-[rgba(0,0,0,0.7)] p-[4vw] md:p-[2vw]">
            <p className="text-white text-center md:text-end text-[3vw] md:text-[1.4vw] italic font-['Dancing_Script']">
              "Ẩm thực Việt Nam không chỉ là việc ăn uống, mà là một hành trình
              khám phá văn hóa, lịch sử và tâm hồn."
            </p>
          </div>
        </div>
      </div>

      {/* NET VAN HOA */}
      <div className="w-full h-auto bg-[#F0EEEE] flex flex-col items-center">
        <div className="w-[90vw] md:w-[85vw] h-auto flex flex-col md:flex-row pt-[8vw] md:pt-[4vw] pb-[8vw] md:pb-[4vw] justify-evenly">
          <div className="w-full md:w-[50vw] h-auto px-[4vw] md:px-0">
            <p className="text-[6vw] md:text-[2.3vw] font-semibold font-['Dancing_Script'] text-center md:text-left">
              NÉT VĂN HÓA GIỮA LÒNG HÀ NỘI
            </p>
            <p className="text-[3.5vw] md:text-[1.2vw] font-['Inter'] mt-[4vw] md:mt-[1vw] text-justify">
              Ẩm thực Việt Nam, như một bản giao hưởng được tấu lên từ những
              hương vị tinh túy của đất trời, mang trong mình hồn cốt của những
              làng quê trù phú. Mỗi món ăn là một câu chuyện, một ký ức, một
              phần hồn của dân tộc. Bếp Khói, với tâm huyết gìn giữ và phát huy
              những giá trị ẩm thực truyền thống, tự hào là nơi hội tụ tinh hoa
              của ba miền đất nước. Tại đây, thực khách không chỉ được thưởng
              thức những món ăn ngon, mà còn được đắm mình trong không gian văn
              hóa ẩm thực đặc sắc. Bếp Khói xin được đại diện là những con người
              mang văn hóa khắp các miền của Việt Nam đến với những con người
              Bắc bộ.
            </p>
          </div>
          {/* Image */}
          <div className="w-[90vw] md:w-[30vw] h-auto mt-[6vw] md:mt-0 px-[4vw] md:px-0">
            <img
              src={restaurant}
              alt="Restaurant"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* TRAI NGHIEM */}
      <div className="w-[99vw] h-auto bg-white">
        <div className="w-[85vw] mx-auto relative mt-[6vw] md:mt-[2vw] flex flex-col items-center justify-center pb-[8vw] md:pb-[4vw]">
          <div className="absolute w-full h-[1px] bg-black"></div>
          <span className="bg-white px-[4vw] md:px-[2vw] text-[3vw] md:text-[1.3vw] font-['Dancing_Script'] font-semibold relative">
            TRẢI NGHIỆM TẠI BẾP KHÓI
          </span>
        </div>
      </div>

      {/* TRAI NGHIEM */}
      <div className="w-[99vw] h-auto bg-white flex flex-col items-center">
        <div className="w-[90vw] md:w-[84vw] flex flex-col md:flex-row justify-between mt-[4vw] md:mt-[2vw]">
          <div className="w-full md:w-[24vw] h-auto pb-[6vw] md:pb-[2vw]">
            {/* The ngang 1 */}
            <div className="w-full h-[16vw] md:h-[8vw] flex flex-row items-center justify-center">
              <img
                src={restaurantIcon1}
                alt="Restaurant"
                className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw]"
              />
              <p className="pl-[2vw] md:pl-[1vw] w-[50vw] md:w-[15vw] text-[3.2vw] md:text-[1.6vw] font-semibold font-['Inter']">
                NHÀ HÀNG ĐẸP TẠI OCEAN PARK
              </p>
            </div>
            {/* The ngang 2 */}
            <div className="w-full h-auto flex flex-col items-center justify-center">
              <p className="w-[80vw] md:w-[20vw] text-[2.4vw] md:text-[1.2vw] font-['Inter'] text-justify">
                Bước vào Bếp Khói, như lạc vào khu rừng nhiệt đới bí ẩn, đẹp đến
                nao lòng. Ocean Park có lẽ khó tìm thấy nơi nào sánh bằng.
              </p>
            </div>
          </div>

          <div className="w-full md:w-[24vw] h-auto pb-[6vw] md:pb-[2vw]">
            {/* The ngang 1 */}
            <div className="w-full h-[16vw] md:h-[8vw] flex flex-row items-center justify-center">
              <img
                src={restaurantIcon2}
                alt="Restaurant"
                className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw]"
              />
              <p className="pl-[2vw] md:pl-[1vw] w-[50vw] md:w-[15vw] text-[3.2vw] md:text-[1.6vw] font-semibold font-['Inter']">
                MÓN ĂN ĐẬM <br />
                "CHẤT VIỆT"
              </p>
            </div>
            {/* The ngang 2 */}
            <div className="w-full h-auto flex flex-col items-center justify-center">
              <p className="w-[80vw] md:w-[20vw] text-[2.4vw] md:text-[1.2vw] font-['Inter'] text-justify">
                Tại Bếp Khói, tôi như được trở về với hương vị quê nhà. Món ăn
                đậm chất Việt, từ nguyên liệu tươi ngon nhất, do chính tay bếp
                trưởng chế biến
              </p>
            </div>
          </div>

          <div className="w-full md:w-[24vw] h-auto pb-[6vw] md:pb-[2vw]">
            {/* The ngang 1 */}
            <div className="w-full h-[16vw] md:h-[8vw] flex flex-row items-center justify-center">
              <img
                src={restaurantIcon3}
                alt="Restaurant"
                className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw]"
              />
              <p className="pl-[2vw] md:pl-[1vw] w-[50vw] md:w-[16vw] text-[3.2vw] md:text-[1.6vw] font-semibold font-['Inter']">
                GIÁ RẺ GIẬT MÌNH
              </p>
            </div>
            {/* The ngang 2 */}
            <div className="w-full h-auto flex flex-col items-center justify-center">
              <p className="w-[80vw] md:w-[20vw] text-[2.4vw] md:text-[1.2vw] font-['Inter'] text-justify">
                Nơi ẩm thực Việt thăng hoa, không gian độc đáo, giá cả phải
                chăng, chỉ từ 50k/người.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MON AN NOI BAT */}
      <div className="w-[99vw] h-auto bg-white">
        <div className="w-[85vw] mx-auto relative flex flex-col items-center justify-center py-[8vw] md:py-[4vw]">
          <div className="absolute w-full h-[1px] bg-black"></div>
          <span className="bg-white px-[4vw] md:px-[2vw] text-[2.6vw] md:text-[1.3vw] font-['Dancing_Script'] font-semibold relative">
            MÓN ĂN NỔI BẬT
          </span>
        </div>
      </div>

      <div className="w-[99vw] h-auto bg-[#F0EEEE] py-[5vw] md:py-[2.5vw]">
        <div className="w-[85vw] mx-auto">
          {/* First row */}
          <div className="flex flex-col md:flex-row md:justify-between gap-[8vw] md:gap-0 mb-[8vw] md:mb-[4vw]">
            {/* Product1 */}
            <div className="w-full md:w-[20vw] h-[50vw] md:h-[25vw]">
              {/* Image */}
              <div className="w-full md:w-[20vw] h-[40vw] md:h-[20vw] overflow-hidden rounded-[1vw] md:rounded-[0.5vw]">
                <img
                  src={trauGacBep}
                  alt="Restaurant"
                  className="w-full h-auto scale-[2.2] translate-x-[-8vw] md:translate-x-[-4vw] object-cover hover:scale-[2.5] transition-all duration-300 hover:cursor-zoom-in"
                />
              </div>
              {/* Name */}
              <p className="pl-[1vw] md:pl-[0.5vw] pt-[2vw] md:pt-[1vw] text-[2vw] md:text-[1vw] text-gray-600 font-semibold italic font-sans">
                Đặc sản Tây Bắc
              </p>
              <p className="pl-[1vw] md:pl-[0.5vw] text-[3.4vw] md:text-[1.7vw] text-black font-semibold font-sans">
                THỊT TRÂU GÁC BẾP
              </p>
            </div>
            {/* Product2 */}
            <div className="w-full md:w-[20vw] h-[50vw] md:h-[25vw]">
              {/* Image */}
              <div className="w-full md:w-[20vw] h-[40vw] md:h-[20vw] overflow-hidden rounded-[1vw] md:rounded-[0.5vw]">
                <img
                  src={thangCo}
                  alt="Restaurant"
                  className="w-full h-auto scale-[2.5] translate-x-[-8vw] md:translate-x-[-4vw] object-cover hover:scale-[2.8] transition-all duration-300 hover:cursor-zoom-in"
                />
              </div>
              {/* Name */}
              <p className="pl-[1vw] md:pl-[0.5vw] pt-[2vw] md:pt-[1vw] text-[2vw] md:text-[1vw] text-gray-600 font-semibold italic font-sans">
                Đặc sản Tây Bắc
              </p>
              <p className="pl-[1vw] md:pl-[0.5vw] text-[3.4vw] md:text-[1.7vw] text-black font-semibold font-sans">
                THẮNG CỐ SAPA
              </p>
            </div>
            {/* Product3 */}
            <div className="w-full md:w-[20vw] h-[50vw] md:h-[25vw]">
              {/* Image */}
              <div className="w-full md:w-[20vw] h-[40vw] md:h-[20vw] overflow-hidden rounded-[1vw] md:rounded-[0.5vw]">
                <img
                  src={comLam}
                  alt="Restaurant"
                  className="w-full h-auto scale-[2] translate-x-[-4vw] md:translate-x-[-2vw] object-cover hover:scale-[2.3] transition-all duration-300 hover:cursor-zoom-in"
                />
              </div>
              {/* Name */}
              <p className="pl-[1vw] md:pl-[0.5vw] pt-[2vw] md:pt-[1vw] text-[2vw] md:text-[1vw] text-gray-600 font-semibold italic font-sans">
                Đặc sản Tây Bắc
              </p>
              <p className="pl-[1vw] md:pl-[0.5vw] text-[3.4vw] md:text-[1.7vw] text-black font-semibold font-sans">
                CƠM LAM MỘC CHÂU
              </p>
            </div>
            {/* Product4 */}
            <div className="w-full md:w-[20vw] h-[50vw] md:h-[25vw]">
              {/* Image */}
              <div className="w-full md:w-[20vw] h-[40vw] md:h-[20vw] overflow-hidden rounded-[1vw] md:rounded-[0.5vw] relative">
                <img
                  src={vitQuay}
                  alt="Restaurant"
                  className="w-full h-auto scale-[2.1] translate-x-[-8vw] md:translate-x-[-4vw] translate-y-[10vw] md:translate-y-[5vw] object-cover hover:scale-[2.4] transition-all duration-300 hover:cursor-zoom-in"
                />
                <div className="absolute top-[2vw] md:top-[1vw] right-[2vw] md:right-[1vw] flex items-center gap-[0.6vw] md:gap-[0.3vw] bg-red-600 text-white px-[1.6vw] md:px-[0.8vw] py-[0.8vw] md:py-[0.4vw] rounded-full text-[1.8vw] md:text-[0.9vw] font-bold">
                  <span className="text-yellow-300">★</span>
                  Best Seller
                </div>
              </div>
              {/* Name */}
              <p className="pl-[1vw] md:pl-[0.5vw] pt-[2vw] md:pt-[1vw] text-[2vw] md:text-[1vw] text-red-600 font-semibold italic font-sans">
                Best Seller
              </p>
              <p className="pl-[1vw] md:pl-[0.5vw] text-[3.4vw] md:text-[1.7vw] text-black font-semibold font-sans">
                VỊT QUAY CAO BẰNG
              </p>
            </div>
          </div>

          {/* Second row */}
          <div className="flex flex-col md:flex-row md:justify-between gap-[8vw] md:gap-0">
            {/* Product1 */}
            <div className="w-full md:w-[20vw] h-[50vw] md:h-[25vw]">
              {/* Image */}
              <div className="w-full md:w-[20vw] h-[40vw] md:h-[20vw] overflow-hidden rounded-[1vw] md:rounded-[0.5vw] relative">
                <img
                  src={bunBoHue}
                  alt="Restaurant"
                  className="w-full h-auto scale-[1.8] translate-x-[-8vw] md:translate-x-[-4vw] translate-y-[8.6vw] md:translate-y-[4.3vw] object-cover hover:scale-[2.1] transition-all duration-300 hover:cursor-zoom-in"
                />
                <div className="absolute top-[2vw] md:top-[1vw] right-[2vw] md:right-[1vw] flex items-center gap-[0.6vw] md:gap-[0.3vw] bg-red-600 text-white px-[1.6vw] md:px-[0.8vw] py-[0.8vw] md:py-[0.4vw] rounded-full text-[1.8vw] md:text-[0.9vw] font-bold">
                  <span className="text-yellow-300">★</span>
                  Best Seller
                </div>
              </div>
              {/* Name */}
              <p className="pl-[1vw] md:pl-[0.5vw] pt-[2vw] md:pt-[1vw] text-[2vw] md:text-[1vw] text-gray-600 font-semibold italic font-sans">
                Bữa sáng sành điệu
              </p>
              <p className="pl-[1vw] md:pl-[0.5vw] text-[3.4vw] md:text-[1.7vw] text-black font-semibold font-sans">
                BÚN BÒ HUẾ ĐẬM VỊ
              </p>
            </div>
            {/* Product2 */}
            <div className="w-full md:w-[20vw] h-[50vw] md:h-[25vw]">
              {/* Image */}
              <div className="w-full md:w-[20vw] h-[40vw] md:h-[20vw] overflow-hidden rounded-[1vw] md:rounded-[0.5vw] relative">
                <img
                  src={banhXeo}
                  alt="Restaurant"
                  className="w-full h-auto scale-[1.7] translate-x-[-8vw] md:translate-x-[-4vw] translate-y-[4vw] md:translate-y-[2vw] object-cover hover:scale-[2] transition-all duration-300 hover:cursor-zoom-in"
                />
              </div>
              {/* Name */}
              <p className="pl-[1vw] md:pl-[0.5vw] pt-[2vw] md:pt-[1vw] text-[2vw] md:text-[1vw] text-gray-600 font-semibold italic font-sans">
                Đặc sản miền Trung
              </p>
              <p className="pl-[1vw] md:pl-[0.5vw] text-[3.4vw] md:text-[1.7vw] text-black font-semibold font-sans">
                BÁNH XÈO TRUNG BỘ
              </p>
            </div>
            {/* Product3 */}
            <div className="w-full md:w-[20vw] h-[50vw] md:h-[25vw]">
              {/* Image */}
              <div className="w-full md:w-[20vw] h-[40vw] md:h-[20vw] overflow-hidden rounded-[1vw] md:rounded-[0.5vw] relative">
                <img
                  src={goiCaTrich}
                  alt="Restaurant"
                  className="w-full h-auto scale-[1.7] translate-x-[-8vw] md:translate-x-[-4vw] translate-y-[4vw] md:translate-y-[2vw] object-cover hover:scale-[2] transition-all duration-300 hover:cursor-zoom-in"
                />
              </div>
              {/* Name */}
              <p className="pl-[1vw] md:pl-[0.5vw] pt-[2vw] md:pt-[1vw] text-[2vw] md:text-[1vw] text-gray-600 font-semibold italic font-sans">
                Hương vị miền biển
              </p>
              <p className="pl-[1vw] md:pl-[0.5vw] text-[3.4vw] md:text-[1.7vw] text-black font-semibold font-sans">
                GỎI CÁ TRÍCH
              </p>
            </div>
            {/* Product4 */}
            <div className="w-full md:w-[20vw] h-[50vw] md:h-[25vw]">
              {/* Image */}
              <div className="w-full md:w-[20vw] h-[40vw] md:h-[20vw] overflow-hidden rounded-[1vw] md:rounded-[0.5vw] relative">
                <img
                  src={lauHaiSan}
                  alt="Restaurant"
                  className="w-full h-auto scale-[1.7] translate-x-[-8vw] md:translate-x-[-4vw] translate-y-[8.2vw] md:translate-y-[4.1vw] object-cover hover:scale-[2] transition-all duration-300 hover:cursor-zoom-in"
                />
                <div className="absolute top-[2vw] md:top-[1vw] right-[2vw] md:right-[1vw] flex items-center gap-[0.6vw] md:gap-[0.3vw] bg-red-600 text-white px-[1.6vw] md:px-[0.8vw] py-[0.8vw] md:py-[0.4vw] rounded-full text-[1.8vw] md:text-[0.9vw] font-bold">
                  <span className="text-yellow-300">★</span>
                  Best Seller
                </div>
              </div>
              {/* Name */}
              <p className="pl-[1vw] md:pl-[0.5vw] pt-[2vw] md:pt-[1vw] text-[2vw] md:text-[1vw] text-gray-600 font-semibold italic font-sans">
                Món ngon cho dịp tụ tập
              </p>
              <p className="pl-[1vw] md:pl-[0.5vw] text-[3.4vw] md:text-[1.7vw] text-black font-semibold font-sans">
                LẨU HẢI SẢN FULL SET
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MON AN NOI BAT */}
      <div className="w-[99vw] h-auto bg-white">
        <div className="w-[85vw] mx-auto relative flex flex-col items-center justify-center py-[8vw] md:py-[4vw]">
          <div className="absolute w-full h-[1px] bg-black"></div>
          <span className="bg-white px-[4vw] md:px-[2vw] text-[2.6vw] md:text-[1.3vw] font-['Dancing_Script'] font-semibold relative">
            ĐÁNH GIÁ CỦA KHÁCH HÀNG
          </span>
        </div>
      </div>

      {/* FEEDBACK */}
      <div className="w-[99vw] h-auto bg-white pt-[5vw] md:pt-[2.5vw] pb-[10vw] md:pb-[5vw]">
        <div className="w-[90vw] md:w-[85vw] mx-auto relative">
          {/* Slider container */}
          <div className="w-full overflow-hidden">
            <div
              className="flex gap-[5vw] md:gap-[2.5vw] transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(0)`,
                width:
                  window.innerWidth >= 768
                    ? "calc((26.6vw + 2.5vw) * 8)" // Desktop width
                    : "calc((80vw + 5vw) * 8)", // Mobile width
              }}
              id="feedback-slider"
            >
              {/* Feedback 1 */}
              <div className="min-w-[80vw] md:min-w-[26.6vw] bg-gray-100 p-[4vw] md:p-[2vw] rounded-lg">
                <div className="flex items-center gap-[2vw] md:gap-[1vw] mb-[2vw] md:mb-[1vw]">
                  <div className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] rounded-full overflow-hidden">
                    <img
                      src={avatar1}
                      alt="avatar1"
                      className="w-full h-full object-cover scale-[1.7] translate-x-[2vw] md:translate-x-[1vw] translate-y-[2.4vw] md:translate-y-[1.2vw]"
                    />
                  </div>
                  <div>
                    <p className="text-[2.4vw] md:text-[1.2vw] font-semibold">
                      anh Đỗ Ngọc Hùng
                    </p>
                    <p className="text-[2vw] md:text-[1vw] text-gray-600 italic font-thin">
                      Chủ đầu tư nhà hàng
                    </p>
                    <div className="flex text-yellow-400 text-[2vw] md:text-[1vw]">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-[2vw] md:text-[1vw] text-gray-600 italic">
                  "Nhà hàng Bếp Khói mang đến trải nghiệm ẩm thực tuyệt vời với
                  không gian sang trọng, món ăn đặc sắc và phong cách phục vụ
                  chuyên nghiệp"
                </p>
              </div>

              {/* Feedback 2 */}
              <div className="min-w-[80vw] md:min-w-[26.6vw] bg-gray-100 p-[4vw] md:p-[2vw] rounded-lg">
                <div className="flex items-center gap-[2vw] md:gap-[1vw] mb-[2vw] md:mb-[1vw]">
                  <div className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] rounded-full overflow-hidden">
                    <img
                      src={avatar2}
                      alt="avatar1"
                      className="w-full h-full object-cover scale-[1.7] translate-x-[-2vw] md:translate-x-[-1vw] translate-y-[0.4vw] md:translate-y-[0.2vw]"
                    />
                  </div>
                  <div>
                    <p className="text-[2.4vw] md:text-[1.2vw] font-semibold">
                      anh Nguyễn Long Nhật
                    </p>
                    <p className="text-[2vw] md:text-[1vw] text-gray-600 italic font-thin">
                      Bạn bè của chủ đầu tư
                    </p>
                    <div className="flex text-yellow-400 text-[2vw] md:text-[1vw]">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-[2vw] md:text-[1vw] text-gray-600 italic">
                  "Là một người bạn thân thiết với chủ nhà hàng, tôi vô cùng tự
                  hào về chất lượng món ăn và không gian ấm cúng tại Bếp Khói"
                </p>
              </div>

              {/* Feedback 3 */}
              <div className="min-w-[80vw] md:min-w-[26.6vw] bg-gray-100 p-[4vw] md:p-[2vw] rounded-lg">
                <div className="flex items-center gap-[2vw] md:gap-[1vw] mb-[2vw] md:mb-[1vw]">
                  <div className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] rounded-full overflow-hidden">
                    <img
                      src={avatar3}
                      alt="avatar1"
                      className="w-full h-full object-cover scale-[1.7] translate-x-[-1vw] md:translate-x-[-0.5vw] translate-y-[1.2vw] md:translate-y-[0.6vw]"
                    />
                  </div>
                  <div>
                    <p className="text-[2.4vw] md:text-[1.2vw] font-semibold">
                      anh Lê Tiến
                    </p>
                    <p className="text-[2vw] md:text-[1vw] text-gray-600 italic font-thin">
                      Dân cư tại Ocean Park 1
                    </p>
                    <div className="flex text-yellow-400 text-[2vw] md:text-[1vw]">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-[2vw] md:text-[1vw] text-gray-600 italic">
                  "Bếp Khói mang đến không gian sang trọng, món ăn đậm đà hương
                  vị truyền thống và phong cách phục vụ chuyên nghiệp. Tôi rất
                  hài lòng với trải nghiệm tại đây."
                </p>
              </div>

              {/* Feedback 4 */}
              <div className="min-w-[80vw] md:min-w-[26.6vw] bg-gray-100 p-[4vw] md:p-[2vw] rounded-lg">
                <div className="flex items-center gap-[2vw] md:gap-[1vw] mb-[2vw] md:mb-[1vw]">
                  <div className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] rounded-full overflow-hidden">
                    <img
                      src={avatar4}
                      alt="avatar1"
                      className="w-full h-full object-cover scale-[1.5] translate-x-[-1vw] md:translate-x-[-0.5vw] translate-y-[2vw] md:translate-y-[1vw]"
                    />
                  </div>
                  <div>
                    <p className="text-[2.4vw] md:text-[1.2vw] font-semibold">
                      anh Bùi Tuấn Anh
                    </p>
                    <p className="text-[2vw] md:text-[1vw] text-gray-600 italic font-thin">
                      Sinh viên Đại học FPT Hà Nội
                    </p>
                    <div className="flex text-yellow-400 text-[2vw] md:text-[1vw]">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-[2vw] md:text-[1vw] text-gray-600 italic">
                  "Mình thực sự ấn tượng với cách bài trí món ăn tại Bếp Khói.
                  Mỗi món đều được trình bày đẹp mắt và mang đậm bản sắc văn hóa
                  ẩm thực Việt Nam."
                </p>
              </div>

              {/* Feedback 5 */}
              <div className="min-w-[80vw] md:min-w-[26.6vw] bg-gray-100 p-[4vw] md:p-[2vw] rounded-lg">
                <div className="flex items-center gap-[2vw] md:gap-[1vw] mb-[2vw] md:mb-[1vw]">
                  <div className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] rounded-full overflow-hidden">
                    <img
                      src={avatar5}
                      alt="avatar1"
                      className="w-full h-full object-cover scale-[2] translate-x-[-1vw] md:translate-x-[-0.5vw] translate-y-[3.4vw] md:translate-y-[1.7vw]"
                    />
                  </div>
                  <div>
                    <p className="text-[2.4vw] md:text-[1.2vw] font-semibold">
                      bạn Nguyễn Thảo
                    </p>
                    <p className="text-[2vw] md:text-[1vw] text-gray-600 italic font-thin">
                      Sinh viên Đại học Mở Hà Nội
                    </p>
                    <div className="flex text-yellow-400 text-[2vw] md:text-[1vw]">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-[2vw] md:text-[1vw] text-gray-600 italic">
                  "Vô tình đi ngang qua thấy quán có vẻ đông khách nên ghé vào
                  ăn thử, không ngờ đồ ăn ngon quá, sẽ quay lại lần sau."
                </p>
              </div>

              {/* Feedback 6 */}
              <div className="min-w-[80vw] md:min-w-[26.6vw] bg-gray-100 p-[4vw] md:p-[2vw] rounded-lg">
                <div className="flex items-center gap-[2vw] md:gap-[1vw] mb-[2vw] md:mb-[1vw]">
                  <div className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] rounded-full overflow-hidden">
                    <img
                      src={avatar6}
                      alt="avatar1"
                      className="w-full h-full object-cover scale-[2] translate-x-[-1vw] md:translate-x-[-0.5vw] translate-y-[3.4vw] md:translate-y-[1.7vw]"
                    />
                  </div>
                  <div>
                    <p className="text-[2.4vw] md:text-[1.2vw] font-semibold">
                      bạn Nguyễn Đức Anh
                    </p>
                    <p className="text-[2vw] md:text-[1vw] text-gray-600 italic font-thin">
                      Sinh viên Đại học Mở Hà Nội
                    </p>
                    <div className="flex text-yellow-400 text-[2vw] md:text-[1vw]">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-[2vw] md:text-[1vw] text-gray-600 italic">
                  "Nhà hàng có không gian rộng rãi, thoáng mát và sạch sẽ. Đồ ăn
                  ngon miệng, đặc biệt là các món đặc sản miền Bắc rất hấp dẫn."
                </p>
              </div>

              {/* Feedback 7 */}
              <div className="min-w-[80vw] md:min-w-[26.6vw] bg-gray-100 p-[4vw] md:p-[2vw] rounded-lg">
                <div className="flex items-center gap-[2vw] md:gap-[1vw] mb-[2vw] md:mb-[1vw]">
                  <div className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] rounded-full overflow-hidden">
                    <img
                      src={avatar7}
                      alt="avatar1"
                      className="w-full h-full object-cover scale-[1.2] translate-x-[-1vw] md:translate-x-[-0.5vw] translate-y-[0vw]"
                    />
                  </div>
                  <div>
                    <p className="text-[2.4vw] md:text-[1.2vw] font-semibold">
                      bạn Phan Ngọc Mai
                    </p>
                    <p className="text-[2vw] md:text-[1vw] text-gray-600 italic font-thin">
                      Sinh viên Đại học Thương Mại
                    </p>
                    <div className="flex text-yellow-400 text-[2vw] md:text-[1vw]">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-[2vw] md:text-[1vw] text-gray-600 italic">
                  "Không gian nhà hàng rất đẹp và sang trọng. Món ăn ngon, phục
                  vụ chu đáo. Sẽ giới thiệu cho bạn bè và người thân ghé thăm."
                </p>
              </div>

              {/* Feedback 8 */}
              <div className="min-w-[80vw] md:min-w-[26.6vw] bg-gray-100 p-[4vw] md:p-[2vw] rounded-lg">
                <div className="flex items-center gap-[2vw] md:gap-[1vw] mb-[2vw] md:mb-[1vw]">
                  <div className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] rounded-full overflow-hidden">
                    <img
                      src={avatar8}
                      alt="avatar1"
                      className="w-full h-full object-cover scale-[1.8] translate-x-[0vw] translate-y-[0vw]"
                    />
                  </div>
                  <div>
                    <p className="text-[2.4vw] md:text-[1.2vw] font-semibold">
                      anh Việt Hoàng
                    </p>
                    <p className="text-[2vw] md:text-[1vw] text-gray-600 italic font-thin">
                      Nhân viên văn phòng
                    </p>
                    <div className="flex text-yellow-400 text-[2vw] md:text-[1vw]">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-[2vw] md:text-[1vw] text-gray-600 italic">
                  "Đồ ăn ngon, giá cả hợp lý. Nhân viên phục vụ nhiệt tình, chu
                  đáo. Địa điểm lý tưởng để tổ chức tiệc với gia đình và bạn
                  bè."
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const slider = document.getElementById("feedback-slider");
              if (slider) {
                const currentTransform = getComputedStyle(slider).transform;
                const matrix = new DOMMatrix(currentTransform);
                const currentX = matrix.m41;
                const slideWidth =
                  window.innerWidth >= 768
                    ? window.innerWidth * 0.266 + window.innerWidth * 0.025 // Desktop
                    : window.innerWidth * 0.8 + window.innerWidth * 0.05; // Mobile
                const newX = Math.min(0, currentX + slideWidth);
                slider.style.transform = `translateX(${newX}px)`;
              }
            }}
            className="absolute top-1/2 left-[-4vw] md:left-[-2vw] transform -translate-y-1/2 bg-white p-[2vw] md:p-[1vw] rounded-full shadow-lg hover:bg-gray-100 active:bg-gray-200 cursor-pointer transition-all duration-300 hover:scale-110"
          >
            <span className="text-[3vw] md:text-[1.5vw]">←</span>
          </button>
          <button
            onClick={() => {
              const slider = document.getElementById("feedback-slider");
              if (slider) {
                const currentTransform = getComputedStyle(slider).transform;
                const matrix = new DOMMatrix(currentTransform);
                const currentX = matrix.m41;
                const slideWidth =
                  window.innerWidth >= 768
                    ? window.innerWidth * 0.266 + window.innerWidth * 0.025 // Desktop
                    : window.innerWidth * 0.8 + window.innerWidth * 0.05; // Mobile
                const maxScroll =
                  window.innerWidth >= 768
                    ? -(slideWidth * 5) // Desktop: show last 3 slides
                    : -(slideWidth * 7); // Mobile: show last slide
                const newX = Math.max(maxScroll, currentX - slideWidth);
                slider.style.transform = `translateX(${newX}px)`;
              }
            }}
            className="absolute top-1/2 right-[-4vw] md:right-[-2vw] transform -translate-y-1/2 bg-white p-[2vw] md:p-[1vw] rounded-full shadow-lg hover:bg-gray-100 active:bg-gray-200 cursor-pointer transition-all duration-300 hover:scale-110"
          >
            <span className="text-[3vw] md:text-[1.5vw]">→</span>
          </button>
        </div>
      </div>

      {/* LIEN HE DAT BAN */}
      <div className="w-[99vw] h-[40vw] md:h-[20vw] bg-white relative">
        <img
          src={contact}
          alt="Contact"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <p className="text-[5vw] md:text-[2.5vw] font-['Dancing_Script'] font-bold mb-[4vw] md:mb-[2vw]">
            Liên Hệ Đặt Bàn
          </p>
          <p className="text-[2.4vw] md:text-[1.2vw] mb-[4vw] md:mb-[2vw] text-center max-w-[80vw] md:max-w-[50vw]">
            Hãy để chúng tôi phục vụ bạn một bữa ăn đáng nhớ. Đặt bàn ngay hôm
            nay để trải nghiệm ẩm thực đặc sắc tại Bếp Khói!.
          </p>
          <button
            onClick={() =>
              window.open("https://www.facebook.com/duchoainam98", "_blank")
            }
            className="bg-red-600 hover:bg-red-700 text-white px-[4vw] md:px-[2vw] py-[2vw] md:py-[1vw] rounded-full text-[2.4vw] md:text-[1.2vw] font-semibold transition-colors duration-300"
          >
            Đặt Bàn Ngay
          </button>
        </div>

        {/* FOOTER */}
      </div>

      {/* ĐÁNH GIÁ TẠI */}
      <div className="w-[99vw] h-auto bg-white py-[8vw] md:py-[4vw]">
        <div className="w-[85vw] mx-auto relative flex flex-col items-center justify-center mb-[8vw] md:mb-[4vw]">
          <div className="absolute w-full h-[1px] bg-black"></div>
          <span className="bg-white px-[4vw] md:px-[2vw] text-[2.6vw] md:text-[1.3vw] font-['Dancing_Script'] font-semibold relative">
            ĐÁNH GIÁ TẠI
          </span>
        </div>

        <div className="w-[85vw] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[8vw] md:gap-[4vw] px-[4vw] md:px-[8vw]">
            {/* Google Maps */}
            <div className="flex flex-col items-center bg-gray-50 rounded-lg p-[4vw] md:p-[2vw] hover:shadow-lg transition-all duration-300">
              <div className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] mb-[2vw] md:mb-[1vw]">
                <svg viewBox="0 0 24 24" fill="#DB4437">
                  <path d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 14 8 14s8-8.5 8-14c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                </svg>
              </div>

              <div className="text-center">
                <p className="text-[2.4vw] md:text-[1.2vw] font-semibold mb-[1vw] md:mb-[0.5vw]">
                  Google Maps
                </p>
                <div className="flex items-center justify-center gap-[1vw] md:gap-[0.5vw] mb-[2vw] md:mb-[1vw]">
                  <span className="text-yellow-400 text-[2.4vw] md:text-[1.2vw]">
                    ★
                  </span>
                  <span className="text-[2.4vw] md:text-[1.2vw] font-semibold">
                    4.7/5
                  </span>
                </div>
                <p className="text-[2vw] md:text-[1vw] text-gray-600 mb-[1vw] md:mb-[0.5vw]">
                  25 đánh giá
                </p>
                <a
                  href="https://maps.app.goo.gl/example"
                  target="_blank"
                  className="text-[2vw] md:text-[1vw] text-blue-600 hover:underline"
                >
                  Xem thêm
                </a>
              </div>
            </div>

            {/* TripAdvisor */}
            <div className="flex flex-col items-center bg-gray-50 rounded-lg p-[4vw] md:p-[2vw] hover:shadow-lg transition-all duration-300">
              <div className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] mb-[2vw] md:mb-[1vw]">
                <svg viewBox="0 0 24 24" fill="#00AA6C">
                  <path d="M12.006 4.295c-2.67 0-4.849 2.179-4.849 4.849 0 2.67 2.179 4.849 4.849 4.849s4.849-2.179 4.849-4.849c0-2.67-2.179-4.849-4.849-4.849zm0 7.616c-1.525 0-2.767-1.242-2.767-2.767 0-1.525 1.242-2.767 2.767-2.767 1.525 0 2.767 1.242 2.767 2.767 0 1.525-1.242 2.767-2.767 2.767zm9.428-3.842c-1.134 0-2.056.922-2.056 2.056 0 1.134.922 2.056 2.056 2.056 1.134 0 2.056-.922 2.056-2.056 0-1.134-.922-2.056-2.056-2.056zm-18.856 0c-1.134 0-2.056.922-2.056 2.056 0 1.134.922 2.056 2.056 2.056 1.134 0 2.056-.922 2.056-2.056 0-1.134-.922-2.056-2.056-2.056zm9.428-6.063l3.364 6.944h-6.728l3.364-6.944z" />
                </svg>
              </div>

              <div className="text-center">
                <p className="text-[2.4vw] md:text-[1.2vw] font-semibold mb-[1vw] md:mb-[0.5vw]">
                  TripAdvisor
                </p>
                <div className="flex items-center justify-center gap-[1vw] md:gap-[0.5vw] mb-[2vw] md:mb-[1vw]">
                  <span className="text-yellow-400 text-[2.4vw] md:text-[1.2vw]">
                    ★
                  </span>
                  <span className="text-[2.4vw] md:text-[1.2vw] font-semibold">
                    4.7/5
                  </span>
                </div>
                <p className="text-[2vw] md:text-[1vw] text-gray-600 mb-[1vw] md:mb-[0.5vw]">
                  18 đánh giá
                </p>
                <a
                  href="https://www.tripadvisor.com/example"
                  target="_blank"
                  className="text-[2vw] md:text-[1vw] text-blue-600 hover:underline"
                >
                  Xem thêm
                </a>
              </div>
            </div>

            {/* Facebook */}
            <div className="flex flex-col items-center bg-gray-50 rounded-lg p-[4vw] md:p-[2vw] hover:shadow-lg transition-all duration-300">
              <div className="w-[8vw] h-[8vw] md:w-[4vw] md:h-[4vw] mb-[2vw] md:mb-[1vw]">
                <svg viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>

              <div className="text-center">
                <p className="text-[2.4vw] md:text-[1.2vw] font-semibold mb-[1vw] md:mb-[0.5vw]">
                  Facebook
                </p>
                <div className="flex items-center justify-center gap-[1vw] md:gap-[0.5vw] mb-[2vw] md:mb-[1vw]">
                  <span className="text-yellow-400 text-[2.4vw] md:text-[1.2vw]">
                    ★
                  </span>
                  <span className="text-[2.4vw] md:text-[1.2vw] font-semibold">
                    4.7/5
                  </span>
                </div>
                <p className="text-[2vw] md:text-[1vw] text-gray-600 mb-[1vw] md:mb-[0.5vw]">
                  32 đánh giá
                </p>
                <a
                  href="https://www.facebook.com/duchoainam98"
                  target="_blank"
                  className="text-[2vw] md:text-[1vw] text-blue-600 hover:underline"
                >
                  Xem thêm
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="w-[99vw] h-auto bg-[#F0EEEE] py-[8vw] md:py-[4vw]">
        <div className="w-[90vw] md:w-[85vw] mx-auto flex flex-col md:flex-row justify-between gap-[8vw] md:gap-0">
          {/* Contact */}
          <div className="w-full md:w-[25vw]">
            <h3 className="text-[4vw] md:text-[1.5vw] font-semibold mb-[4vw] md:mb-[2vw]">
              LIÊN HỆ
            </h3>
            <div className="flex flex-col gap-[2vw] md:gap-[1vw]">
              <div className="flex items-center gap-[2vw] md:gap-[1vw]">
                <svg
                  className="w-[4vw] h-[4vw] md:w-[1.5vw] md:h-[1.5vw]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <p className="text-[3vw] md:text-[1vw]">
                  Số 17 Đường Ngọc Trai 1, Ocean Park 1, Gia Lâm, Hà Nội
                </p>
              </div>
              <div className="flex items-center gap-[2vw] md:gap-[1vw]">
                <svg
                  className="w-[4vw] h-[4vw] md:w-[1.5vw] md:h-[1.5vw]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <p className="text-[3vw] md:text-[1vw]">bepkhoi@gmail.com</p>
              </div>
              <div className="flex items-center gap-[2vw] md:gap-[1vw]">
                <svg
                  className="w-[4vw] h-[4vw] md:w-[1.5vw] md:h-[1.5vw]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                </svg>
                <p className="text-[3vw] md:text-[1vw]">0975 307 087</p>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.95919398528!2d105.94754027486151!3d20.994272780646465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135af4a368975f5%3A0x1e9bb72af579da7d!2zTmfhu41jIFRyYWkgMSwgVmluaG9tZXMgT2NlYW4gUGFyaywgxJBhIFThu5FuLCBHaWEgTMOibSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1744704415138!5m2!1svi!2s"
                className="w-full h-[40vw] md:h-[15vw] border-0 rounded-lg"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="w-full md:w-[25vw]">
            <h3 className="text-[4vw] md:text-[1.5vw] font-semibold mb-[4vw] md:mb-[2vw]">
              MẠNG XÃ HỘI
            </h3>
            <div className="flex flex-col gap-[2vw] md:gap-[1vw]">
              <a
                href="https://www.facebook.com/duchoainam98"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[2vw] md:gap-[1vw] hover:text-blue-600 transition-colors"
              >
                <svg
                  className="w-[4vw] h-[4vw] md:w-[1.5vw] md:h-[1.5vw]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-[3vw] md:text-[1vw]">Facebook</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-[2vw] md:gap-[1vw] hover:text-red-600 transition-colors"
              >
                <svg
                  className="w-[4vw] h-[4vw] md:w-[1.5vw] md:h-[1.5vw]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="text-[3vw] md:text-[1vw]">YouTube</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-[2vw] md:gap-[1vw] hover:text-pink-600 transition-colors"
              >
                <svg
                  className="w-[4vw] h-[4vw] md:w-[1.5vw] md:h-[1.5vw]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
                <span className="text-[3vw] md:text-[1vw]">Instagram</span>
              </a>

              {/* Facebook Page Plugin */}
              <div className="mt-[4vw] md:mt-[2vw] overflow-hidden">
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnhahangbepkhoi.op1&tabs=timeline&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                  width="340"
                  height="130"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Facebook Page Plugin"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Phản ánh dịch vụ */}
          <div className="w-full md:w-[25vw]">
            <h3 className="text-[4vw] md:text-[1.5vw] font-semibold mb-[4vw] md:mb-[2vw]">
              PHẢN ÁNH DỊCH VỤ
            </h3>
            <div className="flex flex-col gap-[2vw] md:gap-[1vw]">
              <p className="text-[3vw] md:text-[1vw]">
                Mọi ý kiến đóng góp xin vui lòng liên hệ:
              </p>
              <div className="flex items-center gap-[2vw] md:gap-[1vw]">
                <svg
                  className="w-[4vw] h-[4vw] md:w-[1.5vw] md:h-[1.5vw]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <p className="text-[3vw] md:text-[1vw]">
                  duc.hoainam@gmail.com
                </p>
              </div>
              <div className="flex items-center gap-[2vw] md:gap-[1vw]">
                <svg
                  className="w-[4vw] h-[4vw] md:w-[1.5vw] md:h-[1.5vw]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                </svg>
                <p className="text-[3vw] md:text-[1vw]">Hotline: 0975307087</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-[8vw] md:mt-[4vw] text-[2.5vw] md:text-[1vw] text-gray-600">
          Copyright © 2025 Nhà hàng Bếp Khói. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default HomeLanding;
