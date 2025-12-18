import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Award, 
  AlertTriangle, 
  Activity,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  Eye,
  Trash2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { showToast } = useToast();

  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Active Certificates',
      value: '15,234',
      change: '+8%',
      icon: Award,
      color: 'from-teal-600 to-cyan-600'
    },
    {
      title: 'Pending Reviews',
      value: '23',
      change: '-15%',
      icon: AlertTriangle,
      color: 'from-orange-600 to-red-600'
    },
    {
      title: 'System Health',
      value: '99.9%',
      change: '+0.1%',
      icon: Activity,
      color: 'from-green-600 to-emerald-600'
    }
  ];

  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      certificates: 5,
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'issuer',
      status: 'active',
      joinDate: '2024-01-10',
      certificates: 23,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'user',
      status: 'suspended',
      joinDate: '2024-01-05',
      certificates: 2,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=50&h=50&fit=crop&crop=face'
    }
  ];

  const certificates = [
    {
      id: 'cert-001',
      name: 'Advanced React Development',
      holder: 'John Doe',
      issuer: 'TechCorp Academy',
      status: 'active',
      issuedDate: '2024-01-15',
      verifications: 45
    },
    {
      id: 'cert-002',
      name: 'Node.js Backend Mastery',
      holder: 'Jane Smith',
      issuer: 'Code Institute',
      status: 'active',
      issuedDate: '2024-01-14',
      verifications: 32
    },
    {
      id: 'cert-003',
      name: 'Full Stack Development',
      holder: 'Mike Johnson',
      issuer: 'Dev Academy',
      status: 'revoked',
      issuedDate: '2024-01-13',
      verifications: 12
    }
  ];

  const handleUserAction = (action: string, userId: string) => {
    showToast({
      type: 'success',
      message: `User ${action} successfully!`
    });
  };

  const handleCertificateAction = (action: string, certId: string) => {
    showToast({
      type: 'success',
      message: `Certificate ${action} successfully!`
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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Panel
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage users, certificates, and system settings
          </p>
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
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-white/20' : 'bg-red-500/20'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.title}</div>
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
                onClick={() => setActiveTab('users')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'certificates'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Certificates
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Activity Logs
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'certificates' && 'Certificate Management'}
                {activeTab === 'activity' && 'Activity Logs'}
              </h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-600">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Certificates</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Join Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                              : user.role === 'issuer'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                              : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                          {user.certificates}
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUserAction('viewed', user.id)}
                              className="p-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserAction(user.status === 'active' ? 'suspended' : 'activated', user.id)}
                              className="p-1 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400"
                            >
                              {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleUserAction('deleted', user.id)}
                              className="p-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-600">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Certificate</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Holder</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Issuer</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Verifications</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((cert) => (
                      <tr key={cert.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{cert.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">ID: {cert.id}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                          {cert.holder}
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                          {cert.issuer}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cert.status === 'active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                          }`}>
                            {cert.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                          {cert.verifications}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCertificateAction('viewed', cert.id)}
                              className="p-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCertificateAction(cert.status === 'active' ? 'revoked' : 'restored', cert.id)}
                              className="p-1 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCertificateAction('deleted', cert.id)}
                              className="p-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Activity Logs Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Activity Logs
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Activity logging feature coming soon. This will show user actions, certificate issuance, and system events.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;