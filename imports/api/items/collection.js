import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Items = new Mongo.Collection('items');
const Schema = new SimpleSchema({
    name: String,
    price: Number,
    description: String,
    categoryId: String,
    cost: Number,
    status: String,
    imageUrl: String
});
Items.attachSchema?.(Schema)
export default (Items);

