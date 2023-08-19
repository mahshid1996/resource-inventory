require("chai").should();
const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");
const chaiSorted = require("chai-sorted");

const serviceEndpoint = "/v1/logical-resource";
const serviceEndP = "/v1/physical-resource";
const app = require("../src/app.js");

chai.use(chaiHttp);
chai.use(chaiSorted);

describe("Queries hook tests", () => {
    describe("Testing basic query parameter", () => {
        it('Testing "type" query parameter', (done) => {
            chai
                .request(app)
                .get(`${serviceEndpoint}?_id=64dfa15902652347e6e610b8`)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.an("array");
                    const [firstItem] = response.body;

                    //additional assertions
                    expect(firstItem).to.be.an("object");
                    expect(firstItem).to.have.property("@baseType");
                    expect(firstItem["@baseType"]).to.equal("LogicalResource");

                    done(error);
                });
        });
        it('Testing "type","regex","baseType"."fields" and "sort"  in the query', (done) => {
            chai
                .request(app)
                .get(
                    `${serviceEndpoint}?type=MSISDN&limit=1&value.regex=^1000&baseType=LogicalResource&fields=name,resourceCharacteristic&sort=name`
                )
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.an("array");
                    if (response.body.length !== 0) {

                        //define the expected values
                        const expectedName = "MSISDN1";
                        const expectedResourceCharacteristic = [
                            {
                                publicIdentifier: true,
                                code: "MSISDN",
                                name: "MSISDN",
                                value: "10000110103449140",
                                valueType: "string",
                            },
                            {
                                publicIdentifier: false,
                                code: "Class",
                                name: "Mobile class",
                                value: "normal",
                                valueType: "string",
                            },
                        ];

                        const [firstItem] = response.body;

                        //use Chai's assertions to validate specific properties
                        expect(firstItem).to.have.property("name").that.equals(expectedName);
                        expect(firstItem.resourceCharacteristic).to.deep.include(expectedResourceCharacteristic[0]);
                        expect(firstItem.resourceCharacteristic).to.deep.include(expectedResourceCharacteristic[1]);
                    }

                    done(error);
                });
        });


        it('Testing "offset" and "gte" query parameter', (done) => {
            const query = new Date("2023-08-18T16:50:34.003Z");
            chai
                .request(app)
                .get(`${serviceEndpoint}?offset=1&createdAt.gte=${query.toISOString()}`)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.an("array");
                    const [firstItem] = response.body;

                    //additional assertions
                    expect(firstItem).to.be.an("object");
                    expect(firstItem).to.have.property("@baseType");
                    expect(firstItem["@baseType"]).to.equal("LogicalResource");
                    done(error);
                });
        });

        it('Testing "resourceCharacteristic.code" query parameter', (done) => {
            const query = `?limit=2&resourceCharacteristic.code=MSISDN|10000110103449140`;

            chai
                .request(app)
                .get(serviceEndpoint + query)
                .end((error, response) => {
                    response.should.have.status(200);

                    response.body.should.be.an("array");
                    const [firstItem] = response.body;
                    //additional assertions
                    expect(firstItem).to.be.an("object");
                    expect(firstItem).to.have.property("resourceStatus");
                    expect(firstItem["resourceStatus"]).to.equal("Available");

                    done(error);
                });
        });

    });
});