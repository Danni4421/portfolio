"use client";

import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { contact } from "@/lib/social";
import {
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
  FaDiscord,
  FaGithub,
} from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

export default function Hero() {
  const router = useRouter();

  const { openModal } = useModal("contact_modal");

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="w-6 h-6" />,
      url: contact.linkedIn,
      description: "Let's connect professionally",
      color: "hover:text-blue-500",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="w-6 h-6" />,
      url: contact.whatsApp,
      description: "Available for quick chat",
      color: "hover:text-green-500",
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="w-6 h-6" />,
      url: contact.instagram,
      description: "Follow my journey",
      color: "hover:text-pink-500",
    },
    {
      name: "Discord",
      icon: <FaDiscord className="w-6 h-6" />,
      url: contact.discord,
      description: "Let's chat on Discord",
      color: "hover:text-indigo-500",
    },
    {
      name: "Email",
      icon: <MdOutlineMail className="w-6 h-6" />,
      url: contact.email,
      description: "Send me an email",
      color: "hover:text-red-500",
    },
    {
      name: "Github",
      icon: <FaGithub className="w-6 h-6" />,
      url: contact.github,
      description: "Follow my code journey",
      color: "hover:text-gray-500",
    },
  ];

  return (
    <>
      <h2 className="text-4xl font-serif mb-8">
        Passionate about building scalable and efficient web applications
      </h2>
      <p className="text-lg mb-8">
        As a Fullstack Developer, I specialize in both frontend and backend
        development, focusing on creating seamless user experiences while
        ensuring robust server-side architectures. I enjoy working with modern
        technologies to bring ideas to life.
      </p>
      <div className="flex space-x-4 mb-12">
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-colors"
        >
          Let's build something together
        </button>
        <button
          onClick={() => router.push("/not-available")}
          className="px-6 py-3 border border-gray-200 rounded-full hover:bg-gray-800 transition-colors"
        >
          See my projects
        </button>
      </div>

      {/* Contact Modal */}
      <dialog id="contact_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <div className="text-center mb-6">
            <h3 className="font-bold text-2xl mb-2">Let's Connect!</h3>
            <p className="text-gray-400">
              Feel free to reach out through any of these platforms
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-all duration-300 ${social.color}`}
              >
                <div className="flex-shrink-0">{social.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{social.name}</h4>
                  <p className="text-sm text-gray-400">{social.description}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-6 text-sm text-gray-400">
            <p>I typically respond within 24 hours</p>
          </div>

          <form method="dialog" className="modal-action">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
