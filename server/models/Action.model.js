import mongoose from "mongoose";

const actionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'created_task',
      'updated_task',
      'deleted_task',
      'moved_task',
      'assigned_task',
      'smart_assigned_task',
      'changed_priority',
      'completed_task',
      'reopened_task'
    ]
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  taskTitle: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed, 
    default: {}
  },
  boardId: {
    type: String,
    default: 'main',
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false // custom timestamp
});

// Index for efficient queries (most recent first)
actionSchema.index({ boardId: 1, timestamp: -1 });

// Static method to get recent actions
actionSchema.statics.getRecentActions = (boardId = 'main', limit = 20) =>{
  return this.find({ boardId })
    .populate('userId', 'username')
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to log action
actionSchema.statics.logAction = async function(actionData) {
  const action = new this(actionData);
  await action.save();
  
  // (keep only last 100)
  const count = await this.countDocuments({ boardId: actionData.boardId || 'main' });
  if (count > 100) {
    const oldActions = await this.find({ boardId: actionData.boardId || 'main' })
      .sort({ timestamp: -1 })
      .skip(100);
    
    const oldActionIds = oldActions.map(action => action._id);
    await this.deleteMany({ _id: { $in: oldActionIds } });
  }
  
  return action.populate('userId', 'username');
};

module.exports = mongoose.model('Action', actionSchema);
