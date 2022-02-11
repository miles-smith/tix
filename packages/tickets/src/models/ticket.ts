import { Model, Schema, HydratedDocument, model, } from 'mongoose';

// Interface that defines a subset of the full document, which exposes e.g. only those
// attributes that may be supplied by an end user.
interface TicketAttributes {
  userId: string;
  title: string;
  price: Schema.Types.Decimal128;
}

// Interface that defines what a *complete* document looks like.
interface TicketDocument extends TicketAttributes {}

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
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform(_doc, ret) {
      delete ret._id;
      return ret;
    }
  }
});

// Factory method ensures we get type checking on incoming args when instantiatng a new object.
schema.static('build', (attributes: TicketAttributes) => {
  return new Ticket(attributes);
});

const Ticket = model<TicketDocument, TicketModel>('Ticket', schema);

export { Ticket };
