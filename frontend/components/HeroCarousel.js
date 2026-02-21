import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: 'New Arrivals',
            subtitle: 'Explore the Latest Collection',
            cta: 'Shop Now',
            bg: 'from-blue-600 to-blue-800',
            emoji: '🛍️'
        },
        {
            id: 2,
            title: 'Special Offers',
            subtitle: 'Up to 50% Off',
            cta: 'Grab Deals',
            bg: 'from-amber-500 to-orange-600',
            emoji: '🎉'
        },
        {
            id: 3,
            title: 'Premium Collection',
            subtitle: 'Exclusive Designer Brands',
            cta: 'Explore',
            bg: 'from-purple-600 to-pink-600',
            emoji: '✨'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl shadow-lg">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 bg-gradient-to-r ${slide.bg} transition-all duration-700 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                >
                    <div className="container mx-auto px-6 h-full flex items-center justify-between">
                        <div className="text-white max-w-xl">
                            <h2 className="text-4xl md:text-6xl font-black mb-4 animate-fadeIn">
                                {slide.title}
                            </h2>
                            <p className="text-xl md:text-2xl mb-6 opacity-90">
                                {slide.subtitle}
                            </p>
                            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg">
                                {slide.cta} →
                            </button>
                        </div>
                        <div className="hidden md:block text-8xl animate-fadeIn">
                            {slide.emoji}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
                aria-label="Previous slide"
            >
                <FiChevronLeft className="text-white text-2xl" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
                aria-label="Next slide"
            >
                <FiChevronRight className="text-white text-2xl" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
