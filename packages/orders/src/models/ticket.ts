import { Model, Schema, HydratedDocument, Document, Decimal128, model, } from 'mongoose';

// Interface that defines a subset of the full document, which exposes e.g. only those
// attributes that may be supplied by an end user.
interface TicketAttributes {
  title: string;
  price: string;
}

interface TicketDocument extends Document {
  title: string;
  price: Decimal128;
}

interface TicketModel extends Model<TicketDocument> {
  build(attributes: TicketAttributes): HydratedDocument<TicketDocument>;
}

const schema = new Schema<TicketDocument, TicketModel>({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Schema.Types.Decimal128,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform(doc, ret) {
      ret.price = doc.price.toString();
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

export { Ticket, TicketAttributes, TicketDocument };
