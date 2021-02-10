import { getStorage } from '../../utils/storage/firebaseStorage';
import { verifyIdToken } from '../../utils/auth/firebaseAdmin'
import { File } from "formidable";
import Formidable from "formidable-serverless";
import fs from "fs";

//https://github.com/vercel/next.js/discussions/11634

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = async (req, res) => {
  try {
    const file = req.headers.name

    const verifideToken = await verifyIdToken(req.headers.token)
    const path = verifideToken.uid + '/' + file

    const storage = getStorage()
    const bucket = storage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
    const storageFile = bucket.file(path)

    return new Promise(async (resolve, reject) => {
      const form = new Formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
      });
  
      form
        .on("file", (name: string, file: File) => {
          const data = fs.readFileSync(file.path);
          storageFile.save(data)
        })
        .on("aborted", () => {
          reject(res.status(500).send('Aborted'))  
        })
        .on("end", () => {
          resolve(res.status(200).send('done'));
        });

        await form.parse(req)
    })
  } catch (error) {
    console.log(error)
    return res.status(401).send('You are unauthorised')
  }
}

export default upload
