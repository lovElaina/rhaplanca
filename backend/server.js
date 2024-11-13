const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('pdf'), async (req, res) => {
    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);
        const htmlContent = `<html><body>${data.text.replace(/\n/g, '<br/>')}</body></html>`;
        res.json({ html: htmlContent });
    } catch (error) {
        console.error('转换失败', error);
        res.status(500).send('转换失败');
    }
});

app.listen(5000, () => {
    console.log('服务器运行在端口5000');
}); 