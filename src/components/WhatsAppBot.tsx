import React from 'react';

const WhatsAppBot: React.FC = () => {
  const handleWhatsAppClick = () => {
    const message = "Hi! I'm interested in learning more about your driving courses. Can you help me?";
    const whatsappUrl = `https://wa.me/447756183484?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 animate-pulse-gentle"
        title="Chat with us on WhatsApp"
      >
        <i className="bi bi-whatsapp text-2xl"></i>
      </button>
      
      {/* WhatsApp tooltip */}
      <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        <div className="text-sm text-secondary-700 font-medium">Need help? Chat with us!</div>
        <div className="absolute bottom-0 right-4 transform translate-y-1">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBot;
