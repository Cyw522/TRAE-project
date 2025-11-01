const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  try {
    // 只允许POST方法
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ success: false, message: '只支持POST请求' }),
      };
    }

    // 解析请求体
    const data = JSON.parse(event.body);
    const { address, phone, message, prize } = data;

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || '1972635933@qq.com',
        pass: process.env.EMAIL_PASS || 'fetffkoaaizddifb'
      }
    });

    // 构建邮件内容
    const emailBody = `
【爱的告白 - 新订单信息】

地址: ${address}
手机号: ${phone}
想对阿常说的话: ${message}
幸运奖品: ${prize}

时间: ${new Date().toLocaleString('zh-CN')}
    `;

    // 发送邮件
    const info = await transporter.sendMail({
      from: '"爱的告白" <1972635933@qq.com>',
      to: process.env.EMAIL_RECIPIENT || '1972635933@qq.com',
      subject: '【爱的告白】新的订单信息',
      text: emailBody,
      html: `<pre style="font-family: Arial, sans-serif;">${emailBody.replace(/\n/g, '<br>')}</pre>`
    });

    console.log('邮件发送成功，消息ID:', info.messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: '邮件发送成功',
        messageId: info.messageId
      })
    };
  } catch (error) {
    console.error('邮件发送失败:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: '邮件发送失败',
        error: error.message
      })
    };
  }
};