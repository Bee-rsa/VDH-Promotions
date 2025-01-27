import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/Design", imageUrl: "/VDH DESIGN.png" },
	{ href: "/Print", imageUrl: "/VDH PRINT.png" },
	{ href: "/Signs", imageUrl: "/VDH SIGNS.png" },
	{ href: "/Branding", imageUrl: "/VDH BRANDING.png" },
	{ href: "/Paints", imageUrl: "/VDH PAINT.png" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className="relative min-h-screen text-white overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<h1 className="text-center text-5xl sm:text-6xl font-bold text-green-500 mb-4">
					Browse Our Catalog
				</h1>
				<p className="text-center text-xl text-gray-300 mb-12">
				Discover high-quality, custom printing services for all your business and personal needs
				</p>

				{/* Grid layout for categories */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
					{categories.map((category) => (
						<CategoryItem
							category={category}
							key={category.href}
							className="h-56" // Reduced height
						/>
					))}
				</div>
				
				{/* New section for the three units */}
				<div className="mt-24">
					<h2 className="text-center text-3xl sm:text-4xl font-semibold text-emerald-400 mb-8">
						What We Offer
					</h2>
					<div className="flex justify-between space-x-6">
						{/* Unit 1 */}
						<div className="flex-1 bg-gray-400 p-8 rounded-lg shadow-lg text-center">
							<h3 className="text-xl font-bold text-black mb-4">Hundreds of Products</h3>
							<p className="text-gray-900 mb-4">
								From Coasters and Die-cut Cards to Labels and Signs. We provide fast online printing for homes and businesses to suit your needs. For Bulk orders please contact our seasoned sales team.
							</p>
							<a
								href="#"
								className="inline-block px-6 py-3 mt-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:from-emerald-500 hover:to-teal-600"
							>
								Shop Now!
							</a>
						</div>

						{/* Unit 2 */}
						<div className="flex-1 bg-gray-400 p-8 rounded-lg shadow-lg text-center">
							<h3 className="text-xl font-bold text-black mb-4">Design Online</h3>
							<p className="text-gray-900 mb-4">
								You can use our free online designer tool to design your artwork from scratch or use it to edit one of our pre-made templates. Save on design fees, faster, more accurate, and in your hands.
							</p>
							<a
								href="#"
								className="inline-block px-6 py-3 mt-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:from-emerald-500 hover:to-teal-600"
							>
								Shop Now!
							</a>
						</div>

						{/* Unit 3 */}
						<div className="flex-1 bg-gray-400 p-8 rounded-lg shadow-lg text-center">
							<h3 className="text-xl font-bold text-black mb-4">Secure Payment & National Delivery</h3>
							<p className="text-gray-900 mb-4">
								Experience the ease and security of online shopping! You can pay online using our secure payment gateway. Nationwide delivery to get your order to you quickly and efficiently.
							</p>
							<a
								href="#"
								className="inline-block px-6 py-3 mt-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:from-emerald-500 hover:to-teal-600"
							>
								Shop Now!
							</a>
							
						</div>
					</div>
					{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
