import multer from 'multer';
import pdf from 'pdf-parse';
import fs from 'fs';
import nextConnect from 'next-connect';

const upload = multer({
    storage: multer.diskStorage({
        destination: '/tmp/uploads', // Vercel 的临时文件夹
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
});

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `抱歉，发生错误: ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `方法 '${req.method}' 不被允许` });
    },
});

apiRoute.use(upload.single('pdf'));

apiRoute.post(async (req, res) => {
    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);
        const htmlContent = `<html><body>${data.text.replace(/\n/g, '<br/>')}</body></html>`;
        res.status(200).json({ html: htmlContent });
    } catch (error) {
        console.error('转换失败', error);
        res.status(500).json({ error: '转换失败' });
    }
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // 关闭默认的 body 解析
    },
};