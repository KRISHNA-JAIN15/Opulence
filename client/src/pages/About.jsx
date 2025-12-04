import {
  Users,
  Award,
  Target,
  Heart,
  Star,
  Globe,
  Truck,
  Shield,
} from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Krishna Jain",
      position: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      description: "Visionary leader with 10+ years in luxury retail",
    },
    {
      name: "Sarah Mitchell",
      position: "Head of Design",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      description: "Award-winning designer with expertise in luxury brands",
    },
    {
      name: "Marcus Chen",
      position: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      description: "Operations expert ensuring seamless customer experience",
    },
    {
      name: "Elena Rodriguez",
      position: "Customer Relations Director",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      description: "Customer service specialist dedicated to excellence",
    },
  ];

  const values = [
    {
      icon: <Award size={48} strokeWidth={1.5} />,
      title: "Excellence",
      description:
        "We curate only the finest products that meet our exacting standards of quality and craftsmanship.",
    },
    {
      icon: <Heart size={48} strokeWidth={1.5} />,
      title: "Passion",
      description:
        "Every product we select is chosen with passion and dedication to bringing you the extraordinary.",
    },
    {
      icon: <Target size={48} strokeWidth={1.5} />,
      title: "Innovation",
      description:
        "We constantly evolve and innovate to provide you with the latest in luxury and technology.",
    },
    {
      icon: <Users size={48} strokeWidth={1.5} />,
      title: "Community",
      description:
        "Building lasting relationships with our customers and creating a community of discerning individuals.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "1000+", label: "Premium Products" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Customer Support" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-wider transform -skew-x-3 drop-shadow-2xl">
            <span className="inline-block transform skew-x-3 text-white drop-shadow-lg">
              ABOUT
            </span>{" "}
            <span className="inline-block transform skew-x-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent filter drop-shadow-lg">
              OPULENCE
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Redefining luxury through exceptional products and unparalleled
            experiences. We believe in bringing you nothing but the
            extraordinary.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-wider transform -skew-x-2">
                <span className="inline-block transform skew-x-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
                  OUR STORY
                </span>
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Founded in 2020, Opulence emerged from a simple yet powerful
                  vision: to create a platform where luxury meets accessibility,
                  where exceptional quality meets exceptional service.
                </p>
                <p>
                  What started as a passion project has evolved into a trusted
                  destination for discerning customers who appreciate the finer
                  things in life. We believe that luxury isn't just about price
                  tags – it's about craftsmanship, attention to detail, and the
                  experience that comes with owning something truly special.
                </p>
                <p>
                  Today, we continue to push boundaries, constantly seeking out
                  the most innovative and exquisite products from around the
                  world. Our commitment remains unchanged: to deliver opulence
                  beyond expectations.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
                alt="Luxury store interior"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">5+ Years</div>
                <div className="text-sm uppercase tracking-wide">
                  of Excellence
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-wider transform -skew-x-2">
              <span className="inline-block transform skew-x-2 bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
                OUR VALUES
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do and shape the
              exceptional experience we provide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-yellow-600 mb-6 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-gray-300">
              Numbers that reflect our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-yellow-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-300 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind Opulence who work tirelessly to
              bring you exceptional experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-yellow-600 font-semibold mb-3">
                  {member.position}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Globe
            size={64}
            className="text-yellow-400 mx-auto mb-8"
            strokeWidth={1.5}
          />
          <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-12">
            To democratize luxury by making exceptional products accessible to
            those who appreciate quality, craftsmanship, and the extraordinary.
            We believe everyone deserves to experience opulence in their lives.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center">
              <Truck
                size={40}
                className="text-yellow-400 mb-4"
                strokeWidth={1.5}
              />
              <h3 className="font-bold text-lg mb-2">Global Shipping</h3>
              <p className="text-gray-400 text-center">
                Delivering excellence worldwide
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Shield
                size={40}
                className="text-yellow-400 mb-4"
                strokeWidth={1.5}
              />
              <h3 className="font-bold text-lg mb-2">Secure Shopping</h3>
              <p className="text-gray-400 text-center">
                Your security is our priority
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Star
                size={40}
                className="text-yellow-400 mb-4"
                strokeWidth={1.5}
              />
              <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-400 text-center">
                Only the finest products
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
