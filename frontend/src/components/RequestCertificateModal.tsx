import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, User, MessageSquare, Tag } from 'lucide-react';

interface RequestCertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRequest: (data: RequestData) => Promise<void>;
}

export interface RequestData {
    issuerUsername: string;
    requestMessage: string;
    skills: string[];
}

const RequestCertificateModal: React.FC<RequestCertificateModalProps> = ({ isOpen, onClose, onRequest }) => {
    const [formData, setFormData] = useState<RequestData>({
        issuerUsername: '',
        requestMessage: '',
        skills: []
    });
    const [skillInput, setSkillInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.skills.length === 0) {
            setError('Please add at least one skill');
            return;
        }

        try {
            setIsSubmitting(true);
            await onRequest(formData);
            // Reset form
            setFormData({
                issuerUsername: '',
                requestMessage: '',
                skills: []
            });
            setSkillInput('');
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addSkill = () => {
        const trimmedSkill = skillInput.trim();
        if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
            setFormData({
                ...formData,
                skills: [...formData.skills, trimmedSkill]
            });
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    if (!isOpen) return null;

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
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Request Certificate
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                                {error}
                            </div>
                        )}

                        {/* Issuer Username */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <User className="w-4 h-4" />
                                Issuer Username *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.issuerUsername}
                                onChange={(e) => setFormData({ ...formData, issuerUsername: e.target.value })}
                                placeholder="Enter the username of the issuer"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                The organization or person who will issue your certificate
                            </p>
                        </div>

                        {/* Request Message */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <MessageSquare className="w-4 h-4" />
                                Request Message *
                            </label>
                            <textarea
                                required
                                value={formData.requestMessage}
                                onChange={(e) => setFormData({ ...formData, requestMessage: e.target.value })}
                                placeholder="Explain why you're requesting this certificate and what you've accomplished..."
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all resize-none text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <Tag className="w-4 h-4" />
                                Skills to be Certified *
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Add a skill and press Enter"
                                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium flex items-center gap-2"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="hover:text-purple-600 dark:hover:text-purple-400"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            {formData.skills.length === 0 && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                    No skills added yet. Add at least one skill.
                                </p>
                            )}
                        </div>

                        {/* Payment Notice */}
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-yellow-900 dark:text-yellow-200">Payment Required</p>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                        A fee is required to submit this certificate request
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">₹10</div>
                                    <div className="text-xs text-yellow-700 dark:text-yellow-300">Request Fee</div>
                                </div>
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
                                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending Request...
                                    </>
                                ) : (
                                    <>
                                        <Award className="w-5 h-5" />
                                        Send Request
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

export default RequestCertificateModal;
