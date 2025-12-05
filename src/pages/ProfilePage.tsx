import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';
import IndividualProfilePage from './profiles/IndividualProfilePage';
import IssuerProfilePage from './profiles/IssuerProfilePage';
import EmployerProfilePage from './profiles/EmployerProfilePage';
import AdminProfilePage from './profiles/AdminProfilePage';

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

const ProfilePage: React.FC = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // If viewing own profile or no username in URL, use current user
        if (!username || username === currentUser?.username) {
          if (currentUser) {
            // Fetch fresh data from API
            const response = await API.get('/users/profile');
            setProfileUser(response.data.data);
          }
        } else {
          // Fetch other user's profile
          const response = await API.get(`/users/${username}`);
          setProfileUser(response.data.data);
        }
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        setError(error.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, currentUser, refreshKey]);

  const handleProfileUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-slate-600 dark:text-slate-400">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-xl mb-2">❌</div>
          <div className="text-slate-600 dark:text-slate-400">{error}</div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-400 text-6xl mb-4">👤</div>
          <div className="text-slate-600 dark:text-slate-400 text-xl">User not found</div>
        </div>
      </div>
    );
  }

  // Route to appropriate profile component based on role
  switch (profileUser.role) {
    case 'ISSUER':
      return <IssuerProfilePage profileUser={profileUser} onProfileUpdate={handleProfileUpdate} />;

    case 'EMPLOYER':
      return <EmployerProfilePage profileUser={profileUser} onProfileUpdate={handleProfileUpdate} />;

    case 'ADMIN':
      return <AdminProfilePage profileUser={profileUser} onProfileUpdate={handleProfileUpdate} />;

    case 'INDIVIDUAL':
    default:
      return <IndividualProfilePage profileUser={profileUser} onProfileUpdate={handleProfileUpdate} />;
  }
};

export default ProfilePage;