"use client";

export default function AcademicFooter() {
  return (
    <footer className="mt-16 bg-blue-50 border-t border-blue-100">
      {/* TOP SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Column 1 - Department Info */}
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-3">
            Department of EEE
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Electrical & Electronic Engineering Department  
            committed to quality education, academic excellence,
            and producing skilled engineers.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-3">
            Quick Links
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="hover:text-blue-600 cursor-pointer">Home</li>
            <li className="hover:text-blue-600 cursor-pointer">Academic</li>
            <li className="hover:text-blue-600 cursor-pointer">Teachers</li>
            <li className="hover:text-blue-600 cursor-pointer">Gallery</li>
            <li className="hover:text-blue-600 cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Column 3 - Contact */}
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-3">
            Contact
          </h2>

          <p className="text-gray-600 mb-2">
            <span className="font-semibold text-gray-700">Email:</span>{" "}
            eee-department@example.com
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold text-gray-700">Phone:</span>{" "}
            +880 1234-567890
          </p>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-700">Address:</span>  
            University Campus, Dhaka, Bangladesh
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-blue-100 py-4 text-center border-t border-blue-200">
        <p className="text-gray-700 text-sm">
          © {new Date().getFullYear()} Department of EEE — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
