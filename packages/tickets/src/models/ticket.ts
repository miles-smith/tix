import { Model, Schema, HydratedDocument, model, } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Interface that defines a subset of the full document, which exposes e.g. only those
// attributes that may be supplied by an end user.
interface TicketAttributes {
  userId: string;
  title:  string;
  price:  string; // We'll let Mongoose handle decimal conversion!
}

// Interface that defines what a *complete* document looks like.
// TODO: Can these two interfaces be DRY'ed?
interface TicketDocument {
  version: number;
  userId:  string;
  title:   string;
  price:   Schema.Types.Decimal128;
}

interface TicketModel extends Model<TicketDocument> {
  build(attributes: TicketAttributes): HydratedDocument<TicketDocument>;
}

const schema = new Schema<TicketDocument, TicketModel>({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Schema.Types.Decimal128,
    required: true
  },
}, {
  versionKey: 'version',
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      ret.price = doc.price.toString();
      delete ret._id;
      return ret;
    }
  }
});

// NOTE: There's currently an open PR for an issue with `mongoose-update-if-current` and
// Typescript compatibility: https://github.com/eoin-obrien/mongoose-update-if-current/pull/454
// We'll tell TS to ignore this for now...
// @ts-ignore
schema.plugin(updateIfCurrentPlugin);

// Factory method ensures we get type checking on incoming args when instantiatng a new object.
schema.static('build', (attributes: TicketAttributes) => {
  return new Ticket(attributes);
});

const Ticket = model<TicketDocument, TicketModel>('Ticket', schema);

export { Ticket, TicketAttributes };
