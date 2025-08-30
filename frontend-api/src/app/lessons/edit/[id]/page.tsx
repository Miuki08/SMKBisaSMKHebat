"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save } from 'lucide-react';
import { lessonService } from '../../../../service/lessonService';

export default function EditLesson() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama_guru: '',
    mata_pelajaran: '',
    kelas: '',
    pokok_materi: '',
    bukti_mengajar: '',
    tanggal_mengajar: '',
    jam_mulai: '',
    jam_selesai: '',
    catatan: '',
    status: 'terlaksana'
  });

  const fetchLesson = useCallback(async () => {
    try {
      setIsFetching(true);
      setError(null);
      const data = await lessonService.getLesson(parseInt(id));
      
      const formattedDate = data.tanggal_mengajar.split('T')[0];
      
      setFormData({
        nama_guru: data.nama_guru,
        mata_pelajaran: data.mata_pelajaran,
        kelas: data.kelas,
        pokok_materi: data.pokok_materi,
        bukti_mengajar: data.bukti_mengajar || '',
        tanggal_mengajar: formattedDate,
        jam_mulai: data.jam_mulai,
        jam_selesai: data.jam_selesai,
        catatan: data.catatan || '',
        status: data.status
      });
    } catch (err: unknown) {
      console.error('Error fetching lesson:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat data';
      setError(errorMessage);
    } finally {
      setIsFetching(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchLesson();
    }
  }, [id, fetchLesson]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await lessonService.updateLesson(parseInt(id), formData);
      alert('Data berhasil diupdate');
      router.push('/lessons');
    } catch (err: unknown) {
      console.error('Error updating lesson:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengupdate data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Edit Data Pembelajaran
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Perbarui informasi data pembelajaran yang sudah ada
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label htmlFor="nama_guru" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Nama Guru *
              </label>
              <input
                type="text"
                id="nama_guru"
                name="nama_guru"
                required
                value={formData.nama_guru}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Masukkan nama guru"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="mata_pelajaran" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Mata Pelajaran *
              </label>
              <input
                type="text"
                id="mata_pelajaran"
                name="mata_pelajaran"
                required
                value={formData.mata_pelajaran}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Masukkan mata pelajaran"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="kelas" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Kelas *
              </label>
              <input
                type="text"
                id="kelas"
                name="kelas"
                required
                value={formData.kelas}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Contoh: X IPA 1"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Status *
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              >
                <option value="terlaksana">Terlaksana</option>
                <option value="dibatalkan">Dibatalkan</option>
                <option value="ditunda">Ditunda</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="tanggal_mengajar" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tanggal Mengajar *
              </label>
              <input
                type="date"
                id="tanggal_mengajar"
                name="tanggal_mengajar"
                required
                value={formData.tanggal_mengajar}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Waktu Mengajar *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="jam_mulai" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    id="jam_mulai"
                    name="jam_mulai"
                    required
                    value={formData.jam_mulai}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="jam_selesai" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    id="jam_selesai"
                    name="jam_selesai"
                    required
                    value={formData.jam_selesai}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="pokok_materi" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Pokok Materi *
              </label>
              <input
                type="text"
                id="pokok_materi"
                name="pokok_materi"
                required
                value={formData.pokok_materi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Masukkan pokok materi pembelajaran"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="bukti_mengajar" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Bukti Mengajar
              </label>
              <input
                type="text"
                id="bukti_mengajar"
                name="bukti_mengajar"
                value={formData.bukti_mengajar}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Contoh: Link Google Drive, foto, dll."
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="catatan" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Catatan
              </label>
              <textarea
                id="catatan"
                name="catatan"
                rows={4}
                value={formData.catatan}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                placeholder="Tambahkan catatan jika diperlukan"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.push('/lessons')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5 mr-2" />
              {isLoading ? 'Menyimpan...' : 'Update Data'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}