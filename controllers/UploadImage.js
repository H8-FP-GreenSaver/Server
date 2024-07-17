const { db } = require("../config/firebase");

class UploadImage {
  static async uploadImage(req, res, next) {
    try {
      
      const { fullName, threadCaption, profileUrl } = req.body;
      const imageUrl = req.file.path;
     
     
      const postData = {
        fullName,
        threadCaption: threadCaption || "",
        profileUrl,
        imageUrl,
        createdAt: new Date(),
      };

      const docRef = await db.collection("threads").add(postData);

      res.status(201).json({ id: docRef.id, ...postData });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = UploadImage;
