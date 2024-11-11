import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Categories = new  Mongo.Collection('categories');
const Schema = new SimpleSchema({
  name: String,
});

Categories.attachSchema?.(Schema)

export default Categories;

