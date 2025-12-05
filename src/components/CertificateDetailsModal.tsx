import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, ExternalLink, QrCode, CheckCircle, Calendar, Shield, Award } from 'lucide-react';
import Button from './ui/Button';
import { useToast } from './ui/Toast';

export interface CertificateDetails {
    id: string;
    name: string;
    description?: string;
    issuer: string;
    issuerLogo?: string;
    holder?: string;
    issuedDate: string;
    expiryDate?: string;
    skills: string[];
    verificationId?: string;
    qrCode?: string;
    verificationUrl?: string;
    blockchainHash?: string;
}

interface CertificateDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    certificate: CertificateDetails | null;
}

const CertificateDetailsModal: React.FC<CertificateDetailsModalProps> = ({
    isOpen,
    onClose,
    certificate,
}) => {
    const { showToast } = useToast();

    if (!certificate) return null;

    const handleCopyId = () => {
        if (certificate.verificationId) {
            navigator.clipboard.writeText(certificate.verificationId);
            showToast({
                type: 'success',
                message: 'Certificate ID copied to clipboard!',
            });
        }
    };

    const verificationLink = certificate.verificationId
        ? `${window.location.origin}/verify/${certificate.verificationId}`
        : '#';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                Certificate Details
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left Column: Details */}
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                            {certificate.name}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                            Issued by <span className="font-semibold text-slate-900 dark:text-white">{certificate.issuer}</span>
                                        </p>
                                    </div>

                                    {certificate.description && (
                                        <p className="text-slate-700 dark:text-slate-300">
                                            {certificate.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs mb-1">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                Issued Date
                                            </div>
                                            <div className="font-medium text-slate-900 dark:text-white">
                                                {new Date(certificate.issuedDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {certificate.expiryDate && (
                                            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                                <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs mb-1">
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    Expiry Date
                                                </div>
                                                <div className="font-medium text-slate-900 dark:text-white">
                                                    {new Date(certificate.expiryDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {certificate.skills.map(skill => (
                                                <span
                                                    key={skill}
                                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Verification */}
                                <div className="w-full md:w-64 flex flex-col gap-6">
                                    {/* QR Code */}
                                    <div className="bg-white p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 text-center">
                                        {certificate.qrCode ? (
                                            <img
                                                src={certificate.qrCode}
                                                alt="QR Code"
                                                className="w-full aspect-square object-contain mb-2"
                                            />
                                        ) : (
                                            <div className="w-full aspect-square bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-2 rounded-lg">
                                                <QrCode className="w-12 h-12 text-slate-400" />
                                            </div>
                                        )}
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Scan to verify
                                        </p>
                                    </div>

                                    {/* Verification ID */}
                                    {certificate.verificationId && (
                                        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                                Verification ID
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <code className="flex-1 font-mono text-lg font-bold text-slate-900 dark:text-white tracking-wider">
                                                    {certificate.verificationId}
                                                </code>
                                                <button
                                                    onClick={handleCopyId}
                                                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                                                    title="Copy ID"
                                                >
                                                    <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <a
                                        href={verificationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full"
                                    >
                                        <Button variant="outline" className="w-full">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Open Verification Page
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CertificateDetailsModal;
