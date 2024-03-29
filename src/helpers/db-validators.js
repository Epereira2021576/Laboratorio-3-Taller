import User from '../users/user.model.js';
import Business from '../business/business.model.js';

export const emailExists = async (email = '') => {
  const existsEmail = await User.findOne({ email });
  if (existsEmail) {
    throw new Error(`The email ${email} is already registered`);
  }
};

export const userExistsById = async (id = '') => {
  const existsUser = await User.findById(id);
  if (!existsUser) {
    throw new Error(`A user with the ID: ${id} does not exist`);
  }
};

export const businessExists = async (name = '') => {
  const existsBusiness = await Business.findOne({ name });
  if (existsBusiness) {
    throw new Error(`A business with the name: ${name} already exists`);
  }
};

export const businessExistsById = async (id = '') => {
  const existsBusiness = await Business.findById(id);
  if (!existsBusiness) {
    throw new Error(`A business with the ID: ${id} does not exist`);
  }
};
