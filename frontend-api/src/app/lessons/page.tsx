"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { lessonService } from '../../service/lessonService';

interface Lesson {
  id: number;
  nama_guru: string;
  mata_pelajaran: string;
  kelas: string;
  pokok_materi: string;
  tanggal_mengajar: string;
  jam_mulai: string;
  jam_selesai: string;
  status: string;
}

export default function LessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchLessons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await lessonService.getLessons();
      setLessons(data || []);
    } catch (err: unknown) {
      console.error('Error fetching lessons:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat data pembelajaran';
      setError(errorMessage);
      
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        localStorage.removeItem('jwt_token');
        router.push('/auth/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  useEffect(() => {
    const filtered = lessons.filter((lesson) =>
      lesson.nama_guru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.mata_pelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.kelas.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLessons(filtered);
    setCurrentPage(1);
  }, [searchTerm, lessons]);

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    try {
      setError(null);
      await lessonService.deleteLesson(id);
      setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
      alert('Data berhasil dihapus');
    } catch (err: unknown) {
      console.error('Error deleting lesson:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal menghapus data';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLessons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-0">
          Data Pembelajaran
        </h1>
        <Link
          href="/lessons/create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Data
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari data pembelajaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {currentItems.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm
              ? 'Tidak ada data yang sesuai dengan pencarian'
              : 'Belum ada data pembelajaran'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {currentItems.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lesson.status === 'terlaksana'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : lesson.status === 'dibatalkan'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {lesson.status}
                </span>
                <div className="flex space-x-2">
                  <Link
                    href={`/lessons/edit/${lesson.id}`}
                    className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                {lesson.mata_pelajaran}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {lesson.pokok_materi}
              </p>

              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Guru:</span>
                  <span>{lesson.nama_guru}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Kelas:</span>
                  <span>{lesson.kelas}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Tanggal:</span>
                  <span>{formatDate(lesson.tanggal_mengajar)}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Waktu:</span>
                  <span>
                    {lesson.jam_mulai} - {lesson.jam_selesai}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 dark:border-gray-600'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}