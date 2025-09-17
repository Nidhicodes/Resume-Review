import { createClient } from '@/lib/supabase/server'
import AuthForm from '@/components/AuthForm'
import ResumeUpload from '@/components/ResumeUpload'
import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-[#0a0a0a] dark:to-gray-950 font-inter">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Header Section */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#21808D]/10 to-[#21808D]/20 rounded-3xl mb-8">
              <svg className="w-10 h-10 text-[#21808D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-6">
              Resume Submission
              <span className="block text-[#21808D] dark:text-[#26a0ae]">Platform</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Submit your resume for professional review and feedback. Join our community of job seekers improving their applications.
            </p>
          </div>

          {user ? (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      Welcome back!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <Link 
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#21808D] hover:bg-[#1e737f] text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#21808D] focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Dashboard
                  </Link>

                  <Link 
                    href="/leaderboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#21808D] focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Leaderboard
                  </Link>

                  <LogoutButton />
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Upload Your Resume
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Submit a new resume for professional review and scoring
                  </p>
                </div>
              </div>

              {/* Upload Section */}
              <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                <ResumeUpload />
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {/* Sign In Section */}
              <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#21808D]/10 to-[#21808D]/20 rounded-2xl mb-4">
                    <svg className="w-8 h-8 text-[#21808D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 1.05a2 2 0 001.28-.68L15 5.18a2 2 0 013.21-.72l2.12 2.83a2 2 0 01-.72 3.21L16.82 13a2 2 0 00-.68 1.28L15.05 21a2 2 0 01-3.89.72L8 18.39a2 2 0 00-1.45-1L3 16.61a2 2 0 01-.89-3.5L5.17 10a2 2 0 001-1.45L7.22 5a2 2 0 013.5-.89L13.39 8a2 2 0 001.45 1l3.55 1.05" />
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Get Started
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Sign in to upload your resume and receive professional feedback. We'll send you a secure magic link to get started.
                  </p>
                </div>

                <AuthForm />
              </div>

              {/* Features Section */}
              <div className="mt-12 grid grid-cols-1 gap-6">
                <div className="text-center p-6 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mb-4">
                    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Professional Review
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Get your resume reviewed by industry experts with detailed feedback and scoring
                  </p>
                </div>

                <div className="text-center p-6 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#21808D]/10 dark:bg-[#21808D]/20 rounded-lg mb-4">
                    <svg className="w-6 h-6 text-[#21808D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Track Progress
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Monitor your submissions and see how you rank against other applicants
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
