import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  // Dummy address configuration
  const dummyAddress = {
    city: "Sample City",
    country: "Country",
    address: "123 Dummy St",
    postalCode: "12345",
    recipientName: "John Doe",
    phone: "+1 234 567 8901",
  };

  // Check if shipping address matches dummy address
  const isDummyAddress = (shippingAddress) => {
    return (
      shippingAddress?.city === dummyAddress.city &&
      shippingAddress?.country === dummyAddress.country &&
      shippingAddress?.address === dummyAddress.address &&
      shippingAddress?.postalCode === dummyAddress.postalCode &&
      shippingAddress?.recipientName === dummyAddress.recipientName &&
      shippingAddress?.phone === dummyAddress.phone
    );
  };

  // Fetch user orders on component mount
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // Handle row click to navigate to order details
  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // Display loading or error messages
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen -mt-1 bg-black text-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl text-green-500 font-bold mb-6">
          My Orders
        </h2>
        <div className="relative shadow-md sm:rounded-lg overflow-hidden">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-900 text-xs uppercase text-white">
              <tr>
                <th className="py-2 px-4 sm:py-3">Image</th>
                <th className="py-2 px-4 sm:py-3">Order ID</th>
                <th className="py-2 px-4 sm:py-3">Created</th>
                <th className="py-2 px-4 sm:py-3">Shipping Address</th>
                <th className="py-2 px-4 sm:py-3">Items</th>
                <th className="py-2 px-4 sm:py-3">Price</th>
                <th className="py-2 px-4 sm:py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => handleRowClick(order._id)}
                    className="border-b bg-white hover:border-gray-50 cursor-pointer"
                  >
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      <img
                        src={order.orderItems[0].image}
                        alt={order.orderItems[0].name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                      #{order._id}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      {new Date(order.createdAt).toLocaleDateString()}{" "}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      {order.shippingAddress ? (
                        isDummyAddress(order.shippingAddress) ? (
                          "Pick up from store"
                        ) : (
                          `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                        )
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      {order.orderItems.length}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      R{order.totalPrice}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                      <span
                        className={`${
                          order.isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        } px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    You have no orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;