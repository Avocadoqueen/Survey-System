'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { surveysApi } from '@/lib/api';
import { ToastContainer, useToast } from '@/components/Toast';

interface Survey {
  id: number;
  title: string;
  description: string;
  created_at: string;
  response_count?: number;
}

function DashboardContent() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setIsLoading(true);
      const data = await surveysApi.getAll();
      setSurveys(data.surveys || data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load surveys';
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this survey?')) return;

    try {
      await surveysApi.delete(id);
      setSurveys(surveys.filter(s => s.id !== id));
      addToast('Survey deleted successfully', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete survey';
      addToast(message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Survey Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name || 'User'}</span>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Surveys</h2>
          <Link
            href="/surveys/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Survey
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">No surveys yet. Create your first survey!</p>
            <Link
              href="/surveys/create"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create Survey →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {survey.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {survey.description || 'No description'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    Created: {new Date(survey.created_at).toLocaleDateString()}
                  </span>
                  <span>{survey.response_count || 0} responses</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/surveys/${survey.id}/take`}
                    className="flex-1 text-center bg-green-100 text-green-700 px-3 py-2 rounded-md hover:bg-green-200 transition-colors text-sm"
                  >
                    Take
                  </Link>
                  <Link
                    href={`/surveys/${survey.id}/results`}
                    className="flex-1 text-center bg-blue-100 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    Results
                  </Link>
                  <button
                    onClick={() => handleDelete(survey.id)}
                    className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-md hover:bg-red-200 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
