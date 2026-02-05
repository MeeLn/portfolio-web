import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function PortfolioSection() {
  return (
    <div id="Portfolio">
      <section className="bg-background pt-20 overflow-hidden">
        {/* Header */}
        <motion.div
          className="container mx-auto px-6 lg:px-30 flex lg:flex-row lg:justify-between md:flex-col md:items-start flex-col items-start"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="text-secondary md:w-1/2 flex-col gap-2 flex items-start">
            <h1 className="text-xl font-sans font-bold text-primary">
              MY EXPERIENCE
            </h1>
            <h2 className="text-primary text-5xl">
              <span className="text-secondary">EXPERIENCE AND </span> SKILLS
            </h2>
          </div>

          <div className="text-secondary md:w-1/2 flex-col gap-2 flex items-start">
            <p className="mt-6 mb-6 text-xl font-mono border-l-2 border-primary pl-4 text-justify">
              Programming Languages: C, C++, JAVA, Python, PHP
              <br />
              Web Development: HTML, CSS, Tailwind CSS, React.js, Next.js,
              Django, XML
              <br />
              Database Management: MySQL, PostgreSQL, SQLite
              <br />
              Mobile Development: Android Studio JAVA
              <br />
              Tools and IDE: VS Code, Android Studio, Visual Studio, IntelliJ
              IDEA, Jupyter Notebook
            </p>
          </div>
        </motion.div>

        {/* Experience Cards */}
        <motion.div
          className="container mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
        >
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-6 lg:px-30 px-6 py-10 mx-10">
            {[
              {
                year: "2022-2023",
                title: "GAME DEVELOPMENT",
                desc: "Experienced in 2D Game making using C++ and SDL2 Library.",
              },
              {
                year: "2023-2023",
                title: "MOBILE APP DEVELOPMENT",
                desc: "Small experience in using Android Studio JAVA to make working Mobile APPs.",
              },
              {
                year: "2023-2024",
                title: "LMS DEVELOPMENT",
                desc: "Experienced in building responsive and dynamic Webapps using Next.js, Tailwind CSS, Django, and PostgreSQL frameworks.",
              },
              {
                year: "2025-Ongoing",
                title: "WEB DEVELOPMENT",
                desc: "Doing Internship in Crayons Code for building responsive and dynamic websites using HTML, CSS, JavaScript, and modern frameworks like React.js.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-background hover:scale-105 lg:hover:bg-muted lg:border-2 text-secondary py-4 lg:py-2 lg:p-4 shadow-lg border-t-2 border-b-2 border-primary hover:border hover:border-primary transition text-center"
              >
                <h3 className="font-bold text-secondary text-lg">
                  {item.year}
                </h3>
                <h2 className="text-primary text-xl font-bold">{item.title}</h2>
                <p className="mt-3 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skill Circles */}
        <motion.div
          className="container mx-auto lg:px-30 grid md:grid-cols-2 lg:grid-cols-4 gap-10 px-6 lg:py-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
        >
          {[
            { label: "PROGRAMMING LANGUAGE", value: "80%" },
            { label: "WEB DEVELOPMENT", value: "75%" },
            { label: "MOBILE DEVELOPMENT", value: "60%" },
            { label: "DATABASE MANAGEMENT", value: "70%" },
          ].map((skill, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-secondary"
            >
              <div className="rounded-full hover:scale-102 h-32 w-32 border-4 border-primary flex items-center justify-center text-3xl font-bold">
                {skill.value}
              </div>
              <h3 className="mt-4 text-xl">{skill.label}</h3>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
