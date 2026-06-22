import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

import { Swiper, SwiperSlide } from "swiper/react";
import {
    Navigation,
    Pagination,
    Autoplay
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function HeroCarousel() {

    const navigate = useNavigate();

    const [banners, setBanners] =
        useState([]);

    useEffect(() => {

        const fetchBanners =
            async () => {

                try {

                    const res =
                        await API.get(
                            "/hero-banners"
                        );

                    setBanners(
                        res.data.data || []
                    );

                }
                catch (err) {

                    console.log(err);

                }

            };

        fetchBanners();

    }, []);

    if (
        banners.length === 0
    ) {
        return null;
    }

    return (

        <div className="mb-8 max-w-5xl mx-auto rounded-3xl shadow-lg">

            <Swiper
                modules={[
                    Navigation,
                    Pagination,
                    Autoplay
                ]}
                navigation
                pagination={{
                    clickable: true
                }}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false
                }}
                loop
            >

                {banners.map(
                    (banner) => (

                        <SwiperSlide key={banner.id}>

                            <img
                                src={banner.imageUrl}
                                alt="Hero Banner"
                                onClick={() =>
                                    navigate(
                                        `/product/${banner.productId}`
                                    )
                                }
                                className="
        w-full
        h-[350px]
        object-cover
        cursor-pointer
        rounded-3xl
    "
                            />

                        </SwiperSlide>

                    )
                )}

            </Swiper>

        </div>

    );
}

export default HeroCarousel;