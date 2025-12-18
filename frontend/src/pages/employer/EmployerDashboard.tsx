import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter,
  MapPin,
  Award,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Calendar,
  Star,
  Building,
  Mail,
  Phone,
  ExternalLink,
  Bookmark,
  CheckCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';

const EmployerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    skills: [],
    location: '',
    experience: '',
    availability: ''
  });
  const { user } = useAuth();
  const { showToast } = useToast();

  const stats = [
    {
      title: 'Candidates Viewed',
      value: '247',
      change: '+12 this week',
      icon: Eye,
      color: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Shortlisted',
      value: '18',
      change: '+3 new',
      icon: Heart,
      color: 'from-teal-600 to-cyan-600'
    },
    {
      title: 'Contacted',
      value: '12',
      change: '+5 this month',
      icon: MessageCircle,
      color: 'from-green-600 to-emerald-600'
    },
    {
      title: 'Verified Certs',
      value: '89',
      change: '100% authentic',
      icon: CheckCircle,
      color: 'from-orange-600 to-red-600'
    }
  ];

  const candidates = [
    {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=100&h=100&fit=crop&crop=face',
      title: 'Full Stack Developer',
      location: 'San Francisco, CA',
      experience: '5 years',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
      certificates: 8,
      profileViews: 1247,
      lastActive: '2 days ago',
      availability: 'Available',
      isShortlisted: false,
      verifiedSkills: 6
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      username: 'sarahj',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face',
      title: 'Frontend Developer',
      location: 'New York, NY',
      experience: '3 years',
      skills: ['React', 'Vue.js', 'JavaScript', 'CSS', 'Figma'],
      certificates: 5,
      profileViews: 892,
      lastActive: '1 day ago',
      availability: 'Open to offers',
      isShortlisted: true,
      verifiedSkills: 4
    },
    {
      id: '3',
      name: 'Mike Chen',
      username: 'mikechen',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=100&h=100&fit=crop&crop=face',
      title: 'DevOps Engineer',
      location: 'Seattle, WA',
      experience: '7 years',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Python'],
      certificates: 12,
      profileViews: 1456,
      lastActive: '5 hours ago',
      availability: 'Available',
      isShortlisted: false,
      verifiedSkills: 9
    }
  ];

  const trendingSkills = [
    { skill: 'React', demand: 95, growth: '+15%' },
    { skill: 'TypeScript', demand: 88, growth: '+22%' },
    { skill: 'AWS', demand: 82, growth: '+18%' },
    { skill: 'Node.js', demand: 79, growth: '+12%' },
    { skill: 'Python', demand: 76, growth: '+20%' }
  ];

  const handleShortlist = (candidateId: string) => {
    showToast({
      type: 'success',
      message: 'Candidate added to shortlist!'
    });
  };

  const handleContact = (candidateId: string) => {
    showToast({
      type: 'info',
      message: 'Contact feature coming soon!'
    });
  };

  const handleVerifyCertificate = () => {
    showToast({
      type: 'info',
      message: 'Redirecting to certificate verification...'
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
              Talent Discovery
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Find and connect with verified professionals
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleVerifyCertificate}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify Certificate
            </Button>
            <Button>
              <Users className="w-4 h-4 mr-2" />
              View Shortlist
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
                onClick={() => setActiveTab('search')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'search'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Search Candidates
              </button>
              <button
                onClick={() => setActiveTab('shortlist')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'shortlist'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Shortlisted
                <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full px-2 py-1">3</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Market Analytics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Search Tab */}
            {activeTab === 'search' && (
              <div>
                {/* Search and Filters */}
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search by name, skills, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Advanced Filters
                    </Button>
                  </div>
                  
                  {/* Quick Filters */}
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'Python', 'AWS', 'Remote', 'Full-time'].map((filter) => (
                      <button
                        key={filter}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Candidates List */}
                <div className="space-y-6">
                  {candidates.map((candidate, index) => (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border border-slate-200 dark:border-slate-600 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex items-start space-x-4 mb-4 md:mb-0">
                          <img
                            src={candidate.avatar}
                            alt={candidate.name}
                            className="w-16 h-16 rounded-full border-2 border-slate-200 dark:border-slate-600"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {candidate.name}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-1">
                              {candidate.title}
                            </p>
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 space-x-4">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {candidate.location}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {candidate.experience}
                              </div>
                              <div className="flex items-center">
                                <Award className="w-4 h-4 mr-1" />
                                {candidate.certificates} certificates
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            candidate.availability === 'Available'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                          }`}>
                            {candidate.availability}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShortlist(candidate.id)}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${candidate.isShortlisted ? 'fill-current text-red-500' : ''}`} />
                            {candidate.isShortlisted ? 'Shortlisted' : 'Shortlist'}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleContact(candidate.id)}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {candidate.skills.slice(0, 5).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 5 && (
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-sm">
                              +{candidate.skills.length - 5} more
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {candidate.profileViews} profile views
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                              {candidate.verifiedSkills} verified skills
                            </div>
                          </div>
                          <span>Last active: {candidate.lastActive}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Shortlist Tab */}
            {activeTab === 'shortlist' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Shortlisted Candidates
                </h2>
                <div className="text-center py-12">
                  <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Your Shortlist
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Candidates you've shortlisted will appear here. Start exploring to build your talent pipeline.
                  </p>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Market Analytics
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Trending Skills */}
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Trending Skills
                    </h3>
                    <div className="space-y-4">
                      {trendingSkills.map((item, index) => (
                        <div key={item.skill} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {index + 1}. {item.skill}
                            </span>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              {item.growth}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${item.demand}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 w-8">
                              {item.demand}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Market Insights */}
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Market Insights
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Remote work demand up 45%
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Compared to last quarter
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            5,247 new professionals joined
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            This month
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            12,456 certificates verified
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            100% authenticity rate
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployerDashboard;