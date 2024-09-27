import { connectDB } from "../../../lib/mongo";
import {UserAuth} from '../../../models/dbconfig';

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      return currentUser(req, res);
    
    case 'PUT':
      return updateUser(req, res);
    
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}

const currentUser = async (req, res) => {
  try {
    const { id } = req.query; // Using query instead of params for Next.js API routes
    const User = await UserAuth.findById(id);
    
    if (!User) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ User });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error in getting current user details' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.query; // Using query instead of params for Next.js API routes
    const { firstName, lastName, email, mobile } = req.body;

    const User = await UserAuth.findByIdAndUpdate(
      id,
      { firstName, lastName, email, mobile, updatedAt: new Date() },
      { new: true } // Return the updated document
    );

    if (!User) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ User, message: 'User details updated' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error in updating user details' });
  }
};
