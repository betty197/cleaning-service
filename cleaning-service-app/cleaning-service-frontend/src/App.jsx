
function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ==================== NAVBAR ==================== */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <h1 className="text-2xl font-bold text-blue-600">
            Clean<span className="text-gray-900">Pro</span>
          </h1>

          {/* Navigation Links */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#" className="font-medium text-blue-600">
              Home
            </a>

            <a
              href="#services"
              className="text-gray-600 hover:text-blue-600"
            >
              Services
            </a>

            <a
              href="#about"
              className="text-gray-600 hover:text-blue-600"
            >
              About
            </a>

            <a
              href="#reviews"
              className="text-gray-600 hover:text-blue-600"
            >
              Reviews
            </a>

            <a
              href="#contact"
              className="text-gray-600 hover:text-blue-600"
            >
              Contact
            </a>
          </div>

          {/* Book Now */}
          <button className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">
            Book Now
          </button>

        </div>
      </nav>


      {/* ==================== HERO SECTION ==================== */}
      <section className="bg-blue-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">

          {/* Hero Text */}
          <div>

            <p className="mb-4 font-semibold uppercase tracking-wide text-blue-600">
              Professional Cleaning Services
            </p>

            <h2 className="text-4xl font-extrabold leading-tight md:text-6xl">
              A Cleaner Home,
              <span className="block text-blue-600">
                A Happier Life.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              We provide reliable and professional cleaning services
              for homes and businesses. Let us make your space
              fresh, clean, and comfortable.
            </p>

            {/* Hero Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">

              <button className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white shadow-lg hover:bg-blue-700">
                Book a Cleaning
              </button>

              <a
                href="#services"
                className="rounded-lg border border-blue-600 px-7 py-3 font-semibold text-blue-600 hover:bg-blue-100"
              >
                View Services
              </a>

            </div>

            {/* Statistics */}
            <div className="mt-10 flex flex-wrap gap-8">

              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm text-gray-500">
                  Happy Customers
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">5+</p>
                <p className="text-sm text-gray-500">
                  Years Experience
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">4.9 ⭐</p>
                <p className="text-sm text-gray-500">
                  Customer Rating
                </p>
              </div>

            </div>

          </div>


          {/* Hero Image */}
          <div className="flex h-96 items-center justify-center rounded-3xl bg-blue-200 shadow-xl">

            <div className="text-center">

              <div className="text-8xl">
                🧹
              </div>

              <p className="mt-4 text-xl font-semibold text-blue-900">
                Fresh & Clean
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ==================== SERVICES SECTION ==================== */}
      <section
        id="services"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6">

          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center">

            <p className="font-semibold uppercase tracking-wide text-blue-600">
              What We Offer
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Our Cleaning Services
            </h2>

            <p className="mt-4 text-gray-600">
              Professional cleaning solutions designed to keep your
              home and workplace fresh, healthy, and comfortable.
            </p>

          </div>


          {/* Service Cards */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {/* Home Cleaning */}
            <div className="rounded-2xl border bg-white p-6 shadow-md transition hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-4xl">
                🏠
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Home Cleaning
              </h3>

              <p className="mt-3 text-gray-600">
                Complete cleaning for bedrooms, living rooms,
                kitchens, and bathrooms.
              </p>

              <p className="mt-5 text-lg font-bold text-blue-600">
                From $50
              </p>

              <button className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700">
                Book Service
              </button>

            </div>


            {/* Office Cleaning */}
            <div className="rounded-2xl border bg-white p-6 shadow-md transition hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-green-100 text-4xl">
                🏢
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Office Cleaning
              </h3>

              <p className="mt-3 text-gray-600">
                Keep your workplace clean, organized, and
                professional for your team.
              </p>

              <p className="mt-5 text-lg font-bold text-blue-600">
                From $100
              </p>

              <button className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700">
                Book Service
              </button>

            </div>


            {/* Carpet Cleaning */}
            <div className="rounded-2xl border bg-white p-6 shadow-md transition hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-yellow-100 text-4xl">
                🧼
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Carpet Cleaning
              </h3>

              <p className="mt-3 text-gray-600">
                Deep carpet cleaning that removes dirt,
                stains, and unpleasant odors.
              </p>

              <p className="mt-5 text-lg font-bold text-blue-600">
                From $40
              </p>

              <button className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700">
                Book Service
              </button>

            </div>


            {/* Window Cleaning */}
            <div className="rounded-2xl border bg-white p-6 shadow-md transition hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-purple-100 text-4xl">
                🪟
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Window Cleaning
              </h3>

              <p className="mt-3 text-gray-600">
                Crystal-clear windows that make your home or
                office brighter and fresher.
              </p>

              <p className="mt-5 text-lg font-bold text-blue-600">
                From $30
              </p>

              <button className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700">
                Book Service
              </button>

            </div>

          </div>

        </div>
      </section>


      {/* ==================== ABOUT SECTION ==================== */}
      <section
        id="about"
        className="bg-blue-50 py-20"
      >
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-12 md:grid-cols-2">

            {/* About Image */}
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-blue-200 shadow-lg">

              <div className="text-center">

                <div className="text-8xl">
                  ✨
                </div>

                <p className="mt-5 text-2xl font-bold text-blue-900">
                  Clean Space
                </p>

                <p className="mt-2 text-blue-800">
                  Happy Place
                </p>

              </div>

            </div>


            {/* About Content */}
            <div>

              <p className="font-semibold uppercase tracking-wide text-blue-600">
                About CleanPro
              </p>

              <h2 className="mt-3 text-4xl font-bold leading-tight">
                We Make Cleaning
                <span className="block text-blue-600">
                  Simple & Stress-Free
                </span>
              </h2>

              <p className="mt-6 leading-7 text-gray-600">
                CleanPro is a professional cleaning service dedicated
                to helping families and businesses enjoy clean,
                healthy, and comfortable spaces.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                Our trained cleaning professionals use reliable
                cleaning methods and quality products to deliver
                excellent results every time.
              </p>


              {/* Why Choose Us */}
              <div className="mt-8 space-y-5">

                {/* Trusted Professionals */}
                <div className="flex gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl text-white">
                    ✓
                  </div>

                  <div>

                    <h3 className="font-bold">
                      Trusted Professionals
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      Our cleaners are trained, reliable, and
                      committed to providing excellent service.
                    </p>

                  </div>

                </div>


                {/* Quality Cleaning */}
                <div className="flex gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl text-white">
                    ✓
                  </div>

                  <div>

                    <h3 className="font-bold">
                      Quality Cleaning
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      We pay attention to every detail to make
                      your space truly clean.
                    </p>

                  </div>

                </div>


                {/* Flexible Scheduling */}
                <div className="flex gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl text-white">
                    ✓
                  </div>

                  <div>

                    <h3 className="font-bold">
                      Flexible Scheduling
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      Choose a convenient date and time that
                      works for your schedule.
                    </p>

                  </div>

                </div>

              </div>


              {/* Learn More */}
              <button className="mt-8 rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white shadow-lg hover:bg-blue-700">
                Learn More
              </button>

            </div>

          </div>

        </div>
      </section>
  
      {/* ==================== REVIEWS SECTION ==================== */}
      <section
        id="reviews"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-6">

          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center">

            <p className="font-semibold uppercase tracking-wide text-blue-600">
              Customer Reviews
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              What Our Customers Say
            </h2>

            <p className="mt-4 text-gray-600">
              We are proud to provide reliable cleaning services
              that our customers can trust.
            </p>

          </div>


          {/* Review Cards */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {/* Review 1 */}
            <div className="rounded-2xl border bg-white p-7 shadow-md transition hover:-translate-y-2 hover:shadow-xl">

              <div className="text-yellow-400 text-xl">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="mt-5 leading-7 text-gray-600">
                "CleanPro did an amazing job! My house looks
                completely fresh and clean. The team was
                professional and very friendly."
              </p>

              <div className="mt-6 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  SA
                </div>

                <div>
                  <h3 className="font-bold">
                    Sarah Ahmed
                  </h3>

                  <p className="text-sm text-gray-500">
                    Home Cleaning Customer
                  </p>
                </div>

              </div>

            </div>


            {/* Review 2 */}
            <div className="rounded-2xl border bg-white p-7 shadow-md transition hover:-translate-y-2 hover:shadow-xl">

              <div className="text-yellow-400 text-xl">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="mt-5 leading-7 text-gray-600">
                "Excellent service from start to finish.
                They arrived on time, worked quickly, and
                left our office looking fantastic."
              </p>

              <div className="mt-6 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600">
                  DM
                </div>

                <div>
                  <h3 className="font-bold">
                    Daniel Mekonnen
                  </h3>

                  <p className="text-sm text-gray-500">
                    Office Cleaning Customer
                  </p>
                </div>

              </div>

            </div>


            {/* Review 3 */}
            <div className="rounded-2xl border bg-white p-7 shadow-md transition hover:-translate-y-2 hover:shadow-xl">

              <div className="text-yellow-400 text-xl">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="mt-5 leading-7 text-gray-600">
                "Very affordable and professional. My carpets
                look brand new again. I will definitely use
                CleanPro again!"
              </p>

              <div className="mt-6 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                  MH
                </div>

                <div>
                  <h3 className="font-bold">
                    Maryam Hassan
                  </h3>

                  <p className="text-sm text-gray-500">
                    Carpet Cleaning Customer
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* Rating Summary */}
          <div className="mt-14 rounded-2xl bg-blue-50 p-8 text-center">

            <p className="text-4xl font-extrabold text-blue-600">
              4.9 ⭐
            </p>

            <p className="mt-2 font-semibold">
              Average Customer Rating
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Based on 500+ happy customers
            </p>

          </div>

        </div>
      </section>
    
      {/* ==================== CONTACT SECTION ==================== */}
      <section
        id="contact"
        className="bg-blue-50 py-20"
      >
        <div className="mx-auto max-w-7xl px-6">

          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center">

            <p className="font-semibold uppercase tracking-wide text-blue-600">
              Get In Touch
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Contact CleanPro
            </h2>

            <p className="mt-4 text-gray-600">
              Have a question or ready to book a cleaning?
              Send us a message and our team will get back to you.
            </p>

          </div>


          {/* Contact Content */}
          <div className="mt-12 grid gap-10 lg:grid-cols-2">

            {/* ================= CONTACT INFORMATION ================= */}
            <div className="space-y-6">

              {/* Location */}
              <div className="flex gap-5 rounded-2xl bg-white p-6 shadow-md">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                  📍
                </div>

                <div>
                  <h3 className="text-lg font-bold">
                    Our Location
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Bole, Addis Ababa, Ethiopia
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Serving homes and businesses across Addis Ababa.
                  </p>
                </div>

              </div>


              {/* Phone */}
              <div className="flex gap-5 rounded-2xl bg-white p-6 shadow-md">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-100 text-2xl">
                  📞
                </div>

                <div>
                  <h3 className="text-lg font-bold">
                    Phone
                  </h3>

                  <p className="mt-2 text-gray-600">
                    +251 91 123 4567
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Monday - Saturday, 8:00 AM - 6:00 PM
                  </p>
                </div>

              </div>


              {/* Email */}
              <div className="flex gap-5 rounded-2xl bg-white p-6 shadow-md">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                  ✉️
                </div>

                <div>
                  <h3 className="text-lg font-bold">
                    Email
                  </h3>

                  <p className="mt-2 text-gray-600">
                    info@cleanpro.com
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    We usually respond within 24 hours.
                  </p>
                </div>

              </div>


              {/* Map Placeholder */}
              <div className="flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-blue-200 shadow-md">

                <div className="text-center">

                  <div className="text-5xl">
                    📍
                  </div>

                  <p className="mt-3 text-lg font-bold text-blue-900">
                    Addis Ababa
                  </p>

                  <p className="text-sm text-blue-800">
                    Ethiopia
                  </p>

                </div>

              </div>

            </div>


            {/* ================= CONTACT FORM ================= */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">

              <h3 className="text-2xl font-bold">
                Send Us a Message
              </h3>

              <p className="mt-2 text-gray-600">
                Fill out the form below and we'll contact you soon.
              </p>


              <form className="mt-8 space-y-5">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>


                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>


                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>


                {/* Service */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Service
                  </label>

                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select a service
                    </option>

                    <option value="home">
                      Home Cleaning
                    </option>

                    <option value="office">
                      Office Cleaning
                    </option>

                    <option value="carpet">
                      Carpet Cleaning
                    </option>

                    <option value="window">
                      Window Cleaning
                    </option>
                  </select>
                </div>


                {/* Message */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Message
                  </label>

                  <textarea
                    rows="5"
                    placeholder="Tell us how we can help..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  ></textarea>
                </div>


                {/* Submit */}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
                >
                  Send Message
                </button>

              </form>

            </div>

          </div>

        </div>
      </section>
      ```jsx
      {/* ==================== BOOKING SECTION ==================== */}
      <section
        id="booking"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-4xl px-6">

          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">

            <p className="font-semibold uppercase tracking-wide text-blue-600">
              Easy Booking
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Book Your Cleaning
            </h2>

            <p className="mt-4 text-gray-600">
              Choose your service, preferred date, and time.
              We'll take care of the rest.
            </p>

          </div>


          {/* Booking Form */}
          <div className="mt-12 rounded-3xl border bg-white p-8 shadow-xl md:p-10">

            <form className="space-y-6">

              {/* Name + Phone */}
              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>


                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    placeholder="+251 9..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>


              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>


              {/* Service */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Select Service
                </label>

                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Choose a cleaning service
                  </option>

                  <option value="home">
                    Home Cleaning - $50
                  </option>

                  <option value="office">
                    Office Cleaning - $100
                  </option>

                  <option value="carpet">
                    Carpet Cleaning - $40
                  </option>

                  <option value="window">
                    Window Cleaning - $30
                  </option>
                </select>
              </div>


              {/* Date + Time */}
              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Booking Date
                  </label>

                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>


                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Preferred Time
                  </label>

                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select a time
                    </option>

                    <option value="08:00">
                      8:00 AM
                    </option>

                    <option value="10:00">
                      10:00 AM
                    </option>

                    <option value="12:00">
                      12:00 PM
                    </option>

                    <option value="14:00">
                      2:00 PM
                    </option>

                    <option value="16:00">
                      4:00 PM
                    </option>
                  </select>
                </div>

              </div>


              {/* Address */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Cleaning Address
                </label>

                <textarea
                  rows="3"
                  placeholder="Enter the address where cleaning is needed"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                ></textarea>
              </div>


              {/* Additional Notes */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Additional Notes
                </label>

                <textarea
                  rows="4"
                  placeholder="Any special instructions or requests?"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                ></textarea>
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
              >
                📅 Confirm Booking
              </button>

            </form>

          </div>

        </div>
      </section>







      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 py-8 text-center text-white">

        <p className="text-lg font-bold">
          Clean<span className="text-blue-400">Pro</span>
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Professional Cleaning Services
        </p>

        <p className="mt-4 text-sm text-gray-500">
          © 2026 CleanPro. All rights reserved.
        </p>

      </footer>

    </div>
  )
}

export default App

