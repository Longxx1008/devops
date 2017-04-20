/**
 * Created by Administrator on 2016/4/21 0021.
 */

var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport("SMTP", {
    secureConnection: false, // use SSL
    host:'smtp.163.com',
    port: 25, // port for secure SMTP
    auth: {
        user: "weihu_zlqw@163.com",
        pass: "890asdbnm"
    }
});

var mailOption = {
    from : "weihu_zlqw@163.com",
    to : "409962307@qq.com",
    subject: "邮件主题",
    generateTextFromHTML : true,
    html : "&lt;p&gt;这是封测试邮件&lt;/p&gt;"
}

module.exports = {
    sendMail : function(title, content, target, cb){
        if(target){
            mailOption.to = target;
        }
        mailOption.subject = title;
        mailOption.html = content;
        transport.sendMail(mailOption, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }
            transport.close();
            if(cb){
                cb(error, response);
            }
        });
    }
}