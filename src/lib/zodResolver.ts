import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

export function zResolver<T>(
  schema: z.Schema<T>
) {
  return async (values: unknown, _context?: any) => {
    try {
      const result = schema.parse(values);
      return {
        values: result,
        errors: {},
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });
        return {
          values: {},
          errors: fieldErrors,
        };
      }
      throw error;
    }
  };
}