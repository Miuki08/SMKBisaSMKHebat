// components/dashboard/RecentData.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, User } from 'lucide-react';
import { Lesson } from '../../service/api';
import { lessonService } from '../../service/lessonService';

const RecentData: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentLessons = async () => {
      try {
        const data = await lessonService.getLessons();
        // Ambil 5 data terbaru
        const recentLessons = data.slice(0, 5);
        setLessons(recentLessons);
      } catch (error) {
        console.error('Error fetching recent lessons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentLessons();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Data Terbaru</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Data Terbaru</h3>
        <Link 
          href="/lessons" 
          className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Lihat semua
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>Belum ada data pembelajaran</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 dark:text-white">{lesson.mata_pelajaran}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.pokok_materi}</p>
                  
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>{lesson.nama_guru}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(lesson.tanggal_mengajar)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{lesson.jam_mulai} - {lesson.jam_selesai}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentData;