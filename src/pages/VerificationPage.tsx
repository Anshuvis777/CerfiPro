import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Search, Shield, CheckCircle, XCircle, QrCode, Scan } from 'lucide-react';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { certificateService, Certificate } from '../services/certificateService';

const schema = yup.object({
  certificateId: yup.string().required('Certificate ID is required'),
});

type FormData = yup.InferType<typeof schema>;

interface VerificationResult {
  isValid: boolean;
  certificate?: Certificate;
  error?: string;
}

const VerificationPage: React.FC = () => {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
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
    setVerificationResult(null);

    try {
      const certificate = await certificateService.getCertificateById(data.certificateId);

      setVerificationResult({
        isValid: certificate.status === 'ACTIVE',
        certificate: certificate,
        error: certificate.status !== 'ACTIVE' ? `Certificate is ${certificate.status}` : undefined
      });

      if (certificate.status === 'ACTIVE') {
        showToast({
          type: 'success',
          message: 'Certificate verified successfully!'
        });
      } else {
        showToast({
          type: 'warning',
          message: `Certificate is ${certificate.status}`
        });
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationResult({
        isValid: false,
        error: 'Certificate not found or invalid'
      });
      showToast({
        type: 'error',
        message: 'Certificate verification failed'
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
                    {...register('certificateId')}
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
              {errors.certificateId && (
                <p className="mt-1 text-sm text-red-600">{errors.certificateId.message}</p>
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

        {/* Verification Result */}
        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`rounded-2xl shadow-lg border p-8 ${verificationResult.isValid
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
          >
            <div className="flex items-center mb-6">
              {verificationResult.isValid ? (
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
              )}
              <div>
                <h2 className={`text-2xl font-bold ${verificationResult.isValid
                  ? 'text-green-900 dark:text-green-100'
                  : 'text-red-900 dark:text-red-100'
                  }`}>
                  {verificationResult.isValid ? 'Certificate Valid' : 'Certificate Invalid'}
                </h2>
                <p className={`${verificationResult.isValid
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
                  }`}>
                  {verificationResult.isValid
                    ? 'This certificate has been verified and is authentic'
                    : verificationResult.error
                  }
                </p>
              </div>
            </div>

            {verificationResult.isValid && verificationResult.certificate && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Certificate Details</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Name: </span>
                        <span className="text-slate-900 dark:text-white font-medium">
                          {verificationResult.certificate.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Holder: </span>
                        <span className="text-slate-900 dark:text-white font-medium">
                          {verificationResult.certificate.holderName || verificationResult.certificate.holderUsername}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Issuer: </span>
                        <span className="text-slate-900 dark:text-white font-medium">
                          {verificationResult.certificate.issuerName || verificationResult.certificate.issuerOrganization}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Issued: </span>
                        <span className="text-slate-900 dark:text-white font-medium">
                          {new Date(verificationResult.certificate.issuedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Skills Certified</h3>
                    <div className="flex flex-wrap gap-2">
                      {verificationResult.certificate.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-600 pt-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Blockchain Verification</h3>
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Transaction Hash:</p>
                    <code className="text-sm font-mono text-slate-900 dark:text-white break-all">
                      {verificationResult.certificate.blockchainHash || 'Pending Blockchain Confirmation'}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

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