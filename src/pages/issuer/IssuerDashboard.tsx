import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Award,
  Plus,
  Users,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Trash2
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { certificateService, Certificate } from '../../services/certificateService';

const schema = yup.object({
  recipientEmail: yup.string().email('Invalid email').required('Email is required'),
  certificateName: yup.string().required('Certificate name is required'),
  description: yup.string().optional(),
  skills: yup.string().required('Skills are required'),
  expiryDate: yup.string().optional(),
});

interface FormData {
  recipientEmail: string;
  certificateName: string;
  description?: string;
  skills: string;
  expiryDate?: string;
}

const IssuerDashboard: React.FC = () => {
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });

  const fetchCertificates = async () => {
    setIsFetching(true);
    try {
      const data = await certificateService.getIssuedCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      showToast({
        type: 'error',
        message: 'Failed to load certificates',
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const stats = [
    {
      title: 'Total Certificates',
      value: certificates.length.toString(),
      change: '+0%', // Placeholder for now
      icon: Award,
      color: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Active Recipients',
      value: new Set(certificates.map(c => c.holderUsername)).size.toString(),
      change: '+0%',
      icon: Users,
      color: 'from-teal-600 to-cyan-600'
    },
    {
      title: 'This Month',
      value: certificates.filter(c => new Date(c.issuedDate).getMonth() === new Date().getMonth()).length.toString(),
      change: '+0%',
      icon: TrendingUp,
      color: 'from-green-600 to-emerald-600'
    },
    {
      title: 'Pending Reviews',
      value: certificates.filter(c => c.status === 'PENDING').length.toString(),
      change: '0%',
      icon: Calendar,
      color: 'from-orange-600 to-red-600'
    }
  ];

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await certificateService.issueCertificate({
        name: data.certificateName,
        description: data.description || '',
        recipientEmail: data.recipientEmail,
        issuedDate: new Date().toISOString().split('T')[0],
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : undefined,
        skills: data.skills.split(',').map(s => s.trim()),
      });

      showToast({
        type: 'success',
        message: 'Certificate issued successfully!'
      });

      reset();
      setIsIssueModalOpen(false);
      fetchCertificates(); // Refresh list
    } catch (error: any) {
      console.error('Issue error:', error);
      showToast({
        type: 'error',
        message: error.message || 'Failed to issue certificate',
      });
    } finally {
      setIsLoading(false);
    }
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
              Issuer Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage and issue certificates to your students
            </p>
          </div>
          <Button
            onClick={() => setIsIssueModalOpen(true)}
            className="mt-4 md:mt-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Issue Certificate
          </Button>
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
                {/* <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-white/20' : 'bg-red-500/20'
                }`}>
                  {stat.change}
                </span> */}
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.title}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Certificates */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 md:mb-0">
              Recent Certificates
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

          <div className="overflow-x-auto">
            {isFetching ? (
              <div className="text-center py-8 text-slate-500">Loading certificates...</div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No available data</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-600">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Certificate</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Recipient</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Skills</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{cert.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">ID: {cert.id.substring(0, 8)}...</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{cert.holderName || cert.holderUsername}</div>
                          {/* <div className="text-sm text-slate-500 dark:text-slate-400">{cert.email}</div> */}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {cert.skills.map(skill => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                        {new Date(cert.issuedDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${cert.status === 'ACTIVE'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                          }`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400">
                            <Download className="w-4 h-4" />
                          </button>
                          {/* <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400">
                          <Edit className="w-4 h-4" />
                        </button> */}
                          <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Issue Certificate Modal */}
        {isIssueModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Issue New Certificate
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Recipient Name
                  </label>
                  <input
                    {...register('recipientName')}
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="Enter recipient name"
                  />
                  {errors.recipientName && (
                    <p className="mt-1 text-sm text-red-600">{errors.recipientName.message}</p>
                  )}
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Recipient Email
                  </label>
                  <input
                    {...register('recipientEmail')}
                    type="email"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="Enter recipient email"
                  />
                  {errors.recipientEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.recipientEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Certificate Name
                  </label>
                  <input
                    {...register('certificateName')}
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="Enter certificate name"
                  />
                  {errors.certificateName && (
                    <p className="mt-1 text-sm text-red-600">{errors.certificateName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <input
                    {...register('description')}
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="Enter description (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    {...register('skills')}
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="React, TypeScript, Node.js"
                  />
                  {errors.skills && (
                    <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    {...register('expiryDate')}
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsIssueModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="flex-1"
                  >
                    Issue Certificate
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuerDashboard;