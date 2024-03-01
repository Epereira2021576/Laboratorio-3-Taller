import { Response, Request } from 'express';
import bcryptjs from 'bcryptjs';
import Business from './business.model.js';

//Post method
export const businessPost = async (req, res) => {
  const { name, impactLevel, operationTime, category, size } = req.body;
  const business = new Business({
    name,
    impactLevel,
    operationTime,
    category,
    size,
  });

  await business.save();
  res.status(200).json({ business });
};

//Get method

export const businessGet = async (req, res) => {
  const { limit, from } = req.query;
  const query = { state: true };

  const [total, businesses] = await Promise.all([
    Business.countDocuments(query),
    Business.find(query).skip(Number(from)).limit(Number(limit)),
  ]);
  res.status(200).json({ total, businesses });
};

//Put method
export const businessPut = async (req, res) => {
  const { id } = req.params;
  const { _id, state, ...rest } = req.body;

  if (rest.password) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(rest.password, salt);
  }

  const business = await Business.findByIdAndUpdate(id, rest, { new: true });
  res.status(200).json({ business });
};
