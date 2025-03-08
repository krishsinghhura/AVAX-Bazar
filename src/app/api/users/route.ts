import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface User {
  address: string;
  role: string;
}

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  const { address, role } = reqBody;

  if (!address || !role) {
    return NextResponse.json(
      { message: "Adsress and Role is missing" },
      { status: 401 }
    );
  }

  try {
    const newUser = await prisma.users.create({
      data: { address, role },
    });
    return NextResponse.json(newUser);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  try {
    const foundUser = await prisma.users.findFirst({
      where: { address: address as string },
    });

    return NextResponse.json(foundUser);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 201 });
  }
}
