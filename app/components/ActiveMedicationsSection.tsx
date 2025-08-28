"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ActiveMedicationsSection() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const activeMedications = useQuery(api.activeMedications.getAll);
  const familyMembers = useQuery(api.familyMembers.getAll);
  const createMedication = useMutation(api.activeMedications.create);
  const updateMedication = useMutation(api.activeMedications.update);
  const removeMedication = useMutation(api.activeMedications.remove);

  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    dosage: "",
    frequency: "",
    duration: "",
    prescribedFor: "",
    prescribedBy: "",
    startDate: "",
    endDate: "",
    instructions: "",
    sideEffects: "",
  });

  const frequencies = [
    "Günde 1 kez",
    "Günde 2 kez",
    "Günde 3 kez",
    "Günde 4 kez",
    "Haftada 1 kez",
    "Haftada 2 kez",
    "Haftada 3 kez",
    "İhtiyaç halinde",
    "Diğer",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      await updateMedication({
        id: editingItem._id,
        ...formData,
      });
      setEditingItem(null);
    } else {
      await createMedication(formData);
    }
    
    setFormData({
      name: "",
      genericName: "",
      dosage: "",
      frequency: "",
      duration: "",
      prescribedFor: "",
      prescribedBy: "",
      startDate: "",
      endDate: "",
      instructions: "",
      sideEffects: "",
    });
    setShowAddForm(false);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      genericName: item.genericName || "",
      dosage: item.dosage,
      frequency: item.frequency,
      duration: item.duration || "",
      prescribedFor: item.prescribedFor,
      prescribedBy: item.prescribedBy || "",
      startDate: item.startDate,
      endDate: item.endDate || "",
      instructions: item.instructions || "",
      sideEffects: item.sideEffects || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu ilacı silmek istediğinizden emin misiniz?")) {
      await removeMedication({ id: id as any });
    }
  };

  const isEndingSoon = (endDate: string) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">💊 Aktif İlaçlar</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          {showAddForm ? "❌ İptal" : "➕ Yeni İlaç Ekle"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingItem ? "İlaç Düzenle" : "Yeni İlaç Ekle"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  İlaç Adı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jenerik Adı
                </label>
                <input
                  type="text"
                  value={formData.genericName}
                  onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Doz *
                </label>
                <input
                  type="text"
                  required
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  placeholder="Örn: 500mg, 1 tablet"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kullanım Sıklığı *
                </label>
                <select
                  required
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
                >
                  <option value="">Sıklık Seçin</option>
                  {frequencies.map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kim İçin Reçete Edildi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.prescribedFor}
                  onChange={(e) => setFormData({ ...formData, prescribedFor: e.target.value })}
                  placeholder="Örn: Anne, Baba, Çocuk"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kim Reçete Etti
                </label>
                <input
                  type="text"
                  value={formData.prescribedBy}
                  onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  placeholder="Örn: Dr. Ahmet Yılmaz"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Başlama Tarihi *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kullanım Süresi
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Örn: 7 gün, 1 ay"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Özel Talimatlar
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={3}
                placeholder="Özel kullanım talimatları, yemekle birlikte alınması gerekiyor mu, vs..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Yan Etkiler
              </label>
              <textarea
                value={formData.sideEffects}
                onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                rows={3}
                placeholder="Bilinen yan etkiler..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                {editingItem ? "Güncelle" : "Ekle"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Medications List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Aktif İlaçlar ({activeMedications?.length || 0})
          </h3>
          
          {activeMedications?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz aktif ilaç eklenmemiş.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeMedications?.map((medication: any) => (
                <div
                  key={medication._id}
                  className={`border rounded-lg p-4 ${
                    isEndingSoon(medication.endDate) ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{medication.name}</h4>
                    {isEndingSoon(medication.endDate) && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        🚨 Yakında Bitecek
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    {medication.genericName && (
                      <p><strong>Jenerik Adı:</strong> {medication.genericName}</p>
                    )}
                    <p><strong>Doz:</strong> {medication.dosage}</p>
                    <p><strong>Sıklık:</strong> {medication.frequency}</p>
                    <p><strong>Kim İçin:</strong> {medication.prescribedFor}</p>
                    {medication.prescribedBy && (
                      <p><strong>Reçete Eden:</strong> {medication.prescribedBy}</p>
                    )}
                    <p><strong>Başlama:</strong> {new Date(medication.startDate).toLocaleDateString('tr-TR')}</p>
                    {medication.endDate && (
                      <p><strong>Bitiş:</strong> {new Date(medication.endDate).toLocaleDateString('tr-TR')}</p>
                    )}
                    {medication.duration && (
                      <p><strong>Süre:</strong> {medication.duration}</p>
                    )}
                    {medication.instructions && (
                      <p><strong>Talimatlar:</strong> {medication.instructions}</p>
                    )}
                    {medication.sideEffects && (
                      <p><strong>Yan Etkiler:</strong> {medication.sideEffects}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => handleEdit(medication)}
                      className="text-sm text-green-600 hover:text-green-900"
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(medication._id)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
