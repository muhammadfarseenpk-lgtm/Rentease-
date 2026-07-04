export function Footer() {
  return (
    <footer className="border-t bg-white pt-12 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-400 mb-4">RentEase</h3>
            <p className="text-gray-500 max-w-sm mb-4">
              Premium furniture and appliance rentals for the modern lifestyle. Live better, pay monthly.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-brand transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Email: support@rentease.com</li>
              <li>Phone: +1 (800) 123-4567</li>
              <li>Address: 123 Rental Blvd, CA 94103</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} RentEase Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-brand transition-colors">Twitter</a>
            <a href="#" className="hover:text-brand transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
