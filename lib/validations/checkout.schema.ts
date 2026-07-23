import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^(\+20|0)?1[0-2,5]{1}[0-9]{8}$/, "Enter a valid Egyptian phone number"),
  whatsappPhone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+20|0)?1[0-2,5]{1}[0-9]{8}$/.test(val),
      "Enter a valid Egyptian WhatsApp number"
    ),
  governorate: z.string().min(2, "Please select your governorate"),
  city: z.string().min(2, "City / Area is required"),
  address: z.string().min(8, "Please enter your full detailed address"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["vodafone_cash", "instapay"], {
    errorMap: () => ({ message: "Please select a payment method" }),
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
