import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, FileText, Calendar, CheckCircle } from 'lucide-react';

interface ApproveCertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApprove: (data: ApprovalData) => Promise<void>;
    request: CertificateRequest | null;
}

export interface CertificateRequest {
    id: string;
    requesterUsername: string;
    requesterEmail: string;
    requestMessage: string;
    skills: string[];
}

export interface ApprovalData {
    certificateName: string;
    description: string;
    issuedDate: string;
    expiryDate?: string;
}

const ApproveCertificateModal: React.FC<ApproveCertificateModalProps> = ({
    isOpen,
    onClose,
    onApprove,
    request
}) => {
    const [formData, setFormData] = useState<ApprovalData>({
        certificateName: '',
        description: '',
        issuedDate: new Date().toISOString().split('T')[0],
        expiryDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setIsSubmitting(true);
            await onApprove(formData);
            // Reset form
            setFormData({
                certificateName: '',
                description: '',
                issuedDate: new Date().toISOString().split('T')[0],
                expiryDate: ''
            });
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to approve request');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !request) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Approve Certificate Request
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Request Details */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Request Details</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-slate-500 dark:text-slate-400">From: </span>
                                <span className="font-medium text-slate-900 dark:text-white">@{request.requesterUsername}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 dark:text-slate-400">Email: </span>
                                <span className="font-medium text-slate-900 dark:text-white">{request.requesterEmail}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 dark:text-slate-400">Message: </span>
                                <p className="text-slate-700 dark:text-slate-300 mt-1">{request.requestMessage}</p>
                            </div>
                            <div>
                                <span className="text-slate-500 dark:text-slate-400">Skills: </span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {request.skills.map(skill => (
                                        <span key={skill} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded text-xs font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                                {error}
                            </div>
                        )}

                        {/* Certificate Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <Award className="w-4 h-4" />
                                Certificate Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.certificateName}
                                onChange={(e) => setFormData({ ...formData, certificateName: e.target.value })}
                                placeholder="e.g., Advanced React Development"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <FileText className="w-4 h-4" />
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe what this certificate represents..."
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all resize-none text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    Issue Date *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.issuedDate}
                                    onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    Expiry Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    min={formData.issuedDate}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Approving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Approve & Issue Certificate
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ApproveCertificateModal;
