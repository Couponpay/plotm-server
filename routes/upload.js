import express from "express";
import AWSController from "../controllers/AWSController";
const router = express.Router();

router.post('/Upload_Image', AWSController.Upload_Image);

router.post('/Upload_File', AWSController.Upload_File);

router.post('/Delete_AWS_Image', async (req, res) => {
    let Result = await AWSController.DeleteAWSImage(req.body.fname);
    res.json(Result);
});

export default router;