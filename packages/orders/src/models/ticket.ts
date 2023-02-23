import { Model, Schema, HydratedDocument, Document, Decimal128, model, } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

// Interface that defines a subset of the full document, which exposes e.g. only those
// attributes that may be supplied by an end user.
interface TicketAttributes {
  id:    string;
  title: string;
  price: string;
}

interface TicketDocument extends Document {
  version: number;
  title:   string;
  price:   Decimal128;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDocument> {
  build(attributes: TicketAttributes): HydratedDocument<TicketDocument>;
  findByEvent(event: { id: string, version: number}): Promise<HydratedDocument<TicketDocument> | null>;
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
  // TODO: Smarter way of transforming `id` to `_id` without having to explicitly list/set all other attrs. 
  return new Ticket({
    _id:   attributes.id,
    title: attributes.title,
    price: attributes.price,
  });
});

schema.static('findByEvent', (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  });
});

schema.methods.isReserved = async function() {
  const order = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!order;
};

const Ticket = model<TicketDocument, TicketModel>('Ticket', schema);

export { Ticket, TicketAttributes, TicketDocument };
