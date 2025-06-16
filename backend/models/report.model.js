import mongoose from 'mongoose';

const { Schema } = mongoose;

const reportSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      enum: ['Spam', 'Abusive Content', 'False Information', 'Other'],
      required: true,
    },
    comment: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed'],
      default: 'pending',
    },
  },
  { timestamps: true, versionKey: false }
);

// Secure uniqueness: prevent duplicate reports
reportSchema.index({ postId: 1, reporterId: 1 }, { unique: true });

export default mongoose.model('Report', reportSchema);
