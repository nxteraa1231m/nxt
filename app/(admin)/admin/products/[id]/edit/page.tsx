import EditProductClient from "@/components/admin/EditProductClient";

export async function generateStaticParams() {
  return [{ id: "sample" }];
}

export const dynamicParams = false;

export default function EditProductPage() {
  return <EditProductClient />;
}
