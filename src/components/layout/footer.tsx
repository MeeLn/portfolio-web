import "@fortawesome/fontawesome-free/css/all.min.css";
import { motion, useReducedMotion } from "framer-motion";

export default function Footer() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <footer>
      <section className="bg-background text-secondary lg:p-6 lg:pt-20 text-center overflow-hidden">
        {/* Main Footer Card */}
        <motion.div
          className="container mx-auto"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="border border-border bg-card/50 backdrop-blur-sm lg:mx-30 mx-6 mb-10 overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-xl">
            <div className="flex flex-col lg:flex-row p-8 lg:p-12 items-center lg:items-start text-center lg:text-left gap-10">
              {/* Profile Image */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-green-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-primary/20">
                  <img
                    src="/profile/profile_2.png"
                    alt="Milan Raut"
                    className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                  />
                </div>
              </div>

              {/* Bio & Contact Info */}
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-2 tracking-tight">
                    Milan Raut
                  </h2>
                  <p className="text-primary font-mono text-lg font-semibold uppercase tracking-widest">
                    Web Developer
                  </p>
                </div>

                <p className="text-secondary/70 text-lg leading-relaxed max-w-2xl">
                  Building digital experiences with precision and passion. Let's
                  collaborate to bring your ideas to life.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <a
                    href="tel:9866734873"
                    className="flex items-center justify-center lg:justify-start gap-3 group text-secondary/80 hover:text-primary transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <i className="fas fa-phone"></i>
                    </div>
                    <span className="font-mono">+977 9866734873</span>
                  </a>
                  <a
                    href="mailto:contact@milanraut.com.np"
                    className="flex items-center justify-center lg:justify-start gap-3 group text-secondary/80 hover:text-primary transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <span className="font-mono">contact@milanraut.com.np</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="container mx-auto flex md:flex-row flex-col justify-between bg-background lg:px-30 px-6 py-4 lg:pt-4 border-t border-gray-800"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex space-x-4 md:pt-none pt-2 justify-center text-secondary text-md">
            <p>Copyright © 2025 Milan Raut</p>
          </div>

          <div className="flex space-x-4 md:pt-none pt-2 justify-center text-secondary text-2xl">
            {[
              ["facebook", "https://www.facebook.com/mi.lana.521512"],
              ["instagram", "https://www.instagram.com/meeln8/"],
              ["twitter", "https://x.com/MeeLn84"],
              ["github", "https://github.com/MeeLn"],
              ["linkedin", "#"],
            ].map(([icon, link]) => (
              <a
                key={icon}
                href={link}
                className="hover:text-green-500 transition"
              >
                <i className={`fab fa-${icon}`}></i>
              </a>
            ))}
          </div>
        </motion.div>
      </section>
    </footer>
  );
}
