"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function FamilyMembersSection() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const familyMembers = useQuery(api.familyMembers.getAll);
  const createMember = useMutation(api.familyMembers.create);
  const updateMember = useMutation(api.familyMembers.update);
  const removeMember = useMutation(api.familyMembers.remove);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    relationship: "",
    allergies: [] as string[],
    medicalConditions: [] as string[],
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  const relationships = [
    "Anne",
    "Baba",
    "Çocuk",
    "Kardeş",
    "Büyükanne",
    "Büyükbaba",
    "Hala",
    "Dayı",
    "Teyze",
    "Amca",
    "Diğer",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const memberData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
    };
    
    if (editingItem) {
      await updateMember({
        id: editingItem._id,
        ...memberData,
      });
      setEditingItem(null);
    } else {
      await createMember(memberData);
    }
    
    setFormData({
      name: "",
      age: "",
      relationship: "",
      allergies: [],
      medicalConditions: [],
    });
    setShowAddForm(false);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      age: item.age?.toString() || "",
      relationship: item.relationship,
      allergies: item.allergies || [],
      medicalConditions: item.medicalConditions || [],
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu aile üyesini silmek istediğinizden emin misiniz?")) {
      await removeMember({ id: id as any });
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, newAllergy.trim()],
      });
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((_, i) => i !== index),
    });
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData({
        ...formData,
        medicalConditions: [...formData.medicalConditions, newCondition.trim()],
      });
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      medicalConditions: formData.medicalConditions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">👨‍👩‍👧‍👦 Aile Üyeleri</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          {showAddForm ? "❌ İptal" : "➕ Yeni Üye Ekle"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingItem ? "Aile Üyesi Düzenle" : "Yeni Aile Üyesi Ekle"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ad Soyad *
                </label>
                                 <input
                   type="text"
                   required
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-black"
                 />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Yaş
                </label>
                                 <input
                   type="number"
                   min="0"
                   max="120"
                   value={formData.age}
                   onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-black"
                 />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  İlişki *
                </label>
                <select
                  required
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-black"
                >
                  <option value="">İlişki Seçin</option>
                  {relationships.map((relationship) => (
                    <option key={relationship} value={relationship}>
                      {relationship}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alerjiler
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Alerji ekle..."
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-black"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                />
                <button
                  type="button"
                  onClick={addAllergy}
                  className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  Ekle
                </button>
              </div>
              {formData.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => removeAllergy(index)}
                        className="ml-1 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Medical Conditions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sağlık Durumları
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Sağlık durumu ekle..."
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-black"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                />
                <button
                  type="button"
                  onClick={addCondition}
                  className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  Ekle
                </button>
              </div>
              {formData.medicalConditions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.medicalConditions.map((condition, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                {editingItem ? "Güncelle" : "Ekle"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Family Members List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Aile Üyeleri ({familyMembers?.length || 0})
          </h3>
          
          {familyMembers?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Henüz aile üyesi eklenmemiş.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {familyMembers?.map((member: any) => (
                <div
                  key={member._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.relationship}</p>
                    </div>
                    {member.age && (
                      <span className="text-sm text-gray-500">{member.age} yaş</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {member.allergies && member.allergies.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Alerjiler:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.allergies.map((allergy: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {member.medicalConditions && member.medicalConditions.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Sağlık Durumları:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.medicalConditions.map((condition: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-sm text-purple-600 hover:text-purple-900"
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
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
