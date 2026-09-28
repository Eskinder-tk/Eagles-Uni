import Image from "next/image";
import Link from "next/link";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import { ScrollReveal } from "./scroll-reveal";

const Footer = () => {
  return (
    <footer className="bg-white  dark:bg-gray-800  text-gray-600 dark:text-gray-300">
      <div className=" px-6 py-0 flex items-start justify-around flex-wrap shadow-md mb-3.5 gap-4">
        <div>
            <ScrollReveal direction="up" delay={0.3}>
                <Image
                    src="/footer_Eagle.png"
                    alt="Eagles University Logo"
                    width={170}
                    height={50}
                    priority
                    className="h-auto w-auto mt-2"
                />
                <h3 className="text-lg font-bold ml-10">ንስር ዩኒቨርሲቲ</h3>
            </ScrollReveal>
          
        </div>

        <ScrollReveal direction="up" delay={0.5}>
            <div className="flex flex-col gap-2 items-start mt-3">
                <h2 className="text-lg font-bold mb-0">About Us</h2>
                <Link href="/history" className="hover:underline">
                    History
                </Link>
                <Link href="/mission" className="hover:underline">
                    Mission
                </Link>
                <Link href="/vision" className="hover:underline">
                    Vision
                </Link>
            </div>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.7}>
            <div className="flex flex-col gap-2 items-start mt-3">
                <h3 className="text-lg font-bold mb-0">Contact</h3>
                <p className="text-blue-500 hover:underline">Email: easkndrtk@gmail.com</p>
                <p className="text-gray-600">tel: +251904542426</p>
            </div>
        </ScrollReveal>
        

        <ScrollReveal direction="up" delay={0.9}>
            <div className="flex flex-col gap-2 items-start mt-3">
                <h3 className="text-lg font-bold mb-0">Socials</h3>
                <a
                    className="flex items-center gap-2 hover:underline"
                    href="https://www.facebook.com/eaglesuniversity"
                >
                    <FaFacebook /> Facebook
                </a>
                <a
                    className="flex items-center gap-2 hover:underline"
                    href="https://www.twitter.com/eaglesuniversity"
                >
                    <FaTwitter /> Twitter
                </a>
                <a
                    className="flex items-center gap-2 hover:underline"
                    href="https://www.instagram.com/eaglesuniversity"
                >
                    <FaInstagram /> Instagram
                </a>
                <a
                    className="flex items-center gap-2 hover:underline"
                    href="https://www.linkedin.com/company/eaglesuniversity"
                >
                    <FaLinkedin /> LinkedIn
                </a>
                <a
                    className="flex items-center gap-2 mb-2 hover:underline"
                    href="https://www.github.com/eaglesuniversity"
                >
                    <FaGithub /> GitHub
                </a>
            </div>
        </ScrollReveal>
        
        
      </div>
      <ScrollReveal direction="up" delay={0.3}>
         <p className="text-center text-gray-500 text-sm py-4">
            @ 2027 Eagles University. All rights reserved.
        </p>
      </ScrollReveal>
     
    </footer>
  );
};

export default Footer;
