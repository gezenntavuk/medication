import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Tüm aile üyelerini getir
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("familyMembers")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});

// Yeni aile üyesi ekle
export const create = mutation({
  args: {
    name: v.string(),
    age: v.optional(v.number()),
    relationship: v.optional(v.string()),
    allergies: v.optional(v.array(v.string())),
    medicalConditions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("familyMembers", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Aile üyesi güncelle
export const update = mutation({
  args: {
    id: v.id("familyMembers"),
    name: v.optional(v.string()),
    age: v.optional(v.number()),
    relationship: v.optional(v.string()),
    allergies: v.optional(v.array(v.string())),
    medicalConditions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Aile üyesi sil (soft delete)
export const remove = mutation({
  args: { id: v.id("familyMembers") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    });
  },
});
