"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MedicalSuppliesSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const medicalSupplies = useQuery(api.medicalSupplies.getAll);
  const createSupply = useMutation(api.medicalSupplies.create);
  const updateSupply = useMutation(api.medicalSupplies.update);
  const removeSupply = useMutation(api.medicalSupplies.remove);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
    expiryDate: "",
    isExpiringSoon: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      await updateSupply({
        id: editingItem._id,
        ...formData,
      });
      setEditingItem(null);
    } else {
      await createSupply(formData);
    }
    
    setFormData({
      name: "",
      description: "",
      quantity: 1,
      expiryDate: "",
      isExpiringSoon: false,
    });
    setShowModal(false);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      quantity: item.quantity,
      expiryDate: item.expiryDate || "",
      isExpiringSoon: item.isExpiringSoon || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu malzemeyi silmek istediğinizden emin misiniz?")) {
      await removeSupply({ id: id as any });
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      quantity: 1,
      expiryDate: "",
      isExpiringSoon: false,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">🏥 Tıbbi Malzemeler</h2>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          ➕ Yeni Malzeme Ekle
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? "Malzeme Düzenle" : "Yeni Malzeme Ekle"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Malzeme Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black p-2"
                    placeholder="Malzeme adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Miktar *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setFormData({ ...formData, quantity: isNaN(value) ? 1 : Math.max(1, value) });
                    }}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black p-2"
                    placeholder="Miktar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black p-2"
                    placeholder="Açıklama..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isExpiringSoon}
                        onChange={(e) => setFormData({ ...formData, isExpiringSoon: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Son kullanım tarihi yaklaşıyor
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        const month = now.toLocaleString('tr-TR', { month: 'long' });
                        const year = now.getFullYear();
                        alert(`Son değişiklik: ${month} ${year}`);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                      title="Son değişiklik bilgisi"
                    >
                      ℹ️
                    </button>
                  </div>
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
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {editingItem ? "Güncelle" : "Ekle"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Supplies List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Mevcut Malzemeler ({medicalSupplies?.length || 0})
          </h3>
          
          {medicalSupplies?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz malzeme eklenmemiş.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicalSupplies?.map((supply: any) => (
                <div
                  key={supply._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{supply.name}</h4>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Miktar:</strong> {supply.quantity} kutu</p>
                    {supply.description && (
                      <p><strong>Açıklama:</strong> {supply.description}</p>
                    )}
                    {supply.isExpiringSoon && (
                      <p className="text-yellow-600 font-medium">⚠️ Son kullanım tarihi yaklaşıyor</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => handleEdit(supply)}
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(supply._id)}
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
