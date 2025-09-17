import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin'
import { updateResume } from '../actions'

type PageProps = {
    params: { id: string }
}

export default async function SingleResumePage({ params }: PageProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !(await isAdmin(user.id))) {
        return redirect('/')
    }
    const { data: resume, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', params.id)
        .single()
    if (!resume) {
        return (
            <div className="w-full max-w-4xl mx-auto py-16 px-6 font-inter bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h1 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-gray-100">
                    Resume not found
                </h1>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                    The resume you are looking for does not exist or you do not have permission to view it.
                </p>
            </div>
        )
    }
    const { data: signedUrlData, error: urlError } = await supabase
        .storage
        .from('resumes')
        .createSignedUrl(resume.file_path, 60)

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-6 font-inter bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h1 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-gray-100 mb-8">
                Review Resume
            </h1>
            
            <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Submitter ID</dt>
                            <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                                {resume.user_id}
                            </dd>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">File</dt>
                            <dd className="text-sm">
                                {signedUrlData?.signedUrl ? (
                                    <a 
                                        href={signedUrlData.signedUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#21808D] hover:bg-[#1e737f] text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        View Resume PDF
                                    </a>
                                ) : (
                                    <span className="text-red-500 dark:text-red-400 text-sm">Could not generate file link</span>
                                )}
                            </dd>
                        </div>
                    </div>
                </div>

                <form action={updateResume} className="space-y-6">
                    <input type="hidden" name="id" value={resume.id} />
                    <input type="hidden" name="userId" value={resume.user_id} />
                    
                    <div className="space-y-2">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Status
                        </label>
                        <div className="relative">
                            <select
                                id="status"
                                name="status"
                                defaultValue={resume.status}
                                className="w-full appearance-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#21808D] focus:border-transparent transition-all duration-200"
                            >
                                <option>Submitted</option>
                                <option>Needs Revision</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="score" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Score (out of 100)
                        </label>
                        <input
                            type="number"
                            name="score"
                            id="score"
                            min="0"
                            max="100"
                            defaultValue={resume.score ?? ''}
                            placeholder="Enter score"
                            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#21808D] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={4}
                            defaultValue={resume.notes ?? ''}
                            placeholder="Add your review notes here..."
                            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#21808D] focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-vertical"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6">
                        <a 
                            href="/admin" 
                            className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
                        >
                            Cancel
                        </a>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#21808D] hover:bg-[#1e737f] text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#21808D] focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
