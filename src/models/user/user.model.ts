import { userModelInterface } from '@/interfaces';
import { createHashPassword } from '@/utils';
import { Schema, model } from 'mongoose';

const userSchema = new Schema<userModelInterface>(
  {
    name: { type: String, required: true, default: null },
    email: { type: String, required: true, default: null, unique: true },
    contact: { type: Number, default: null },
    password: { type: String, required: true, default: null, select: false },
    passLastUpdated: { type: Date, default: null, select: false },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await createHashPassword(this.password);
    return next();
  }
  return next();
});

const User = model<userModelInterface>('User', userSchema);

export { User };
