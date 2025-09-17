'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Document, Page, pdfjs } from 'react-pdf'
import { createClient } from '@/lib/supabase/client'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ResumeUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [numPages, setNumPages] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const supabase = createClient()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
            setSuccess(null);
        }
    }, [])

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }
    
    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        setSuccess(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('You must be logged in to upload a resume.');
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { error: dbError } = await supabase.from('resumes').insert({
                user_id: user.id,
                file_path: filePath,
            });

            if (dbError) {
                await supabase.storage.from('resumes').remove([filePath]);
                throw dbError;
            }

            setSuccess('Resume uploaded successfully! You can view its status on your dashboard.');
            setFile(null); 
        } catch (error: any) {
            setError(error.message || 'An unexpected error occurred.');
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        multiple: false,
    });

    return (
        <div className="w-full font-inter">
            {!file && (
                <div
                    {...getRootProps()}
                    className={`flex justify-center rounded-2xl border-2 border-dashed px-6 py-12 transition-all duration-200 cursor-pointer ${
                        isDragActive 
                            ? 'border-[#21808D] bg-[#21808D]/5 dark:bg-[#21808D]/10' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-[#21808D] hover:bg-[#21808D]/5 dark:hover:bg-[#21808D]/10'
                    }`}
                >
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-[#21808D]/10 dark:bg-[#21808D]/20 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-[#21808D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div className="flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                            <label className="relative cursor-pointer rounded-lg font-semibold text-[#21808D] hover:text-[#1e737f] transition-colors duration-200">
                                <span>Upload a file</span>
                                <input {...getInputProps()} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-500 dark:text-gray-400 mt-2">
                            PDF files only, up to 10MB
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>
                    </div>
                </div>
            )}

            {file && (
                <div className="mt-6 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Selected File
                        </h4>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                            <div className="w-10 h-10 bg-[#21808D]/10 dark:bg-[#21808D]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-[#21808D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(file.size / 1024).toFixed(2)} KB • PDF Document
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Preview
                        </h4>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900/50">
                            <div className="h-96 overflow-y-auto p-4">
                                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                                    {Array.from(new Array(numPages || 0), (el, index) => (
                                        <div key={`page_${index + 1}`} className="mb-4 last:mb-0">
                                            <Page pageNumber={index + 1} renderTextLayer={false} />
                                        </div>
                                    ))}
                                </Document>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setFile(null)}
                            disabled={uploading}
                            className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#21808D] focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={uploading}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#21808D] hover:bg-[#1e737f] text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#21808D] focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 transition-all duration-200"
                        >
                            {uploading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Upload Resume
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
