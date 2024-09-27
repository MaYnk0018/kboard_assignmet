import mongoose from 'mongoose';

// UserAuth Schema
const userAuthSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 45,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 45,
  },
  mobile: {
    type: String,
    required: true,
    maxlength: 45,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// OTP Schema
const otpSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
    maxlength: 45,
  },
  hashedOtp: {
    type: String,
    required: true,
    maxlength: 255,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Project Schema
const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAuth', // Referencing the UserAuth model
    required: true,
  },
  projectName: {
    type: String,
    required: true,
    maxlength: 45,
  },
  tasks: {
    type: Array, // Since tasks are stored as JSON
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Task Schema
const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // Referencing the Project model
    required: true,
  },
  taskStatus: {
    type: String,
    required: true,
    maxlength: 45,
  },
  taskDetails: {
    type: Object, // Since taskDetails are stored as JSON
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Exporting all models in one file
const UserAuth = mongoose.models.UserAuth || mongoose.model('UserAuth', userAuthSchema);
const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export { UserAuth, Otp, Project, Task };
