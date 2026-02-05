import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <div id="about">
      <section className="bg-Background pt-24 pb-6 overflow-hidden">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row justify-between items-center lg:px-30 px-6 gap-10">
          {/* Image */}
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ x: -30, y: 40, scale: 1.2 }}
          >
            <img
              src="/profile/profile.png"
              alt="About Milan Raut"
              className="rounded-lg w-full max-w-sm sm:max-w-md lg:max-w-lg"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            className="text-secondary w-full lg:w-1/2 flex flex-col items-start p-2 sm:p-6 text-center lg:text-left"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold my-4 text-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              ABOUT ME
            </motion.h1>

            <motion.div
              className="mb-6 text-base sm:text-lg lg:text-xl font-mono border-l-4 border-primary pl-4 mx-auto lg:mx-0 text-justify space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <p>
                An Information Technology graduate with a Bachelor of
                Engineering in Information Technology (BEIT) from Nepal College
                of Information Technology (NCIT). I am deeply passionate about
                software development, problem-solving, and staying ahead of the
                curve with emerging technologies.
              </p>

              <div className="flex flex-wrap gap-2 pt-4">
                {[
                  "C",
                  "C++",
                  "JAVA",
                  "Python",
                  "PHP",
                  "HTML",
                  "CSS",
                  "Tailwind CSS",
                  "React.js",
                  "Next.js",
                  "Django",
                  "XML",
                  "MySQL",
                  "PostgreSQL",
                  "SQLite",
                  "Android Studio",
                  "VS Code",
                  "Visual Studio",
                  "IntelliJ IDEA",
                  "Jupyter Notebook",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Button */}
            <motion.div
              className="group mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href="/CV.pdf"
                download="milan_cv.pdf"
                className="px-4 py-2 hover:scale-105 bg-green-500 text-white rounded-lg border-green-500 border-2 group-hover:bg-muted hover:text-green-500 transition flex items-center gap-2"
              >
                Download CV
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
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
