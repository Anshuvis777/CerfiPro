import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Award, ExternalLink, Edit, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI, certificateAPI, certificateRequestAPI } from '../../services/api';
import EditProfileModal, { ProfileData } from '../../components/EditProfileModal';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';
import RequestCertificateModal, { RequestData } from '../../components/RequestCertificateModal';
import CertificateDetailsModal from '../../components/CertificateDetailsModal';

interface Certificate {
    id: string;
    name: string;
    issuer: string;
    issuerLogo?: string;
    issuedDate: string;
    verificationUrl?: string;
    skills: string[];
    verificationId?: string;
    qrCode?: string;
    description?: string;
    expiryDate?: string;
}

interface UserProfile {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar?: string;
    bio?: string;
    location?: string;
    organization?: string;
    experience?: string;
    skills?: string[];
    certificates?: Certificate[];
    createdAt?: string;
    profileVisibility?: 'PUBLIC' | 'PRIVATE' | 'CONNECTIONS_ONLY';
}

interface IndividualProfilePageProps {
    profileUser: UserProfile;
    onProfileUpdate: () => void;
}

const IndividualProfilePage: React.FC<IndividualProfilePageProps> = ({ profileUser, onProfileUpdate }) => {
    const { user: currentUser } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const user = {
        username: profileUser.username,
        name: profileUser.username,
        avatar: profileUser.avatar || `https://ui-avatars.com/api/?name=${profileUser.username}&background=3b82f6&color=fff&size=200`,
        bio: profileUser.bio || 'No bio available',
        location: profileUser.location || 'Location not specified',
        joinedDate: profileUser.createdAt
            ? new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'Recently',
        skills: profileUser.skills || [],
        organization: profileUser.organization,
        experience: profileUser.experience,
        role: profileUser.role,
    };

    const isOwnProfile = currentUser?.username === profileUser.username;

    // Fetch certificates and requests from API
    useEffect(() => {
        const fetchData = async () => {
            if (!isOwnProfile) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const [certsResponse, requestsResponse] = await Promise.all([
                    certificateAPI.getMyCertificates(),
                    certificateRequestAPI.getMyRequests()
                ]);
                setCertificates(certsResponse.data.data);
                setRequests(requestsResponse.data.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOwnProfile]);

    const handleRequestCertificate = async (data: RequestData) => {
        try {
            await certificateRequestAPI.createRequest(data);
            // Refresh requests
            const response = await certificateRequestAPI.getMyRequests();
            setRequests(response.data.data);
        } catch (error) {
            console.error('Failed to create request:', error);
            throw error;
        }
    };

    const handleProfileUpdate = async (data: ProfileData) => {
        try {
            await profileAPI.updateProfile(data);
            onProfileUpdate();
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    };

    const handleProfilePictureUpload = async (file: File) => {
        try {
            await profileAPI.uploadProfilePicture(file);
            onProfileUpdate();
        } catch (error) {
            console.error('Failed to upload profile picture:', error);
            throw error;
        }
    };

    const handleProfilePictureDelete = async () => {
        try {
            await profileAPI.deleteProfilePicture();
            onProfileUpdate();
        } catch (error) {
            console.error('Failed to delete profile picture:', error);
            throw error;
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8"
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        {isOwnProfile ? (
                            <ProfilePictureUpload
                                currentAvatar={user.avatar}
                                onUpload={handleProfilePictureUpload}
                                onDelete={handleProfilePictureDelete}
                                username={user.username}
                            />
                        ) : (
                            <div className="relative">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-32 h-32 rounded-full border-4 border-blue-600 dark:border-blue-400 object-cover"
                                />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                            </div>
                        )}

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {user.name}
                                </h1>
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium uppercase tracking-wider">
                                    {user.role}
                                </span>
                            </div>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">@{user.username}</p>

                            <p className="text-slate-700 dark:text-slate-300 mb-4 max-w-2xl">
                                {user.bio}
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {user.location}
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Joined {user.joinedDate}
                                </div>
                            </div>

                            {isOwnProfile && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => setIsRequestModalOpen(true)}
                                        className="mt-4 md:mt-0 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Request Certificate
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Skills Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8"
                >
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {user.skills.length > 0 ? (
                            user.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400">No skills added yet</p>
                        )}
                    </div>
                </motion.div>

                {/* My Certificate Requests Section */}
                {isOwnProfile && requests.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                            <Clock className="w-6 h-6 mr-2 text-purple-500" />
                            My Certificate Requests ({requests.length})
                        </h2>
                        <div className="space-y-4">
                            {requests.map((req: any) => (
                                <div
                                    key={req.id}
                                    className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700/50"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                                    Request to @{req.issuerUsername}
                                                </h3>
                                                {req.status === 'PENDING' && (
                                                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        Pending
                                                    </span>
                                                )}
                                                {req.status === 'APPROVED' && (
                                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs font-medium flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Approved
                                                    </span>
                                                )}
                                                {req.status === 'REJECTED' && (
                                                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-xs font-medium flex items-center gap-1">
                                                        <XCircle className="w-3 h-3" />
                                                        Rejected
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                {req.requestMessage}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {req.skills.map((skill: string) => (
                                                    <span
                                                        key={skill}
                                                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded text-xs font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                            {req.rejectionReason && (
                                                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                                    Reason: {req.rejectionReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Requested on {new Date(req.requestedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Certificates Earned Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
                >
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                        <Award className="w-6 h-6 mr-2 text-yellow-500" />
                        Certificates Earned ({certificates.length})
                    </h2>

                    {certificates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {certificates.map((cert, index) => (
                                <motion.div
                                    key={cert.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="border border-slate-200 dark:border-slate-600 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={cert.issuerLogo}
                                                alt={cert.issuer}
                                                className="w-10 h-10 rounded-lg"
                                            />
                                            <div>
                                                <h3
                                                    className="font-semibold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    onClick={() => {
                                                        setSelectedCertificate(cert);
                                                        setIsDetailsModalOpen(true);
                                                    }}
                                                >
                                                    {cert.name}
                                                </h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {cert.issuer}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedCertificate(cert);
                                                setIsDetailsModalOpen(true);
                                            }}
                                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                        Issued on {new Date(cert.issuedDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {cert.skills.map(skill => (
                                            <span
                                                key={skill}
                                                className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                            No certificates earned yet
                        </p>
                    )}
                </motion.div>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleProfileUpdate}
                currentData={{
                    bio: user.bio,
                    location: user.location,
                    organization: user.organization,
                    experience: user.experience,
                    skills: user.skills,
                    profileVisibility: profileUser?.profileVisibility
                }}
            />

            {/* Request Certificate Modal */}
            <RequestCertificateModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                onRequest={handleRequestCertificate}
            />

            {/* Certificate Details Modal */}
            <CertificateDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedCertificate(null);
                }}
                certificate={selectedCertificate}
            />
        </div>
    );
};

export default IndividualProfilePage;
