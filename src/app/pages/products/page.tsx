// src/app/pages/products/page.tsx

import DataTable from "../../../components/DataTable";

const productColumns = [
  { Header: "Name", accessor: "name" },
  { Header: "Price", accessor: "price" },
  { Header: "Category", accessor: "category" },
];

export default function ProductsPage() {
  return (
    <div>
      <h1>Products Table</h1>
      <DataTable columns={productColumns} fetchDataUrl="/api/products" />
    </div>
  );
}
