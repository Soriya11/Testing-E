import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Categories from "./collection";
import SimpleSchema from 'simpl-schema';


new ValidatedMethod({
    name: 'fetchCategories',
    mixins: [],
    validate: null,
    async run() {
        if (Meteor.isServer) {
            const data = await Categories.find().fetch();
            
            return data;
        }
    }
});


new ValidatedMethod({
    name: 'findCategoryById',
    mixins: [],
    validate: new SimpleSchema({
        _id: String
    }).validator(),
    async run({ _id }) {
        if (Meteor.isServer) {
            const data = await Categories.findOne({ _id });
            return data;
        }
    }
});

new ValidatedMethod({
    name: 'categoryOpts',
    mixins: [],
    validate: null,
    async run() {
        if (Meteor.isServer) {
            const data = await Categories.find().fetch();
            return data.map(it => ({ label: it.name, value: it._id }));
        }
    }
});

// Insert a new category
new ValidatedMethod({
    name: 'insertCategory',
    mixins: [],
    validate: new SimpleSchema({
        name: String,
    
    }).validator(),
    async run(categoryData) {
        if (Meteor.isServer) {
            return await Categories.insertAsync(categoryData);
        }
    }
});

new ValidatedMethod({
    name: 'updateCategory',
    mixins: [],
    validate: new SimpleSchema({
        _id: String,
        name: String,

    }).validator(),
    async run(categoryData) {
        if (Meteor.isServer) {
            return await Categories.updateAsync({ _id: categoryData._id }, { $set: categoryData });
        }
    }
});

// Remove a category by ID
new ValidatedMethod({
    name: 'removeCategoryById',
    mixins: [],
    validate: new SimpleSchema({
        _id: String,
    }).validator(),
    async run({ _id }) {
        if (Meteor.isServer) {
            return await Categories.removeAsync({ _id });
        }
    }
});
