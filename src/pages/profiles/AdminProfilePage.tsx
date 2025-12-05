import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Shield, Users, Award, Activity, TrendingUp, AlertCircle, Edit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { profileAPI, adminAPI } from '../../services/api';
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

interface AdminProfilePageProps {
    profileUser: UserProfile;
    onProfileUpdate: () => void;
}

interface SystemStats {
    totalUsers: number;
    totalCertificates: number;
    activeIssuers: number;
    monthlyGrowth: number;
}

interface UserRoleBreakdown {
    role: string;
    count: number;
    percentage: number;
    color?: string;
}

const AdminProfilePage: React.FC<AdminProfilePageProps> = ({ profileUser, onProfileUpdate }) => {
    const { user: currentUser } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [systemStats, setSystemStats] = useState<SystemStats>({
        totalUsers: 0,
        totalCertificates: 0,
        activeIssuers: 0,
        monthlyGrowth: 0
    });
    const [userBreakdown, setUserBreakdown] = useState<UserRoleBreakdown[]>([]);
    const [loading, setLoading] = useState(true);

    const user = {
        username: profileUser.username,
        name: profileUser.username,
        avatar: profileUser.avatar || `https://ui-avatars.com/api/?name=${profileUser.username}&background=ef4444&color=fff&size=200`,
        bio: profileUser.bio || 'System Administrator',
        location: profileUser.location || 'Location not specified',
        joinedDate: profileUser.createdAt
            ? new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'Recently',
        role: profileUser.role,
    };

    const isOwnProfile = currentUser?.username === profileUser.username;

    // Fetch admin stats from API
    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                setLoading(true);
                const response = await adminAPI.getAdminStats();
                const data = response.data.data;

                setSystemStats({
                    totalUsers: data.totalUsers,
                    totalCertificates: data.totalCertificates,
                    activeIssuers: data.activeIssuers,
                    monthlyGrowth: data.monthlyGrowth
                });

                // Map user breakdown with color coding
                const breakdownWithColors = data.userBreakdown.map((item: UserRoleBreakdown) => ({
                    ...item,
                    color: item.role === 'INDIVIDUAL' ? 'bg-blue-500' :
                        item.role === 'ISSUER' ? 'bg-indigo-500' :
                            item.role === 'EMPLOYER' ? 'bg-green-500' :
                                'bg-red-500'
                }));

                setUserBreakdown(breakdownWithColors);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminStats();
    }, []);

    // Mock recent activity (will be replaced when backend endpoint is ready)
    const recentActivity = [
        { id: '1', action: 'New user registration', user: 'john_doe', timestamp: '2024-12-05 09:15:00' },
        { id: '2', action: 'Certificate issued', issuer: 'TechCorp', timestamp: '2024-12-05 09:10:00' },
        { id: '3', action: 'Profile updated', user: 'jane_smith', timestamp: '2024-12-05 09:05:00' },
        { id: '4', action: 'Certificate verified', user: 'mike_jones', timestamp: '2024-12-05 09:00:00' }
    ];

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Admin Header */}
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
                                    className="w-32 h-32 rounded-full border-4 border-red-600 dark:border-red-400 object-cover"
                                />
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-600 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        )}

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {user.name}
                                </h1>
                                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm font-medium uppercase tracking-wider">
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
                                    Admin since {user.joinedDate}
                                </div>
                            </div>

                            {isOwnProfile && (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="mt-4 md:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* System Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
                    >
                        <Users className="w-8 h-8 mb-2 opacity-80" />
                        <div className="text-3xl font-bold mb-1">{systemStats.totalUsers.toLocaleString()}</div>
                        <div className="text-blue-100 text-sm">Total Users</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
                    >
                        <Award className="w-8 h-8 mb-2 opacity-80" />
                        <div className="text-3xl font-bold mb-1">{systemStats.totalCertificates.toLocaleString()}</div>
                        <div className="text-purple-100 text-sm">Certificates Issued</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
                    >
                        <Activity className="w-8 h-8 mb-2 opacity-80" />
                        <div className="text-3xl font-bold mb-1">{systemStats.activeIssuers}</div>
                        <div className="text-green-100 text-sm">Active Issuers</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white"
                    >
                        <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
                        <div className="text-3xl font-bold mb-1">+{systemStats.monthlyGrowth}%</div>
                        <div className="text-orange-100 text-sm">Monthly Growth</div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                            <Users className="w-6 h-6 mr-2 text-blue-500" />
                            User Distribution
                        </h2>

                        <div className="space-y-4">
                            {userBreakdown.map((item, index) => (
                                <motion.div
                                    key={item.role}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {item.role}
                                        </span>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            {item.count} ({item.percentage}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div
                                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                            <Activity className="w-6 h-6 mr-2 text-green-500" />
                            Recent Activity
                        </h2>

                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900 dark:text-white mb-1">
                                                {activity.action}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {activity.user || activity.issuer}
                                            </p>
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(activity.timestamp).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Admin Quick Actions */}
                {isOwnProfile && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
                    >
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                            <Shield className="w-6 h-6 mr-2 text-red-500" />
                            Quick Actions
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="px-6 py-4 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg hover:shadow-md transition-all duration-300 text-left">
                                <Users className="w-5 h-5 mb-2" />
                                <div className="font-semibold">Manage Users</div>
                                <div className="text-xs opacity-75">View and manage all users</div>
                            </button>

                            <button className="px-6 py-4 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-lg hover:shadow-md transition-all duration-300 text-left">
                                <Award className="w-5 h-5 mb-2" />
                                <div className="font-semibold">Manage Certificates</div>
                                <div className="text-xs opacity-75">Review and verify certificates</div>
                            </button>

                            <button className="px-6 py-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg hover:shadow-md transition-all duration-300 text-left">
                                <AlertCircle className="w-5 h-5 mb-2" />
                                <div className="font-semibold">System Settings</div>
                                <div className="text-xs opacity-75">Configure platform settings</div>
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleProfileUpdate}
                currentData={{
                    bio: user.bio,
                    location: user.location,
                    organization: profileUser.organization,
                    experience: profileUser.experience,
                    skills: profileUser.skills,
                    profileVisibility: profileUser?.profileVisibility
                }}
            />
        </div>
    );
};

export default AdminProfilePage;
