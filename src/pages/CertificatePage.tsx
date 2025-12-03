import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Calendar, User, Building, Download, Share2, QrCode, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

const CertificatePage: React.FC = () => {
  const { certId } = useParams();
  const { showToast } = useToast();

  // Mock certificate data - in real app, fetch from API
  const certificate = {
    id: certId,
    name: 'Advanced React Development',
    description: 'This certificate validates comprehensive knowledge and practical skills in advanced React development, including hooks, context, performance optimization, and modern React patterns.',
    holder: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=100&h=100&fit=crop&crop=face'
    },
    issuer: {
      name: 'TechCorp Academy',
      logo: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?w=100&h=100&fit=crop&crop=center',
      website: 'https://techcorp.academy'
    },
    issuedDate: '2024-01-15',
    expiryDate: '2026-01-15',
    skills: ['React', 'Redux', 'TypeScript', 'Testing', 'Performance'],
    verificationHash: '0x1234567890abcdef1234567890abcdef12345678',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPgogIDxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNmZmYiLz4KICA8dGV4dCB4PSIxMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiI+UVIgQ29kZTwvdGV4dD4KPC9zdmc+'
  };

  const handleDownload = () => {
    showToast({
      type: 'success',
      message: 'Certificate download started!'
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast({
      type: 'success',
      message: 'Certificate link copied to clipboard!'
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Certificate Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Certificate of Achievement
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Verified digital certificate powered by blockchain technology
          </p>
        </motion.div>

        {/* Main Certificate Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8"
        >
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{certificate.name}</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">{certificate.description}</p>
          </div>

          {/* Certificate Body */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Certificate Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Holder Information */}
                <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <img
                    src={certificate.holder.avatar}
                    alt={certificate.holder.name}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {certificate.holder.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">Certificate Holder</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{certificate.holder.email}</p>
                  </div>
                </div>

                {/* Issuer Information */}
                <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <img
                    src={certificate.issuer.logo}
                    alt={certificate.issuer.name}
                    className="w-16 h-16 rounded-xl border-2 border-slate-200 dark:border-slate-600"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {certificate.issuer.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">Issuing Organization</p>
                    <a
                      href={certificate.issuer.website}
                      className="text-sm text-blue-600 hover:text-blue-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {certificate.issuer.website}
                    </a>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Issued Date</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {new Date(certificate.issuedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Valid Until</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {new Date(certificate.expiryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Certified Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {certificate.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - QR Code and Actions */}
              <div className="space-y-6">
                {/* QR Code */}
                <div className="text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <QrCode className="w-8 h-8 text-slate-600 dark:text-slate-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Verification QR Code
                  </h3>
                  <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-lg p-2">
                    <img
                      src={certificate.qrCode}
                      alt="QR Code"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Scan to verify authenticity
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={handleDownload}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Certificate
                  </Button>
                </div>

                {/* Verification Hash */}
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
                    Blockchain Hash
                  </h4>
                  <code className="text-xs text-slate-600 dark:text-slate-400 break-all font-mono">
                    {certificate.verificationHash}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Verification Status */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
            Certificate Verified
          </h3>
          <p className="text-green-700 dark:text-green-300">
            This certificate has been verified on the blockchain and is authentic.
            Certificate ID: <span className="font-mono">{certificate.id}</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificatePage;