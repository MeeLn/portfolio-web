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

export default function ProjectsSection() {
  return (
    <div id="projects">
      <section className="bg-background overflow-hidden">
        {/* Header */}
        <motion.div
          className="container mx-auto px-6 lg:px-30 pt-20 flex lg:flex-row justify-between md:flex-col md:items-start flex-col items-start"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="text-secondary md:w-1/2 flex-col gap-2 flex items-start">
            <h1 className="text-xl font-sans font-bold text-primary">WORKS</h1>
            <h2 className="text-primary text-5xl">
              <span className="text-secondary">LATEST WORKING </span> PROJECTS
            </h2>
          </div>

          <div className="text-secondary md:w-1/2 flex-col gap-2 flex items-end">
            <p className="mt-6 mb-6 text-xl font-mono border-l-2 border-primary pl-4 text-justify">
              My latest project works that I have done during my college time
              for experience.
            </p>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="container mx-auto grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 lg:p-6 lg:px-30 pb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
        >
          {[
            {
              title: "DASHLEAPSTER – 2D Game",
              tech: "Using C++ and SDL2 Library",
              img1: "/projects/project_1.png",
              img2: "/projects/project_1-2.png",
            },
            {
              title: "ATTENDANDEASE – Mobile App",
              tech: "Using Android Studio and JAVA",
              img1: "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxLzI3OS1wYWkxNTc5LW5hbS1qb2IxNTI5LnBuZw.png",
              img2: "/projects/image.png",
            },
            {
              title: "COLLEGE LMS",
              tech: "Using Next.js, Django & PostgreSQL",
              img1: "/projects/project_2.png",
              img2: "/projects/project_2-2.png",
            },
          ].map((project, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              transition={{
                duration: 0.6,
                delay: 0.2 + 0.15 * index,
                ease: "easeOut",
              }}
              className="group bg-background hover:scale-105 hover:bg-muted border-2 border-background text-secondary p-4 shadow-lg hover:border hover:border-primary transition"
            >
              <img
                src={project.img1}
                className="shadow-lg mx-auto lg:aspect-square w-full mb-4 group-hover:hidden transition-opacity duration-300"
              />

              <img
                src={project.img2}
                className="shadow-lg mx-auto lg:aspect-square w-full mb-4 hidden group-hover:block transition-opacity duration-300"
              />

              <h3 className="text-xl font-mono font-bold text-primary text-center">
                {project.title}
              </h3>
              <p className="text-md font-mono text-secondary text-center">
                {project.tech}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
