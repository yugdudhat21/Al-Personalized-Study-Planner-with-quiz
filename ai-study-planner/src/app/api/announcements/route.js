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
  },
  {
    id: 'ann-2',
    title: 'Mathematics Assignment 4 Deadline Extended',
    content: 'Assignment 4 on Integral Calculus deadline has been extended to Friday 11:59 PM. Submit via Assignments portal.',
    priority: 'Normal',
    category: 'Homework',
    author: 'Dr. Mehta (Math Dept)',
    date: 'Yesterday, 04:15 PM',
  },
];

export async function GET() {
  return NextResponse.json({ success: true, announcements: announcementsStore });
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
    };

    announcementsStore.unshift(newAnnouncement);

    return NextResponse.json({ success: true, announcement: newAnnouncement });
  } catch (err) {
    console.error('Error posting announcement:', err);
    return NextResponse.json({ error: 'Failed to post announcement' }, { status: 500 });
  }
}
