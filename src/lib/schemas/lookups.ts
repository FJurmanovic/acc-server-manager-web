import * as z from 'zod';

export const trackSchema = z.object({
	track: z.string(),
	uniquePitBoxes: z.number().int().nonnegative(),
	privateServerSlots: z.number().int().nonnegative()
});

export type Track = z.infer<typeof trackSchema>;

export const carModelSchema = z.object({
	value: z.number().int().nonnegative(),
	carModel: z.string()
});
export type CarModel = z.infer<typeof carModelSchema>;

export const driverCategorySchema = z.object({
	value: z.number().int().nonnegative(),
	category: z.string()
});
export type DriverCategory = z.infer<typeof driverCategorySchema>;

export const cupCategorySchema = z.object({
	value: z.number().int().nonnegative(),
	category: z.string()
});
export type CupCategory = z.infer<typeof cupCategorySchema>;

export const sessionTypeSchema = z.object({
	value: z.number().int().nonnegative(),
	sessionType: z.string()
});
export type SessionType = z.infer<typeof sessionTypeSchema>;
