import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, Camera } from 'lucide-react';

interface ProfilePictureUploadProps {
    currentAvatar?: string;
    onUpload: (file: File) => Promise<void>;
    onDelete?: () => Promise<void>;
    username: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
    currentAvatar,
    onUpload,
    onDelete,
    username
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (file: File) => {
        setError(null);

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size exceeds 5MB limit.');
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setUploading(true);
            setError(null);
            await onUpload(selectedFile);
            setIsOpen(false);
            setPreview(null);
            setSelectedFile(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload profile picture');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;

        try {
            setUploading(true);
            setError(null);
            await onDelete();
            setIsOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete profile picture');
        } finally {
            setUploading(false);
        }
    };

    const defaultAvatar = `https://ui-avatars.com/api/?name=${username}&background=3b82f6&color=fff&size=200`;

    return (
        <>
            {/* Profile Picture with Edit Button */}
            <div className="relative group">
                <img
                    src={currentAvatar || defaultAvatar}
                    alt={username}
                    className="w-32 h-32 rounded-full border-4 border-blue-600 dark:border-blue-400 object-cover"
                />
                <button
                    onClick={() => setIsOpen(true)}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
                    title="Change profile picture"
                >
                    <Camera className="w-5 h-5" />
                </button>
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Profile Picture
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
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

                            {/* Preview or Upload Area */}
                            {preview || currentAvatar ? (
                                <div className="mb-6">
                                    <img
                                        src={preview || currentAvatar || defaultAvatar}
                                        alt="Preview"
                                        className="w-full h-64 object-cover rounded-xl"
                                    />
                                </div>
                            ) : (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-slate-300 dark:border-slate-600'
                                        }`}
                                >
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                                        Drag and drop your image here
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                                        or
                                    </p>
                                    <label className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                                        Browse Files
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handleFileInput}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
                                        JPEG, PNG, or WebP (max 5MB)
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {preview && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setPreview(null);
                                                setSelectedFile(null);
                                                setError(null);
                                            }}
                                            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpload}
                                            disabled={uploading}
                                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            {uploading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4" />
                                                    Upload
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}

                                {!preview && currentAvatar && onDelete && (
                                    <>
                                        <label className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors text-center">
                                            Change Picture
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={handleFileInput}
                                                className="hidden"
                                            />
                                        </label>
                                        <button
                                            onClick={handleDelete}
                                            disabled={uploading}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            {uploading ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProfilePictureUpload;
