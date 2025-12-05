import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProfileData) => Promise<void>;
    currentData: ProfileData;
}

export interface ProfileData {
    bio?: string;
    location?: string;
    organization?: string;
    experience?: string;
    skills?: string[];
    profileVisibility?: 'PUBLIC' | 'PRIVATE' | 'CONNECTIONS_ONLY';
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    onSave,
    currentData
}) => {
    const [formData, setFormData] = useState<ProfileData>(currentData);
    const [newSkill, setNewSkill] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFormData(currentData);
    }, [currentData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError(null);
            await onSave(formData);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
            setFormData({
                ...formData,
                skills: [...(formData.skills || []), newSkill.trim()]
            });
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills?.filter(skill => skill !== skillToRemove)
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Edit Profile
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    value={formData.bio || ''}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={4}
                                    maxLength={500}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
                                    {formData.bio?.length || 0}/500
                                </p>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location || ''}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    maxLength={100}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., San Francisco, CA"
                                />
                            </div>

                            {/* Organization */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Organization
                                </label>
                                <input
                                    type="text"
                                    value={formData.organization || ''}
                                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                    maxLength={100}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Google, Microsoft"
                                />
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Experience
                                </label>
                                <input
                                    type="text"
                                    value={formData.experience || ''}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    maxLength={100}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 5+ years in Software Development"
                                />
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Skills
                                </label>

                                {/* Add Skill Input */}
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add a skill..."
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add
                                    </button>
                                </div>

                                {/* Skills List */}
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills?.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium flex items-center gap-2"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Profile Visibility */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Profile Visibility
                                </label>
                                <select
                                    value={formData.profileVisibility || 'PUBLIC'}
                                    onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="PUBLIC">Public - Anyone can view</option>
                                    <option value="CONNECTIONS_ONLY">Connections Only</option>
                                    <option value="PRIVATE">Private - Only you</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditProfileModal;
