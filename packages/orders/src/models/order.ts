import { Model, Schema, HydratedDocument, Document, model, } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@elevenhotdogs-tix/common';
import { TicketDocument } from './ticket';

// Interface that defines a subset of the full document, which exposes e.g. only those
// attributes that may be supplied by an end user.
interface OrderAttributes {
  userId:    string;
  status:    OrderStatus;
  expiresAt: Date;
  ticket:    TicketDocument;
}

interface OrderDocument extends Document {
  version:   number;
  userId:    string;
  status:    OrderStatus;
  expiresAt: Date;
  ticket:    TicketDocument;
}

interface OrderModel extends Model<OrderDocument> {
  build(attributes: OrderAttributes): HydratedDocument<OrderDocument>;
}

const schema = new Schema<OrderDocument, OrderModel>({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    type: Schema.Types.Date
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  }
}, {
  versionKey: 'version',
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
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
schema.static('build', (attributes: OrderAttributes) => {
  return new Order(attributes);
});

const Order = model<OrderDocument, OrderModel>('Order', schema);

export { Order, OrderAttributes, OrderDocument, OrderStatus };
