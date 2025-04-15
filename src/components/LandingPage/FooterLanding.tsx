import React from "react";

const FooterLanding: React.FC = () => {
  return (
    <div className="w-[99vw] h-auto bg-[#F0EEEE] py-[4vw]">
      <div className="w-[85vw] mx-auto flex justify-between">
        {/* Contact */}
        <div className="w-[25vw]">
          <h3 className="text-[1.5vw] font-semibold mb-[2vw]">LIÊN HỆ</h3>
          <div className="flex flex-col gap-[1vw]">
            <div className="flex items-center gap-[1vw]">
              <svg
                className="w-[1.5vw] h-[1.5vw]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <p className="text-[1vw]">123 Đường ABC, Quận XYZ, Hà Nội</p>
            </div>
            <div className="flex items-center gap-[1vw]">
              <svg
                className="w-[1.5vw] h-[1.5vw]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <p className="text-[1vw]">bepkhoi@gmail.com</p>
            </div>
            <div className="flex items-center gap-[1vw]">
              <svg
                className="w-[1.5vw] h-[1.5vw]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
              <p className="text-[1vw]">0123 456 789</p>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.95919398528!2d105.94754027486151!3d20.994272780646465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135af4a368975f5%3A0x1e9bb72af579da7d!2zTmfhu41jIFRyYWkgMSwgVmluaG9tZXMgT2NlYW4gUGFyaywgxJBhIFThu5FuLCBHaWEgTMOibSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1744704415138!5m2!1svi!2s"
              className="w-full h-[15vw] border-0 rounded-lg"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="w-[25vw]">
          <h3 className="text-[1.5vw] font-semibold mb-[2vw]">MẠNG XÃ HỘI</h3>
          <div className="flex flex-col gap-[1vw]">
            <a
              href="https://www.facebook.com/duchoainam98"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[1vw] hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-[1.5vw] h-[1.5vw]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-[1vw]">Facebook</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-[1vw] hover:text-red-600 transition-colors"
            >
              <svg
                className="w-[1.5vw] h-[1.5vw]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span className="text-[1vw]">YouTube</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-[1vw] hover:text-pink-600 transition-colors"
            >
              <svg
                className="w-[1.5vw] h-[1.5vw]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
              </svg>
              <span className="text-[1vw]">Instagram</span>
            </a>

            {/* Facebook Page Plugin */}
            <div className="mt-[2vw]">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnhahangbepkhoi.op1&tabs=timeline&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                width="340"
                height="130"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Phản ánh dịch vụ */}
        <div className="w-[25vw]">
          <h3 className="text-[1.5vw] font-semibold mb-[2vw]">
            PHẢN ÁNH DỊCH VỤ
          </h3>
          <div className="flex flex-col gap-[1vw]">
            <p className="text-[1vw]">
              Mọi ý kiến đóng góp xin vui lòng liên hệ:
            </p>
            <div className="flex items-center gap-[1vw]">
              <svg
                className="w-[1.5vw] h-[1.5vw]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <p className="text-[1vw]">duc.hoainam@gmail.com</p>
            </div>
            <div className="flex items-center gap-[1vw]">
              <svg
                className="w-[1.5vw] h-[1.5vw]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
              <p className="text-[1vw]">Hotline: 0975307087</p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-[4vw] text-[1vw] text-gray-600">
        Copyright © 2025 Nhà hàng Bếp Khói. All rights reserved.
      </div>
    </div>
  );
};

export default FooterLanding;
