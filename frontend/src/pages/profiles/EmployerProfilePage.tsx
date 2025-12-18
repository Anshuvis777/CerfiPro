import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Building2, Users, CheckCircle, Briefcase, TrendingUp, Edit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI, employerAPI } from '../../services/api';
import EditProfileModal, { ProfileData } from '../../components/EditProfileModal';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';

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

interface EmployerProfilePageProps {
    profileUser: UserProfile;
    onProfileUpdate: () => void;
}

interface EmployerStats {
    employeesVerified: number;
    activeJobs: number;
    candidatesReviewed: number;
    hiringRate: number;
}

interface JobPosting {
    id: string;
    title: string;
    status: string;
    department: string;
    postedDate: string;
    applicants: number;
}

const EmployerProfilePage: React.FC<EmployerProfilePageProps> = ({ profileUser, onProfileUpdate }) => {
    const { user: currentUser } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [stats, setStats] = useState<EmployerStats>({
        employeesVerified: 0,
        activeJobs: 0,
        candidatesReviewed: 0,
        hiringRate: 0
    });
    const [loading, setLoading] = useState(true);

    const user = {
        username: profileUser.username,
        companyName: profileUser.organization || profileUser.username,
        avatar: profileUser.avatar || `https://ui-avatars.com/api/?name=${profileUser.username}&background=10b981&color=fff&size=200`,
        bio: profileUser.bio || 'No company description available',
        location: profileUser.location || 'Location not specified',
        establishedDate: profileUser.createdAt
            ? new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'Recently',
        role: profileUser.role,
    };

    const isOwnProfile = currentUser?.username === profileUser.username;

    // Fetch employer stats from API
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await employerAPI.getEmployerStats(profileUser.username);
                setStats(response.data.data);
            } catch (error) {
                console.error('Failed to fetch employer stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [profileUser.username]);

    // Mock job postings (will be replaced when backend endpoint is ready)
    const jobPostings: JobPosting[] = [];

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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Employer Header */}
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
                                    alt={user.companyName}
                                    className="w-32 h-32 rounded-full border-4 border-green-600 dark:border-green-400 object-cover"
                                />
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-600 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        )}

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {user.companyName}
                                </h1>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium uppercase tracking-wider">
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
                                    className="mt-4 md:mt-0 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
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
                        <Users className="w-8 h-8 mb-2 opacity-80" />
                        <div className="text-3xl font-bold mb-1">{stats.employeesVerified}</div>
                        <div className="text-blue-100 text-sm">Employees Verified</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
                    >
                        <Briefcase className="w-8 h-8 mb-2 opacity-80" />
                        <div className="text-3xl font-bold mb-1">{stats.activeJobs}</div>
                        <div className="text-green-100 text-sm">Active Job Postings</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
                    >
                        <CheckCircle className="w-8 h-8 mb-2 opacity-80" />
                        <div className="text-3xl font-bold mb-1">{stats.candidatesReviewed}</div>
                        <div className="text-purple-100 text-sm">Candidates Reviewed</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white"
                    >
                        <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
                        <div className="text-3xl font-bold mb-1">{stats.hiringRate}%</div>
                        <div className="text-orange-100 text-sm">Hiring Success Rate</div>
                    </motion.div>
                </div>

                {/* Active Job Postings Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                            <Briefcase className="w-6 h-6 mr-2 text-green-500" />
                            Active Job Postings ({jobPostings.length})
                        </h2>
                        {isOwnProfile && (
                            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
                                Post New Job
                            </button>
                        )}
                    </div>

                    {jobPostings.length > 0 ? (
                        <div className="space-y-4">
                            {jobPostings.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="border border-slate-200 dark:border-slate-600 rounded-lg p-6 hover:shadow-md transition-all duration-300 bg-slate-50 dark:bg-slate-700/50"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                    {job.title}
                                                </h3>
                                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs font-medium">
                                                    {job.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                                {job.department} Department
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    Posted {new Date(job.postedDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    {job.applicants} applicants
                                                </div>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 rounded-lg transition-colors text-sm">
                                            View Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                            No active job postings
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
                    organization: user.companyName,
                    experience: profileUser.experience,
                    skills: profileUser.skills,
                    profileVisibility: profileUser?.profileVisibility
                }}
            />
        </div>
    );
};

export default EmployerProfilePage;
