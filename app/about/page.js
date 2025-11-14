/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Users, Award, Target, Zap, Globe, Heart, Code, Lightbulb, TrendingUp, CheckCircle } from 'lucide-react';
import Footer from '@/components/Footer';
import GoogleAd from '@/components/adcomponet';
export default function About() {
  const achievements = [
    { number: "10+", label: "Active Users", icon: Users },
    { number: "99.9%", label: "Uptime", icon: TrendingUp },
    { number: "50+", label: "Countries Served", icon: Globe },
    { number: "24/7", label: "Support", icon: Heart }
  ];

  const values = [
    {
      icon: Code,
      title: "Innovation First",
      description: "We embrace cutting-edge technologies to deliver solutions that push the boundaries of what's possible in digital communication."
    },
    {
      icon: Users,
      title: "User-Centric Design",
      description: "Every feature we build is designed with our users in mind, ensuring intuitive and delightful experiences across all touchpoints."
    },
    {
      icon: Zap,
      title: "Performance Excellence",
      description: "We obsess over performance, delivering lightning-fast, reliable solutions that scale with your needs."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Breaking language barriers and connecting people worldwide through intelligent, inclusive technology solutions."
    }
  ];

  const milestones = [
    { year: "June 2025", title: "Company Founded", desc: "Started with a vision to revolutionize video communication" },
    { year: "July 2025", title: "First Major Release", desc: "Launched our advanced video calling platform with AI integration" },
    { year: "August 2025", title: "10K Users Milestone", desc: "Reached 10,000+ active users across 50+ countries" },
    { year: "September 2025", title: "AI Translation Launch", desc: "Introduced real-time multi-language translation feature" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative z-10 mx-auto text-center max-w-7xl">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
            <Lightbulb className="w-4 h-4 mr-2" />
            Innovating Communication Technology
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-transparent md:text-7xl bg-gradient-to-r from-blue-700 via-purple-600 to-blue-800 bg-clip-text">
            About Our Vision
          </h1>
          <p className="max-w-4xl mx-auto text-xl leading-relaxed text-gray-700 md:text-2xl">
            We are a passionate team of innovators dedicated to transforming how the world communicates. 
            Our advanced video calling platform breaks down language barriers and connects people 
            across cultures with cutting-edge AI technology.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-transform duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl group-hover:scale-110">
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <div className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">{achievement.number}</div>
                <div className="font-medium text-gray-600">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                <Target className="w-4 h-4 mr-2" />
                Our Mission
              </div>
              <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-800 md:text-5xl">
                Building the Future of 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Global Communication</span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-gray-700">
                We are passionate about creating technology that brings people together. Our team works 
                tirelessly day and night to make our platform more intuitive, more powerful, and more 
                accessible to everyone, everywhere.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="flex-shrink-0 w-6 h-6 mr-3 text-green-500" />
                  <span className="font-medium text-gray-700">Breaking language barriers with AI-powered translation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="flex-shrink-0 w-6 h-6 mr-3 text-green-500" />
                  <span className="font-medium text-gray-700">Delivering crystal-clear HD video and audio quality</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="flex-shrink-0 w-6 h-6 mr-3 text-green-500" />
                  <span className="font-medium text-gray-700">Ensuring enterprise-grade security and privacy</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative p-8 overflow-hidden text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl">
                <div className="absolute top-0 right-0 w-32 h-32 translate-x-16 -translate-y-16 rounded-full bg-white/10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 -translate-x-12 translate-y-12 rounded-full bg-white/10"></div>
                <div className="relative z-10">
                  <Award className="w-12 h-12 mb-6" />
                  <h3 className="mb-4 text-2xl font-bold">Award-Winning Platform</h3>
                  <p className="mb-6 text-blue-100">
                    Recognized for excellence in innovation, user experience, and technological advancement 
                    in the communication industry.
                  </p>
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                    <div className="mb-1 text-sm text-blue-100">Latest Achievement</div>
                    <div className="font-semibold">&quot;Best Innovation in Communication Technology 2025&quot;</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-4 py-20 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
              <Heart className="w-4 h-4 mr-2" />
              Our Core Values
            </div>
            <h2 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
              What Drives Us Forward
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Our values shape everything we do, from the code we write to the relationships we build with our users.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-2">
                <div className="flex items-center justify-center mb-6 bg-gradient-to-br from-blue-500 to-purple-500 w-14 h-14 rounded-xl">
                  <value.icon className="text-white w-7 h-7" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-800">{value.title}</h3>
                <p className="leading-relaxed text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-green-700 bg-green-100 rounded-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              Our Journey
            </div>
            <h2 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
              Milestones & Achievements
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Every step of our journey has been driven by innovation, dedication, and the desire to connect people worldwide.
            </p>
          </div>

          <div className="relative">
            <div className="absolute w-1 h-full transform -translate-x-1/2 left-1/2 bg-gradient-to-b from-blue-500 to-purple-500"></div>
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="p-6 transition-shadow duration-300 bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-xl">
                    <div className="mb-2 text-2xl font-bold text-blue-600">{milestone.year}</div>
                    <h3 className="mb-3 text-xl font-bold text-gray-800">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.desc}</p>
                  </div>
                </div>
                <div className="absolute w-4 h-4 transform -translate-x-1/2 bg-white border-4 border-blue-500 rounded-full left-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Overview */}
      <section className="px-4 py-20 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto text-center max-w-7xl">
          <Users className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Meet Our Passionate Team
          </h2>
          <p className="max-w-3xl mx-auto mb-12 text-xl leading-relaxed text-blue-100">
            We are a diverse group of developers, designers, and visionaries who are passionate about 
            technology and committed to working hard every day to make our platform better than yesterday. 
            Our dedication drives us to continuously innovate and exceed expectations.
          </p>
        </div>
      </section>

      {/* Development Team Section */}
      <section className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
              <Code className="w-4 h-4 mr-2" />
              Development Team
            </div>
            <h2 className="mb-6 text-4xl font-bold text-gray-800">Building Robust Solutions</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Our development team consists of full-stack engineers who craft scalable, secure, and high-performance applications.
            </p>
          </div>

          <div className="grid items-center gap-12 mb-16 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-2xl font-bold text-gray-800">Technical Expertise</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                  <div className="w-3 h-3 mr-4 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-gray-800">Frontend Development</div>
                    <div className="text-gray-600">React.js, Next.js, TypeScript, Tailwind CSS</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-green-50 rounded-xl">
                  <div className="w-3 h-3 mr-4 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-gray-800">Backend Development</div>
                    <div className="text-gray-600">Node.js, Python, WebRTC, Socket.io, MongoDB</div>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                  <div className="w-3 h-3 mr-4 bg-purple-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-gray-800">Cloud & DevOps (Building phase)</div>
                    <div className="text-gray-600">AWS, Docker, Kubernetes, CI/CD Pipelines</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 text-white bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
                <Code className="w-12 h-12 mb-4 opacity-90" />
                <div className="mb-2 text-2xl font-bold">1+</div>
                <div className="text-blue-100">Senior Developers</div>
              </div>
              <div className="p-6 text-white bg-gradient-to-br from-green-500 to-green-600 rounded-2xl">
                <CheckCircle className="w-12 h-12 mb-4 opacity-90" />
                <div className="mb-2 text-2xl font-bold">100+</div>
                <div className="text-green-100">Hours Coded</div>
              </div>
              <div className="p-6 text-white bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl">
                <Zap className="w-12 h-12 mb-4 opacity-90" />
                <div className="mb-2 text-2xl font-bold">20+</div>
                <div className="text-purple-100">Features Built</div>
              </div>
              <div className="p-6 text-white bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl">
                <TrendingUp className="w-12 h-12 mb-4 opacity-90" />
                <div className="mb-2 text-2xl font-bold">24/7</div>
                <div className="text-orange-100">Code Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Team Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
              <Lightbulb className="w-4 h-4 mr-2" />
              Design Team
            </div>
            <h2 className="mb-6 text-4xl font-bold text-gray-800">Crafting Beautiful Experiences</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Our design team creates intuitive, accessible, and visually stunning interfaces that users love to interact with.
            </p>
          </div>

          <div className="grid items-center gap-12 mb-16 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 gap-6">
                <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">UI/UX Design</h4>
                      <p className="text-sm text-gray-600">User-centered design approach</p>
                    </div>
                  </div>
                  <p className="text-gray-600">Creating wireframes, prototypes, and high-fidelity designs that prioritize user experience and accessibility.</p>
                </div>
                
                <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Visual Identity</h4>
                      <p className="text-sm text-gray-600">Brand consistency across platforms</p>
                    </div>
                  </div>
                  <p className="text-gray-600">Developing cohesive visual languages, color schemes, and typography that reflect our brand values.</p>
                </div>

                <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">User Research</h4>
                      <p className="text-sm text-gray-600">Data-driven design decisions</p>
                    </div>
                  </div>
                  <p className="text-gray-600">Conducting user interviews, usability testing, and analyzing behavior patterns to improve our products.</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="mb-6 text-2xl font-bold text-gray-800">Design Philosophy</h3>
              <p className="mb-8 leading-relaxed text-gray-600">
                Our design team believes that great design is invisible - it should feel natural and effortless. 
                We focus on creating interfaces that are not just beautiful, but functional and accessible to everyone.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="flex-shrink-0 w-6 h-6 mr-3 text-green-500" />
                  <span className="text-gray-700">User-first design methodology</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="flex-shrink-0 w-6 h-6 mr-3 text-green-500" />
                  <span className="text-gray-700">Accessibility and inclusive design</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="flex-shrink-0 w-6 h-6 mr-3 text-green-500" />
                  <span className="text-gray-700">Iterative design and continuous improvement</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="flex-shrink-0 w-6 h-6 mr-3 text-green-500" />
                  <span className="text-gray-700">Cross-platform design consistency</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Team Section */}
      <section className="px-4 py-20 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-orange-700 rounded-full bg-gradient-to-r from-orange-100 to-red-100">
              <Zap className="w-4 h-4 mr-2" />
              Innovation Team
            </div>
            <h2 className="mb-6 text-4xl font-bold text-gray-800">Pushing Technology Boundaries</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Our innovation team specializes in AI, machine learning, and cutting-edge technologies that power the future of communication.
            </p>
          </div>

          <div className="grid gap-8 mb-16 lg:grid-cols-3">
            <div className="p-8 border border-orange-100 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl">
              <div className="flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-800">AI & Machine Learning</h3>
              <p className="mb-6 text-gray-600">
                Developing intelligent features like real-time language translation, face detection, and smart call routing.
              </p>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">• Natural Language Processing</div>
                <div className="text-sm font-medium text-gray-700">• Computer Vision</div>
                <div className="text-sm font-medium text-gray-700">• Deep Learning Models</div>
                <div className="text-sm font-medium text-gray-700">• Real-time AI Processing</div>
              </div>
            </div>

            <div className="p-8 border border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
              <div className="flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-800">WebRTC & Communications</h3>
              <p className="mb-6 text-gray-600">
                Optimizing peer-to-peer connections, reducing latency, and ensuring crystal-clear audio-video quality.
              </p>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">• P2P Connection Optimization</div>
                <div className="text-sm font-medium text-gray-700">• Adaptive Bitrate Streaming</div>
                <div className="text-sm font-medium text-gray-700">• Network Quality Enhancement</div>
                <div className="text-sm font-medium text-gray-700">• Multi-platform Compatibility</div>
              </div>
            </div>

            <div className="p-8 border border-green-100 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl">
              <div className="flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-800">Performance & Security</h3>
              <p className="mb-6 text-gray-600">
                Implementing advanced security protocols and optimizing system performance for seamless user experiences.
              </p>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">• End-to-End Encryption</div>
                <div className="text-sm font-medium text-gray-700">• System Performance Optimization</div>
                <div className="text-sm font-medium text-gray-700">• Scalability Engineering</div>
                <div className="text-sm font-medium text-gray-700">• Security Compliance</div>
              </div>
            </div>
          </div>

          <div className="p-8 text-white bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl lg:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-6 text-3xl font-bold">Innovation Pipeline</h3>
                <p className="mb-8 leading-relaxed text-blue-100">
                  Our innovation team is constantly researching and developing next-generation features. 
                  We&#39;re working on breakthrough technologies that will revolutionize how people communicate across languages and cultures.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <div className="mb-1 text-2xl font-bold">1+</div>
                    <div className="text-sm text-blue-100">AI Models Deployed</div>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <div className="mb-1 text-2xl font-bold">95%</div>
                    <div className="text-sm text-blue-100">Translation Accuracy</div>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <div className="mb-1 text-2xl font-bold">&lt;100ms</div>
                    <div className="text-sm text-blue-100">Processing Latency</div>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <div className="mb-1 text-2xl font-bold">24/7</div>
                    <div className="text-sm text-blue-100">R&D Operations</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="p-6 mb-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 mr-3 bg-green-400 rounded-full"></div>
                    <span className="font-semibold">Currently Developing</span>
                  </div>
                  <div className="text-blue-100">Advanced emotion recognition in video calls</div>
                </div>
                <div className="p-6 mb-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 mr-3 bg-yellow-400 rounded-full"></div>
                    <span className="font-semibold">In Testing Phase</span>
                  </div>
                  <div className="text-blue-100">Real-time background noise cancellation</div>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 mr-3 bg-blue-400 rounded-full"></div>
                    <span className="font-semibold">Research Phase</span>
                  </div>
                  <div className="text-blue-100">Holographic video calling technology</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
              <Users className="w-4 h-4 mr-2" />
              Leadership Team
            </div>
            <h2 className="mb-6 text-4xl font-bold text-gray-800">Meet Our Visionary Leaders</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              The passionate minds behind our innovation, driving our mission to revolutionize global communication.
            </p>
          </div>

          {/* Founders */}
          <div className="grid gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
            {/* Founder */}
            <div className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-2">
              <div className="relative">
                <img 
                  src="/images\ank.jpg" 
                  alt="Founder"
                  className="object-cover w-full h-64"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                    Founder & CEO
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-800">Ankit kumar kero</h3>
                <p className="mb-4 text-gray-600">Visionary leader with 1+ years in tech innovation</p>
                <p className="mb-4 text-sm text-gray-500">
                  &quot;Our mission is to break down communication barriers and connect the world through technology.&quot;
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
                  IIT PATNA • Ex-Nhi hai
                </div>
              </div>
            </div>

            {/* Co-Founder */}
            <div className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-2">
              <div className="relative">
                <img 
                  src="\images\arvind..jpg" 
                  alt="Co-Founder"
                  className="object-cover w-full h-64"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-sm font-medium text-white rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                    Co-Founder & CTO
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-800">Arvind Jatavath</h3>
                <p className="mb-4 text-gray-600">AI & Machine Learning specialist driving innovation</p>
                <p className="mb-4 text-sm text-gray-500">
                  &quot; We&#39;re building the future of AI-powered communication, one breakthrough at a time.&quot;
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
                  MIT • Ex-Microsoft Research
                </div>
              </div>
            </div>

            {/* Head of Product */}
            {/* <div className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-2">
              <div className="relative">
                <img 
                  src="/images\ank.jpg" 
                  alt="Head of Product"
                  className="object-cover w-full h-64"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-sm font-medium text-white rounded-full bg-gradient-to-r from-green-500 to-teal-500">
                    Head of Product
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-800">Michael Chen</h3>
                <p className="mb-4 text-gray-600">Product strategy and user experience expert</p>
                <p className="mb-4 text-sm text-gray-500">
                  "Every feature we build is designed to make communication more human and meaningful."
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
                  UC Berkeley • Ex-Slack
                </div>
              </div>
            </div> */}
          </div>

          {/* Key Team Members */}
          <div className="p-8 bg-white shadow-lg rounded-3xl lg:p-12">
            <h3 className="mb-8 text-3xl font-bold text-center text-gray-800">Key Team Members</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              
              {/* Senior Developer */}
              <div className="text-center group">
                <div className="relative mb-4">
                  <img 
                    src="/images\ank.jpg" 
                    alt="Senior Developer"
                    className="object-cover w-24 h-24 mx-auto transition-colors border-4 border-blue-100 rounded-full group-hover:border-blue-300"
                  />
                  <div className="absolute flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full -bottom-2 -right-2">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h4 className="font-bold text-gray-800">Alex Rodriguez</h4>
                <p className="mb-2 text-sm text-gray-600">Senior Full-Stack Developer</p>
                <p className="text-xs text-gray-500">React • Node.js • WebRTC</p>
              </div>

              {/* UI/UX Designer */}
              <div className="text-center group">
                <div className="relative mb-4">
                  <img 
                    src="/images\ank.jpg" 
                    alt="UI/UX Designer"
                    className="object-cover w-24 h-24 mx-auto transition-colors border-4 border-purple-100 rounded-full group-hover:border-purple-300"
                  />
                  <div className="absolute flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full -bottom-2 -right-2">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h4 className="font-bold text-gray-800">Emma Wilson</h4>
                <p className="mb-2 text-sm text-gray-600">Lead UI/UX Designer</p>
                <p className="text-xs text-gray-500">Figma • Design Systems • UX Research</p>
              </div>

              {/* AI Engineer */}
              <div className="text-center group">
                <div className="relative mb-4">
                  <img 
                    src="/images\ank.jpg" 
                    alt="AI Engineer"
                    className="object-cover w-24 h-24 mx-auto transition-colors border-4 border-green-100 rounded-full group-hover:border-green-300"
                  />
                  <div className="absolute flex items-center justify-center w-8 h-8 bg-green-500 rounded-full -bottom-2 -right-2">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h4 className="font-bold text-gray-800">David Kim</h4>
                <p className="mb-2 text-sm text-gray-600">AI/ML Engineer</p>
                <p className="text-xs text-gray-500">Python • TensorFlow • NLP</p>
              </div>

              {/* DevOps Engineer */}
              <div className="text-center group">
                <div className="relative mb-4">
                  <img 
                    src="/images\ank.jpg" 
                    alt="DevOps Engineer"
                    className="object-cover w-24 h-24 mx-auto transition-colors border-4 border-orange-100 rounded-full group-hover:border-orange-300"
                  />
                  <div className="absolute flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full -bottom-2 -right-2">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h4 className="font-bold text-gray-800">Lisa Zhang</h4>
                <p className="mb-2 text-sm text-gray-600">Senior DevOps Engineer</p>
                <p className="text-xs text-gray-500">AWS • Kubernetes • Docker</p>
              </div>

            </div>
          </div>
        </div>
      </section>
      <div><GoogleAd slot="1234567890" /></div>
      <Footer/>
    </div>
  );
}