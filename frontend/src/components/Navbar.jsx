import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useState, useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();

	// State to control the visibility of the navbar
	const [isVisible, setIsVisible] = useState(true);

	// State to store the previous scroll position
	const [prevScrollPos, setPrevScrollPos] = useState(0);

	// Effect hook to track scroll behavior
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollPos = window.pageYOffset;
			if (currentScrollPos > prevScrollPos) {
				// Hide the navbar when scrolling down
				setIsVisible(false);
			} else {
				// Show the navbar when scrolling up
				setIsVisible(true);
			}
			setPrevScrollPos(currentScrollPos);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [prevScrollPos]);

	return (
		<header
			className={`fixed top-0 left-0 w-full bg-black backdrop-blur-md shadow-lg z-40 transition-all duration-300 ${
				isVisible ? "transform translate-y-0" : "transform -translate-y-full"
			}`}
		>
			<div className="container mx-auto -mb-18 h-54 px-4 py-4">
				<div className="flex flex-wrap justify-between items-center">
					<Link to="/" className="flex items-center">
						<img
							src="/VDH LOGO.png" // Replace with your logo image path
							alt="E-Commerce Logo"
							className="h-32" // Adjust the height as needed
						/>
					</Link>

					<nav className="flex flex-wrap items-center -mt-16 gap-4 font-poppins">
						<Link
							to={"/"}
							className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
						>
							Home
						</Link>
						{user && (
							<Link
								to={"/cart"}
								className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
							>
								<ShoppingCart className="inline-block mr-1 group-hover:text-emerald-400" size={20} />
								<span className="hidden sm:inline">Cart</span>
								{cart.length > 0 && (
									<span
										className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}
						{isAdmin && (
							<Link
								className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
								to={"/secret-dashboard"}
							>
								<Lock className="inline-block mr-1" size={18} />
								<span className="hidden sm:inline">Dashboard</span>
							</Link>
						)}

						{user ? (
							<button
								className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
								onClick={logout}
							>
								<LogOut size={18} />
								<span className="hidden sm:inline ml-2">Log Out</span>
							</button>
						) : (
							<>
								<Link
									to={"/signup"}
									className="bg-green-500 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
								>
									<UserPlus className="mr-2" size={18} />
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
								>
									<LogIn className="mr-2" size={18} />
									Login
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
