const Footer = () => {
    const createdYear = 2024;

    return (
        <footer className="flex flex-col gap-8 px-8 py-16 md:px-16 lg:px-24 bg-gray-900">
            <p className="text-white text-center text-sm">© {createdYear} Finder. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
