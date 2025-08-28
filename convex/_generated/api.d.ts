/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as activeMedications from "../activeMedications.js";
import type * as dailyTracking from "../dailyTracking.js";
import type * as familyMembers from "../familyMembers.js";
import type * as medicalSupplies from "../medicalSupplies.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  activeMedications: typeof activeMedications;
  dailyTracking: typeof dailyTracking;
  familyMembers: typeof familyMembers;
  medicalSupplies: typeof medicalSupplies;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
