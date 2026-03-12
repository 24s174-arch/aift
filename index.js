const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Render에서 설정한 DATABASE_URL 환경변수를 사용하여 연결 풀 생성
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon 등 클라우드 DB 연결 시 SSL 설정 필수
  }
});

app.get('/', async (req, res) => {
  try {
    // test 테이블에서 name 컬럼 하나만 조회 (LIMIT 1)
    const result = await pool.query('SELECT name FROM test LIMIT 1');
    
    if (result.rows.length > 0) {
      const userName = result.rows[0].name;
      res.send(`<h1>Hello ${userName}</h1>`);
    } else {
      res.send('<h1>데이터가 없습니다.</h1>');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Database Error');
  }
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
