"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Users,
  Globe,
  Shield,
  BarChart,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Us Section - Now at the TOP */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-6">
            About VoteNepal.net 🗳️
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Welcome to <strong>VoteNepal.net</strong>, a platform born from the
            passion and expertise of two dedicated Nepalese professionals who
            believe in the power of informed civic engagement.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          className="bg-white shadow-xl rounded-2xl p-8 mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto">
            At VoteNepal, our mission is to empower Nepalese- at home and
            abroad— with reliable information, thoughtful analysis, and
            meaningful tools to participate in the democratic process.
          </p>
        </motion.div>

        {/* Our Team Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-full h-16 flex items-center justify-center bg-[rgba(15,23,42,0.8)]">
            <h2 className="text-3xl font-bold text-slate-100">Our Team</h2>
          </div>

          {/* Khem Raj Neupane */}
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Image Placeholder */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400 flex items-center justify-center shadow-2xl">
                  <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center">
                    <Image
                      src="/assets/khem.jpeg" // Replace with actual image path
                      alt="Khem Raj Neupane"
                      width={160}
                      height={160}
                      className="w-40 h-40 rounded-full object-cover"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-5xl font-bold text-gray-800 mb-4">
                  Khem Raj Neupane
                </h3>
                <p className="text-gray-600 mb-4">
                  is a passionate <strong>full-stack </strong> web developer and
                  <strong> software engineer</strong> who brings modern web
                  technologies and a creative approach to our platform. He has
                  worked extensively with{" "}
                  <strong>
                    React.js, Next.js, TypeScript, Node.js, Express.js
                  </strong>
                  , as well as technologies like:{" "}
                  <strong>Python, AI, LLM, Agents, RAG, Langchain.</strong>{" "}
                </p>

                <h4 className="text-xl font-semibold text-gray-700 mb-4 mt-6">
                  Notable Projects:
                </h4>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      <a
                        href="https://www.ilkkapohjalainen.fi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Ilkkapohjalainen News
                      </a>
                      : Client project- <strong>lead-developer</strong> bringing
                      figma desing to lively, performant and user-friendly site,
                      using the technologies like: React.js, Node.js, and Malibu
                      framework. Integrated TuloSSO, Coral Comment, Chartbeat,
                      Voice intuitive etc., for enhanced user interaction.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      <a
                        href="https://deiplus.fi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Deiplus Media Platform
                      </a>
                      : Client project- lead frontend development task
                      translating design into pixel perfect, user-friendly,
                      performant site for a live radio and podcast web platform,
                      incrementally adding features like listening history, user
                      profiles, and media playback.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      <a
                        href="https://www.khemrajneupane.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Portfolio App
                      </a>
                      : Personal project- a web app to showcasing skills, tools,
                      and projects with a clean, responsive design, featuring
                      secure authentication via NextAuth CredentialsProvider and
                      GoogleProvider
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 w-5 h-5 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      <a
                        href="https://re-read-books.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        reRead
                      </a>
                      : Personal project- a full-featured used-book marketplace
                      with Admin Dashboard. Tech-stacks: Next.js, TypeScript,
                      TailwindCSS, Framer Motion, Lucide- react,
                      radix-ui/react-tooltip, Sonner, Redux, Zustand,
                      React-stripe-js, Payload CMS, NodeMailer, Stripe Webhook,
                      MondoDB, Cloudflare R2, Vercel.
                    </span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  At <strong>votenepal.net</strong>, Khem Raj is responsible for
                  the design, development and maintenance of our interactive
                  tools, data visualizations, and user-facing features. His
                  experience in building complex, user-centric fullstack web
                  platforms ensures that our content is both engaging,
                  accessible and secure.
                </p>
              </div>
            </div>
          </div>
          {/* Prashanta Paudel */}
          <div className="bg-white shadow-xl rounded-2xl p-8 mb-12">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Image Placeholder */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-2xl">
                  <div className="w-44 h-44 rounded-full bg-white flex items-center justify-center">
                    <Image
                      src="/assets/prashanta.jpeg" // Replace with actual image path
                      alt="Prashanta Paudel"
                      width={160}
                      height={160}
                      className="w-40 h-40 rounded-full object-cover"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-5xl font-bold text-gray-800 mb-4">
                  Prashanta Paudel
                </h3>
                <p className="text-gray-600 mb-4">
                  brings a strong technical foundation and a problem-solving
                  mindset to VoteNepal. By profession, he is a{" "}
                  <strong>Software Engineer</strong>, having worked as a Network
                  Engineer at Worldlink Communications and several IT and
                  Network Administration roles.
                </p>
                <p className="text-gray-600 mb-4">
                  He brings strong foundation of <strong>Cloud</strong> and{" "}
                  <strong>Network</strong> to the Team. Beyond his engineering
                  role, <strong>Prashanta</strong> is deeply interested in
                  <strong> cloud architecture, DevOps</strong>, and scalable
                  systems.
                </p>
                <p className="text-gray-600">
                  At <strong>votenepal.net</strong>, Prashanta leads the
                  technical vision, ensuring that our site is not only
                  user-friendly, but secure, reliable, and scalable. His
                  engineering rigor helps make our data-driven tools run
                  smoothly, enabling visitors to access election info, candidate
                  profiles, and interactive resources with confidence.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why VoteNepal Section */}
        <motion.div
          className="bg-white shadow-xl rounded-2xl p-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
            Why VoteNepal?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8 text-indigo-600" />,
                title: "Expertise meets technology",
                desc: "With Prashanta's engineering background and Khem Raj's software development skills, we combine deep technical knowledge with real-world usability.",
              },
              {
                icon: <Shield className="w-8 h-8 text-indigo-600" />,
                title: "Neutral and fact-based",
                desc: "Our goal is not to shape opinions, but to provide the tools and information that empower voters to make their own informed decisions.",
              },
              {
                icon: <Globe className="w-8 h-8 text-indigo-600" />,
                title: "Built for Nepalis",
                desc: "We understand the unique context of Nepalese democracy—its history, its challenges, and its promise.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 bg-indigo-50 rounded-xl hover:shadow-lg transition"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Original Voting Portal Content */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight drop-shadow-lg">
            Welcome to Nepal Voting Portal
          </h2>
          <p className="tagline text-xl md:text-2xl font-semibold mb-6 text-gray-900/80">
            Your Vote, Your Voice, Your Nepal
          </p>
          <p className="text-lg md:text-xl text-gray-900/80 mb-10">
            Vote for your favorite party and help shape the future of Nepal.
            Secure, transparent, and easy to use.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Link
              href="/vote"
              className="card p-8 rounded-2xl shadow-2xl animated-card bg-white hover:shadow-3xl transition"
            >
              <div className="flex items-center justify-center mb-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <Image
                    src="https://c.tenor.com/9Rt9JC45-54AAAAC/nepal-nepali.gif"
                    alt="Voting icon"
                    className="w-12 h-12"
                    width={50}
                    height={50}
                  />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-700">
                Cast Your Vote
              </h3>
              <p className="text-gray-600">
                Vote securely for your preferred party. Your vote is
                confidential and protected.
              </p>
            </Link>

            {/* Card 2 */}
            <div className="card p-8 rounded-2xl shadow-2xl animated-card bg-white hover:shadow-3xl transition">
              <div className="flex items-center justify-center mb-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400 flex items-center justify-center shadow-lg">
                  <Image
                    src="https://c.tenor.com/9Rt9JC45-54AAAAC/nepal-nepali.gif"
                    alt="Candidate registration icon"
                    className="w-12 h-12"
                    width={50}
                    height={50}
                  />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-orange-600">
                Transparent Process
              </h3>
              <p className="text-gray-600">
                Every vote is counted. See real-time results and analytics.
              </p>
            </div>

            {/* Card 3 */}
            <Link
              href="/results"
              className="card p-8 rounded-2xl shadow-2xl animated-card bg-white hover:shadow-3xl transition"
            >
              <div className="flex items-center justify-center mb-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center shadow-lg">
                  <Image
                    src="https://c.tenor.com/9Rt9JC45-54AAAAC/nepal-nepali.gif"
                    alt="Bar chart"
                    className="w-12 h-12"
                    width={50}
                    height={50}
                  />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-indigo-700">
                Live Results
              </h3>
              <p className="text-gray-600">
                Track the election results as votes are counted live.
              </p>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {[
            {
              icon: <Shield className="w-10 h-10 text-indigo-600" />,
              title: "Secure Voting",
              desc: "Each device can cast only one vote, preventing duplicates.",
            },
            {
              icon: <BarChart className="w-10 h-10 text-indigo-600" />,
              title: "Real-Time Results",
              desc: "Votes are counted instantly and displayed transparently.",
            },
            {
              icon: <Users className="w-10 h-10 text-indigo-600" />,
              title: "For All Elections",
              desc: "From student unions to local governments and organizations.",
            },
            {
              icon: <Globe className="w-10 h-10 text-indigo-600" />,
              title: "Accessible",
              desc: "Designed with simplicity for citizens of all backgrounds.",
            },
            {
              icon: <Clock className="w-10 h-10 text-indigo-600" />,
              title: "Live Monitoring",
              desc: "Committees and public can track results instantly.",
            },
            {
              icon: <CheckCircle className="w-10 h-10 text-indigo-600" />,
              title: "Transparent",
              desc: "Every vote is secure, visible, and trusted.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing */}
        <motion.div
          className="text-center bg-white shadow-xl rounded-2xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-indigo-700 mb-4">
            Towards Digital Democracy 🇳🇵
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto">
            This project is more than just a prototype. It is a step towards
            digital democracy in Nepal. Whether used for student unions,
            organizations, or local governments, it aims to build trust in fair
            elections and empower citizens.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
