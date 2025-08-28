"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface PersonDetailPageProps {
  personName: string;
  onBack: () => void;
}

export default function PersonDetailPage({ personName, onBack }: PersonDetailPageProps) {
  const [today] = useState(new Date().toISOString().split('T')[0]);
  const [checkedMeds, setCheckedMeds] = useState<Set<string>>(new Set());

  // Kişinin ilaçlarını getir
  const personMedications = useQuery(api.activeMedications.getByPerson, {
    prescribedFor: personName
  });

  // Tüm ilaçları da getir (debug için)
  const allMedications = useQuery(api.activeMedications.getAll);

  // İlacın bugün alınması gerekip gerekmediğini kontrol et
  const shouldTakeToday = (medication: any) => {
    console.log('Checking medication:', medication.name);
    console.log('Start date:', medication.startDate);
    console.log('Frequency:', medication.frequency);
    
    const startDate = new Date(medication.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    
    console.log('Start date parsed:', startDate);
    console.log('Today:', today);
    
    // Başlangıç tarihinden önceyse alınmamalı
    if (startDate > today) {
      console.log('Start date is in future, not taking today');
      return false;
    }
    
    // Günlük ilaçlar her gün
    if (medication.frequency === "daily") {
      console.log('Daily medication, taking today');
      return true;
    }
    
    // Haftalık ilaçlar - haftanın belirli günü
    if (medication.frequency === "weekly") {
      // Başlangıç günü ile bugün aynı günse alınmalı
      const startDay = startDate.getDay();
      const todayDay = today.getDay();
      console.log('Weekly medication - start day:', startDay, 'today day:', todayDay);
      const shouldTake = startDay === todayDay;
      console.log('Should take weekly medication:', shouldTake);
      return shouldTake;
    }
    
    console.log('Default case, taking today');
    return true;
  };

  // Bugün alınması gereken ilaçları filtrele
  const todayMedications = personMedications?.filter(shouldTakeToday) || [];

  console.log('Person name:', personName);
  console.log('Person medications:', personMedications);
  console.log('All medications:', allMedications);
  console.log('Person medications length:', personMedications?.length);
  console.log('All medications length:', allMedications?.length);
  console.log('Today medications:', todayMedications);
  console.log('Today medications length:', todayMedications?.length);

  // Bugünkü takip verilerini getir (yeni bir query oluşturacağız)
  const dailyTracking = useQuery(api.dailyTracking.getByPersonAndDate, {
    personName: personName,
    date: today
  });

  const createDailyTracking = useMutation(api.dailyTracking.create);
  const updateDailyTracking = useMutation(api.dailyTracking.update);

  // Sayfa yüklendiğinde bugünkü takip verilerini yükle
  useEffect(() => {
    if (dailyTracking) {
      const checkedIds = new Set(dailyTracking.medications || []);
      setCheckedMeds(checkedIds);
    }
  }, [dailyTracking]);

  const handleMedicationToggle = async (medicationId: string) => {
    const newCheckedMeds = new Set(checkedMeds);
    
    if (newCheckedMeds.has(medicationId)) {
      newCheckedMeds.delete(medicationId);
    } else {
      newCheckedMeds.add(medicationId);
    }
    
    setCheckedMeds(newCheckedMeds);

    // Veritabanını güncelle
    const medications = Array.from(newCheckedMeds);
    
    if (dailyTracking) {
      // Mevcut kaydı güncelle
      await updateDailyTracking({
        id: dailyTracking._id,
        medications: medications
      });
    } else {
      // Yeni kayıt oluştur
      await createDailyTracking({
        personName: personName,
        date: today,
        medications: medications
      });
    }
  };

  const getMedicationStatus = (medicationId: string) => {
    return checkedMeds.has(medicationId);
  };

  // İlacın kaç gündür kullanıldığını hesapla
  const getDaysUsed = (medication: any) => {
    const startDate = new Date(medication.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={onBack}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              ← Geri
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {personName} - Günlük İlaç Takibi
            </h1>
            <div className="ml-auto text-sm text-gray-500">
              {new Date().toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {personMedications?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {personName} için henüz ilaç kaydı bulunmuyor.
            </div>
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Geri Dön
            </button>
          </div>
        ) : todayMedications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              Bugün alınması gereken ilaç bulunmuyor.
            </div>
            <div className="text-sm text-gray-400 mb-4">
              Tüm ilaçlarınızı aldınız veya bugün ilaç gününüz değil.
            </div>
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Geri Dön
            </button>
          </div>
                 ) : (
           <div className="space-y-6">
             {/* İlaç Kartları */}
             <div className="bg-white shadow rounded-lg">
               <div className="px-6 py-4 border-b border-gray-200">
                 <h2 className="text-lg font-medium text-gray-900">
                   Kullanılan İlaçlar
                 </h2>
                 <p className="text-sm text-gray-500 mt-1">
                   {personName} için kayıtlı tüm ilaçlar
                 </p>
               </div>
               <div className="p-6">
                 {personMedications?.length === 0 ? (
                   <div className="text-center py-8">
                     <p className="text-gray-500">Henüz ilaç kaydı bulunmuyor.</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {personMedications?.map((medication: any) => (
                       <div
                         key={medication._id}
                         className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                       >
                         <div className="flex justify-between items-start mb-2">
                           <h3 className="font-medium text-gray-900">{medication.name}</h3>
                           <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                             {getDaysUsed(medication)} gün
                           </span>
                         </div>
                         <div className="space-y-1 text-sm text-gray-600">
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
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>

             {/* İstatistikler */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-white rounded-lg shadow p-6">
                 <div className="text-sm font-medium text-gray-500">Bugün Alınacak</div>
                 <div className="text-2xl font-bold text-gray-900">
                   {todayMedications.length}
                 </div>
               </div>
               <div className="bg-white rounded-lg shadow p-6">
                 <div className="text-sm font-medium text-gray-500">Bugün Alınan</div>
                 <div className="text-2xl font-bold text-green-600">
                   {checkedMeds.size}
                 </div>
               </div>
               <div className="bg-white rounded-lg shadow p-6">
                 <div className="text-sm font-medium text-gray-500">Kalan</div>
                 <div className="text-2xl font-bold text-orange-600">
                   {todayMedications.length - checkedMeds.size}
                 </div>
               </div>
             </div>

                         {/* Günlük İlaç Takibi */}
             <div className="bg-white shadow rounded-lg">
               <div className="px-6 py-4 border-b border-gray-200">
                 <h2 className="text-lg font-medium text-gray-900">
                   Bugünkü İlaç Takibi
                 </h2>
                 <p className="text-sm text-gray-500 mt-1">
                   Bugün alınması gereken ilaçları işaretleyin
                 </p>
               </div>
                             <div className="divide-y divide-gray-200">
                 {todayMedications.map((medication: any) => (
                  <div
                    key={medication._id}
                    className="px-6 py-4 flex items-center space-x-4"
                  >
                    <button
                      onClick={() => handleMedicationToggle(medication._id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        getMedicationStatus(medication._id)
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {getMedicationStatus(medication._id) && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                                                                           <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {medication.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {medication.frequency === "daily" ? `Günde ${medication.frequencyCount} kez` :
                               medication.frequency === "weekly" ? `Haftada ${medication.frequencyCount} kez` :
                               `${medication.frequencyCount} kez`}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              Başlangıç: {new Date(medication.startDate).toLocaleDateString('tr-TR')}
                            </div>
                            {medication.instructions && (
                              <div className="text-xs text-gray-400 mt-1">
                                {medication.instructions}
                              </div>
                            )}
                          </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

                         {/* Tamamlandı Mesajı */}
             {checkedMeds.size === todayMedications.length && todayMedications.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Tebrikler! Bugünkü tüm ilaçlarınızı aldınız.
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      Yarın tekrar görüşmek üzere!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
