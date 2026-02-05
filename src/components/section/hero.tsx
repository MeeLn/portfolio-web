import "@fortawesome/fontawesome-free/css/all.min.css";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div id="hero">
      <section className="bg-background pt-42 overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row-reverse justify-between items-center lg:px-30 gap-10">
          {/* Image */}
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ x: 30, y: -30, scale: 1.1 }}
          >
            <img
              src="/Profile/profile_1.png"
              alt="Milan Raut profile image"
              className="rounded-lg w-full max-w-sm sm:max-w-md lg:max-w-lg"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            className="text-secondary w-full lg:w-1/2 flex flex-col items-start lg:p-6 text-center lg:text-left"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold my-4 text-primary"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              HI, I'M MILAN RAUT
            </motion.h1>

            <motion.div
              className="mb-6 text-base sm:text-lg lg:text-xl font-mono border-l-4 border-primary pl-4 mx-auto lg:mx-0 text-justify space-y-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <p className="font-bold text-secondary/80">
                🎓 BE in Information Technology
              </p>
              <p className="text-left">
                💻 Passionate about software development, problem-solving &
                exploring new tech.
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex mx-auto lg:mx-0 justify-start items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href="#Portfolio"
                className="px-4 py-2 bg-primary text-white rounded-lg border-primary border-2 hover:bg-muted hover:text-primary transition flex items-center gap-2
                hover:scale-105"
              >
                View Portfolio
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>

              <a
                href="#contact"
                className="px-4 py-2 hover:scale-105 border-2 border-primary bg-muted text-primary rounded-lg hover:bg-primary hover:text-white transition"
              >
                <i className="fa-solid fa-phone pr-2"></i>
                Contact Me
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
