import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-gray-900">About Us</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">Blog</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a>
                </div>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        <FaFacebook size={20}/>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        <FaTwitter size={20}/>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        <FaLinkedin size={20}/>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        <FaInstagram size={20}/>
                    </a>
                </div>
            </div>
        </footer>
    );
};