const fs = require('fs');
const path = require('path');

// 'data' 폴더 안에 'info.txt'가 있다고 가정할 때
// __dirname은 현재 실행 중인 파일의 위치를 알려줍니다.
const filePath = path.join(__dirname, 'science 4 all', 'index.html');

app.get('/read-file', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일 읽기 실패:', err);
            return res.status(500).send('파일을 찾을 수 없습니다.');
        }
        res.send(`파일 내용: ${data}`);
    });
});
const axios = require('axios');

app.get('/fetch-github', async (req, res) => {
    // GitHub의 'Raw' 버튼을 눌렀을 때 나오는 URL을 사용해야 합니다.
    const rawUrl = 'https://raw.githubusercontent.com/사용자이름/저장소명/main/data.json';

    try {
        const response = await axios.get(rawUrl);
        res.json(response.data);
    } catch (error) {
        console.error('GitHub 파일 호출 실패:', error);
        res.status(500).send('GitHub 데이터를 가져오지 못했습니다.');
    }
});
