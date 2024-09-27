import { connectDB } from "../../../lib/mongo";
import {Task} from '../../../models/dbconfig';

export default async function handler(req, res) {
  const { method } = req;
  const { taskId } = req.query; // Dynamic route parameter for taskId

  await connectDB();

  switch (method) {
    case 'POST':
      // Add new task
      try {
        const { projectId, task } = req.body;
        const newTask = new Task({
          projectId,
          taskStatus: task.taskStatus,
          taskDetails: [
            {
              taskTitle: task.taskDetails.taskTitle,
              taskDescription: task.taskDetails.taskDescription,
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', newTask });
      } catch (error) {
        res.status(500).json({ message: 'Error adding task', error: error.message });
      }
      break;

    case 'GET':
      // Get a specific task by taskId OR list all tasks for a project
      try {
        if (taskId) {
          // Fetch the task by taskId
          const task = await Task.findById(taskId);
          if (!task) {
            return res.status(404).json({ message: 'Task not found' });
          }
          res.status(200).json({ task });
        } else {
          // List all tasks for a project
          const { projectId } = req.query;
          const tasks = await Task.find({ projectId });
          res.status(200).json({ tasks });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
      }
      break;

    case 'PUT':
      // Update a task
      try {
        const { taskStatus, taskDetails } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
          taskId,
          {
            taskStatus,
            taskDetails: [
              {
                taskTitle: taskDetails.taskTitle,
                taskDescription: taskDetails.taskDescription,
              },
            ],
            updatedAt: new Date(),
          },
          { new: true }
        );
        if (!updatedTask) {
          return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task updated successfully', updatedTask });
      } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
      }
      break;

    case 'DELETE':
      // Delete a task
      try {
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
          return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully', deletedTask });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
