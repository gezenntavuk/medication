import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Tüm tıbbi malzemeleri getir
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("medicalSupplies")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});

// Yeni tıbbi malzeme ekle
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("medicalSupplies", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Tıbbi malzeme güncelle
export const update = mutation({
  args: {
    id: v.id("medicalSupplies"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    quantity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Tıbbi malzeme sil (soft delete)
export const remove = mutation({
  args: { id: v.id("medicalSupplies") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    });
  },
});
