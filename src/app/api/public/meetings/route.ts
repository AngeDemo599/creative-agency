import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST - Public endpoint for booking meetings
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.date || !data.time) {
      return NextResponse.json(
        { error: "Name, email, date, and time are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate date is in the future
    const meetingDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (meetingDate < today) {
      return NextResponse.json(
        { error: "Meeting date must be in the future" },
        { status: 400 }
      );
    }

    // Check for existing meeting at same time
    const existingMeeting = await prisma.meeting.findFirst({
      where: {
        date: meetingDate,
        time: data.time,
        status: { not: "cancelled" },
      },
    });

    if (existingMeeting) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please choose another time." },
        { status: 400 }
      );
    }

    const meeting = await prisma.meeting.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        service: data.service || null,
        date: meetingDate,
        time: data.time,
        duration: data.duration || 30,
        notes: data.notes || null,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Meeting booked successfully! We will confirm your appointment shortly.",
      meeting: {
        id: meeting.id,
        date: meeting.date,
        time: meeting.time,
      },
    });
  } catch (error) {
    console.error("Error booking meeting:", error);
    return NextResponse.json(
      { error: "Failed to book meeting. Please try again." },
      { status: 500 }
    );
  }
}

// GET - Get available time slots for a specific date
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);

    // Get booked meetings for this date
    const bookedMeetings = await prisma.meeting.findMany({
      where: {
        date: date,
        status: { not: "cancelled" },
      },
      select: { time: true },
    });

    const bookedTimes = bookedMeetings.map((m) => m.time);

    // Available time slots (9 AM to 6 PM, 30-minute intervals)
    const allTimeSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    ];

    const availableSlots = allTimeSlots.filter(
      (slot) => !bookedTimes.includes(slot)
    );

    return NextResponse.json({
      date: dateStr,
      availableSlots,
      bookedSlots: bookedTimes,
    });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch available times" },
      { status: 500 }
    );
  }
}
