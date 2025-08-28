import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Kişi ve tarihe göre günlük takip verilerini getir
export const getByPersonAndDate = query({
  args: {
    personName: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dailyTracking")
      .filter((q) => q.eq(q.field("personName"), args.personName))
      .filter((q) => q.eq(q.field("date"), args.date))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
  },
});

// Yeni günlük takip kaydı oluştur
export const create = mutation({
  args: {
    personName: v.string(),
    date: v.string(),
    medications: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("dailyTracking", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Günlük takip kaydını güncelle
export const update = mutation({
  args: {
    id: v.id("dailyTracking"),
    medications: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Günlük takip kaydını sil (soft delete)
export const remove = mutation({
  args: { id: v.id("dailyTracking") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    });
  },
});

// Kişinin tüm günlük takip verilerini getir
export const getByPerson = query({
  args: { personName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dailyTracking")
      .filter((q) => q.eq(q.field("personName"), args.personName))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});
