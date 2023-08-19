require('chai').should();
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../src/app.js');

chai.use(chaiHttp);

describe('Application tests', () => {
    describe('/', () => {
        it('has status 200', done => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done(err);
                });
        });
    });

    describe('/non/existent/path', () => {
        it('has status 404', done => {
            chai.request(app)
                .get('/non/existent/path')
                .end((err, res) => {
                    res.should.have.status(404);
                    done(err);
                });
        });
    });
});
