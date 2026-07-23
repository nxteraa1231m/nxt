import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^(\+20|0)?1[0-2,5]{1}[0-9]{8}$/, "Enter a valid Egyptian phone number"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(10, "Please enter your full address"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["vodafone_cash", "instapay"], {
    errorMap: () => ({ message: "Please select a payment method" }),
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
