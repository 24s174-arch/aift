const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Neon DB 연결 설정
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// [기능 1] 회원가입 (계정 추가)
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
        res.status(201).json({ message: "계정이 성공적으로 생성되었습니다!" });
    } catch (err) {
        res.status(400).json({ message: "이미 존재하는 아이디이거나 오류가 발생했습니다." });
    }
});

// [기능 2] 'S 4 내신' 계획 저장
app.post('/api/save-plan', async (req, res) => {
    const { username, plan_data } = req.body;
    try {
        await pool.query(
            'INSERT INTO study_plans (username, plan_data) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET plan_data = $2',
            [username, JSON.stringify(plan_data)]
        );
        res.json({ message: "계획이 안전하게 저장되었습니다." });
    } catch (err) {
        res.status(500).json({ message: "저장 중 오류 발생" });
    }
});

// [기능 3] 'S 4 일상' 설문 데이터 업데이트
app.post('/api/survey', async (req, res) => {
    const { field } = req.body;
    try {
        await pool.query('UPDATE survey_results SET vote_count = vote_count + 1 WHERE field_name = $1', [field]);
        res.json({ message: "설문 결과가 반영되었습니다." });
    } catch (err) {
        res.status(500).json({ message: "설문 처리 오류" });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`서버가 포트 ${process.env.PORT}에서 실행 중입니다.`);
});
// 모든 게시글 가져오기 (댓글 포함)
app.get('/api/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "게시글 불러오기 실패" });
    }
});

// 게시글 작성
app.post('/api/posts', async (req, res) => {
    const { username, title, content } = req.body;
    try {
        await pool.query('INSERT INTO posts (username, title, content) VALUES ($1, $2, $3)', 
        [username, title, content]);
        res.status(201).json({ message: "게시글이 등록되었습니다." });
    } catch (err) {
        res.status(500).json({ message: "등록 실패" });
    }
});

// 댓글 작성
app.post('/api/comments', async (req, res) => {
    const { post_id, username, content } = req.body;
    try {
        await pool.query('INSERT INTO comments (post_id, username, content) VALUES ($1, $2, $3)', 
        [post_id, username, content]);
        res.status(201).json({ message: "댓글 등록 완료" });
    } catch (err) {
        res.status(500).json({ message: "댓글 등록 실패" });
    }
});