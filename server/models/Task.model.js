import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must be assigned to a user"],
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastEditedAt: {
      type: Date,
      default: Date.now,
    },
    position: {
      type: Number,
      default: 0,
    },
    boardId: {
      type: String,
      default: "main",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ title: 1, boardId: 1 }, { unique: true });
taskSchema.index({ status: 1, boardId: 1 });
taskSchema.index({ assignedUser: 1, status: 1 });

taskSchema.pre("save", (next) => {
  const columnNames = ["Todo", "In Progress", "Done"];
  if (columnNames.includes(this.title)) {
    const error = new Error(
      "Task title cannot be same as column names (Todo, In Progress, Done)"
    );
    error.name = "ValidationError";
    return next(error);
  }
  this.lastEditedAt = new Date();
  next();
});

//static method to get tasks by status
taskSchema.statics.getTasksByStatus = function (status, boardId = "main") {
  return this.find({ status, boardId })
    .populate("assignedUser", "username email")
    .populate("createdBy", "username")
    .populate("lastEditedBy", "username")
    .sort({ position: 1, createdAt: -1 });
};

// Static method for smart assign logic
taskSchema.statics.getUserWithLeastActiveTasks = async function (
  boardId = "main"
) {
  const User = mongoose.model("User");

  // Get all active users
  const users = await User.find({ isActive: true });

  // Count active tasks (Todo + In Progress) for each user
  const userTaskCounts = await Promise.all(
    users.map(async (user) => {
      const activeTaskCount = await this.countDocuments({
        assignedUser: user._id,
        status: { $in: ["Todo", "In Progress"] },
        boardId,
      });
      return { user, activeTaskCount };
    })
  );

  
  let userWithLeastTasks = userTaskCounts[0];

  for (const user of userTaskCounts) {
    if (user.activeTaskCount < userWithLeastTasks.activeTaskCount) {
      userWithLeastTasks = user;
    }
  }

  return userWithLeastTasks.user;
};

const Task = mongoose.model("Task", taskSchema);
export default Task;
