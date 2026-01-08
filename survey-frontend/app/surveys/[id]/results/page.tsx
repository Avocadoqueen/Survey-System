'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { surveysApi, responsesApi } from '@/lib/api';
import { ToastContainer, useToast } from '@/components/Toast';

interface Question {
  id: number;
  question_text: string;
  question_type: 'text' | 'multiple_choice' | 'rating';
  options?: string[];
}

interface Survey {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

interface Response {
  id: number;
  question_id: number;
  answer_text: string;
  created_at: string;
}

interface QuestionAnalytics {
  questionId: number;
  questionText: string;
  questionType: string;
  totalResponses: number;
  answers: Array<{
    answer: string;
    count: number;
    percentage: number;
  }>;
  averageRating?: number;
}

function ResultsContent() {
  const params = useParams();
  const surveyId = params.id as string;
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [analytics, setAnalytics] = useState<QuestionAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    fetchData();
  }, [surveyId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch survey details
      const surveyData = await surveysApi.getById(Number(surveyId));
      const surveyInfo = surveyData.survey || surveyData;
      setSurvey(surveyInfo);

      // Fetch responses
      const responsesData = await responsesApi.getBySurvey(Number(surveyId));
      const responsesList = responsesData.responses || responsesData || [];
      setResponses(responsesList);

      // Calculate analytics
      if (surveyInfo.questions && responsesList.length > 0) {
        const analyticsData = calculateAnalytics(surveyInfo.questions, responsesList);
        setAnalytics(analyticsData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load results';
      setError(message);
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = (questions: Question[], responses: Response[]): QuestionAnalytics[] => {
    return questions.map((question) => {
      const questionResponses = responses.filter((r) => r.question_id === question.id);
      const totalResponses = questionResponses.length;

      // Count answers
      const answerCounts: Record<string, number> = {};
      questionResponses.forEach((r) => {
        const answer = r.answer_text;
        answerCounts[answer] = (answerCounts[answer] || 0) + 1;
      });

      const answers = Object.entries(answerCounts).map(([answer, count]) => ({
        answer,
        count,
        percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0,
      }));

      // Calculate average for rating questions
      let averageRating: number | undefined;
      if (question.question_type === 'rating' && totalResponses > 0) {
        const sum = questionResponses.reduce((acc, r) => acc + Number(r.answer_text), 0);
        averageRating = Math.round((sum / totalResponses) * 10) / 10;
      }

      return {
        questionId: question.id,
        questionText: question.question_text,
        questionType: question.question_type,
        totalResponses,
        answers: answers.sort((a, b) => b.count - a.count),
        averageRating,
      };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Survey not found'}</p>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const totalUniqueResponses = new Set(responses.map(r => r.created_at.split('T')[0] + r.question_id)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
            <p className="text-gray-600">Survey Results</p>
          </div>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{responses.length}</p>
              <p className="text-sm text-gray-600">Total Responses</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {survey.questions?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {analytics.filter(a => a.totalResponses > 0).length}
              </p>
              <p className="text-sm text-gray-600">Questions Answered</p>
            </div>
          </div>
        </div>

        {/* Question Analytics */}
        {analytics.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No responses yet for this survey.</p>
            <Link
              href={`/surveys/${surveyId}/take`}
              className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
            >
              Be the first to respond →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {analytics.map((questionAnalytics, index) => (
              <div key={questionAnalytics.questionId} className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Question {index + 1}</span>
                  <h3 className="text-lg font-medium text-gray-900">
                    {questionAnalytics.questionText}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {questionAnalytics.totalResponses} response{questionAnalytics.totalResponses !== 1 ? 's' : ''}
                  </p>
                </div>

                {questionAnalytics.totalResponses === 0 ? (
                  <p className="text-gray-500 italic">No responses yet</p>
                ) : (
                  <>
                    {/* Rating Average */}
                    {questionAnalytics.questionType === 'rating' && questionAnalytics.averageRating && (
                      <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-gray-600">Average Rating</p>
                        <p className="text-3xl font-bold text-yellow-600">
                          {questionAnalytics.averageRating} / 5
                        </p>
                        <div className="flex gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-2xl ${
                                star <= Math.round(questionAnalytics.averageRating!)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Answer Distribution */}
                    <div className="space-y-3">
                      {questionAnalytics.answers.map((answer, answerIndex) => (
                        <div key={answerIndex}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 truncate max-w-[70%]">
                              {answer.answer}
                            </span>
                            <span className="text-gray-500">
                              {answer.count} ({answer.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${answer.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Share Link */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Share Survey</h2>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? `${window.location.origin}/surveys/${surveyId}/take` : ''}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/surveys/${surveyId}/take`);
                addToast('Link copied to clipboard!', 'success');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Copy Link
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <ProtectedRoute>
      <ResultsContent />
    </ProtectedRoute>
  );
}
