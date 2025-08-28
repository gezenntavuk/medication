"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import MedicalSuppliesSection from "./components/MedicalSuppliesSection";
import ActiveMedicationsSection from "./components/ActiveMedicationsSection";
import FamilyMembersSection from "./components/FamilyMembersSection";

export default function Home() {
  const [activeTab, setActiveTab] = useState("supplies");
  const medicalSupplies = useQuery(api.medicalSupplies.getAll);
  const activeMedications = useQuery(api.activeMedications.getAll);
  const familyMembers = useQuery(api.familyMembers.getAll);

  const tabs = [
    { id: "supplies", name: "Tıbbi Malzemeler", icon: "🏥" },
    { id: "medications", name: "Aktif İlaçlar", icon: "💊" },
    { id: "family", name: "Aile Üyeleri", icon: "👨‍👩‍👧‍👦" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">🏠 Ev Sağlık Yönetimi</h1>
          </div>
        </div>
      </header>

      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="hidden md:block bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

        {activeTab === "supplies" && (<MedicalSuppliesSection />)}
        {activeTab === "medications" && (<ActiveMedicationsSection />)}
        {activeTab === "family" && (<FamilyMembersSection />)}
      </main>

      {/* Mobile App Bar - Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 px-4 min-w-0 flex-1 transition-colors ${
                activeTab === tab.id
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span className="text-xs font-medium truncate">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
