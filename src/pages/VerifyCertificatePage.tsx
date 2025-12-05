import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Calendar, Shield, Download, Share2, QrCode, CheckCircle, XCircle, Loader } from 'lucide-react';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { certificateAPI } from '../services/api';

interface CertificateData {
    id: string;
    name: string;
    description: string;
    holderName: string;
    holderUsername: string;
    issuerName: string;
    issuerOrganization: string;
    issuedDate: string;
    expiryDate: string;
    skills: string[];
    blockchainHash: string;
    qrCode: string;
    verificationId: string;
    status: string;
}

const VerifyCertificatePage: React.FC = () => {
    const { verificationId } = useParams<{ verificationId: string }>();
    const { showToast } = useToast();
    const [certificate, setCertificate] = useState<CertificateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyCertificate = async () => {
            if (!verificationId) return;

            try {
                setLoading(true);
                const response = await certificateAPI.verifyCertificate(verificationId);
                setCertificate(response.data.data);
            } catch (err: any) {
                console.error('Verification failed:', err);
                setError(err.response?.data?.message || 'Invalid certificate ID or certificate not found');
            } finally {
                setLoading(false);
            }
        };

        verifyCertificate();
    }, [verificationId]);

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
            message: 'Verification link copied to clipboard!'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-12 h-12 text-purple-600 animate-spin" />
            </div>
        );
    }

    if (error || !certificate) {
        return (
            <div className="min-h-screen py-12 px-4 flex items-center justify-center">
                <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-red-100 dark:border-red-900/30">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Verification Failed
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {error || 'The certificate you are trying to verify does not exist or has been revoked.'}
                    </p>
                    <Link to="/">
                        <Button className="w-full">Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Verification Status Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center mb-8"
                >
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                        Certificate Verified Successfully
                    </h1>
                    <p className="text-green-700 dark:text-green-300">
                        This certificate is valid and authentic.
                    </p>
                    <div className="mt-2 font-mono text-sm text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900/40 inline-block px-3 py-1 rounded">
                        ID: {certificate.verificationId}
                    </div>
                </motion.div>

                {/* Main Certificate Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8"
                >
                    {/* Certificate Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-8 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <Award className="w-16 h-16 text-white/80 mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 font-serif tracking-wide">{certificate.name}</h2>
                        <p className="text-blue-100 max-w-2xl mx-auto text-lg">{certificate.description}</p>
                    </div>

                    {/* Certificate Body */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Certificate Details */}
                            <div className="lg:col-span-2 space-y-8">

                                <div className="space-y-6">
                                    <div className="border-b border-slate-100 dark:border-slate-700 pb-6">
                                        <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Presented To</p>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {certificate.holderName}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">@{certificate.holderUsername}</p>
                                    </div>

                                    <div className="border-b border-slate-100 dark:border-slate-700 pb-6">
                                        <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Issued By</p>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {certificate.issuerOrganization || certificate.issuerName}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">@{certificate.issuerName}</p>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Issued On</p>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {new Date(certificate.issuedDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {certificate.expiryDate && (
                                        <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Valid Until</p>
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {new Date(certificate.expiryDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Skills */}
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                        Verified Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {certificate.skills?.map(skill => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
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
                                <div className="text-center p-6 bg-white dark:bg-slate-700/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                                        Digital Verification
                                    </h3>
                                    <div className="w-40 h-40 mx-auto mb-4 bg-white p-2 rounded-lg shadow-sm">
                                        {certificate.qrCode ? (
                                            <img
                                                src={certificate.qrCode}
                                                alt="QR Code"
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <QrCode className="w-full h-full text-slate-300" />
                                        )}
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
                                        Share Link
                                    </Button>
                                </div>

                                {/* Verification Hash */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">
                                        Blockchain Hash
                                    </h4>
                                    <code className="text-[10px] text-slate-600 dark:text-slate-400 break-all font-mono leading-relaxed block">
                                        {certificate.blockchainHash}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyCertificatePage;
