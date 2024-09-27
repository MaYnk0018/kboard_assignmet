import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongo';
import { Project } from '../../../../models/dbconfig';

// Fetch a specific project
export async function GET(req, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching project', error: error.message }, { status: 500 });
  }
}

// Update a specific project
export async function PUT(req, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const { projectName } = await req.json();
    const updatedProject = await Project.findByIdAndUpdate(id, {
      projectName,
      updatedAt: new Date(),
    }, { new: true });

    if (!updatedProject) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project updated successfully', updatedProject }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating project', error: error.message }, { status: 500 });
  }
}

// Delete a specific project
export async function DELETE(req, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Project deleted successfully', deletedProject }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting project', error: error.message }, { status: 500 });
  }
}
