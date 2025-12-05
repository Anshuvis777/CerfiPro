import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Award, Building2, CheckCircle, TrendingUp, FileText, Edit, Clock, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI, issuerAPI, certificateAPI, certificateRequestAPI } from '../../services/api';
import EditProfileModal, { ProfileData } from '../../components/EditProfileModal';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';
import IssueCertificateModal, { CertificateData } from '../../components/IssueCertificateModal';
import ApproveCertificateModal, { CertificateRequest as CertReq, ApprovalData } from '../../components/ApproveCertificateModal';
import CertificateDetailsModal from '../../components/CertificateDetailsModal';

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
    certificates?: any[];
    createdAt?: string;
    profileVisibility?: 'PUBLIC' | 'PRIVATE' | 'CONNECTIONS_ONLY';
}

interface IssuerProfilePageProps {
    profileUser: UserProfile;
    onProfileUpdate: () => void;
}

interface IssuerStats {
    totalIssued: number;
    activeTemplates: number;
    monthlyIssue: number;
    verificationRate: number;
}

const IssuerProfilePage: React.FC<IssuerProfilePageProps> = ({ profileUser, onProfileUpdate }) => {
    const { user: currentUser } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
    const [selectedRequest, setSelectedRequest] = useState<CertReq | null>(null);
    const [stats, setStats] = useState<IssuerStats>({
        totalIssued: 0,
        activeTemplates: 0,
        monthlyIssue: 0,
        verificationRate: 0
    });
    const [certificatesIssued, setCertificatesIssued] = useState<any[]>([]);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const user = {
        username: profileUser.username,
        organizationName: profileUser.organization || profileUser.username,
        avatar: profileUser.avatar || `https://ui-avatars.com/api/?name=${profileUser.username}&background=6366f1&color=fff&size=200`,
        bio: profileUser.bio || 'No description available',
        location: profileUser.location || 'Location not specified',
        establishedDate: profileUser.createdAt
            ? new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'Recently',
        role: profileUser.role,
    };

    const isOwnProfile = currentUser?.username === profileUser.username;

    // Fetch issuer stats, issued certificates, and pending requests from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const promises = [
                    issuerAPI.getIssuerStats(profileUser.username),
                    isOwnProfile ? certificateAPI.getIssuedCertificates() : Promise.resolve({ data: { data: [] } }),
                    isOwnProfile ? certificateRequestAPI.getPendingRequests() : Promise.resolve({ data: { data: [] } })
                ];
                const [statsResponse, certificatesResponse, requestsResponse] = await Promise.all(promises);
                setStats(statsResponse.data.data);
                setCertificatesIssued(certificatesResponse.data.data);
                setPendingRequests(requestsResponse.data.data);
            } catch (error) {
                console.error('Failed to fetch issuer data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [profileUser.username, isOwnProfile]);

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

    const handleIssueCertificate = async (data: CertificateData) => {
        try {
            await certificateAPI.issueCertificate(data);
            // Refresh stats and certificates list
            const [statsResponse, certificatesResponse] = await Promise.all([
                issuerAPI.getIssuerStats(profileUser.username),
                certificateAPI.getIssuedCertificates()
            ]);
            setStats(statsResponse.data.data);
            setCertificatesIssued(certificatesResponse.data.data);
        } catch (error) {
            console.error('Failed to issue certificate:', error);
            throw error;
        }
    };

    const handleApproveRequest = async (data: ApprovalData) => {
        if (!selectedRequest) return;

        try {
            await certificateRequestAPI.approveRequest(selectedRequest.id, data);
            // Refresh everything
            const [statsResponse, certificatesResponse, requestsResponse] = await Promise.all([
                issuerAPI.getIssuerStats(profileUser.username),
                certificateAPI.getIssuedCertificates(),
                certificateRequestAPI.getPendingRequests()
            ]);
            setStats(statsResponse.data.data);
            setCertificatesIssued(certificatesResponse.data.data);
            setPendingRequests(requestsResponse.data.data);
            setSelectedRequest(null);
        } catch (error) {
            console.error('Failed to approve request:', error);
            throw error;
        }
    };

    const handleRejectRequest = async (requestId: string, reason: string) => {
        try {
            await certificateRequestAPI.rejectRequest(requestId, { rejectionReason: reason });
            // Refresh pending requests
            const response = await certificateRequestAPI.getPendingRequests();
            setPendingRequests(response.data.data);
        } catch (error) {
            console.error('Failed to reject request:', error);
            throw error;
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Issuer Header */}
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
                                    alt={user.organizationName}
                                    className="w-32 h-32 rounded-full border-4 border-indigo-600 dark:border-indigo-400 object-cover"
                                />
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        )}

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {user.organizationName}
                                </h1>
                                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium uppercase tracking-wider">
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
                                    Established {user.establishedDate}
                                </div>
                            </div>

                            {isOwnProfile && (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
                    >
                        <FileText className="w-8 h-8 mb-2 opacity-80" />
                        <div className="text-3xl font-bold mb-1">{stats.totalIssued}</div>
                        <div className="text-blue-100 text-sm">Certificates Issued</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
                    >
                        <Award className="w-8 h-8 mb-2 opacity-80" />
                        <div className="text-3xl font-bold mb-1">{stats.activeTemplates}</div>
                        <div className="text-purple-100 text-sm">Active Templates</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
                    >
                        <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
                        <div className="text-3xl font-bold mb-1">{stats.monthlyIssue}</div>
                        <div className="text-green-100 text-sm">This Month</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white"
                    >
                        <CheckCircle className="w-8 h-8 mb-2 opacity-80" />
                        <div className="text-3xl font-bold mb-1">{stats.verificationRate}%</div>
                        <div className="text-orange-100 text-sm">Verification Rate</div>
                    </motion.div>
                </div>

                {/* Pending Certificate Requests Section */}
                {isOwnProfile && pendingRequests.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                            <Clock className="w-6 h-6 mr-2 text-yellow-500" />
                            Pending Certificate Requests ({pendingRequests.length})
                        </h2>
                        <div className="space-y-4">
                            {pendingRequests.map((req: any) => (
                                <div
                                    key={req.id}
                                    className="border border-slate-200 dark:border-slate-600 rounded-lg p-6 bg-slate-50 dark:bg-slate-700/50"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                                                    From: @{req.requesterUsername}
                                                </h3>
                                                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium">
                                                    PENDING
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                                Email: {req.requesterEmail}
                                            </p>
                                            <p className="text-slate-700 dark:text-slate-300 mb-3">
                                                {req.requestMessage}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {req.skills.map((skill: string) => (
                                                    <span
                                                        key={skill}
                                                        className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded text-xs font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Requested on {new Date(req.requestedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedRequest({
                                                    id: req.id,
                                                    requesterUsername: req.requesterUsername,
                                                    requesterEmail: req.requesterEmail,
                                                    requestMessage: req.requestMessage,
                                                    skills: req.skills
                                                });
                                                setIsApproveModalOpen(true);
                                            }}
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={async () => {
                                                const reason = prompt('Enter rejection reason:');
                                                if (reason) {
                                                    await handleRejectRequest(req.id, reason);
                                                }
                                            }}
                                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Certificates Issued Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                            <Building2 className="w-6 h-6 mr-2 text-indigo-500" />
                            Certificates Issued ({certificatesIssued.length})
                        </h2>
                        {isOwnProfile && (
                            <button
                                onClick={() => setIsIssueModalOpen(true)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
                            >
                                Issue New Certificate
                            </button>
                        )}
                    </div>

                    {certificatesIssued.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {certificatesIssued.map((cert, index) => (
                                <motion.div
                                    key={cert.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="border border-slate-200 dark:border-slate-600 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                            onClick={() => {
                                                setSelectedCertificate(cert);
                                                setIsDetailsModalOpen(true);
                                            }}
                                        >
                                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                                {cert.name}
                                            </h3>
                                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                <Award className="w-4 h-4 mr-1" />
                                                {cert.recipientsCount || 0} recipients
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                        Created {new Date(cert.issuedDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {cert.skills.map((skill: string) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded text-xs font-medium"
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
                            No certificates issued yet
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
                    organization: user.organizationName,
                    experience: profileUser.experience,
                    skills: profileUser.skills,
                    profileVisibility: profileUser?.profileVisibility
                }}
            />

            {/* Issue Certificate Modal */}
            <IssueCertificateModal
                isOpen={isIssueModalOpen}
                onClose={() => setIsIssueModalOpen(false)}
                onIssue={handleIssueCertificate}
            />

            {/* Approve Certificate Request Modal */}
            <ApproveCertificateModal
                isOpen={isApproveModalOpen}
                onClose={() => {
                    setIsApproveModalOpen(false);
                    setSelectedRequest(null);
                }}
                onApprove={handleApproveRequest}
                request={selectedRequest}
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

export default IssuerProfilePage;
