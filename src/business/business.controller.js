import express from 'express';
import bcryptjs from 'bcryptjs';
import Business from './business.model.js';
import exceljs from 'exceljs';

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

//Method for generating an Excel report of all the registered businesses
export const businessExcel = async (req, res) => {
  try {
    const businesses = await Business.find();
    const excelWork = new exceljs.Workbook();
    const excelSheet = excelWork.addWorksheet('Businesses');

    //Adding rows according to the business parameters
    excelSheet.addRow([
      'Name',
      'Impact Level',
      'Operation Time',
      'Category',
      'Size',
    ]);

    //Adding the data of each and every business to the created rows
    businesses.forEach((businessRow) => {
      excelSheet.addRow([
        businessRow.name,
        businessRow.impactLevel,
        businessRow.operationTime,
        businessRow.category,
        businessRow.size,
      ]);
    });

    //Content type header
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    //Filename header
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="businessesReport.xlsx"'
    );

    await excelWork.xlsx.write(res);

    res.end();
  } catch (e) {
    console.log('Unexpected error ocurred while generating a report:', e);
    return res.status(500).json({
      e: 'Unexpected Error',
    });
  }
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

//Order business by name, category and operation time

export const businessOrder = async (req, res = Response) => {
  const { orderReference } = req.params;

  let sorting, orderMode;

  switch (parseInt(orderReference)) {
    case 1:
      sorting = 'name';
      orderMode = 'asc';
      break;
    case 2:
      sorting = 'name';
      orderMode = 'desc';
      break;
    case 3:
      sorting = 'operationTime';
      orderMode = 'asc';
      break;
    case 4:
      sorting = 'category';
      orderMode = 'asc';
      break;
    default:
      sorting = 'name';
      orderMode = 'asc';
  }

  const businesses = await Business.find().sort({ [sorting]: orderMode });
  res.status(200).json({ businesses });
};
