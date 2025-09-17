import { createClient } from '@/lib/supabase/server'

interface LeaderboardEntry {
  anon_id: string;
  score: number;
}

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const { data: leaderboard, error } = await supabase.rpc('get_leaderboard')

  const getRankIcon = (position: number) => {
    if (position === 1) {
      return (
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2L13.09 8.26L20 9L15 13.74L16.18 20.02L10 16.77L3.82 20.02L5 13.74L0 9L6.91 8.26L10 2Z" clipRule="evenodd" />
          </svg>
        </div>
      )
    }
    if (position === 2) {
      return (
        <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2L13.09 8.26L20 9L15 13.74L16.18 20.02L10 16.77L3.82 20.02L5 13.74L0 9L6.91 8.26L10 2Z" clipRule="evenodd" />
          </svg>
        </div>
      )
    }
    if (position === 3) {
      return (
        <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2L13.09 8.26L20 9L15 13.74L16.18 20.02L10 16.77L3.82 20.02L5 13.74L0 9L6.91 8.26L10 2Z" clipRule="evenodd" />
          </svg>
        </div>
      )
    }
    return (
      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{position}</span>
      </div>
    )
  }

  const getScoreColor = (position: number) => {
    if (position === 1) return 'text-yellow-600 dark:text-yellow-400'
    if (position === 2) return 'text-gray-600 dark:text-gray-400'
    if (position === 3) return 'text-amber-600 dark:text-amber-400'
    return 'text-[#21808D] dark:text-[#26a0ae]'
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6 font-inter">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#21808D]/10 to-[#21808D]/20 rounded-2xl mb-6">
          <svg className="w-8 h-8 text-[#21808D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Resume Leaderboard
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover the highest-scoring resumes on our platform and see how your submissions compare
        </p>
      </div>

      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {leaderboard && leaderboard.length > 0 ? (
          <>
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Top Performers
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {leaderboard.length} {leaderboard.length === 1 ? 'entry' : 'entries'}
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {(leaderboard as LeaderboardEntry[]).map((entry: LeaderboardEntry, index: number) => {
                const position = index + 1;
                return (
                  <div
                    key={entry.anon_id}
                    className={`flex items-center justify-between px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors duration-150 ${
                      position <= 3 ? 'bg-gradient-to-r from-transparent to-gray-25 dark:to-gray-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {getRankIcon(position)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {entry.anon_id}
                          </h3>
                          {position <= 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#21808D]/10 text-[#21808D] dark:bg-[#21808D]/20 dark:text-[#26a0ae]">
                              Top {position}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Anonymous submission
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(position)}`}>
                          {entry.score}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          points
                        </div>
                      </div>
                      
                      {position <= 3 && (
                        <div className="flex-shrink-0">
                          <svg className={`w-5 h-5 ${getScoreColor(position)}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.414 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full"></div>
                  <span>1st Place</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
                  <span>2nd Place</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full"></div>
                  <span>3rd Place</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#21808D]/10 to-[#21808D]/20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[#21808D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Leaderboard Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              The leaderboard will appear here once resumes have been reviewed and scored by our team.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Fair scoring system</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Anonymous rankings</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
