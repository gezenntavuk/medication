import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Tüm aktif ilaçları getir
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("activeMedications")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});

// Yeni aktif ilaç ekle
export const create = mutation({
  args: {
    name: v.string(),
    genericName: v.optional(v.string()),
    dosage: v.string(),
    frequency: v.optional(v.string()),
    duration: v.optional(v.string()),
    prescribedFor: v.string(),
    prescribedBy: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    instructions: v.optional(v.string()),
    sideEffects: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("activeMedications", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Aktif ilaç güncelle
export const update = mutation({
  args: {
    id: v.id("activeMedications"),
    name: v.optional(v.string()),
    genericName: v.optional(v.string()),
    dosage: v.optional(v.string()),
    frequency: v.optional(v.string()),
    duration: v.optional(v.string()),
    prescribedFor: v.optional(v.string()),
    prescribedBy: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    instructions: v.optional(v.string()),
    sideEffects: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Aktif ilaç sil (soft delete)
export const remove = mutation({
  args: { id: v.id("activeMedications") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    });
  },
});

// Kişiye göre ilaçları getir
export const getByPerson = query({
  args: { prescribedFor: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activeMedications")
      .filter((q) => q.eq(q.field("prescribedFor"), args.prescribedFor))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});

// Süresi dolmak üzere olan ilaçları getir
export const getEndingSoon = query({
  args: { days: v.number() },
  handler: async (ctx, args) => {
    const allMedications = await ctx.db
      .query("activeMedications")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const now = new Date();
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + args.days);

    return allMedications.filter((medication) => {
      if (!medication.endDate) return false;
      const endDate = new Date(medication.endDate);
      return endDate <= threshold && endDate >= now;
    });
  },
});
