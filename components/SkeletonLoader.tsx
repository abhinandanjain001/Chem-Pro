import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
    return (
        <div className={`animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded ${className}`} />
    );
};

export const QuizLoadingSkeleton: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto animate-fadeIn space-y-6">
            {/* Progress Bar Skeleton */}
            <div className="mb-8">
                <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
            </div>

            {/* Question Card Skeleton */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 sm:p-10">
                {/* Question Title */}
                <div className="mb-8 space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-4/5" />
                    <Skeleton className="h-6 w-3/5" />
                </div>

                {/* Options */}
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-white/70 rounded-2xl">
                            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                            <Skeleton className="h-5 flex-1" />
                        </div>
                    ))}
                </div>

                {/* Hint Button Skeleton */}
                <div className="mt-8 pt-6 border-t border-slate-200/50">
                    <Skeleton className="h-5 w-32" />
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between items-center">
                    <Skeleton className="h-10 w-24 rounded-xl" />
                    <Skeleton className="h-12 w-40 rounded-xl" />
                </div>
            </div>

            {/* Loading Text */}
            <div className="text-center space-y-2">
                <Skeleton className="h-6 w-64 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
            </div>
        </div>
    );
};

export const OrganizerLoadingSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Processing Message */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/60 text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-64 mx-auto mb-2" />
                <Skeleton className="h-4 w-48 mx-auto" />
            </div>

            {/* Topic Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/50 backdrop-blur-md rounded-xl p-6 border border-white/40">
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DiagramLoadingSkeleton: React.FC = () => {
    return (
        <div className="animate-fadeIn">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/60">
                {/* Header */}
                <div className="text-center mb-6">
                    <Skeleton className="h-6 w-48 mx-auto mb-2" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                </div>

                {/* Diagram Area */}
                <div className="bg-slate-50/50 rounded-xl p-8 mb-6">
                    <div className="aspect-video flex items-center justify-center">
                        <div className="space-y-4 w-full max-w-md">
                            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                            <div className="grid grid-cols-3 gap-4">
                                <Skeleton className="h-16 w-16 rounded-lg" />
                                <Skeleton className="h-16 w-16 rounded-lg" />
                                <Skeleton className="h-16 w-16 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="text-center space-y-2">
                    <Skeleton className="h-5 w-56 mx-auto" />
                    <Skeleton className="h-4 w-72 mx-auto" />
                </div>
            </div>
        </div>
    );
};
