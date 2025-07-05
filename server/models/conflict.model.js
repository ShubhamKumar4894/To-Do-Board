import mongoose from "mongoose";

const conflictSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  originalVersion: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  conflictingVersions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    version: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  },
  resolutionMethod: {
    type: String,
    enum: ['merge', 'overwrite', 'keep_original']
  },
  boardId: {
    type: String,
    default: 'main'
  }
}, {
  timestamps: true
});

// Index for efficient queries
conflictSchema.index({ taskId: 1, isResolved: 1 });
conflictSchema.index({ boardId: 1, isResolved: 1 });

// Static method to create conflict
conflictSchema.statics.createConflict = async function(taskId, originalVersion, conflictingVersion, userId, boardId = 'main') {
  // Check if conflict already exists for this task
  let conflict = await this.findOne({ taskId, isResolved: false });
  
  if (conflict) {
    // Add to existing conflict
    conflict.conflictingVersions.push({
      userId,
      version: conflictingVersion,
      timestamp: new Date()
    });
  } else {
    // Create new conflict
    conflict = new this({
      taskId,
      originalVersion,
      conflictingVersions: [{
        userId,
        version: conflictingVersion,
        timestamp: new Date()
      }],
      boardId
    });
  }
  
  await conflict.save();
  return conflict.populate('conflictingVersions.userId', 'username');
};

// Static method to resolve conflict
conflictSchema.statics.resolveConflict = async function(conflictId, resolvedBy, resolutionMethod, finalVersion) {
  const conflict = await this.findById(conflictId);
  if (!conflict) throw new Error('Conflict not found');
  
  conflict.isResolved = true;
  conflict.resolvedBy = resolvedBy;
  conflict.resolvedAt = new Date();
  conflict.resolutionMethod = resolutionMethod;
  
  await conflict.save();
  
  // Update the actual task with resolved version
  const Task = mongoose.model('Task');
  await Task.findByIdAndUpdate(conflict.taskId, {
    ...finalVersion,
    lastEditedBy: resolvedBy,
    lastEditedAt: new Date()
  });
  
  return conflict;
};

module.exports = mongoose.model('Conflict', conflictSchema);
