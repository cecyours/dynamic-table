// src/app/api/users/route.ts

import { NextResponse } from 'next/server';

// Define the type for users
type User = {
  id: number;
  name: string;
  age: number;
  role: string;
};

const usersData: User[] = [
  { id: 1, name: "Alice", age: 25, role: "Admin" },
  { id: 2, name: "Bob", age: 30, role: "User" },
  { id: 3, name: "Charlie", age: 35, role: "Moderator" },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("searchTerm") || "";
  const sortBy = (searchParams.get("sortBy") || "name") as keyof User;
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const pageSize = 2;

  let filteredData = usersData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filteredData.sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;
    return a[sortBy] > b[sortBy] ? order : -order;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({
    data: paginatedData,
    totalPages,
    currentPage: page,
  });
}

  