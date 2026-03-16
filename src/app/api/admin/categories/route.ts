import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where = type ? { type } : {};

    const categories = await prisma.category.findMany({
      where,
      orderBy: [{ type: 'asc' }, { order: 'asc' }]
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Generate slug from name if not provided
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        type: data.type,
        order: data.order || 0,
        isActive: data.isActive ?? true
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // Check if name is changing — cascade to projects/FAQs
    const currentCategory = await prisma.category.findUnique({ where: { id } });
    if (!currentCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const newName = updateData.name;
    const nameChanged = newName && newName !== currentCategory.name;

    const category = await prisma.$transaction(async (tx) => {
      const updated = await tx.category.update({
        where: { id },
        data: updateData
      });

      // Cascade name change to projects and FAQs that reference the old name
      if (nameChanged) {
        if (currentCategory.type === "project") {
          await tx.project.updateMany({
            where: { category: currentCategory.name },
            data: { category: newName },
          });
        }
        if (currentCategory.type === "faq") {
          await tx.fAQ.updateMany({
            where: { category: currentCategory.name },
            data: { category: newName },
          });
        }
      }

      return updated;
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // Check if any projects/FAQs reference this category
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (category.type === "project") {
      const projectCount = await prisma.project.count({ where: { category: category.name } });
      if (projectCount > 0) {
        return NextResponse.json(
          { error: `Cannot delete: ${projectCount} project(s) use this category. Reassign them first.` },
          { status: 400 }
        );
      }
    }

    if (category.type === "faq") {
      const faqCount = await prisma.fAQ.count({ where: { category: category.name } });
      if (faqCount > 0) {
        return NextResponse.json(
          { error: `Cannot delete: ${faqCount} FAQ(s) use this category. Reassign them first.` },
          { status: 400 }
        );
      }
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
