"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { apiService } from '../../../service/api';

export default function CreateLesson() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiService.post('/lessons', formData);
      router.push('/lessons');
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Gagal menambahkan data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Tambah Data Pembelajaran Baru
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Isi formulir berikut untuk menambahkan data pembelajaran baru
        </p>
      </div>

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
              {isLoading ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}