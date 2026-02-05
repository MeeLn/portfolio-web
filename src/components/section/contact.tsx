import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const res = await fetch(
      "https://formsubmit.co/ajax/contact@milanraut.com.np",
      {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (res.ok) {
      setStatus("Message sent successfully!");
      setTimeout(() => setStatus(""), 3000);
      form.reset();
    } else {
      setStatus("Failed to send message. Please try again.");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <section id="contact" className="bg-background overflow-hidden">
      {/* Header */}
      <motion.div
        className="container pt-20 px-6 mx-auto flex flex-col md:flex-row justify-between items-start lg:px-30"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="text-secondary md:w-1/2 flex flex-col gap-2">
          <h1 className="text-xl font-bold text-primary">GET IN TOUCH</h1>
          <h2 className="text-primary text-4xl sm:text-5xl">
            <span className="text-secondary">CONTACT</span> ME
          </h2>
        </div>

        <div className="text-secondary md:w-1/2 flex flex-col gap-2 mt-6 md:mt-0">
          <p className="text-lg sm:text-xl font-mono border-l-2 border-primary pl-4">
            Feel free to reach out for collaborations or just a friendly hello!
          </p>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        className="container px-6 mt-10 mx-auto flex flex-col gap-6 lg:px-30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p className="text-secondary text-2xl font-mono">
          Get in touch with me via social media or send me an email.
        </p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 sm:gap-12"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <a
            href="https://www.facebook.com/mi.lana.521512"
            className="flex items-center text-blue-600 text-4xl hover:scale-105 hover:-translate-y-1 transition-transform duration-300"
          >
            <i className="fab fa-facebook"></i>
            <span className="text-2xl px-3">Facebook</span>
          </a>

          <a
            href="https://www.instagram.com/meeln8/"
            className="flex items-center text-red-400 text-4xl hover:scale-105 hover:-translate-y-1 transition-transform duration-300"
          >
            <i className="fab fa-instagram"></i>
            <span className="text-2xl px-3">Instagram</span>
          </a>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 sm:gap-12"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <a
            href="#"
            className="flex items-center text-blue-500 text-4xl hover:scale-105 hover:-translate-y-1 transition-transform duration-300"
          >
            <i className="fab fa-linkedin"></i>
            <span className="text-2xl px-3">LinkedIn</span>
          </a>

          <a
            href="https://x.com/MeeLn84"
            className="flex items-center text-sky-400 text-4xl hover:scale-105 hover:-translate-y-1 transition-transform duration-300"
          >
            <i className="fab fa-twitter"></i>
            <span className="text-2xl px-3">Twitter</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        className="container mt-10 px-6 lg:px-30 md:px-20 w-full mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="bg-background hover:bg-card border-2 border-background p-8 hover:border-primary transition">
          <h2 className="text-secondary text-xl font-bold mb-4">
            Send me an email
          </h2>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col lg:flex-row gap-8 mb-4">
              <input type="hidden" name="_captcha" value="false" />

              <div className="flex flex-col gap-4 w-full lg:w-1/3">
                <input
                  name="name"
                  placeholder="Your Name"
                  className="p-2 border-2 border-border rounded-lg bg-card text-secondary focus:border-primary focus:outline-none"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  className="p-2 border-2 border-border rounded-lg bg-card text-secondary focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-4 w-full lg:w-2/3">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  className="min-h-[100px] p-2 border-2 border-border rounded-lg bg-card text-secondary focus:border-primary focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 hover:scale-105 bg-primary text-white rounded-lg border-2 border-primary hover:bg-background hover:text-primary transition"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>

            {status && (
              <p className="text-primary font-medium mt-3">{status}</p>
            )}
          </form>
        </div>
      </motion.div>
    </section>
  );
}
