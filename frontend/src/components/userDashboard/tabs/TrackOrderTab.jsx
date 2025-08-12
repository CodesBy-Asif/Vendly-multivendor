import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Calendar, User } from 'lucide-react';

function TrackOrderTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Sample user orders for autocomplete - replace with your actual data
    const userOrders = [
        {
            id: 'ORD-001',
            date: '2024-01-15',
            status: 'delivered',
            customerName: 'John Doe',
            shippingAddress: '123 Main St, New York, NY 10001',
            total: 89.99,
            items: [
                { name: 'Wireless Headphones', quantity: 1 },
                { name: 'Phone Case', quantity: 2 }
            ],
            trackingNumber: 'TRK123456789',
            trackingSteps: [
                { status: 'ordered', title: 'Order Placed', description: 'Order confirmed and payment processed', date: '2024-01-15 10:30 AM', completed: true },
                { status: 'processing', title: 'Processing', description: 'Order is being prepared for shipment', date: '2024-01-15 2:15 PM', completed: true },
                { status: 'shipped', title: 'Shipped', description: 'Order has left our facility', date: '2024-01-16 9:00 AM', completed: true },
                { status: 'in_transit', title: 'In Transit', description: 'Package is on the way to your location', date: '2024-01-17 11:30 AM', completed: true },
                { status: 'delivered', title: 'Delivered', description: 'Package delivered successfully', date: '2024-01-18 3:45 PM', completed: true }
            ]
        },
        {
            id: 'ORD-002',
            date: '2024-01-20',
            status: 'in_transit',
            customerName: 'John Doe',
            shippingAddress: '123 Main St, New York, NY 10001',
            total: 149.99,
            items: [
                { name: 'Bluetooth Speaker', quantity: 1 },
                { name: 'USB Cable', quantity: 1 }
            ],
            trackingNumber: 'TRK987654321',
            trackingSteps: [
                { status: 'ordered', title: 'Order Placed', description: 'Order confirmed and payment processed', date: '2024-01-20 2:15 PM', completed: true },
                { status: 'processing', title: 'Processing', description: 'Order is being prepared for shipment', date: '2024-01-21 10:00 AM', completed: true },
                { status: 'shipped', title: 'Shipped', description: 'Order has left our facility', date: '2024-01-22 1:30 PM', completed: true },
                { status: 'in_transit', title: 'In Transit', description: 'Package is on the way to your location', date: '2024-01-23 8:15 AM', completed: true },
                { status: 'delivered', title: 'Delivered', description: 'Estimated delivery date', date: 'Jan 25, 2024', completed: false }
            ]
        },
        {
            id: 'ORD-003',
            date: '2024-01-22',
            status: 'processing',
            customerName: 'John Doe',
            shippingAddress: '123 Main St, New York, NY 10001',
            total: 299.99,
            items: [
                { name: 'Laptop Stand', quantity: 1 },
                { name: 'Wireless Mouse', quantity: 1 },
                { name: 'Keyboard', quantity: 1 }
            ],
            trackingNumber: 'TRK456789123',
            trackingSteps: [
                { status: 'ordered', title: 'Order Placed', description: 'Order confirmed and payment processed', date: '2024-01-22 4:20 PM', completed: true },
                { status: 'processing', title: 'Processing', description: 'Order is being prepared for shipment', date: 'In Progress', completed: true },
                { status: 'shipped', title: 'Shipped', description: 'Order will be shipped soon', date: 'Pending', completed: false },
                { status: 'in_transit', title: 'In Transit', description: 'Package will be on the way', date: 'Pending', completed: false },
                { status: 'delivered', title: 'Delivered', description: 'Estimated delivery date', date: 'Jan 28, 2024', completed: false }
            ]
        }
    ];

    const filteredOrders = userOrders.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (query) => {
        setSearchQuery(query);
        setShowSuggestions(query.length > 0);

        if (query.length === 0) {
            setSelectedOrder(null);
        }
    };

    const handleSelectOrder = (order) => {
        setSearchQuery(order.id);
        setSelectedOrder(order);
        setShowSuggestions(false);
    };

    const handleTrackOrder = () => {
        const order = userOrders.find(o => o.id.toLowerCase() === searchQuery.toLowerCase());
        if (order) {
            setSelectedOrder(order);
        } else {
            // Handle order not found
            alert('Order not found. Please check your order ID and try again.');
        }
        setShowSuggestions(false);
    };

    const getStepIcon = (status, completed) => {
        if (completed) {
            return <CheckCircle className="w-6 h-6 text-green-600" />;
        }

        switch (status) {
            case 'ordered':
                return <Package className="w-6 h-6 text-blue-600" />;
            case 'processing':
                return <Clock className="w-6 h-6 text-yellow-600" />;
            case 'shipped':
            case 'in_transit':
                return <Truck className="w-6 h-6 text-blue-600" />;
            case 'delivered':
                return <MapPin className="w-6 h-6 text-gray-400" />;
            default:
                return <Clock className="w-6 h-6 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'text-green-600 bg-green-100';
            case 'in_transit':
                return 'text-blue-600 bg-blue-100';
            case 'processing':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-background">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">Track Your Order</h1>
                <p className="text-muted-foreground">Enter your order ID to track your package</p>
            </div>

            {/* Search Section */}
            <div className="mb-8">
                <div className="relative">
                    <div className="flex space-x-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                                placeholder="Enter Order ID (e.g., ORD-001)"
                                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-primary placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />

                            {/* Autocomplete Suggestions */}
                            {showSuggestions && filteredOrders.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                    {filteredOrders.map((order) => (
                                        <button
                                            key={order.id}
                                            onClick={() => handleSelectOrder(order)}
                                            className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
                                        >
                                            <div className="font-medium text-primary">{order.id}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(order.date).toLocaleDateString()} • ${order.total.toFixed(2)}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleTrackOrder}
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                        >
                            <Search className="w-5 h-5" />
                            <span>Track Order</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Order Tracking Results */}
            {selectedOrder && (
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-primary mb-2">Order #{selectedOrder.id}</h2>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Ordered: {new Date(selectedOrder.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Package className="w-4 h-4" />
                                        <span>Tracking: {selectedOrder.trackingNumber}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1).replace('_', ' ')}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-primary mb-2">Shipping Address</h3>
                                <div className="flex items-start space-x-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium text-primary">{selectedOrder.customerName}</p>
                                        <p className="text-muted-foreground">{selectedOrder.shippingAddress}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-primary mb-2">Order Items</h3>
                                <div className="space-y-1">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-primary">{item.name}</span>
                                            <span className="text-muted-foreground">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-2 mt-2 border-t border-border">
                                    <div className="flex justify-between font-medium">
                                        <span className="text-primary">Total:</span>
                                        <span className="text-primary">${selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="text-lg font-bold text-primary mb-6">Tracking Timeline</h3>

                        <div className="space-y-6">
                            {selectedOrder.trackingSteps.map((step, index) => (
                                <div key={index} className="flex space-x-4">
                                    <div className="flex flex-col items-center">
                                        {getStepIcon(step.status, step.completed)}
                                        {index < selectedOrder.trackingSteps.length - 1 && (
                                            <div className={`w-0.5 h-12 mt-2 ${step.completed ? 'bg-green-200' : 'bg-gray-200'}`}></div>
                                        )}
                                    </div>

                                    <div className="flex-1 pb-6">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`font-medium ${step.completed ? 'text-primary' : 'text-muted-foreground'}`}>
                                                {step.title}
                                            </h4>
                                            <span className={`text-sm ${step.completed ? 'text-primary' : 'text-muted-foreground'}`}>
                                                {step.date}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${step.completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!selectedOrder && (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-primary mb-2">Enter Order ID to Track</h3>
                    <p className="text-muted-foreground">Start typing your order ID above to see tracking information</p>
                </div>
            )}
        </div>
    );
}

export default TrackOrderTab;