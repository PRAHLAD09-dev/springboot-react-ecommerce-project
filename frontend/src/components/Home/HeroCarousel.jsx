import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function HeroCarousel() {
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await API.get("/hero-banners");
                setBanners(res.data.data || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchBanners();
    }, []);

    if (banners.length === 0) {
        return null;
    }

    return (
        <div className="mb-10 overflow-hidden rounded-2xl shadow-md sm:rounded-3xl">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                loop
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <div
                            onClick={() => navigate(`/product/${banner.productId}`)}
                            className="relative h-[180px] w-full cursor-pointer sm:h-[280px] lg:h-[380px]"
                        >
                            <img
                                src={banner.imageUrl}
                                alt="Hero Banner"
                                className="h-full w-full object-cover"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default HeroCarousel;
