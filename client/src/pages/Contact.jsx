import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  User,
  Globe,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus("success");
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "general",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <MapPin size={28} strokeWidth={1.5} />,
      title: "Visit Our Store",
      details: [
        "123 Luxury Avenue",
        "Fashion District, NY 10001",
        "United States",
      ],
      action: "Get Directions",
    },
    {
      icon: <Phone size={28} strokeWidth={1.5} />,
      title: "Call Us",
      details: [
        "+1 (555) 123-4567",
        "Monday - Friday: 9AM - 8PM",
        "Weekend: 10AM - 6PM",
      ],
      action: "Call Now",
    },
    {
      icon: <Mail size={28} strokeWidth={1.5} />,
      title: "Email Us",
      details: [
        "hello@opulence.com",
        "support@opulence.com",
        "We reply within 2 hours",
      ],
      action: "Send Email",
    },
  ];

  const departments = [
    {
      name: "Customer Support",
      email: "support@opulence.com",
      description: "Product inquiries, orders, and general assistance",
    },
    {
      name: "Sales & Partnerships",
      email: "sales@opulence.com",
      description: "Bulk orders, corporate partnerships, and collaborations",
    },
    {
      name: "Press & Media",
      email: "press@opulence.com",
      description: "Media inquiries, press releases, and brand partnerships",
    },
    {
      name: "Technical Support",
      email: "tech@opulence.com",
      description: "Website issues, account problems, and technical assistance",
    },
  ];

  const faqs = [
    {
      question: "What are your shipping options?",
      answer:
        "We offer free standard shipping on orders over €69. Express shipping is available for €15, and same-day delivery in select cities for €25.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days of purchase. Items must be in original condition with tags attached. Free returns for defective items.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes! We ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track orders in your account dashboard.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageSquare
            size={64}
            className="text-yellow-400 mx-auto mb-6"
            strokeWidth={1.5}
          />
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-wider transform -skew-x-3 drop-shadow-2xl">
            <span className="inline-block transform skew-x-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent filter drop-shadow-lg">
              CONTACT
            </span>{" "}
            <span className="inline-block transform skew-x-3 text-white drop-shadow-lg">
              US
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We're here to help. Reach out to us anytime and we'll get back to
            you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-wider transform -skew-x-2">
              <span className="inline-block transform skew-x-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
                GET IN TOUCH
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the most convenient way to reach us. We're available across
              multiple channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="text-center p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="text-yellow-600 mb-6 flex justify-center">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {info.title}
                </h3>
                <div className="space-y-2 mb-6">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">
                      {detail}
                    </p>
                  ))}
                </div>
                <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  {info.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h3>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
                  <p className="font-semibold">Message sent successfully!</p>
                  <p className="text-sm">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <User
                        size={20}
                        className="absolute left-3 top-3 text-gray-400"
                        strokeWidth={1.5}
                      />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail
                        size={20}
                        className="absolute left-3 top-3 text-gray-400"
                        strokeWidth={1.5}
                      />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Inquiry Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="sales">Sales & Partnerships</option>
                    <option value="press">Press & Media</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Brief subject of your message"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-vertical"
                    placeholder="Please provide as much detail as possible..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} strokeWidth={1.5} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map/Store Info */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Visit Our Flagship Store
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin
                      className="text-yellow-600 mt-1 flex-shrink-0"
                      size={24}
                      strokeWidth={1.5}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Address
                      </h4>
                      <p className="text-gray-600">
                        123 Luxury Avenue
                        <br />
                        Fashion District, NY 10001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock
                      className="text-yellow-600 mt-1 flex-shrink-0"
                      size={24}
                      strokeWidth={1.5}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Store Hours
                      </h4>
                      <div className="text-gray-600 space-y-1">
                        <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                        <p>Saturday: 10:00 AM - 7:00 PM</p>
                        <p>Sunday: 11:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Globe
                      className="text-yellow-600 mt-1 flex-shrink-0"
                      size={24}
                      strokeWidth={1.5}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Services
                      </h4>
                      <div className="text-gray-600 space-y-1">
                        <p>• Personal Shopping Assistance</p>
                        <p>• Product Consultations</p>
                        <p>• Custom Orders</p>
                        <p>• VIP Customer Lounge</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-900 to-black p-8 rounded-2xl text-white">
                <h3 className="text-xl font-bold mb-4">Need Immediate Help?</h3>
                <p className="text-gray-300 mb-6">
                  For urgent inquiries, call us directly or use our live chat
                  feature.
                </p>
                <div className="space-y-3">
                  <button className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Call: +1 (555) 123-4567
                  </button>
                  <button className="w-full border border-white text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
                    Start Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Department Contacts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect directly with the right department for faster assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="p-6 border border-gray-200 rounded-xl hover:border-yellow-400 transition-colors"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {dept.name}
                </h3>
                <p className="text-gray-600 mb-4">{dept.description}</p>
                <a
                  href={`mailto:${dept.email}`}
                  className="text-yellow-600 font-semibold hover:text-yellow-700 transition-colors flex items-center gap-2"
                >
                  <Mail size={16} strokeWidth={1.5} />
                  {dept.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find quick answers to common questions before reaching out.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Didn't find what you're looking for?
            </p>
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-8 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
