import { Model, Schema, HydratedDocument, model } from 'mongoose';

// Interface that defines a subset of the full document, which exposes e.g. only those
// attributes that may be supplied by an end user.
interface UserAttributes {
  email: string;
  password: string;
}

// Interface that defines what a *complete* user document looks like.
interface UserDocument extends UserAttributes {}

interface UserModel extends Model<UserDocument> {
  build(attributes: UserAttributes): HydratedDocument<UserDocument>;
}

const schema = new Schema<UserDocument, UserModel>({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

// Factory method ensures we get type checking on incoming args when instantiatng a new object.
// -> `const user = User.build({ email: 'user@example.com' })` will correctly show TS errors
// -> `const user = new User({ email: 'user@example.com' })` will not!
schema.static('build', (attributes: UserAttributes) => {
  return new User(attributes);
});

const User = model<UserDocument, UserModel>('User', schema);

export { User };
