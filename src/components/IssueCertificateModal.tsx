import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, User, Calendar, FileText, Tag } from 'lucide-react';

interface IssueCertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onIssue: (data: CertificateData) => Promise<void>;
}

export interface CertificateData {
    name: string;
    description: string;
    recipientEmail: string;
    issuedDate: string;
    expiryDate?: string;
    skills: string[];
}

const IssueCertificateModal: React.FC<IssueCertificateModalProps> = ({ isOpen, onClose, onIssue }) => {
    const [formData, setFormData] = useState<CertificateData>({
        name: '',
        description: '',
        recipientEmail: '',
        issuedDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
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
            await onIssue(formData);
            // Reset form
            setFormData({
                name: '',
                description: '',
                recipientEmail: '',
                issuedDate: new Date().toISOString().split('T')[0],
                expiryDate: '',
                skills: []
            });
            setSkillInput('');
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to issue certificate');
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
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Issue New Certificate
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

                        {/* Certificate Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <FileText className="w-4 h-4" />
                                Certificate Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Advanced React Development"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
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
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all resize-none text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Recipient Email */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <User className="w-4 h-4" />
                                Recipient Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.recipientEmail}
                                onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                                placeholder="recipient@example.com"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
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
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
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
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <Tag className="w-4 h-4" />
                                Skills *
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Add a skill and press Enter"
                                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium flex items-center gap-2"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="hover:text-indigo-600 dark:hover:text-indigo-400"
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
                                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Issuing...
                                    </>
                                ) : (
                                    <>
                                        <Award className="w-5 h-5" />
                                        Issue Certificate
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

export default IssueCertificateModal;
