import { Mail, MapPin, Phone } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="mb-6 tracking-wider mb-6 tracking-wider text-gray-100 bg-gradient-to-r from-indigo-500 to-pink-600
      bg-clip-text text-transparent">GET IN TOUCH</h2>
            <p className="mb-8 text-gray-300">
              Ready to start your next project? We'd love to hear from you.
              Reach out to discuss how we can help bring your vision to life.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin size={24} className="mt-1 text-gray-400" />
                <div>
                  <h3 className="mb-1 tracking-wide">Address</h3>
                  <p className="text-gray-300">123 Portfolio Street<br />Creative City, CC 12345</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone size={24} className="mt-1 text-gray-400" />
                <div>
                  <h3 className="mb-1 tracking-wide">Phone</h3>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail size={24} className="mt-1 text-gray-400" />
                <div>
                  <h3 className="mb-1 tracking-wide">Email</h3>
                  <p className="text-gray-300">hello@portfolio.com</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 tracking-wide">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 focus:border-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 tracking-wide">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 focus:border-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 tracking-wide">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 focus:border-white focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-3 bg-white text-black hover:bg-gray-200 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
