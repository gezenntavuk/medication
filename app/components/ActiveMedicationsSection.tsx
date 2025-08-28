"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ActiveMedicationsSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const activeMedications = useQuery(api.activeMedications.getAll);
  const medicalSupplies = useQuery(api.medicalSupplies.getAll);
  const familyMembers = useQuery(api.familyMembers.getAll);
  const createMedication = useMutation(api.activeMedications.create);
  const updateMedication = useMutation(api.activeMedications.update);
  const removeMedication = useMutation(api.activeMedications.remove);

  const [formData, setFormData] = useState({
    name: "",
    prescribedFor: "",
    frequency: "daily", // Sıklık: daily, weekly
    frequencyCount: 1, // Kaç kez: 1-7 arası
    startDate: new Date().toISOString().split('T')[0], // Başlangıç tarihi
    instructions: "",
  });

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredMedications, setFilteredMedications] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const medicationData = {
      ...formData,
      genericName: "",
      prescribedBy: "",
      endDate: "",
      sideEffects: "",
    };
    
    if (editingItem) {
      await updateMedication({
        id: editingItem._id,
        ...medicationData,
      });
      setEditingItem(null);
    } else {
      await createMedication(medicationData);
    }
    
    setFormData({
      name: "",
      prescribedFor: "",
      frequency: "daily",
      frequencyCount: 1,
      startDate: new Date().toISOString().split('T')[0],
      instructions: "",
    });
    setShowModal(false);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      prescribedFor: item.prescribedFor,
      frequency: item.frequency || "daily",
      frequencyCount: item.frequencyCount || 1,
      startDate: item.startDate || new Date().toISOString().split('T')[0],
      instructions: item.instructions || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu ilacı silmek istediğinizden emin misiniz?")) {
      await removeMedication({ id: id as any });
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      prescribedFor: "",
      frequency: "daily",
      frequencyCount: 1,
      startDate: new Date().toISOString().split('T')[0],
      instructions: "",
    });
    setShowModal(true);
  };

  const handleMedicationNameChange = (value: string) => {
    setFormData({ ...formData, name: value });
    
    if (value.length > 0 && medicalSupplies && Array.isArray(medicalSupplies)) {
      const filtered = medicalSupplies.filter((supply: any) =>
        supply.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMedications(filtered);
      setShowAutocomplete(filtered.length > 0);
    } else {
      setShowAutocomplete(false);
      setFilteredMedications([]);
    }
  };

  const selectMedication = (supply: any) => {
    setFormData({
      ...formData,
      name: supply.name,
      instructions: supply.description || formData.instructions, // Use description as instructions
    });
    setShowAutocomplete(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">💊 Aktif İlaçlar</h2>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          ➕ Yeni İlaç Ekle
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          onClick={() => setShowAutocomplete(false)}
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? "İlaç Düzenle" : "Yeni İlaç Ekle"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İlaç Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleMedicationNameChange(e.target.value)}
                    onFocus={() => {
                      if (formData.name.length > 0 && medicalSupplies) {
                        const filtered = medicalSupplies.filter((supply: any) =>
                          supply.name.toLowerCase().includes(formData.name.toLowerCase())
                        );
                        setFilteredMedications(filtered);
                        setShowAutocomplete(filtered.length > 0);
                      }
                    }}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black p-2"
                    placeholder="İlaç adı"
                  />
                  
                  {/* Autocomplete Dropdown */}
                  {showAutocomplete && filteredMedications.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredMedications.map((supply: any) => (
                        <div
                          key={supply._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectMedication(supply);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{supply.name}</div>
                          <div className="text-sm text-gray-500">
                            {supply.quantity} kutu - {supply.description || 'Açıklama yok'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kullanan Kişi *
                  </label>
                  <select
                    required
                    value={formData.prescribedFor}
                    onChange={(e) => setFormData({ ...formData, prescribedFor: e.target.value })}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black p-2"
                  >
                    <option value="">Kişi Seçin</option>
                    {familyMembers?.map((member: any) => (
                      <option key={member._id} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sıklık *
                              </label>
                              <select
                                required
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black p-2"
                              >
                                <option value="daily">Günlük</option>
                                <option value="weekly">Haftalık</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kaç Kez *
                              </label>
                              <select
                                required
                                value={formData.frequencyCount}
                                onChange={(e) => setFormData({ ...formData, frequencyCount: parseInt(e.target.value) || 1 })}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black p-2"
                              >
                                <option value={1}>1 kez</option>
                                <option value={2}>2 kez</option>
                                <option value={3}>3 kez</option>
                                <option value={4}>4 kez</option>
                                <option value={5}>5 kez</option>
                                <option value={6}>6 kez</option>
                                <option value={7}>7 kez</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Başlangıç Tarihi *
                              </label>
                              <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black p-2"
                              />
                            </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Not
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={3}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-black p-2"
                    placeholder="Özel talimatlar, yan etkiler..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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
          </div>
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
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{medication.name}</h4>
                  </div>
                  
                                                <div className="space-y-1 text-sm text-gray-600">
                                <p><strong>Kullanan:</strong> {medication.prescribedFor}</p>
                                <p><strong>Sıklık:</strong> {
                                  medication.frequency === "daily" ? `Günde ${medication.frequencyCount} kez` :
                                  medication.frequency === "weekly" ? `Haftada ${medication.frequencyCount} kez` :
                                  `${medication.frequencyCount} kez`
                                }</p>
                                <p><strong>Başlangıç:</strong> {new Date(medication.startDate).toLocaleDateString('tr-TR')}</p>
                                {medication.instructions && (
                                  <p><strong>Not:</strong> {medication.instructions}</p>
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
