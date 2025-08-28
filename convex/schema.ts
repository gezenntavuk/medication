import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tıbbi malzemeler tablosu
  medicalSupplies: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    quantity: v.number(),
    expiryDate: v.optional(v.string()),
    isExpiringSoon: v.optional(v.boolean()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Aktif ilaçlar tablosu
  activeMedications: defineTable({
    name: v.string(),
    genericName: v.optional(v.string()),
    frequency: v.string(), // Sıklık: daily, weekly
    frequencyCount: v.number(), // Kaç kez: 1-7 arası
    prescribedFor: v.string(),
    prescribedBy: v.optional(v.string()),
    startDate: v.string(), // Başlangıç tarihi
    endDate: v.optional(v.string()),
    instructions: v.optional(v.string()),
    sideEffects: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Aile üyeleri tablosu
  familyMembers: defineTable({
    name: v.string(),
    age: v.optional(v.number()),
    relationship: v.optional(v.string()),
    allergies: v.optional(v.array(v.string())),
    medicalConditions: v.optional(v.array(v.string())),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Günlük ilaç takibi tablosu
  dailyTracking: defineTable({
    personName: v.string(),
    date: v.string(),
    medications: v.array(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});
