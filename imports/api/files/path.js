import { Meteor } from "meteor/meteor";
import path from "path";

export const getFilePath = () => {
  // const { appName = "App" } = Meteor.settings.public;
  return Meteor.isProduction
    ? `uploads-rabbit`
    : path.join(
        `${process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]}`,
        `uploads-rabbit`
      );
};
