export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
        <div className="px-8 py-10">
          <header className="mb-10 border-b border-gray-100 pb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-2 text-gray-500">
              Campground Booking System & Community Reviews
            </p>
          </header>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            {/* Section 1: Data Collection */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                1. Information Collection
              </h2>
              <p className="mb-4">
                To provide a secure booking and review experience, we collect
                the following personal information during account registration:
                Full Name, Telephone Number, Email Address and Encrypted
                Password. This information is for use in signing you in and for
                contact purposes. The Full Name will be publicly visible once
                you publish a review.
              </p>
            </section>

            {/* Section 2: Usage */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                2. Service Functionality
              </h2>
              <p className="mb-3">
                We use your data to manage the lifecycle of your interactions
                with our platform:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-bold">Booking:</span> Reserve up to 3
                  nights at your preferred campgrounds.
                </li>
                <li>
                  <span className="font-bold">Discovery:</span> Filter
                  campgrounds by price, rating, and location to find the perfect
                  stay.
                </li>
                <li>
                  <span className="font-bold">Reviews:</span> Share your
                  experiences through ratings and comments once your booking has
                  concluded.
                </li>
                <li>
                  <span className="font-bold">Confidentiality:</span> Your
                  booking transactions are kept private and secure within the
                  system.
                </li>
              </ul>
            </section>

            {/* Section 3: User Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                3. Your Content Rights
              </h2>
              <p className="mb-4">
                You maintain control over the content you contribute to the
                community:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-bold">Bookings:</span> You may view,
                  edit, or delete your own reservations at any time. However,
                  your booking will be locked once you create a review
                </li>
                <li>
                  <span className="font-bold">Reviews:</span> You have the right
                  to edit or delete your own feedback to correct mistakes or
                  remove your public profile.
                </li>
                <li>
                  <span className="font-bold">Stats:</span> Updating or deleting a review
                  will automatically trigger an update to the campground’s
                  overall statistics.
                </li>
              </ul>
            </section>

            {/* Section 4: Moderation & Admin Access */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                4. Moderation & Safety
              </h2>
              <p className="mb-4">
                To ensure a civil and safe community, system administrators have
                specific oversight capabilities:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-bold">Administrative Access:</span>{" "}
                  Admins can view, edit, or delete any booking or review to
                  manage system integrity and remove spam.
                </li>
                <li>
                  <span className="font-bold">Review Lock Policy:</span> If an
                  admin edits a user's review, the original user will be
                  prevented from further editing that review or creating a new
                  review for that specific booking.
                </li>
              </ul>
            </section>

            {/* Section 5: Security Requirements */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                5. Security
              </h2>
              <p>
                As required by our technical specifications, the system
                validates all data through secure REST APIs. We utilize
                professional testing environments like Postman to verify
                security compliance.
              </p>
            </section>
          </div>

          <footer className="mt-16 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
            &copy; 2026 Campground Booking Project. Built with Security in mind.
          </footer>
        </div>
      </div>
    </main>
  );
}
