import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongo';
import { Project } from '../../../../../models/dbconfig';

// Create a new project or get all projects
export async function POST(req) {
  await connectDB();

  try {
    const { userId, projectName } = await req.json();
    const newProject = new Project({
      userId,
      projectName,
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await newProject.save();
    return NextResponse.json({ message: 'Project created successfully', newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding project', error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();

  const url = new URL(req.url);
  // const { userId, projectName } = await req.json();
  const userId = url.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 400 }
    ); // Bad Request if userId is not provided
  }

  try {
    const projects = await Project.find({ userId });
    if (!projects || projects.length === 0) {
      return NextResponse.json(
        { message: 'No projects found for this user' },
        { status: 404 }
      ); // Not Found if no projects are found
    }
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Error fetching projects', error: error.message }, { status: 500 });
  }
}
