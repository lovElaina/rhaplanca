import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
    const [file, setFile] = useState(null);
    const [htmlContent, setHtmlContent] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const response = await axios.post('/api/upload', formData);
            setHtmlContent(response.data.html);
        } catch (error) {
            console.error('上传失败', error);
        }
    };

    return (
        <div>
            <h2>上传PDF并转换为HTML</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>上传并转换</button>
            <div>
                <h3>转换后的HTML内容：</h3>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
            </div>
        </div>
    );
}

export default Upload; 