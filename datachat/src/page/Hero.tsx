import { useState, useEffect, useRef, type MouseEvent } from 'react';
import { ChevronDown, Mail, Phone, MapPin, Contact } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card, { CardTypes } from '../components/ui/card';

// Define the type for a single ripple effect
type Ripple = {
  id: number;
  x: number;
  y: number;
};

const contactData = [
  {
    icon: Mail,
    heading: "Hi talk to me",
    desc: "say hello",
    contact: "test@gmail"
  },
  {
    icon: Mail,
    heading: "Hi talk to me",
    desc: "say hello",
    contact: "test@gmail"
  },
  {
    icon: Mail,
    heading: "Hi talk to me",
    desc: "say hello",
    contact: "test@gmail"
  }
]

function HeroPage() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);

  // Effect for Intersection Observer to handle scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the element is visible
    );

    // Observe all elements with the 'data-animate' attribute
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    // Cleanup observer on component unmount
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);


  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple: Ripple = { id: Date.now(), x, y };

    // Add new ripple and start the animation
    setRipples(prev => [...prev, newRipple]);

    // The ripple element will be removed by CSS animation ending, 
    // but we'll clear the state after a delay to prevent memory leaks.
    setTimeout(() => {
      setRipples(current => current.filter(r => r.id !== newRipple.id));
    }, 700); // Match animation duration
  };

  const RippleButton = () => (
    <button
      onClick={handleButtonClick}
      className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/90 px-10 py-4 text-lg font-bold text-black shadow-lg backdrop-blur-sm transition-transform duration-200 ease-in-out hover:scale-105"
    >
      <Link to={'/login'}><span className="z-10">Explore</span></Link>

      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute block rounded-full bg-white/50"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '1px',
            height: '1px',
            transform: 'translate(-50%, -50%)',
            animationName: 'ripple',
            animationDuration: '700ms',
            animationTimingFunction: 'ease-out',
          }}
        />
      ))}
    </button>
  );

  return (
    <div className="w-screen bg-[#0B021D] font-sans text-white">
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(500);
            opacity: 0;
          }
        }
        .animate-section {
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            opacity: 0;
            transform: translateY(40px);
        }
        .animate-section.visible {
            opacity: 1;
            transform: translateY(0);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Subtle starry background texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }}
        ></div>

        {/* The main purple radial gradient */}
        <div className="absolute -right-1/4 -top-1/4 h-[800px] w-[800px] bg-[radial-gradient(ellipse_at_center,_rgba(138,43,226,0.3)_0%,_rgba(138,43,226,0)_70%)]"></div>

        {/* Header Navigation */}
        <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 md:p-8">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tighter">ConnectDB</h1>
          </div>
          <nav className="hidden items-center space-x-8 text-sm font-medium text-gray-300 md:flex">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
        </header>

        {/* Main Content (Left Side) */}
        <main className="relative z-10 flex h-full w-full flex-col justify-center p-6 md:w-1/2 md:p-12">
          <div className="text-left text-white">
            <h2 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Your Data, One Question Away
            </h2>
            <p className="mt-6 max-w-lg text-lg text-gray-300">
              From conversation to database insights in seconds
            </p>
          </div>

          {/* Button for Mobile View */}
          <div className="mt-10 text-left md:hidden">
            <RippleButton />
          </div>
        </main>

        {/* Button Container for Desktop View (Right Side) */}
        <div className="absolute right-0 top-0 z-10 hidden h-full w-1/2 items-center justify-center p-12 md:flex">
          <div className="absolute h-96 w-96 bg-[radial-gradient(ellipse_at_center,_rgba(138,43,226,0.25)_0%,_rgba(138,43,226,0)_60%)] blur-3xl"></div>
          <RippleButton />
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <a href="#about" aria-label="Scroll to about section">
            <ChevronDown className="h-8 w-8 animate-bounce text-gray-500" />
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-12 bg-[#0e0421]">
        <div
          data-animate
          id="about-content"
          className={`max-w-4xl mx-auto text-center animate-section ${isVisible['about-content'] ? 'visible' : ''}`}
        >
          <h3 className="text-4xl md:text-5xl font-bold mb-6">About ConnectDB</h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            ConnectDB revolutionizes the way you interact with your databases. We believe that data analysis should be accessible to everyone, not just those who can write complex SQL queries. Our platform leverages cutting-edge AI to translate natural language questions into powerful database insights, empowering teams to make faster, data-driven decisions without the technical overhead. Our mission is to democratize data access and unlock the full potential of your information assets.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 md:px-12 bg-[#0B021D]">
        <div
          data-animate
          id="contact-content"
          className={`max-w-4xl mx-auto text-center animate-section ${isVisible['contact-content'] ? 'visible' : ''}`}
        >
          <h3 className="text-4xl md:text-5xl font-bold mb-12">Contact</h3>
          <div className="grid md:grid-cols-3 gap-12 text-left">
            {
              contactData.map(({icon, heading, desc , contact })=>(
                <Card icon={icon} heading={heading} desc={desc} contact={contact} />
              ))
            }
            
           
            {/* <div className="flex flex-col items-center text-center">
                      <Phone className="h-10 w-10 mb-4 text-purple-400"/>
                      <h4 className="text-xl font-bold mb-2">Phone</h4>
                      <p className="text-gray-400">Mon-Fri from 9am to 5pm.</p>
                      <a href="tel:+1234567890" className="text-purple-300 hover:underline mt-2">(123) 456-7890</a>
                  </div>
                  <div className="flex flex-col items-center text-center">
                      <MapPin className="h-10 w-10 mb-4 text-purple-400"/>
                      <h4 className="text-xl font-bold mb-2">Office</h4>
                      <p className="text-gray-400">123 Data Drive, Tech City</p>
                      <p className="text-purple-300 mt-2">Come say hello</p>
                  </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroPage;