import { NextResponse } from 'next/server';

// In-memory announcements store with sample initial notices
let announcementsStore = [
  {
    id: 'ann-1',
    title: 'Mid-Term Physics Exam Schedule Announced',
    content: 'The Mid-Term Physics exam will be held next Monday at 10:00 AM. Complete Chapter 3 revision in your AI Study Planner.',
    priority: 'Urgent',
    category: 'Exam Alert',
    author: 'Prof. Sharma (Physics Dept)',
    date: 'Today, 09:30 AM',
    isPublished: true,
  },
  {
    id: 'ann-2',
    title: 'Mathematics Assignment 4 Deadline Extended',
    content: 'Assignment 4 on Integral Calculus deadline has been extended to Friday 11:59 PM. Submit via Assignments portal.',
    priority: 'Normal',
    category: 'Homework',
    author: 'Dr. Mehta (Math Dept)',
    date: 'Yesterday, 04:15 PM',
    isPublished: true,
  },
];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const isStudent = searchParams.get('role') === 'student';

  // If student requesting, filter to only published announcements
  const list = isStudent
    ? announcementsStore.filter((item) => item.isPublished)
    : announcementsStore;

  return NextResponse.json({ success: true, announcements: list });
}

export async function POST(req) {
  try {
    const { title, content, priority = 'Normal', category = 'General Note' } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      priority,
      category,
      author: 'Teacher Portal (Faculty)',
      date: 'Just now',
      isPublished: true,
    };

    announcementsStore.unshift(newAnnouncement);

    return NextResponse.json({ success: true, announcement: newAnnouncement });
  } catch (err) {
    console.error('Error posting announcement:', err);
    return NextResponse.json({ error: 'Failed to post announcement' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, title, content, priority, category, isPublished } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });
    }

    const index = announcementsStore.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    // Update properties if provided
    if (title !== undefined) announcementsStore[index].title = title;
    if (content !== undefined) announcementsStore[index].content = content;
    if (priority !== undefined) announcementsStore[index].priority = priority;
    if (category !== undefined) announcementsStore[index].category = category;
    if (isPublished !== undefined) announcementsStore[index].isPublished = isPublished;

    return NextResponse.json({ success: true, announcement: announcementsStore[index] });
  } catch (err) {
    console.error('Error updating announcement:', err);
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });
    }

    announcementsStore = announcementsStore.filter((a) => a.id !== id);

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('Error deleting announcement:', err);
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
