import { Model, Schema, Document, HydratedDocument, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentAttributes {
  orderId:  string;
  chargeId: string;
}

interface PaymentDocument extends Document {
  version:  number;
  orderId:  string;
  chargeId: string;
}

interface PaymentModel extends Model<PaymentDocument> {
  build(attributes: PaymentAttributes): HydratedDocument<PaymentDocument>;
}

const schema = new Schema<PaymentDocument, PaymentModel>({
  orderId: {
    type: String,
    required: true,
  },
  chargeId: {
    type: String,
    required: true,
  }
}, {
  versionKey: 'version',
  toJSON: {
    virtuals: true,
    transform(_doc, ret) {
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

schema.static('build', (attributes: PaymentAttributes) => {
  return new Payment(attributes);
});

const Payment = model<PaymentDocument, PaymentModel>('Payment', schema);

export { Payment, PaymentAttributes, PaymentDocument }
