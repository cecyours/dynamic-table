// src/app/api/products/route.ts

import { NextResponse } from 'next/server';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

const productsData: Product[] = [
  { id: 1, name: "Product 1", price: 50, category: "Electronics" },
  { id: 2, name: "Product 2", price: 100, category: "Clothing" },
  { id: 3, name: "Product 3", price: 75, category: "Sports" },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("searchTerm") || "";
  const sortBy = (searchParams.get("sortBy") || "name") as keyof Product;
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const pageSize = 2;

  let filteredData = productsData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  