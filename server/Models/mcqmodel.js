import mongoose from "mongoose";

const MCQSchema = new mongoose.Schema({
    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MCQList',
      required: true
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          return v.length > 1;
        },
        message: props => `An MCQ must have at least 2 options!`
      }
    },
    correctAnswer: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v) {
          return v.length > 0 && v.every(num => num >= 0 && num <= this.options.length);
        },
        message: props => `${props.value} is not a valid array of correct answers!`
      }
    },
    createdAt: { 
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const MCQ = mongoose.model('MCQ', MCQSchema);
  export default MCQ;