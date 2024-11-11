import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Items from './collection';
import Categories from '../category/collection';
import SimpleSchema from 'simpl-schema';

// Fixed: Removed the extra `i` from the aggregate function
Meteor.methods({
  'fetchItemsWithCategories'() {
    return Items.rawCollection().aggregate([
      {
        $lookup: {
          from: Categories.rawCollection().collectionName,
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categoryInfo'
        },
      },
      {
        $unwind: {
          path: '$categoryInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          cost: 1,
          description: 1,
          status: 1,
          categoryId: 1,
          imageUrl: 1,
          categoryName: '$categoryInfo.name',
        },
      },
    ]).toArray();
  },
});


new ValidatedMethod({
  name: 'fetchItems',
  validate: null,
  async run() {
    if (Meteor.isServer) {
      return await Items.find().fetch();
    }
  },
});

new ValidatedMethod({
  name: 'findItemsById',
  validate: new SimpleSchema({
    _id: String,
  }).validator(),
  async run({ _id }) {
    if (Meteor.isServer) {
      return await Items.findOneAsync({ _id });
    }
  }
});

new ValidatedMethod({
  name: 'itemsOpts',
  validate: null,
  async run() {
    if (Meteor.isServer) {
      const data = await Categories.find().fetch();
      return data.map(it => ({ label: it.name, value: it._id }));
    }
  }
});

new ValidatedMethod({
  name: 'insertItems',
  validate: new SimpleSchema({
    name: String,
    price: Number,
    description: String,
    categoryId: String,
    imageUrl: String,
    cost: Number,
    status: String,
  }).validator(),
  async run(itemsData) {
    if (Meteor.isServer) {
      return await Items.insertAsync(itemsData);
    }
  },
});

new ValidatedMethod({
  name: 'updateItems',
  validate: new SimpleSchema({
    _id: String,
    name: String,
    price: Number,
    description: String,
    categoryId: String,
    imageUrl: {
      type: String,
      optional: true,
    },
    cost: Number,
    status: String,
  }).validator(),
  async run(itemsData) {
    if (Meteor.isServer) {
      const updateData = { ...itemsData };
      if (!updateData.imageUrl) updateData.imageUrl = null;

      console.log("Updating item data on server:", updateData); 

      return await Items.updateAsync(
        { _id: updateData._id },
        { $set: updateData }
      );
    }
  },
});

new ValidatedMethod({
  name: 'removeItemsById',
  validate: new SimpleSchema({
    _id: String,
  }).validator(),
  async run({ _id }) {
    if (Meteor.isServer) {
      return await Items.removeAsync({ _id });
    }
  },
});
