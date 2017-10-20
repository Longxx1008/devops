const assert = require('assert'); // 断言库
const request = require('supertest'); // api访问库
describe('测试一个大逻辑', () => {
    // it('测试一个接口第一步  /api', () => {
    //     request('https://www.baidu.com')
    //         .get('/')
    //         .expect(200)
    //         .expect('Content-Type', /html/)
    //         .end(function (err, res) {
    //             expect(res).to.be.an('object');
    //             done();
    //         });
    // })
    it('测试一个外部接口第二步 /api', () => {
        request('/project/api/project/operation/grayenvironmentmanage/deploy/info')
            .get('/')
            .expect(200)
            .end(function (err, res) {
                expect(res.success).to.be.an(0);
                done();
            });
    })
})