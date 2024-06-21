
export const Footer = () => {
    return (
        <footer className="footer p-10 bg-base-300">
            <aside>
                <img
                    src="/asset/img/Logo.png"
                    alt="logo"
                    className={`h-24 w-24`}
                />
                <p>© 2024 codeartist99. All rights reserved.</p>
            </aside>
            <nav>
                <h6 className="footer-title text-black">Social</h6>
                <div className="grid grid-flow-col gap-4">
                    <a href="https://github.com/codeartist99" className="text-gray-600 hover:text-gray-900">
                        <img
                            src="/asset/img/social/github.svg"
                            alt="github"
                            className={`h-6 w-6`}
                        />
                    </a>
                    <a href="https://www.linkedin.com/in/seongwon-yang-01928a228/"
                       className="text-gray-600 hover:text-gray-900">
                        <img
                            src="/asset/img/social/linkedin.svg"
                            alt="linkedin"
                            className={`h-6 w-6`}
                        />
                    </a>
                    <a href="https://www.instagram.com/99_seongwon"
                       className="text-gray-600 hover:text-gray-900">
                        <img
                            src="/asset/img/social/instagram.svg"
                            alt="instagram"
                            className={`h-6 w-6`}
                        />
                    </a>
                </div>
            </nav>
        </footer>
    )
        ;
};