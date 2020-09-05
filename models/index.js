import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import gradeModel from './gradeModel.js';

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB;
db.gradeModel = gradeModel(mongoose);

export { db };
