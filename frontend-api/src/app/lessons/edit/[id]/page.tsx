"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import { apiService } from '../../../../service/api';

export default function EditLesson() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
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

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      const data = await apiService.get(`/lessons/${id}`);
      setFormData({
        nama_guru: data.nama_guru,
        mata_pelajaran: data.mata_pelajaran,
        kelas: data.kelas,
        pokok_materi: data.pokok_materi,
        bukti_mengajar: data.bukti_mengajar || '',
        tanggal_mengajar: data.tanggal_mengajar.split('T')[0],
        jam_mulai: data.jam_mulai,
        jam_selesai: data.jam_selesai,
        catatan: data.catatan || '',
        status: data.status
      });
    } catch (error) {
      console.error('Error fetching lesson:', error);
      alert('Gagal memuat data');
    } finally {
      setIsFetching(false);
    }
  };

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
      await apiService.put(`/lessons/${id}`, formData);
      router.push('/lessons');
    } catch (error) {
      console.error('Error updating lesson:', error);
      alert('Gagal mengupdate data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Kembali
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Edit Data Pembelajaran</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="nama_guru" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Guru *
              </label>
              <input
                type="text"
                id="nama_guru"
                name="nama_guru"
                required
                value={formData.nama_guru}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Masukkan nama guru"
              />
            </div>

            <div>
              <label htmlFor="mata_pelajaran" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mata Pelajaran *
              </label>
              <input
                type="text"
                id="mata_pelajaran"
                name="mata_pelajaran"
                required
                value={formData.mata_pelajaran}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Masukkan mata pelajaran"
              />
            </div>

            <div>
              <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kelas *
              </label>
              <input
                type="text"
                id="kelas"
                name="kelas"
                required
                value={formData.kelas}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Contoh: X IPA 1"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="terlaksana">Terlaksana</option>
                <option value="dibatalkan">Dibatalkan</option>
                <option value="ditunda">Ditunda</option>
              </select>
            </div>

            <div>
              <label htmlFor="tanggal_mengajar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Mengajar *
              </label>
              <input
                type="date"
                id="tanggal_mengajar"
                name="tanggal_mengajar"
                required
                value={formData.tanggal_mengajar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="jam_mulai" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jam Mulai *
                </label>
                <input
                  type="time"
                  id="jam_mulai"
                  name="jam_mulai"
                  required
                  value={formData.jam_mulai}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="jam_selesai" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jam Selesai *
                </label>
                <input
                  type="time"
                  id="jam_selesai"
                  name="jam_selesai"
                  required
                  value={formData.jam_selesai}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="pokok_materi" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pokok Materi *
              </label>
              <input
                type="text"
                id="pokok_materi"
                name="pokok_materi"
                required
                value={formData.pokok_materi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Masukkan pokok materi pembelajaran"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="bukti_mengajar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bukti Mengajar
              </label>
              <input
                type="text"
                id="bukti_mengajar"
                name="bukti_mengajar"
                value={formData.bukti_mengajar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Contoh: Link Google Drive, foto, dll."
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catatan
              </label>
              <textarea
                id="catatan"
                name="catatan"
                rows={3}
                value={formData.catatan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Tambahkan catatan jika diperlukan"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Menyimpan...' : 'Update Data'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}