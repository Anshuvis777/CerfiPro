import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Award, 
  Eye, 
  TrendingUp,
  Bell,
  Search,
  Filter,
  Download,
  Share2,
  Plus,
  Edit,
  Settings,
  MapPin,
  Calendar,
  Star,
  ExternalLink
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';

const IndividualDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { showToast } = useToast();

  const stats = [
    {
      title: 'Total Certificates',
      value: '12',
      change: '+2 this month',
      icon: Award,
      color: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Profile Views',
      value: '1,247',
      change: '+18% this week',
      icon: Eye,
      color: 'from-teal-600 to-cyan-600'
    },
    {
      title: 'Skill Endorsements',
      value: '34',
      change: '+5 new',
      icon: Star,
      color: 'from-green-600 to-emerald-600'
    },
    {
      title: 'Profile Score',
      value: '85%',
      change: '+12% improved',
      icon: TrendingUp,
      color: 'from-orange-600 to-red-600'
    }
  ];

  const certificates = [
    {
      id: '1',
      name: 'Advanced React Development',
      issuer: 'TechCorp Academy',
      issuerLogo: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?w=50&h=50&fit=crop&crop=center',
      issuedDate: '2024-01-15',
      expiryDate: '2026-01-15',
      status: 'Active',
      skills: ['React', 'TypeScript', 'Redux'],
      views: 45
    },
    {
      id: '2',
      name: 'Node.js Backend Mastery',
      issuer: 'Code Institute',
      issuerLogo: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?w=50&h=50&fit=crop&crop=center',
      issuedDate: '2024-02-20',
      expiryDate: '2026-02-20',
      status: 'Active',
      skills: ['Node.js', 'Express', 'MongoDB'],
      views: 32
    },
    {
      id: '3',
      name: 'AWS Cloud Architect',
      issuer: 'Amazon Web Services',
      issuerLogo: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?w=50&h=50&fit=crop&crop=center',
      issuedDate: '2024-03-10',
      expiryDate: '2025-03-10',
      status: 'Expiring Soon',
      skills: ['AWS', 'Cloud Computing', 'DevOps'],
      views: 67
    }
  ];

  const notifications = [
    {
      id: '1',
      type: 'certificate',
      title: 'New Certificate Issued',
      message: 'You received a new certificate from TechCorp Academy',
      time: '2 hours ago',
      unread: true
    },
    {
      id: '2',
      type: 'endorsement',
      title: 'Skill Endorsed',
      message: 'John Smith endorsed your React skills',
      time: '1 day ago',
      unread: true
    },
    {
      id: '3',
      type: 'expiry',
      title: 'Certificate Expiring',
      message: 'Your AWS Cloud Architect certificate expires in 30 days',
      time: '3 days ago',
      unread: false
    }
  ];

  const handleCertificateAction = (action: string, certId: string) => {
    showToast({
      type: 'success',
      message: `Certificate ${action} successfully!`
    });
  };

  const handleRequestCertificate = () => {
    showToast({
      type: 'info',
      message: 'Certificate request feature coming soon!'
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your skills, certificates, and professional profile
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button onClick={handleRequestCertificate}>
              <Plus className="w-4 h-4 mr-2" />
              Request Certificate
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-gradient-to-r ${stat.color} rounded-xl p-6 text-white`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.title}</div>
              <div className="text-xs opacity-75 mt-1">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
        >
          {/* Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex space-x-8 px-8 pt-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'certificates'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                My Certificates
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Notifications
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">2</span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Profile Completion */}
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Profile Completion
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Overall Progress</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">85%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                          Profile photo added
                        </div>
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                          Skills listed
                        </div>
                        <div className="flex items-center text-orange-600 dark:text-orange-400">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                          Add work experience
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Certificate earned
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Skill endorsed
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 md:mb-0">
                    My Certificates ({certificates.length})
                  </h2>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search certificates..."
                        className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((cert, index) => (
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
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                              {cert.name}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {cert.issuer}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cert.status === 'Active'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
                        }`}>
                          {cert.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          Issued: {new Date(cert.issuedDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <Eye className="w-3 h-3 mr-1" />
                          {cert.views} views
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {cert.skills.map(skill => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => handleCertificateAction('shared', cert.id)}
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Share
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => handleCertificateAction('downloaded', cert.id)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Notifications
                </h2>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.unread
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            notification.type === 'certificate'
                              ? 'bg-blue-100 dark:bg-blue-900/30'
                              : notification.type === 'endorsement'
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-orange-100 dark:bg-orange-900/30'
                          }`}>
                            {notification.type === 'certificate' && <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            {notification.type === 'endorsement' && <Star className="w-4 h-4 text-green-600 dark:text-green-400" />}
                            {notification.type === 'expiry' && <Bell className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900 dark:text-white">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IndividualDashboard;