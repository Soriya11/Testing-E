// import  links from "./links";

// Meteor.methods({
//   fetchData: async () => {
//     const list = await links.find().fetch();
//     // const list = links.aggregate([]);

//     return list;
//   },
// insertLink: async ({name,price,imageUr,}) =>{
// return await links.insertAsync({
//     name,
//     price,
//     imageUrl,
//     createdAt: new Date(),
//     updatedAt: new Date(),
// })
// },
// updateLink: async ({ _id, name, price, imageUrl }) => {
//   const res = await links.updateAsync(
//     { _id },
//     { $set: { name, price, imageUrl, updatedAt: new Date() } }
//   );

//   return res;
// },
// removeLink: async ({ _id }) => {
//   return await links.removeAsync({ _id });
// },

// });
