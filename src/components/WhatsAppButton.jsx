import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsAppButton({ text = "Agendar por WhatsApp", className = "" }) {
    return (
        <a
            href="https://wa.me/yournumber"
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center gap-3 bg-gradient-to-r from-deep-purple to-electric-purple 
        text-white font-semibold px-8 py-4 rounded-2xl shadow-lg 
        hover:shadow-electric-purple/40 hover:shadow-xl hover:scale-105 
        transition-all duration-300 ease-out ${className}`}
        >
            <FaWhatsapp className="w-6 h-6" />
            <span>{text}</span>
        </a>
    )
}
