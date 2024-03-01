import mongoose from 'mongoose';

const BusinessSchema = mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  impactLevel: { type: String, required: [true, 'Impact level is required'] },
  operationTime: {
    type: String,
    required: [true, 'Operation time is required'],
  },
  category: { type: String, required: [true, 'Category is required'] },
  size: { type: String, required: [true, 'Size is required'] },
  state: { type: Boolean, default: true },
});

BusinessSchema.methods.toJSON = function () {
  const { __v, _id, ...business } = this.toObject();
  business.bid = _id;
  return business;
};

export default mongoose.model('Business', BusinessSchema);
