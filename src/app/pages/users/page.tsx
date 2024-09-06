// src/app/pages/users/page.tsx

import DataTable from "../../../components/DataTable";

const userColumns = [
  { Header: "Name", accessor: "name" },
  { Header: "Age", accessor: "age" },
  { Header: "Role", accessor: "role" },
];

export default function UsersPage() {
  return (
    <div>
      <h1>Users Table</h1>
      <DataTable columns={userColumns} fetchDataUrl="/api/users" />
    </div>
  );
}
