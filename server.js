const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 创建邮件传输器
const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: '1972635933@qq.com',
        pass: 'fetffkoaaizddifb' // 用户提供的新授权码
    }
});

// 测试连接
transporter.verify((error, success) => {
    if (error) {
        console.error('邮件服务器连接失败:', error);
    } else {
        console.log('邮件服务器连接成功，准备发送邮件');
    }
});

// 邮件发送接口
app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, body } = req.body;
        
        console.log('收到邮件发送请求:', {
            to,
            subject,
            body
        });
        
        // 发送邮件
        const info = await transporter.sendMail({
            from: '"爱的告白" <1972635933@qq.com>',
            to: to || '1972635933@qq.com',
            subject: subject,
            text: body,
            html: `<pre style="font-family: Arial, sans-serif;">${body.replace(/\n/g, '<br>')}</pre>`
        });
        
        console.log('邮件发送成功，消息ID:', info.messageId);
        
        res.status(200).json({
            success: true,
            message: '邮件发送成功',
            messageId: info.messageId
        });
    } catch (error) {
        console.error('邮件发送失败:', error);
        res.status(500).json({
            success: false,
            message: '邮件发送失败',
            error: error.message
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('邮件发送API端点: http://localhost:3000/send-email');
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: '服务器运行正常'
    });
});