import { useState } from "react";
import { Mail, X } from "lucide-react";
import { Menu, House, Calendars, User, Contact, UserStar } from "lucide-react";

export default function Header() {
  const [sideBar, setSideBar] = useState(false);

  return (
    <header className=" bg-background text-secondary">
      <nav className="fixed top-0 left-0 w-full z-50 bg-background border-chart-4 border-b shadow-md">
        <div className="container mx-auto flex h-18 justify-between lg:px-30 px-6 items-center">
          <a href="#hero">
            <img
              src="/logos/MilanLOGO_light.png"
              className="block dark:hidden"
              alt="Milan Raut"
              height={30}
              width={30}
            />
            <img
              src="/logos/MilanLOGO_dark_1.png"
              className="hidden dark:block"
              alt="Milan Raut"
              height={30}
              width={30}
            />
          </a>
          <ul className="hidden md:flex lg:space-x-8">
            <li>
              <a
                href="#hero"
                className="pb-6 hover:border-green-500 hover:border-b-2 hover:text-green-500 focus:text-green-500 focus:border-green-500 focus:border-b-2"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="pb-6 hover:border-green-500 hover:border-b-2 hover:text-green-500 focus:text-green-500 focus:border-green-500 focus:border-b-2"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#Portfolio"
                className="pb-6 hover:border-green-500 hover:border-b-2 hover:text-green-500 focus:text-green-500 focus:border-green-500 focus:border-b-2"
              >
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className="pb-6 hover:border-green-500 hover:border-b-2 hover:text-green-500 focus:text-green-500 focus:border-green-500 focus:border-b-2"
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="pb-6 hover:border-green-500 hover:border-b-2 hover:text-green-500 focus:text-green-500 focus:border-green-500 focus:border-b-2"
              >
                Contact
              </a>
            </li>
          </ul>

          <button
            onClick={() => setSideBar(true)}
            className="block md:hidden text-gray-300 hover:text-white transition"
          >
            <span className="text-2xl">
              <Menu size={24} color="#66BB6A" strokeWidth={2} />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {sideBar && (
        <div
          className="fixed inset-0 z-60 bg-black/40 md:hidden"
          onClick={() => setSideBar(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 h-full w-71 bg-muted/99 p-6 transition-transform duration-300 md:hidden z-60 flex flex-col gap-4
                    ${sideBar ? "translate-x-0" : "translate-x-full"}
            `}
      >
        <div className="flex flex-col gap-146">
          <div className="flex justify-between ">
            <div className="order-2 flex items-start">
              <button
                onClick={() => setSideBar(false)}
                className="text-gray-300 hover:text-white text-2xl mb-4"
              >
                <X size={24} color="red" strokeWidth={2} />
              </button>
            </div>
            <div className="order-1 flex flex-col space-y-4 items-start ml-2">
              <a
                href="#hero"
                onClick={() => setSideBar(false)}
                className="flex gap-2 closer text-primary text-lg"
              >
                <House />
                Home
              </a>
              <a
                href="#about"
                onClick={() => setSideBar(false)}
                className="flex gap-2 closer text-primary text-lg"
              >
                <UserStar /> About
              </a>
              <a
                href="#Portfolio"
                onClick={() => setSideBar(false)}
                className="flex gap-2 closer text-primary text-lg"
              >
                <User />
                Portfolio
              </a>
              <a
                href="#projects"
                onClick={() => setSideBar(false)}
                className="flex gap-2 closer text-primary text-lg"
              >
                <Calendars />
                Projects
              </a>
              <a
                href="#contact"
                onClick={() => setSideBar(false)}
                className="flex gap-2 closer text-primary text-lg"
              >
                <Contact />
                Contact
              </a>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <a
              href="#Portfolio"
              className="px-4 py-2 bg-primary text-white rounded-lg border-primary border-2 hover:bg-muted hover:text-primary transition flex items-center gap-2
                hover:scale-105"
            >
              <Mail /> Get In Touch
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
