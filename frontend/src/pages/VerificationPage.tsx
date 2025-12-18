import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Search, Shield, QrCode, Scan, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { certificateAPI } from '../services/api';

const schema = yup.object({
  verificationId: yup.string().required('Verification ID is required'),
});

type FormData = yup.InferType<typeof schema>;

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      // Check if certificate exists and is valid
      await certificateAPI.verifyCertificate(data.verificationId);

      // Navigate to the verification result page
      navigate(`/verify/${data.verificationId}`);

    } catch (error: any) {
      console.error('Verification error:', error);
      showToast({
        type: 'error',
        message: 'Certificate not found or invalid ID'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = () => {
    // Mock QR scan functionality for now, but could be real later
    showToast({
      type: 'info',
      message: 'QR scanning not implemented yet.'
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Verify Certificate
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Enter a certificate ID or scan a QR code to verify its authenticity
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Certificate ID
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    {...register('verificationId')}
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500"
                    placeholder="Enter certificate ID"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleQRScan}
                  className="px-4"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Scan QR
                </Button>
              </div>
              {errors.verificationId && (
                <p className="mt-1 text-sm text-red-600">{errors.verificationId.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              <Scan className="w-5 h-5 mr-2" />
              Verify Certificate
            </Button>
          </form>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Enter Certificate ID</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Input the unique certificate identifier or scan the QR code
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Blockchain Verification</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Our system checks the certificate against the blockchain
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Instant Results</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Get immediate verification results with detailed information
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerificationPage;