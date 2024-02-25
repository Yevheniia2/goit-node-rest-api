import { model, Schema } from 'mongoose';
import { handleMongooseError } from '../helpers/handleMongooseError.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.post("save", handleMongooseError);

const Contact = model('Contact', contactSchema);

export default Contact;