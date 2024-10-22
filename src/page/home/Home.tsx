import React from 'react';

// Importing TailwindCSS and DaisyUI components
export const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center p-8 space-y-12 bg-gray-100 min-h-screen text-gray-900">
            <div className="w-full max-w-6xl">
                <header className="mb-16 text-center">
                    <h1 className="text-6xl font-extrabold">
                        Manage Your Time Effortlessly
                    </h1>
                    <p className="text-xl text-gray-700 mt-4 max-w-4xl mx-auto">
                        A modern and stylish way to organize your calendar and tasks. Make planning your day, week, and month
                        as easy as it gets with the latest in user-friendly design.
                    </p>
                </header>

                {/* Features Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-500">
                        <h2 className="text-2xl font-bold mb-4">Intuitive Calendar</h2>
                        <p className="text-gray-600">
                            Organize your schedule easily with a calendar that is designed to give you clear visibility and flexible management.
                        </p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-500">
                        <h2 className="text-2xl font-bold mb-4">Task Management</h2>
                        <p className="text-gray-600">
                            Keep track of your tasks efficiently, prioritize what matters most, and never miss an important to-do.
                        </p>
                    </div>
                    <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-500">
                        <h2 className="text-2xl font-bold mb-4">Smart Notifications</h2>
                        <p className="text-gray-600">
                            Get reminders and alerts for upcoming events and deadlines, keeping you informed without overwhelming you.
                        </p>
                    </div>
                </section>

                {/* Call to Action Buttons */}
                <div className="flex justify-center space-x-4 mt-16">
                    <button className="btn btn-primary rounded-lg px-8 py-4 shadow-lg text-xl bg-blue-600 text-white transition-transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300">
                        Get Started
                    </button>
                    <button className="btn btn-outline rounded-lg px-8 py-4 shadow-lg text-xl border-blue-600 text-blue-600 transition-transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300">
                        Learn More
                    </button>
                </div>

                {/* Illustrative Image with Subtle Animation */}
                <div className="mt-16 relative group flex justify-center">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-700 ease-in-out rounded-lg"></div>
                    <img
                        src="https://placeimg.com/800/600/tech"
                        alt="Planning Illustration"
                        className="w-full max-w-3xl rounded-lg shadow-xl border border-gray-300 transition-transform transform group-hover:scale-110 group-hover:rotate-1 duration-500 ease-in-out"
                    />
                </div>

                {/* Additional Features Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                    <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-500">
                        <h2 className="text-3xl font-bold mb-6">Comprehensive Reporting</h2>
                        <p className="text-gray-600">
                            Stay on top of your progress with detailed reports that help you analyze your productivity and improve over time.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-500">
                        <h2 className="text-3xl font-bold mb-6">Customizable Workflows</h2>
                        <p className="text-gray-600">
                            Adapt the system to suit your unique needs with highly customizable workflows, making it easy to fit into your daily routine.
                        </p>
                    </div>
                </section>

                {/* Smooth Scroll to Section */}
                <div className="mt-20 text-center">
                    <a href="#features" className="text-blue-600 text-xl underline hover:text-blue-800 transition-colors ease-in-out duration-300">
                        Discover Features
                    </a>
                </div>
            </div>
        </div>
    );
};

