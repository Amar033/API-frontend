// import { Button, MenuButton } from '@headlessui/react';
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FcGoogle } from 'react-icons/fc'; 


// // The Login page component.
// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate(); // Hook for programmatic navigation.

//   // The function to handle the dummy login and redirect.
//   const handleLogin = (e: { preventDefault: () => void; }) => {
//     e.preventDefault();
//     // This is the dummy login logic. In a real application, you would
//     // validate the email and password against a database or API.
//     console.log("Attempting to log in with:", email, password);
    
//     // Redirect to the dashboard page after the dummy login.
//     navigate('/dashboard');
//   };
  

//   return (
//     <div className="h-screen w-full  flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
    
//     <div className="grid grid-cols-2 gap-0 w-full h-full" >
//       {/* First column */}
//       <div className="w-full bg-gradient-to-b from-white via-purple-900 via-purple-500 via-purple-400 via-purple-300  via-purple-200 via-purple-100 to-black p-6 rounded-2xl shadow-lg" >
//         <div className="item-center flex-col">

//           {/*Logo component  */}
//           <div className="flex item-center  justify-center mt-45">
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M4 7V17M12 7V17M8 4L8 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M20 12L2 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           <span className="text-center text-white mt-0 font-sans font-bold"> ConnectDB</span>
//           </div>
          
//           {/* Main heading */}
//           <h3 className="text-center text-white mt-3 font-sans font-bold text-3xl ">Get Started with Us</h3>
//           <p className="text-center text-gray-200 mt-3 font-sans font-bold text-sm">Already have an account? Then Login to your account</p>

//           {/* Buttons */}
          
//           <div className="flex item-center  justify-center mt-3">
//             <button type="button" className='bg-[#6b6b73] text-white hover:bg-white hover:text-black font-bold py-2 px-4 rounded-lg w-sm  h-full   '> Sign in </button>
//           </div>
//           <div className="flex item-center  justify-center mt-3">
//             <button type="button" className='bg-[#6b6b73] text-white hover:bg-white hover:text-black font-bold py-2 px-4 rounded-lg w-sm    '> Sign up </button>
//           </div>
//           <div className="flex item-center  justify-center mt-3">
//             <button type="button" className='bg-[#6b6b73] text-white hover:bg-white hover:text-black font-bold py-2 px-4 rounded-lg w-sm    '> Demo </button>
//           </div>
          
//         </div>
//       </div>
//       {/* Second Column */}
//       <div className="w-full bg-black p-6 rounded-2xl shadow-lg">
//         <h3 className="text-3xl font-bold mb-2 text-white">Sign Up Account</h3>
//           <p className="text-gray-400 text-sm mb-6">Enter your personal data to create your account.</p>
//           <form className="w-full" >
//             <div className="mb-6">
//               <label className="block text-gray-400 text-sm font-bold mb-2">Email</label>
//               <input
//                 className="appearance-none block w-full bg-[#2d2d2d] text-white border border-[#2d2d2d] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-[#3d3d3d] placeholder:text-gray-500"
//                 type="email"
//                 placeholder="eg. johnfrans@gmail.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div className="mb-6">
//               <label className="block text-gray-400 text-sm font-bold mb-2">Password</label>
//               <input
//                 className="appearance-none block w-full bg-[#2d2d2d] text-white border border-[#2d2d2d] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-[#3d3d3d] placeholder:text-gray-500"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <p className="text-gray-500 text-xs italic mt-2">Must be at least 8 characters.</p>
//             </div>

//             <button type="submit" className="bg-white text-black font-bold py-3 px-4 rounded-lg w-full hover:bg-gray-200">
//               Sign Up
//             </button>
//           </form>

//           <p className="text-center text-gray-400 text-sm mt-6">
//             Already have an account? <Link to="/login" className="text-white hover:underline">Log in</Link>
//           </p>
 
//         </div>

//     </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';

// Mock navigation function (replace with actual routing in your app)
const mockNavigate = (path: string) => {
  console.log(`Navigating to: ${path}`);
  alert(`Would navigate to: ${path}`);
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [activeMode, setActiveMode] = useState('signin'); // 'signin', 'signup', 'demo'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (activeMode === 'signin') {
        console.log("Signing in with:", email, password);
        mockNavigate('/dashboard');
      } else if (activeMode === 'signup') {
        console.log("Signing up with:", { fullName, email, password });
        // After successful signup, switch to signin mode
        setActiveMode('signin');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        alert('Account created successfully! Please sign in.');
      } else if (activeMode === 'demo') {
        console.log("Starting demo mode");
        mockNavigate('/dashboard');
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleModeChange = (mode: React.SetStateAction<string>) => {
    if (mode !== activeMode) {
      setActiveMode(mode);
      // Clear form when switching modes
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
    }
  };

  const getFormTitle = () => {
    switch (activeMode) {
      case 'signup': return 'Create Account';
      case 'demo': return 'Try Demo';
      default: return 'Sign In Account';
    }
  };

  const getFormSubtitle = () => {
    switch (activeMode) {
      case 'signup': return 'Enter your personal data to create your account.';
      case 'demo': return 'Experience our platform with sample data.';
      default: return 'Enter your credentials to access your account.';
    }
  };

  return (
    <>
      <div className="h-screen w-full flex items-center justify-center bg-black p-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full h-full max-w-6xl max-h-screen">
          {/* First column - Left Panel */}
          <div 
            className={`w-full bg-gradient-to-b from-white via-purple-900 via-purple-500 via-purple-400 via-purple-300 via-purple-200 via-purple-100 to-black p-6 rounded-2xl shadow-2xl transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full">
              {/* Logo component with hover animation */}
              <div className="flex items-center justify-center mb-6 group cursor-pointer transform transition-all duration-300 hover:scale-110 hover-float">
                <div className="transform transition-transform duration-300 group-hover:rotate-12">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 7V17M12 7V17M8 4L8 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 12L2 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-white ml-3 font-sans font-bold text-lg animate-pulse">ConnectDB</span>
              </div>
              
              {/* Main heading with animation */}
              <h3 className="text-center text-white mb-3 font-sans font-bold text-3xl animate-pulse">
                Get Started with Us
              </h3>
              <p className="text-center text-gray-200 mb-6 font-sans text-base max-w-sm leading-relaxed">
                Choose your path to access our powerful database management platform
              </p>

              {/* Navigation Buttons */}
              <div className="space-y-3 w-full max-w-xs">
                <button 
                  onClick={() => handleModeChange('signin')}
                  className={`w-full py-2.5 px-5 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 ${
                    activeMode === 'signin' 
                      ? 'bg-white text-black shadow-lg scale-105 animate-pulse' 
                      : 'bg-gray-700 bg-opacity-50 text-white hover:bg-white hover:text-black backdrop-blur-sm'
                  }`}
                > 
                  Sign In 
                </button>
                
                <button 
                  onClick={() => handleModeChange('signup')}
                  className={`w-full py-2.5 px-5 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 ${
                    activeMode === 'signup' 
                      ? 'bg-white text-black shadow-lg scale-105 animate-pulse' 
                      : 'bg-gray-700 bg-opacity-50 text-white hover:bg-white hover:text-black backdrop-blur-sm'
                  }`}
                > 
                  Sign Up 
                </button>
                
                <button 
                  onClick={() => handleModeChange('demo')}
                  className={`w-full py-2.5 px-5 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 ${
                    activeMode === 'demo' 
                      ? 'bg-white text-black shadow-lg scale-105 animate-pulse' 
                      : 'bg-gray-700 bg-opacity-50 text-white hover:bg-white hover:text-black backdrop-blur-sm'
                  }`}
                > 
                  Demo 
                </button>
              </div>

              {/* Decorative elements */}
              <div className="mt-6 opacity-30">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Column - Form Panel */}
          <div 
            className={`w-full bg-black p-6 rounded-2xl shadow-2xl transform transition-all duration-1000 ease-out delay-200 overflow-y-auto ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <div 
              key={activeMode}
              className="animate-fade-in-up h-full flex flex-col"
            >
              <div className="mb-6 flex-shrink-0">
                <h3 className="text-3xl font-bold mb-2 text-white">{getFormTitle()}</h3>
                <p className="text-gray-400 text-sm">{getFormSubtitle()}</p>
              </div>

              <div className="w-full space-y-4 flex-1 overflow-y-auto">
                {/* Full Name Field (only for signup) */}
                {/* {activeMode === 'signup' && (
                  <div className="transform transition-all duration-300 ease-in-out">
                    <label className="block text-gray-400 text-xs font-bold mb-1">Full Name</label>
                    <input
                      className="input-field w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-gray-700 focus:border-purple-500 placeholder:text-gray-500 transition-all duration-300"
                      type="text"
                      placeholder="eg. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                )} */}

                {/* Email Field (not shown for demo) */}
                {activeMode !== 'demo' && (
                  <div className="transform transition-all duration-300 ease-in-out">
                    <label className="block text-gray-400 text-xs font-bold mb-1">Email</label>
                    <input
                      className="input-field w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-gray-700 focus:border-purple-500 placeholder:text-gray-500 transition-all duration-300"
                      type="email"
                      placeholder="eg. johnfrans@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}

                {/* Password Field (not shown for demo) */}
                {activeMode !== 'demo' && (
                  <div className="transform transition-all duration-300 ease-in-out">
                    <label className="block text-gray-400 text-xs font-bold mb-1">Password</label>
                    <input
                      className="input-field w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-gray-700 focus:border-purple-500 placeholder:text-gray-500 transition-all duration-300"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-gray-500 text-xs italic mt-1">Must be at least 8 characters.</p>
                  </div>
                )}

                {/* Confirm Password Field (only for signup) */}
                {activeMode === 'signup' && (
                  <div className="transform transition-all duration-300 ease-in-out">
                    <label className="block text-gray-400 text-xs font-bold mb-1">Confirm Password</label>
                    <input
                      className="input-field w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-gray-700 focus:border-purple-500 placeholder:text-gray-500 transition-all duration-300"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                )}

                {/* Demo Instructions */}
                {activeMode === 'demo' && (
                  <div className="bg-gray-800 p-4 rounded-lg border border-purple-500 border-opacity-30 animate-pulse">
                    <h4 className="text-white font-bold mb-2 flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></span>
                      Demo Features:
                    </h4>
                    <ul className="text-gray-300 space-y-1 text-xs">
                      <li className="flex items-center">
                        <span className="text-purple-400 mr-2">•</span>
                        Explore database management interface
                      </li>
                      <li className="flex items-center">
                        <span className="text-purple-400 mr-2">•</span>
                        View sample data and analytics
                      </li>
                      <li className="flex items-center">
                        <span className="text-purple-400 mr-2">•</span>
                        Test core functionality
                      </li>
                      <li className="flex items-center">
                        <span className="text-purple-400 mr-2">•</span>
                        No registration required
                      </li>
                    </ul>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full font-bold py-3 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 ${
                    isSubmitting 
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                      : 'bg-white text-black hover:bg-gray-200 hover:shadow-2xl'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      {activeMode === 'signup' && 'Create Account'}
                      {activeMode === 'signin' && 'Sign In'}
                      {activeMode === 'demo' && 'Start Demo'}
                    </>
                  )}
                </button>

                {/* Google Sign In Option (not for demo) */}
                {activeMode !== 'demo' && (
                  <div className="mt-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-black text-gray-400">Or continue with</span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="mt-3 w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center border border-gray-700 hover:border-gray-600"
                    >
                      <FcGoogle className="mr-2 text-lg" />
                      Continue with Google
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Links */}
              <div className="mt-4 flex-shrink-0">
                {activeMode === 'signin' && (
                  <p className="text-center text-gray-400 text-xs">
                    Don't have an account? 
                    <button 
                      onClick={() => handleModeChange('signup')}
                      className="text-white hover:underline ml-1 transition-colors duration-200 hover:text-purple-300"
                    >
                      Sign up
                    </button>
                  </p>
                )}
                
                {activeMode === 'signup' && (
                  <p className="text-center text-gray-400 text-xs">
                    Already have an account? 
                    <button 
                      onClick={() => handleModeChange('signin')}
                      className="text-white hover:underline ml-1 transition-colors duration-200 hover:text-purple-300"
                    >
                      Sign in
                    </button>
                  </p>
                )}

                {activeMode === 'demo' && (
                  <p className="text-center text-gray-400 text-xs">
                    Want to create an account? 
                    <button 
                      onClick={() => handleModeChange('signup')}
                      className="text-white hover:underline ml-1 transition-colors duration-200 hover:text-purple-300"
                    >
                      Sign up here
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .hover-float:hover {
          animation: float 2s ease-in-out infinite;
        }
        
        .input-field:focus {
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #ffffff, #a855f7, #ffffff);
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @media (max-width: 1024px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}