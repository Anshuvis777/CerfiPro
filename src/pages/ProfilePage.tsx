import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Github, Linkedin, Twitter, Award, ExternalLink } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { username } = useParams();
  
  // Mock user data - in real app, fetch from API
  const user = {
    username: 'johndoe',
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=200&h=200&fit=crop&crop=face',
    bio: 'Full-stack developer passionate about blockchain technology and creating innovative solutions. Always learning and building amazing things.',
    location: 'San Francisco, CA',
    joinedDate: 'January 2024',
    skills: ['JavaScript', 'React', 'Node.js', 'Blockchain', 'Python', 'AWS'],
    socialLinks: {
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe'
    },
    certificates: [
      {
        id: '1',
        name: 'Advanced React Development',
        issuer: 'TechCorp Academy',
        issuerLogo: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?w=50&h=50&fit=crop&crop=center',
        issuedDate: '2024-01-15',
        verificationUrl: '/cert/react-advanced-2024',
        skills: ['React', 'Redux', 'TypeScript']
      },
      {
        id: '2',
        name: 'Blockchain Fundamentals',
        issuer: 'Crypto Institute',
        issuerLogo: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?w=50&h=50&fit=crop&crop=center',
        issuedDate: '2024-02-20',
        verificationUrl: '/cert/blockchain-fundamentals-2024',
        skills: ['Blockchain', 'Smart Contracts', 'Web3']
      },
      {
        id: '3',
        name: 'AWS Cloud Architect',
        issuer: 'Amazon Web Services',
        issuerLogo: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?w=50&h=50&fit=crop&crop=center',
        issuedDate: '2024-03-10',
        verificationUrl: '/cert/aws-architect-2024',
        skills: ['AWS', 'Cloud Computing', 'DevOps']
      }
    ]
  };
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-blue-600 dark:border-blue-400"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {user.name}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">@{user.username}</p>
              
              <p className="text-slate-700 dark:text-slate-300 mb-4 max-w-2xl">
                {user.bio}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {user.joinedDate}
                </div>
              </div>
              
              <div className="flex justify-center md:justify-start space-x-4">
                <a
                  href={user.socialLinks.github}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={user.socialLinks.linkedin}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={user.socialLinks.twitter}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {user.skills.map((skill, index) => (
              <span
                key={skill}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
        
        {/* Certificates Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-500" />
            Certificates ({user.certificates.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-slate-200 dark:border-slate-600 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={cert.issuerLogo}
                      alt={cert.issuer}
                      className="w-10 h-10 rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {cert.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>
                  <a
                    href={cert.verificationUrl}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Issued on {new Date(cert.issuedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;