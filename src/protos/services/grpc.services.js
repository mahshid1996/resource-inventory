// Importing gRPC server and
var gg = require("@grpc/grpc-js");
var grpc = require("../../grpc.server");
const logger = require("../../logger");
var utility = require("../../util/utility");
const _ = require("lodash");

// Get proto file paths and load their definitions
var LOGICAL_PATH = "./src/protos/logical-resource.proto";
var CATEGORYsCHEMA_PATH = "./src/protos/category-schema.proto";
var PHYSICAL_PATH = "./src/protos/physical-resource.proto";
var CATEGORY_PATH = "./src/protos/resource-category.proto";

// const schema = require('../../services/v1/logical-resource/logical-resource.schema');

var logical = grpc.loadProtoDefinition(LOGICAL_PATH);
var categorys = grpc.loadProtoDefinition(CATEGORYsCHEMA_PATH);
var physical = grpc.loadProtoDefinition(PHYSICAL_PATH);
var category = grpc.loadProtoDefinition(CATEGORY_PATH);

var server = grpc.getServer();

//getting mongoose modle fro the qurey and update method.
const mongoose = require('mongoose');
const logicalModel = require("../../services/v1/logical-resource/logical-resource.mongoose");
const physicalModel = require("../../services/v1/physical-resource/physical-resource.mongoose");
const logicalResources = mongoose.model('logicalResources', logicalModel);
const physicalResources = mongoose.model('physicalResources', physicalModel);
//for manual recycle process
function manualCycle(data) {
  if (_.isEqual(data.resourceStatus, undefined)) {
    Object.assign(data, { resourceStatus: "Available" });
  } else {
    data.resourceStatus = "Available";
  }

  if (_.isEqual(data.operationalState, undefined)) {
    Object.assign(data, { operationalState: "Functional" });
  } else {
    data.operationalState = "Functional";
  }

  var time = new Date();
  if (_.isEqual(data.endOperatingDate, undefined)) {
    Object.assign(data, { endOperatingDate: time });
  } else {
    data.endOperatingDate = time;
  }

  return data;
}

// Capture query params from request for READ/READALL func
function getQueries(data) {
  if (data === null || data === {}) {
    return {
      query: {},
      route: {},
      provider: "grpc",
    };
  } else {
    var queryObj = {
      query: {},
      route: {},
      provider: "grpc",
      paginate: false,
    };

    //adding functionality for generate other fields in query
    for (let value of Object.keys(data)) {
      switch (value) {
        case "resourceStatus": // resourceStatus
          if (data.resourceStatus !== "") {
            queryObj.query["resourceStatus"] = data.resourceStatus;
          } else {
            delete queryObj.query["resourceStatus"];
          }
          break;
        case "operationalState": // resourceStatus
          if (data.operationalState !== "") {
            queryObj.query["operationalState"] = data.operationalState;
          } else {
            delete queryObj.query["operationalState"];
          }
          break;
        case "limit": // limit
          if (data.limit !== "") {
            queryObj.query["limit"] = data.limit;
          } else {
            delete queryObj.query["limit"];
          }
          break;
        case "value": // value
          if (data.value !== "") {
            queryObj.query["value"] = data.value;
          } else {
            delete queryObj.query["value"];
          }
          break;
        case "offset": // place
          if (data.offset !== "") {
            queryObj.query["offset"] = data.offset;
          } else {
            delete queryObj.query["offset"];
          }
          break;
        case "sort": // place
          if (data.sort !== "") {
            queryObj.query["sort"] = data.sort;
          } else {
            delete queryObj.query["sort"];
          }
          break;
        case "type": //type
          if (data.type !== "") {
            queryObj.query["type"] = data.type;
          } else {
            delete queryObj.query["type"];
          }
          break;
        case "regex": //regex
          if (data.regex !== "") {
            queryObj.query["regex"] = data.regex;
          } else {
            delete queryObj.query["regex"];
          }
          break;
        case "Query": //Query
          if (data.Query !== "") {
            queryObj.query["Query"] = data.Query;
          } else {
            delete queryObj.query["Query"];
          }
          break;
        case "place": // place
          if (data.place !== "") {
            queryObj.query["place"] = data.place;
          } else {
            delete queryObj.query["place"];
          }
          break;
        case "resourceSpecification": // resourceSpecification
          if (data.resourceSpecification !== "") {
            queryObj.query["resourceSpecification"] =
              data.resourceSpecification;
          } else {
            delete queryObj.query["resourceSpecification"];
          }
          break;
        case "productOffering": // productOffering
          if (data.productOffering !== "") {
            queryObj.query["productOffering"] = data.productOffering;
          } else {
            delete queryObj.query["productOffering"];
          }
          break;
        case "gt": //gt
          if (data.gt !== "") {
            queryObj.query["gt"] = data.gt;
          } else {
            delete queryObj.query["gt"];
          }
          break;
        case "gte": //gte
          if (data.gte !== "") {
            queryObj.query["gte"] = data.gte;
          } else {
            delete queryObj.query["gte"];
          }
          break;
        case "lt": //lt
          if (data.lt !== "") {
            queryObj.query["lt"] = data.lt;
          } else {
            delete queryObj.query["lt"];
          }
          break;
        case "lte": //lte
          if (data.lte !== "") {
            queryObj.query["lte"] = data.lte;
          } else {
            delete queryObj.query["lte"];
          }
          break;
        default:
          break;
      }
    }

    Object.entries(queryObj.query).forEach(([key, value]) => {
      if (key === "regex") {
        var i = 0;
        var keyRegex = "";
        var valueRegex = "";
        var lenOfValueRegex = value.length;
        var x = true;
        var j = 0;

        for (i; i < lenOfValueRegex; i++) {
          if (x) {
            keyRegex += value[i];
            if (value[i + 1] == ":") {
              x = false;
              j = i + 2;
            }
          }
        }

        if (!x) {
          for (j; j < lenOfValueRegex; j++) {
            valueRegex += value[j];
          }
        }

        let quertOfRegex = JSON.stringify(queryObj.query);
        var x = 0;
        var y = 0;
        let test1 = "";
        let finalQuertOfRegex = "";
        var flag = true;
        for (x; x < quertOfRegex.length; x++) {
          if (
            quertOfRegex[x] === '"' &&
            quertOfRegex[x + 1] === "r" &&
            quertOfRegex[x + 2] === "e" &&
            quertOfRegex[x + 3] === "g" &&
            quertOfRegex[x + 4] === "e" &&
            quertOfRegex[x + 5] === "x"
          ) {
            finalQuertOfRegex += quertOfRegex[x];
            if (flag) {
              for (y = x + 1; y < quertOfRegex.length; y++) {
                test1 += quertOfRegex[y];
                quertOfRegex[y] = "";

                if (quertOfRegex[y + 1] == '"') {
                  falg = false;
                  finalQuertOfRegex =
                    finalQuertOfRegex + keyRegex + '"' + ":" + '"' + valueRegex;
                  break;
                }
              }
              x = y + 3 + keyRegex.length + valueRegex.length + 1;
            }
            //
          } else {
            finalQuertOfRegex += quertOfRegex[x];
          }
        }
        queryObj.query = JSON.parse(finalQuertOfRegex);
      }

      //Query
      if (key === "Query") {
        //to converting '&' to ','
        var convertData = JSON.stringify(queryObj.query);
        if (convertData.indexOf("resourceCharacteristic:[") == -1) {
          var finalConvert = "";
          for (var k = 0; k < convertData.length; k++) {
            if (_.isEqual(convertData[k], "&")) {
              finalConvert += convertData[k].replace("&", ",");
            } else {
              finalConvert += convertData[k];
            }
          }

          var result = JSON.parse(finalConvert);
          let quertOfQuery = JSON.stringify(result);
          var x = 0;
          var y = 0;
          let finalQuertOfQuery = "";
          var flag = true;
          if (quertOfQuery.includes("Query")) {
            var indexQuery = quertOfQuery.indexOf("Query");
            indexQuery = indexQuery + 1;
            var finalQuery = quertOfQuery.replace('"Query":', "");

            for (x; x < finalQuery.length; x++) {
              if (flag) {
                finalQuertOfQuery = finalQuertOfQuery + finalQuery[x];
                x + 1 === indexQuery ? (flag = false) : (flag = true);
              } else {
                if (finalQuery[x] === "=") {
                  finalQuery[x].replace(finalQuery[x], "");
                  finalQuertOfQuery =
                    finalQuertOfQuery +
                    '"' +
                    ":" +
                    (finalQuery[x + 1] === "[" || finalQuery[x + 1] === "{"
                      ? ""
                      : '"');
                }
                // To support array while parsing into JSON object
                else if (finalQuery[x] === "[" && finalQuery[x + 1] !== "{") {
                  finalQuertOfQuery = finalQuertOfQuery + finalQuery[x] + '"';
                } else if (finalQuery[x] === "]" && finalQuery[x - 1] !== "}") {
                  finalQuertOfQuery[x].replace(finalQuertOfQuery[x], "");
                  finalQuertOfQuery = finalQuertOfQuery + '"]';
                } else if (
                  finalQuery[x] === '"' &&
                  (finalQuery[x - 1] !== "{" ||
                    finalQuery[x - 1] === ":" ||
                    finalQuery[x - 1] !== "[" ||
                    finalQuery[x - 1] === "]")
                ) {
                  finalQuery[x].replace(finalQuery[x], "");
                } else if (finalQuery[x] === "{" && finalQuery[x + 1] !== "[") {
                  finalQuertOfQuery = finalQuertOfQuery + '{"';
                } else if (finalQuery[x] === "}" && finalQuery[x - 1] !== "]") {
                  finalQuertOfQuery = finalQuertOfQuery + '"}';
                } else if (
                  finalQuery[x] === ":" &&
                  finalQuertOfQuery[x - 1] !== '"'
                ) {
                  finalQuertOfQuery = finalQuertOfQuery + '":';
                } else if (
                  finalQuery[x] === "," &&
                  (finalQuery[x + 1] !== "{" || finalQuery[x - 1] !== "}")
                ) {
                  finalQuertOfQuery =
                    finalQuertOfQuery +
                    (finalQuery[x - 1] !== "]" ? '"' : "") +
                    finalQuery[x] +
                    '"';
                } else {
                  finalQuertOfQuery = finalQuertOfQuery + finalQuery[x];
                }
              }
            }
          }

          var finalResult = "";
          for (var symb = 0; symb < finalQuertOfQuery.length; symb++) {
            if (finalQuertOfQuery[symb] === "/") {
              finalResult += finalQuertOfQuery[symb].replace("/", ",");
            } else {
              finalResult += finalQuertOfQuery[symb];
            }
          }

          queryObj.query = JSON.parse(finalResult);
        } else {
          var finalConvert = "";
          for (var k = 0; k < convertData.length; k++) {
            if (_.isEqual(convertData[k], "&")) {
              finalConvert += convertData[k]
                .replace("&", '","')
                .replace("=", ":");
            } else {
              finalConvert += convertData[k];
            }
          }
          if (finalConvert.includes("Query")) {
            var indexQuery = finalConvert.indexOf("Query");
            indexQuery = indexQuery + 1;
            var finalQuery = finalConvert.replace('"Query":', "");
          }

          queryObj.query = JSON.parse(finalConvert);
        }
      }

      //lte
      if (key === "lte") {
        var i = 0;
        var j = 0;
        var keyLte = "";
        var valueLte = "";
        var lenOfValueLte = value.length;
        var x = true;

        for (i; i < lenOfValueLte; i++) {
          if (x) {
            keyLte += value[i];
            if (value[i + 1] == ":") {
              x = false;
              j = i + 2;
            }
          }
        }

        if (!x) {
          for (j; j < lenOfValueLte; j++) {
            valueLte += value[j];
          }
        }

        let quertOfLte = JSON.stringify(queryObj.query);
        var x = 0;
        var y = 0;
        let finalQuertOfLte = "";
        var flag = true;

        for (x; x < quertOfLte.length; x++) {
          if (
            quertOfLte[x] === '"' &&
            quertOfLte[x + 1] === "l" &&
            quertOfLte[x + 2] === "t" &&
            quertOfLte[x + 3] === "e" &&
            quertOfLte[x + 4] === '"' &&
            quertOfLte[x + 5] === ":"
          ) {
            finalQuertOfLte += quertOfLte[x];
            if (flag) {
              for (y = x + 1; y < quertOfLte.length; y++) {
                quertOfLte[y] = "";
                if (quertOfLte[y + 1] == '"') {
                  falg = false;
                  finalQuertOfLte =
                    finalQuertOfLte + keyLte + '"' + ":" + '"' + valueLte;
                  break;
                }
              }
              x = y + 3 + keyLte.length + valueLte.length + 1;
            }
          } else {
            finalQuertOfLte += quertOfLte[x];
          }
        }
        queryObj.query = JSON.parse(finalQuertOfLte);
      } //end lte

      //lt
      if (key === "lt") {
        var i = 0;
        var j = 0;
        var keyLt = "";
        var valueLt = "";
        var lenOfValueLt = value.length;
        var x = true;

        for (i; i < lenOfValueLt; i++) {
          if (x) {
            keyLt += value[i];
            if (value[i + 1] == ":") {
              x = false;
              j = i + 2;
            }
          }
        }

        if (!x) {
          for (j; j < lenOfValueLt; j++) {
            valueLt += value[j];
          }
        }

        let quertOfLt = JSON.stringify(queryObj.query);
        var x = 0;
        var y = 0;
        let finalQuertOfLt = "";
        var flag = true;

        for (x; x < quertOfLt.length; x++) {
          if (
            quertOfLt[x] === '"' &&
            quertOfLt[x + 1] === "l" &&
            quertOfLt[x + 2] === "t" &&
            quertOfLt[x + 3] === '"' &&
            quertOfLt[x + 4] === ":" &&
            quertOfLt[x + 5] === '"'
          ) {
            finalQuertOfLt += quertOfLt[x];
            if (flag) {
              for (y = x + 1; y < quertOfLt.length; y++) {
                quertOfLt[y] = "";
                if (quertOfLt[y + 1] == '"') {
                  falg = false;
                  finalQuertOfLt =
                    finalQuertOfLt + keyLt + '"' + ":" + '"' + valueLt;
                  break;
                }
              }
              x = y + 3 + keyLt.length + valueLt.length + 1;
            }
          } else {
            finalQuertOfLt += quertOfLt[x];
          }
        }
        queryObj.query = JSON.parse(finalQuertOfLt);
      } //end lt

      //gte
      if (key === "gte") {
        var i = 0;
        var j = 0;
        var keyGte = "";
        var valueGte = "";
        var lenOfValueGte = value.length;
        var x = true;

        for (i; i < lenOfValueGte; i++) {
          if (x) {
            keyGte += value[i];
            if (value[i + 1] == ":") {
              x = false;
              j = i + 2;
            }
          }
        }

        if (!x) {
          for (j; j < lenOfValueGte; j++) {
            valueGte += value[j];
          }
        }

        let quertOfGte = JSON.stringify(queryObj.query);
        var x = 0;
        var y = 0;
        let finalQuertOfGte = "";
        var flag = true;

        for (x; x < quertOfGte.length; x++) {
          if (
            quertOfGte[x] === '"' &&
            quertOfGte[x + 1] === "g" &&
            quertOfGte[x + 2] === "t" &&
            quertOfGte[x + 3] === "e" &&
            quertOfGte[x + 4] === '"' &&
            quertOfGte[x + 5] === ":"
          ) {
            finalQuertOfGte += quertOfGte[x];
            if (flag) {
              for (y = x + 1; y < quertOfGte.length; y++) {
                quertOfGte[y] = "";
                if (quertOfGte[y + 1] == '"') {
                  falg = false;
                  finalQuertOfGte =
                    finalQuertOfGte + keyGte + '"' + ":" + '"' + valueGte;
                  break;
                }
              }
              x = y + 3 + keyGte.length + valueGte.length + 1;
            }
          } else {
            finalQuertOfGte += quertOfGte[x];
          }
        }
        queryObj.query = JSON.parse(finalQuertOfGte);
      } //end gte

      //gt
      if (key === "gt") {
        var i = 0;
        var j = 0;
        var keyGt = "";
        var valueGt = "";
        var lenOfValueGt = value.length;
        var x = true;

        for (i; i < lenOfValueGt; i++) {
          if (x) {
            keyGt += value[i];
            if (value[i + 1] == ":") {
              x = false;
              j = i + 2;
            }
          }
        }

        if (!x) {
          for (j; j < lenOfValueGt; j++) {
            valueGt += value[j];
          }
        }

        let quertOfGt = JSON.stringify(queryObj.query);
        var x = 0;
        var y = 0;
        let finalQuertOfGt = "";
        var flag = true;

        for (x; x < quertOfGt.length; x++) {
          if (
            quertOfGt[x] === '"' &&
            quertOfGt[x + 1] === "g" &&
            quertOfGt[x + 2] === "t" &&
            quertOfGt[x + 3] === '"' &&
            quertOfGt[x + 4] === ":" &&
            quertOfGt[x + 5] === '"'
          ) {
            finalQuertOfGt += quertOfGt[x];
            if (flag) {
              for (y = x + 1; y < quertOfGt.length; y++) {
                quertOfGt[y] = "";
                if (quertOfGt[y + 1] == '"') {
                  falg = false;
                  finalQuertOfGt =
                    finalQuertOfGt + keyGt + '"' + ":" + '"' + valueGt;
                  break;
                }
              }
              x = y + 3 + keyGt.length + valueGt.length + 1;
            }
          } else {
            finalQuertOfGt += quertOfGt[x];
          }
        }
        queryObj.query = JSON.parse(finalQuertOfGt);
      } //end gte
    });

    return queryObj;
  }
}

// Capture query params from request for Patch func
function patchQueries(data) {
  if (data === undefined || data === null || data === {}) {
    return {
      query: {},
      route: {},
      provider: "grpc",
    };
  } else {
    return {
      query: {
        action: data.action,
      },
      route: {},
      //provider: 'grpc',
      provider: data == "DRMSwap" ? "DRMSwap" : "grpc",
    };
  }
}


// start startLogicalResourceService
function startLogicalResourceService(app) {
  let getObjectById = {};
  server.addService(logical.protos.service.LogicalResource.service, {
    // ReadAll Command
    ReadAll: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var resultMessages = [];
      var count;
      var valid = grpc.validateJWT(call);
      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");
        const appLimit = getPaginationMax(app);
        if (call.request.limit > appLimit) {
          call.request.paginate = false;
          app
            .service("v1/logical-resource")
            .find(getQueries(call.request))
            .then((messages) => {
              count = messages.length;
              callback(null, {
                totalCount: count,
                appLimit: appLimit,
              });
            })
            .catch((error) => {
              logger.applog("error", t0, JSON.stringify(error));
              callback(error, "");
            });
        } else {
          app
            .service("v1/logical-resource")
            .find(getQueries(call.request))
            .then((messages) => {
              count = messages.length;
              messages.forEach(function (message) {
                resultMessages.push(
                  utility.replaceKeyWithoutSpecailSymbels(message)
                );
              });
              callback(null, {
                logicalResource: resultMessages,
                totalCount: count,
                appLimit: appLimit,
              });
            })
            .catch((error) => {
              logger.applog("error", t0, JSON.stringify(error));
              callback(error, "");
            });
        }
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // Create Command
    Create: function (call, callback) {
      // Get current time
      var t0 = new Date();
      

      var valid = grpc.validateJWT(call);
      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");
        app
          .service("v1/logical-resource")
          .create(
            utility.replaceKeyWithSpecialSymble(call.request.logicalResource)
          )
          .then((messages) => {
            logger.applog("debug", t0, JSON.stringify(messages));

            callback(null, {
              id: messages.id,
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // Delete Command
    Delete: function (call, callback) {
      // Get current time
      var t0 = new Date();
      

      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/logical-resource")
          .remove({
            _id: call.request.id,
          })
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "deleted record by id: " + JSON.stringify(messages)
            );

            callback(null, {
              result: "deleted record successfully with id " + messages.id,
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // ReadById Command
    ReadById: function (call, callback) {
      // Get current time
      var t0 = new Date();
      

      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/logical-resource")
          .get(
            {
              _id: call.request.id,
            },
            getQueries(call.request)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after executing read by id method: " +
              utility.replaceKeyWithoutSpecailSymbels(
                JSON.stringify(messages)
              )
            );

            callback(null, {
              logicalResource:
                utility.replaceKeyWithoutSpecailSymbels(messages),
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // Patch Command
    Update: function (call, callback) {
      // Get current time
      var t0 = new Date();
      

      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/logical-resource")
          .update(
            call.request.logicalResource.id,
            utility.replaceKeyWithSpecialSymble(call.request.logicalResource)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after data updated: " +
              utility.replaceKeyWithoutSpecailSymbels(
                JSON.stringify(messages)
              )
            );

            callback(null, {
              logicalResource:
                utility.replaceKeyWithoutSpecailSymbels(messages),
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },
    Patch: function (call, callback) {
      // Get current time
      var t0 = new Date();
      

      var formattedRequest = {};
      let finalObject = {};
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);

      var provider = call.metadata.get("provider")[0];
    
      if (valid) {
        app
          .service("v1/logical-resource")
          .get(
            {
              _id: call.request.id,
            },
            getQueries(call.request)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after executing read by id method for patch: " +
              JSON.stringify(messages)
            );

            getObjectById = messages;
            var requestWithSpecialSymbles = utility.replaceKeyWithSpecialSymble(
              call.request.logicalResource
            );
            formattedRequest = utility.patchFormateJSON(
              requestWithSpecialSymbles
            );
            //Checking data of isBundle and isMNP
            if (formattedRequest.isMNP !== undefined) {
              var isMNPValue =
                formattedRequest.isMNP.toLowerCase() === "true" ? true : false;
              Object.assign(formattedRequest, { isMNP: isMNPValue });
            }
            if (formattedRequest.isBundle !== undefined) {
              var isBundleValue =
                formattedRequest.isBundle.toLowerCase() === "true"
                  ? true
                  : false;
              Object.assign(formattedRequest, { isBundle: isBundleValue });
            }
            //fmanual recycle process
            if (!_.isEqual(call.request.action, undefined)) {
              if (_.isEqual(call.request.action, "recycle")) {
                manualCycle(formattedRequest);
              }
            }
            var finalObject = utility.deepmerge(
              getObjectById,
              formattedRequest
            );

            //assigining note value
            if(finalObject?.note && formattedRequest?.note){
              finalObject.note = formattedRequest.note;
            }
            //Checking resourceRelationship for removing poolId and capacityId of resourceRelationship for automatic recycling
            if (
              messages.isBundle !== undefined &&
              messages.isBundle === false &&
              messages.resourceRelationship !== undefined &&
              messages.resourceRelationship.length !== 0 &&
              messages.resourceStatus === "Retired" &&
              call.request.logicalResource.resourceStatus !== undefined &&
              call.request.logicalResource.resourceStatus === "Available"
            ) {
              let resourceRelationship = [];
              for (var i = 0; i < messages.resourceRelationship.length; i++) {
                if (
                  messages.resourceRelationship[i].relationshipType !==
                  "pool" &&
                  messages.resourceRelationship[i].relationshipType !==
                  "capacity"
                ) {
                  resourceRelationship.push(messages.resourceRelationship[i]);
                }
              }
   
              Object.assign(finalObject, {
                resourceRelationship: resourceRelationship,
              });
            }
            app
              .service("v1/logical-resource")
              .patch(
                call.request.id,
                finalObject,
                patchQueries(
                  call.request.action === ""
                    ? provider !== null
                      ? provider
                      : call.request.action
                    : call.request
                )
              )
              .then((messages) => {
                logger.applog(
                  "debug",
                  t0,
                  "after data updated: " +
                  utility.replaceKeyWithoutSpecailSymbels(
                    JSON.stringify(messages)
                  )
                );
                callback(null, {
                  logicalResource:
                    utility.replaceKeyWithoutSpecailSymbels(messages),
                });
              })
              .catch((error) => {
                logger.applog("error", t0, JSON.stringify(error));
                callback(error, "");
              });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },
    // GetByValue Command
    GetByValue: function (call, callback) {
      // Get current time
      var t0 = new Date();

      var valid = grpc.validateJWT(call);
      

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/logical-resource")
          .find(
            {
              query: {
                value: call.request.value,
                type: call.request.type,
              },
            },
            getQueries(call.request)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after executing get by value method: " +
              utility.replaceKeyWithoutSpecailSymbels(
                JSON.stringify(messages)
              )
            );

            callback(null, {
              logicalResource:
                utility.replaceKeyWithoutSpecailSymbels(messages),
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    DeleteByValue: function (call, callback) {
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      

      if (valid) {
        if (call.request.value && call.request.type) {
          app
            .service("v1/logical-resource")
            .find(
              {
                query: {
                  value: call.request.value,
                  type: call.request.type,
                },
              },
              getQueries(call.request)
            )
            .then((messages) => {
              logger.applog(
                "debug",
                t0,
                "after executing get by value method for delete: " +
                JSON.stringify(messages)
              );

              let resourceStatus;
              if (messages.length !== 0) {
                resourceStatus = messages[0].resourceStatus;
              } else {
                callback(
                  grpc.sendError(
                    gg.status.NOT_FOUND,
                    "Resource does not exist!"
                  ),
                  null
                );
              }

              if (
                resourceStatus === "Created" ||
                resourceStatus === "Available"
              ) {
                app
                  .service("v1/logical-resource")
                  .remove({
                    _id: messages[0].id,
                  })
                  .then((messages) => {
                    logger.applog(
                      "debug",
                      t0,
                      "after data DeleteByValue method: " +
                      utility.replaceKeyWithoutSpecailSymbels(
                        JSON.stringify(messages)
                      )
                    );
                    let deleteResponse = messages['@type'] !== 'StarterPack' ? ("deleted record successfully with id " + messages.id) : JSON.stringify(messages);
                    callback(null, {
                      result: deleteResponse
                    });

                  })
                  .catch((error) => {
                    logger.applog("error", t0, JSON.stringify(error));
                    callback(error, "");
                  });
              } else {
                callback(
                  grpc.sendError(
                    gg.status.FAILED_PRECONDITION,
                    "Resource is not in the state Avaiable or Created"
                  ),
                  null
                );
              }
            })
            .catch((error) => {
              logger.applog("error", t0, JSON.stringify(error));
              callback(error, "");
            });
        } else {
          callback(
            grpc.sendError(
              gg.status.INVALID_ARGUMENT,
              "User passing INVALID_ARGUMENT."
            ),
            null
          );
        }
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    PatchByValue: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var formattedRequest = {};
      let finalObject = {};
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);

      if (valid) {
        //when we don't have resourceStatus field or previous resourceStatus is not equal with current resourceStatus,switchFlag should be 'true'
        //else it should be false(previous resourceStatus is equal with current resourceStatus)
        var switchFlag = true;
        var wrongCategory = true;
        var wrongResourceStatus = true;
        if (!_.isEmpty(call.request.logicalResource.resourceStatus)) {
          var currentResourceStatus =
            call.request.logicalResource.resourceStatus;
        }
        if (call.request.value && call.request.type) {
          app
            .service("v1/logical-resource")
            .find(
              {
                query: {
                  value: call.request.value,
                  type: call.request.type,
                },
              },
              getQueries(call.request)
            )
            .then((messages) => {
              logger.applog(
                "debug",
                t0,
                "after executing read by value method for patch: " +
                JSON.stringify(messages)
              );

              previousResourceStatus = messages[0].resourceStatus;
              isBundle = messages[0].isBundle;
             
              /* if (isBundle) {
                callback(
                  grpc.sendError(
                    gg.status.INVALID_ARGUMENT,
                    `You cannot edit resources when it is attached to any bundle.`
                  ),
                  null
                );
              } */
              getObjectById = messages;
              if (
                _.isEqual(currentResourceStatus, undefined) &&
                _.isEqual(previousResourceStatus, "InUse")
              ) {
                callback(
                  grpc.sendError(
                    gg.status.INVALID_ARGUMENT,
                    `You can not do the patch because previous reasourceStatus is 'InUse'`
                  ),
                  null
                );
              } else {
                var requestWithSpecialSymbles =
                  utility.replaceKeyWithSpecialSymble(
                    call.request.logicalResource
                  );

                formattedRequest = utility.patchFormateJSON(
                  requestWithSpecialSymbles
                );
                //manual recycle process
                let isManualRecycle = false;
                if (!_.isEqual(call.request.action, undefined)) {
                  if (_.isEqual(call.request.action, "recycle")) {
                    isManualRecycle = true;
                    manualCycle(formattedRequest);
                  }
                }

                var finalObject = utility.deepmerge(
                  getObjectById,
                  formattedRequest
                );

                //Checking resourceRelationship for removing poolId and capacityId of resourceRelationship for manual recycling
                if (
                  isManualRecycle &&
                  messages[0].isBundle !== undefined &&
                  messages[0].isBundle === false &&
                  messages[0].resourceRelationship !== undefined &&
                  messages[0].resourceRelationship.length !== 0
                ) {
                  let resourceRelationship = [];
                  for (
                    var i = 0;
                    i < messages[0].resourceRelationship.length;
                    i++
                  ) {
                    if (
                      messages[0].resourceRelationship[i].relationshipType !==
                      "pool" &&
                      messages[0].resourceRelationship[i].relationshipType !==
                      "capacity"
                    ) {
                      resourceRelationship.push(
                        messages[0].resourceRelationship[i]
                      );
                    }
                  }
                  Object.assign(finalObject, {
                    resourceRelationship: resourceRelationship,
                  });
                }

                call.request.id = messages[0].id;
                // if resourceStatus was not in request,switchFlag should be true
                if (
                  !_.isEqual(
                    call.request.logicalResource.resourceStatus,
                    undefined
                  )
                ) {
                  if (
                    _.isEqual(previousResourceStatus, currentResourceStatus)
                  ) {
                    switchFlag = false;
                  }
                }
                if (
                  _.isEqual(currentResourceStatus, "Retired") &&
                  _.isEmpty(messages[0].category)
                ) {
                  switchFlag = false;
                  wrongResourceStatus = false;
                }
                if (
                  _.isEqual(previousResourceStatus, "Retired") &&
                  _.isEmpty(messages[0].category)
                ) {
                  switchFlag = false;
                  wrongCategory = false;
                }

                /*
                checking actions
                */
                let stateOfActionIsCorrect = true;
                if (call.request.action) {
                  switch (call.request.action) {
                    case 'recycle':
                      if (['InUse', 'Available', 'Reserved'].includes(messages[0].resourceStatus)) {
                        stateOfActionIsCorrect = false;
                        callback(
                          grpc.sendError(
                            gg.status.INVALID_ARGUMENT,
                            `You can not do the patch because previous resourceStatus is '${messages[0].resourceStatus}'.`
                          ))
                      }
                      break;
                    case 'unblock':
                      if (messages[0].resourceStatus !== 'Blocked') {
                        stateOfActionIsCorrect = false;
                        callback(
                          grpc.sendError(
                            gg.status.INVALID_ARGUMENT,
                            `For 'unblock' action previous state of resource should be 'Blocked'.`
                          ),
                          null
                        );
                      }
                      break;
                    case 'block':
                      if (messages[0].resourceStatus !== 'Available') {
                        stateOfActionIsCorrect = false;
                        callback(
                          grpc.sendError(
                            gg.status.INVALID_ARGUMENT,
                            `For 'block' action previous state of resource should be 'Available'.`
                          ),
                          null
                        );
                      }
                      break;
                    case 'package-change':
                      if (messages[0].resourceStatus !== 'Available' && messages[0].resourceStatus !== 'Created') {
                        stateOfActionIsCorrect = false;
                        callback(
                          grpc.sendError(
                            gg.status.INVALID_ARGUMENT,
                            `For 'package-change' action previous state of resource should be 'Available' or 'Created'.`
                          ),
                          null
                        );
                      }
                      break;
                    case 'category-change':
                      if (messages[0].resourceStatus !== 'Available' && messages[0].resourceStatus !== 'Retired') {
                        stateOfActionIsCorrect = false;
                        callback(
                          grpc.sendError(
                            gg.status.INVALID_ARGUMENT,
                            `For 'category-change' action previous state of resource should be 'Available' or 'Retired'.`
                          ),
                          null
                        );
                      }
                      break;
                  }
                }
                if (switchFlag && stateOfActionIsCorrect) {
                  app
                    .service("v1/logical-resource")
                    .patch(
                      call.request.id,
                      finalObject,
                      patchQueries(
                        call.request.action === ""
                          ? call.request.action
                          : call.request
                      )
                    )
                    .then((messages) => {
                      logger.applog(
                        "debug",
                        t0,
                        "after data updated: " +
                        utility.replaceKeyWithoutSpecailSymbels(
                          JSON.stringify(messages)
                        )
                      );
                      callback(null, {
                        logicalResource:
                          utility.replaceKeyWithoutSpecailSymbels(messages),
                      });
                    })
                    .catch((error) => {
                      logger.applog("error", t0, JSON.stringify(error));
                      callback(error, "");
                    });
                } else if (!switchFlag && _.isEmpty(messages[0].category)) {
                  callback(
                    grpc.sendError(
                      gg.status.FAILED_PRECONDITION,
                      "Category field is empty"
                    ),
                    null
                  );
                } else if (!switchFlag) {
                  callback(
                    grpc.sendError(
                      gg.status.FAILED_PRECONDITION,
                      `Previous resourceStatus is equal with Current resourceStatus`
                    ),
                    null
                  );
                } else {
                  callback(
                    grpc.sendError(
                      gg.status.FAILED_PRECONDITION,
                      "Please check your request "
                    ),
                    null
                  );
                }
              }
            })

            .catch((error) => {
              logger.applog("error", t0, JSON.stringify(error));
              callback(error, "");
            });
        } else {
          callback(
            grpc.sendError(
              gg.status.INVALID_ARGUMENT,
              "User passing INVALID_ARGUMENT."
            ),
            null
          );
        }
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },


    PatchByAvailableValue: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var formattedRequest = {};
      let finalObject = {};
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);

      if (valid) {
        if (call.request.value && call.request.type) {
          app
            .service("v1/logical-resource")
            .find(
              {
                query: {
                  value: call.request.value,
                  type: call.request.type,
                },
              },
              getQueries(call.request)
            )
            .then((messages) => {
              logger.applog(
                "debug",
                t0,
                "after executing read by value method for patch: " +
                JSON.stringify(messages)
              );

              var previousResourceCharacteristic =
                messages[0].resourceCharacteristic;
              let resourceStatus;
              if (messages.length !== 0) {
                resourceStatus = messages[0].resourceStatus;
              } else {
                callback(
                  grpc.sendError(
                    gg.status.NOT_FOUND,
                    "Resource does not exist!"
                  ),
                  null
                );
              }

              //checking resourceStatus value
              if (resourceStatus === "Available") {
                getObjectById = messages;
                var requestWithSpecialSymbles =
                  utility.replaceKeyWithSpecialSymble(
                    call.request.logicalResource
                  );
                var currentResourceCharacteristic =
                  requestWithSpecialSymbles.resourceCharacteristic;
                var key_code = [];
                var len = currentResourceCharacteristic.length;

                //If there was ResourceCharacteristic value on payload
                if (
                  previousResourceCharacteristic.length !== 0 &&
                  currentResourceCharacteristic.length !== 0
                ) {
                  for (
                    var i = 0;
                    i < currentResourceCharacteristic.length;
                    i++
                  ) {
                    key_code[i] = currentResourceCharacteristic[i].code;
                  }

                  for (
                    var j = 0;
                    j < previousResourceCharacteristic.length;
                    j++
                  ) {
                    if (
                      !key_code.includes(previousResourceCharacteristic[j].code)
                    ) {
                      currentResourceCharacteristic[len] =
                        previousResourceCharacteristic[j];
                      len++;
                    }
                  }
                  requestWithSpecialSymbles.resourceCharacteristic =
                    currentResourceCharacteristic;
                }

                formattedRequest = utility.patchFormateJSON(
                  requestWithSpecialSymbles
                );
                var finalObject = utility.deepmerge(
                  getObjectById,
                  formattedRequest
                );
                call.request.id = messages[0].id;
                app
                  .service("v1/logical-resource")
                  .patch(
                    call.request.id,
                    finalObject,
                    patchQueries(
                      call.request.action === ""
                        ? call.request.action
                        : call.request
                    )
                  )
                  .then((messages) => {
                    logger.applog(
                      "debug",
                      t0,
                      "after data updated: " +
                      utility.replaceKeyWithoutSpecailSymbels(
                        JSON.stringify(messages)
                      )
                    );
                    callback(null, {
                      logicalResource:
                        utility.replaceKeyWithoutSpecailSymbels(messages),
                    });
                  });
              } else {
                callback(
                  grpc.sendError(
                    gg.status.FAILED_PRECONDITION,
                    "Resource is not in the state Available"
                  ),
                  null
                );
              }
            })
            .catch((error) => {
              logger.applog("error", t0, JSON.stringify(error));
              callback(error, "");
            });
        } else {
          let errMessage = !call?.request?.value
            ? `Missing ${call?.request?.type} resource Value`
            : "User passing INVALID_ARGUMENT.";
          callback(
            grpc.sendError(gg.status.INVALID_ARGUMENT, errMessage),
            null
          );
        }
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // This method is used for Querying and Upading the logicalResource data together.
    QueryAndUpdate: function (call, callback) {
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      
      if (valid) {
        if (call.request.id) {
          var query = { _id: call.request.id, resourceStatus: 'Pooled' }
          let updateData = {
            resourceStatus: call.request.logicalResource.resourceStatus,
            resourceRelationship: call.request.logicalResource.resourceRelationship
          }
          var t = (call.request.logicalResource.operationalState !== undefined && !_.isEmpty(call.request.logicalResource.operationalState)) ? (updateData.operationalState = call.request.logicalResource.operationalState) : '';
          //  var updateData=call.request.logicalResource;
          logicalResources.findOneAndUpdate(query, updateData, { new: true }, function (err, docs) {
            if (err) {
              logger.applog(
                "error",
                t0,
                "Error while doing queryAnUpdate for logicalResource with query: " + query, updateData, err
              );
            }
            else {
              callback(null, {
                logicalResource: docs
              })
              //callback();
            }
          })
        } else {
          callback(
            grpc.sendError(
              gg.status.INVALID_ARGUMENT,
              "User passing INVALID_ARGUMENT."
            ),
            null
          );
        }
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },
  });
}

// start startPhysicalicalResourceService
function startPhysicalicalResourceService(app) {
  let getObjectById = {};
  server.addService(physical.protos.service.PhysicalResource.service, {
    // ReadAll Command
    ReadAll: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var resultMessages = [];
      var count;
      var valid = grpc.validateJWT(call);
      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");
        const appLimit = getPaginationMax(app);
        if (call.request.limit > appLimit) {
          call.request.paginate = false;
          app
            .service("v1/physical-resource")
            .find(getQueries(call.request))
            .then((messages) => {
              count = messages.length;
              callback(null, {
                totalCount: count,
                appLimit: appLimit,
              });
            })
            .catch((error) => {
              logger.applog("error", t0, JSON.stringify(error));
              callback(error, "");
            });
        } else {
          app
            .service("v1/physical-resource")
            .find(getQueries(call.request))
            .then((messages) => {
              count = messages.length;
              messages.forEach(function (message) {
                resultMessages.push(
                  utility.replaceKeyWithoutSpecailSymbels(message)
                );
              });
              callback(null, {
                physicalResource: resultMessages,
                totalCount: count,
                appLimit: appLimit,
              });
            })
            .catch((error) => {
              logger.applog("error", t0, JSON.stringify(error));
              callback(error, "");
            });
        }
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // Create Command
    Create: function (call, callback) {
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        let resource = call?.request?.physicalResource;
        logger.applog("debug", t0, "Caller is authorized");
        app
          .service("v1/physical-resource")
          .create(
            utility.replaceKeyWithSpecialSymble(call.request.physicalResource)
          )
          .then((messages) => {
            logger.applog("debug", t0, JSON.stringify(messages));

            callback(null, {
              id: messages.id,
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // Delete Command
    Delete: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/physical-resource")
          .remove({
            _id: call.request.id,
          })
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "deleted record by id: " + JSON.stringify(messages)
            );

            callback(null, {
              result: "deleted record successfully with id " + messages.id,
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // GetByValue Command
    GetByValue: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/physical-resource")
          .find(
            {
              query: {
                value: call.request.value,
                type: call.request.type,
              },
            },
            getQueries(call.request)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after executing get by value method: " +
              utility.replaceKeyWithoutSpecailSymbels(
                JSON.stringify(messages)
              )
            );

            callback(null, {
              physicalResource:
                utility.replaceKeyWithoutSpecailSymbels(messages),
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    DeleteByValue: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);

      if (valid) {
        if (call.request.value && call.request.type) {
          app
            .service("v1/physical-resource")
            .find(
              {
                query: {
                  value: call.request.value,
                  type: call.request.type,
                },
              },
              getQueries(call.request)
            )
            .then((messages) => {
              logger.applog(
                "debug",
                t0,
                "after executing get by value method for delete: " +
                JSON.stringify(messages)
              );

              let resourceStatus;
              if (messages.length !== 0) {
                resourceStatus = messages[0].resourceStatus;
              } else {
                callback(
                  grpc.sendError(
                    gg.status.NOT_FOUND,
                    "Resource does not exist!"
                  ),
                  null
                );
              }

              if (
                resourceStatus === "Created" ||
                resourceStatus === "Available"
              ) {
                app
                  .service("v1/physical-resource")
                  .remove({
                    _id: messages[0].id,
                  })
                  .then((messages) => {
                    logger.applog(
                      "debug",
                      t0,
                      "after data DeleteByValue method: " +
                      utility.replaceKeyWithoutSpecailSymbels(
                        JSON.stringify(messages)
                      )
                    );
                    callback(null, {
                      result:
                        "deleted record successfully with id " + messages.id,
                    });
                  });
              } else {
                callback(
                  grpc.sendError(
                    gg.status.FAILED_PRECONDITION,
                    "Resource is not in the state Available or Created"
                  ),
                  null
                );
              }
            })
            .catch((error) => {
              logger.applog("error", t0, JSON.stringify(error));
              callback(error, "");
            });
        } else {
          callback(
            grpc.sendError(
              gg.status.INVALID_ARGUMENT,
              "User passing INVALID_ARGUMENT."
            ),
            null
          );
        }
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },
    // ReadById Command
    ReadById: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/physical-resource")
          .get(
            {
              _id: call.request.id,
            },
            getQueries(call.request)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after executing read by id method: " +
              utility.replaceKeyWithoutSpecailSymbels(
                JSON.stringify(messages)
              )
            );

            callback(null, {
              physicalResource:
                utility.replaceKeyWithoutSpecailSymbels(messages),
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // Patch Command
    Update: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/physical-resource")
          .update(
            call.request.physicalResource.id,
            utility.replaceKeyWithSpecialSymble(call.request.physicalResource)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after data updated: " +
              utility.replaceKeyWithoutSpecailSymbels(
                JSON.stringify(messages)
              )
            );

            callback(null, {
              physicalResource:
                utility.replaceKeyWithoutSpecailSymbels(messages),
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    Patch: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var formattedRequest = {};
      let finalObject = {};
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        app
          .service("v1/physical-resource")
          .get(
            {
              _id: call.request.id,
            },
            getQueries(call.request)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after executing read by id method for patch: " +
              JSON.stringify(messages)
            );

            getObjectById = messages;
            var requestWithSpecialSymbles = utility.replaceKeyWithSpecialSymble(
              call.request.physicalResource
            );
            formattedRequest = utility.patchFormateJSON(
              requestWithSpecialSymbles
            );
            //Checking data of isBundle and isMNP
            if (formattedRequest.isMNP !== undefined) {
              var isMNPValue =
                formattedRequest.isMNP.toLowerCase() === "true" ? true : false;
              Object.assign(formattedRequest, { isMNP: isMNPValue });
            }
            if (formattedRequest.isBundle !== undefined) {
              var isBundleValue =
                formattedRequest.isBundle.toLowerCase() === "true"
                  ? true
                  : false;
              Object.assign(formattedRequest, { isBundle: isBundleValue });
            }
            //manual recycle process
            if (!_.isEqual(call.request.action, undefined)) {
              if (_.isEqual(call.request.action, "recycle")) {
                manualCycle(formattedRequest);
              }
            }
            var finalObject = utility.deepmerge(
              getObjectById,
              formattedRequest
            );

              //assigining note value
              if(finalObject?.note && formattedRequest?.note){
                finalObject.note = formattedRequest.note;
              }
              
            //Checking resourceRelationship for removing poolId and capacityId of resourceRelationship for automatic recycling
            if (
              messages.isBundle !== undefined &&
              messages.isBundle === false &&
              messages.resourceRelationship !== undefined &&
              messages.resourceRelationship.length !== 0 &&
              messages.resourceStatus === "Retired" &&
              call.request.physicalResource.resourceStatus !== undefined &&
              call.request.physicalResource.resourceStatus === "Available"
            ) {
              let resourceRelationship = [];
              for (var i = 0; i < messages.resourceRelationship.length; i++) {
                if (
                  messages.resourceRelationship[i].relationshipType !==
                  "pool" &&
                  messages.resourceRelationship[i].relationshipType !==
                  "capacity"
                ) {
                  resourceRelationship.push(messages.resourceRelationship[i]);
                }
              }
              Object.assign(finalObject, {
                resourceRelationship: resourceRelationship,
              });
            }
            app
              .service("v1/physical-resource")
              .patch(
                call.request.id,
                finalObject,
                patchQueries(
                  call.request.action === ""
                    ? call.request.action
                    : call.request
                )
              )
              .then((messages) => {
                logger.applog(
                  "debug",
                  t0,
                  "after data updated: " +
                  utility.replaceKeyWithoutSpecailSymbels(
                    JSON.stringify(messages)
                  )
                );
                callback(null, {
                  physicalResource:
                    utility.replaceKeyWithoutSpecailSymbels(messages),
                });
              })
              .catch((error) => {
                logger.applog("error", t0, JSON.stringify(error));
                callback(error, "");
              });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    PatchByValue: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var formattedRequest = {};
      let finalObject = {};
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        //when we don't have resourceStatus field or previous resourceStatus is not equal with current resourceStatus,switchFlag should be 'true'
        //else it should be false(previous resourceStatus is equal with current resourceStatus)
        var switchFlag = true;
        var wrongCategory = true;
        var wrongResourceStatus = true;
        if (!_.isEmpty(call.request.physicalResource.resourceStatus)) {
          var currentResourceStatus =
            call.request.physicalResource.resourceStatus;
        }
        if (call.request.value && call.request.type) {
          app
            .service("v1/physical-resource")
            .find(
              {
                query: {
                  value: call.request.value,
                  type: call.request.type,
                },
              },
              getQueries(call.request)
            )
            .then((messages) => {
              logger.applog(
                "debug",
                t0,
                "after executing read by value method for patch: " +
                JSON.stringify(messages)
              );
              //manual recycle process
              let isManualRecycle = false;
              if (!_.isEqual(call.request.action, undefined)) {
                if (_.isEqual(call.request.action, "recycle")) {
                  isManualRecycle = true;
                  manualCycle(formattedRequest);
                }
              }
              //Checking resourceRelationship for removing poolId and capacityId of resourceRelationship for manual recycling
              if (
                isManualRecycle &&
                messages[0].isBundle !== undefined &&
                messages[0].isBundle === false &&
                messages[0].resourceRelationship !== undefined &&
                messages[0].resourceRelationship.length !== 0
              ) {
                let resourceRelationship = [];
                for (
                  var i = 0;
                  i < messages[0].resourceRelationship.length;
                  i++
                ) {
                  if (
                    messages[0].resourceRelationship[i].relationshipType !==
                    "pool" &&
                    messages[0].resourceRelationship[i].relationshipType !==
                    "capacity"
                  ) {
                    resourceRelationship.push(
                      messages[0].resourceRelationship[i]
                    );
                  }
                }
                // commented this to fix recycle case, as we get undefined for finalObject
                
                // Object.assign(finalObject, {
                //   resourceRelationship: resourceRelationship,
                // });
              }

              previousResourceStatus = messages[0].resourceStatus;
              getObjectById = messages;
              if (
                _.isEqual(currentResourceStatus, undefined) &&
                _.isEqual(previousResourceStatus, "Operating")
              ) {
                callback(
                  grpc.sendError(
                    gg.status.INVALID_ARGUMENT,
                    `You can not do the patch because previous reasourceStatus is 'Operating'`
                  ),
                  null
                );
              } else {
                var requestWithSpecialSymbles =
                  utility.replaceKeyWithSpecialSymble(
                    call.request.physicalResource
                  );

                formattedRequest = utility.patchFormateJSON(
                  requestWithSpecialSymbles
                );
                //manual recycle process
                if (!_.isEqual(call.request.action, undefined)) {
                  if (_.isEqual(call.request.action, "recycle")) {
                    manualCycle(formattedRequest);
                  }
                }
                var finalObject = utility.deepmerge(
                  getObjectById,
                  formattedRequest
                );

                call.request.id = messages[0].id;
                // if resourceStatus was not in request,switchFlag should be true
                if (
                  !_.isEqual(
                    call.request.physicalResource.resourceStatus,
                    undefined
                  )
                ) {
                  if (
                    _.isEqual(previousResourceStatus, currentResourceStatus)
                  ) {
                    switchFlag = false;
                  }
                }
                if (
                  _.isEqual(currentResourceStatus, "Retired") &&
                  _.isEmpty(messages[0].category)
                ) {
                  switchFlag = false;
                  wrongResourceStatus = false;
                }
                if (
                  _.isEqual(previousResourceStatus, "Retired") &&
                  _.isEmpty(messages[0].category)
                ) {
                  switchFlag = false;
                  wrongCategory = false;
                }

                /*
                checking actions
                */
                let stateOfActionIsCorrect = true;
                if (call.request.action) {
                  switch (call.request.action) {
                    case 'recycle':
                      if (['Operating', 'Available', 'Reserved'].includes(messages[0].resourceStatus)) {
                        stateOfActionIsCorrect = false;
                        callback(
                          grpc.sendError(
                            gg.status.INVALID_ARGUMENT,
                            `You can not do the patch because previous resourceStatus is '${messages[0].resourceStatus}'.`
                          ))
                      }
                      break;
                    case 'unblock':
                      if (messages[0].resourceStatus !== 'Blocked') {
                        stateOfActionIsCorrect = false;
                        callback(
                          grpc.sendError(
                            gg.status.INVALID_ARGUMENT,
                            `For 'unblock' action previous state of resource should be 'Blocked'.`
                          ),
                          null
                        );
                      }
                      break;
                    case 'block':
                      if (messages[0].resourceStatus !== 'Available') {
                        stateOfActionIsCorrect = false;
                        callback(
                          grpc.sendError(
                            gg.status.INVALID_ARGUMENT,
                            `For 'block' action previous state of resource should be 'Available'.`
                          ),
                          null
                        );
                      }
                      break;
                    case 'package-change':
                      if (messages[0].resourceStatus !== 'Available' && messages[0].resourceStatus !== 'Created') {
                        stateOfActionIsCorrect = false;
                        callback(
                          grpc.sendError(
                            gg.status.INVALID_ARGUMENT,
                            `For 'package-change' action previous state of resource should be 'Available' or 'Created'.`
                          ),
                          null
                        );
                      }
                      break;
                    case 'category-change':
                      if (messages[0].resourceStatus !== 'Available' && messages[0].resourceStatus !== 'Retired') {
                        stateOfActionIsCorrect = false;
                        callback(
                          grpc.sendError(
                            gg.status.INVALID_ARGUMENT,
                            `For 'category-change' action previous state of resource should be 'Available' or 'Retired'.`
                          ),
                          null
                        );
                      }
                      break;
                  }
                }
                if (switchFlag && stateOfActionIsCorrect) {
                  app
                    .service("v1/physical-resource")
                    .patch(
                      call.request.id,
                      finalObject,
                      patchQueries(
                        call.request.action === ""
                          ? call.request.action
                          : call.request
                      )
                    )
                    .then((messages) => {
                      logger.applog(
                        "debug",
                        t0,
                        "after data updated: " +
                        utility.replaceKeyWithoutSpecailSymbels(
                          JSON.stringify(messages)
                        )
                      );
                      callback(null, {
                        physicalResource:
                          utility.replaceKeyWithoutSpecailSymbels(messages),
                      });
                    })
                    .catch((error) => {
                      logger.applog("error", t0, JSON.stringify(error));
                      callback(error, "");
                    });
                } else if (!switchFlag && _.isEmpty(messages[0].category)) {
                  callback(
                    grpc.sendError(
                      gg.status.FAILED_PRECONDITION,
                      "Category field is empty"
                    ),
                    null
                  );
                } else if (!switchFlag) {
                  callback(
                    grpc.sendError(
                      gg.status.FAILED_PRECONDITION,
                      `Previous resourceStatus is equal with Current resourceStatus`
                    ),
                    null
                  );
                } else {
                  callback(
                    grpc.sendError(
                      gg.status.FAILED_PRECONDITION,
                      "Please check your request "
                    ),
                    null
                  );
                }
              }
            })

            .catch((error) => {
              logger.applog("error", t0, JSON.stringify(error));
              callback(error, "");
            });
        } else {
          callback(
            grpc.sendError(
              gg.status.INVALID_ARGUMENT,
              "User passing INVALID_ARGUMENT."
            ),
            null
          );
        }
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    PatchByAvailableValue: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var formattedRequest = {};
      let finalObject = {};
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        if (call.request.value && call.request.type) {
          app
            .service("v1/physical-resource")
            .find(
              {
                query: {
                  value: call.request.value,
                  type: call.request.type,
                },
              },
              getQueries(call.request)
            )
            .then((messages) => {
              logger.applog(
                "debug",
                t0,
                "after executing read by id method for patch: " +
                JSON.stringify(messages)
              );

              var previousResourceCharacteristic =
                messages[0]?.resourceCharacteristic;
              let resourceStatus;
              if (messages.length !== 0) {
                resourceStatus = messages[0].resourceStatus;
              } else {
                callback(
                  grpc.sendError(
                    gg.status.NOT_FOUND,
                    "Resource does not exist!"
                  ),
                  null
                );
              }

              if (resourceStatus === "Available") {
                getObjectById = messages;
                var requestWithSpecialSymbles =
                  utility.replaceKeyWithSpecialSymble(
                    call.request.physicalResource
                  );
                var currentResourceCharacteristic =
                  requestWithSpecialSymbles.resourceCharacteristic;
                var key_code = [];
                var len = currentResourceCharacteristic.length;
                if (
                  previousResourceCharacteristic.length !== 0 &&
                  currentResourceCharacteristic.length !== 0
                ) {
                  for (
                    var i = 0;
                    i < currentResourceCharacteristic.length;
                    i++
                  ) {
                    key_code[i] = currentResourceCharacteristic[i].code;
                  }

                  for (
                    var j = 0;
                    j < previousResourceCharacteristic.length;
                    j++
                  ) {
                    if (
                      !key_code.includes(previousResourceCharacteristic[j].code)
                    ) {
                      currentResourceCharacteristic[len] =
                        previousResourceCharacteristic[j];
                      len++;
                    }
                  }
                  requestWithSpecialSymbles.resourceCharacteristic =
                    currentResourceCharacteristic;
                }

                formattedRequest = utility.patchFormateJSON(
                  requestWithSpecialSymbles
                );
                var finalObject = utility.deepmerge(
                  getObjectById,
                  formattedRequest
                );
                call.request.id = messages[0].id;
                app
                  .service("v1/physical-resource")
                  .patch(
                    call.request.id,
                    finalObject,
                    patchQueries(
                      call.request.action === ""
                        ? call.request.action
                        : call.request
                    )
                  )
                  .then((messages) => {
                    logger.applog(
                      "debug",
                      t0,
                      "after data updated: " +
                      utility.replaceKeyWithoutSpecailSymbels(
                        JSON.stringify(messages)
                      )
                    );
                    callback(null, {
                      physicalResource:
                        utility.replaceKeyWithoutSpecailSymbels(messages),
                    });
                  });
              } else {
                callback(
                  grpc.sendError(
                    gg.status.FAILED_PRECONDITION,
                    "Resource is not in the state Available"
                  ),
                  null
                );
              }
            })
            .catch((error) => {
              logger.applog("error", t0, JSON.stringify(error));
              callback(error, "");
            });
        } else {
          let errMessage = !call?.request?.value
            ? `Missing ${call?.request?.type} resource Value`
            : "User passing INVALID_ARGUMENT.";
          callback(
            grpc.sendError(gg.status.INVALID_ARGUMENT, errMessage),
            null
          );
        }
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // This method is used for Querying and Upading the physicalResrource data together.
    QueryAndUpdate: function (call, callback) {
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      
      if (valid) {
        if (call.request.id) {
          var query = { _id: call.request.id, resourceStatus: 'Pooled' }
          var updateData = {
            resourceStatus: call.request.physicalResource.resourceStatus,
            resourceRelationship: call.request.physicalResource.resourceRelationship
          }
          
          var t = (call.request.physicalResource.operationalState !== undefined && !_.isEmpty(call.request.logicalResource.operationalState)) ? (updateData.operationalState = call.request.physicalResource.operationalState) : '';
          //  var updateData=call.request.physicalResource;
          physicalResources.findOneAndUpdate(query, updateData, { new: true }, function (err, docs) {
            if (err) {
              logger.applog(
                "error",
                t0,
                "Error while doing queryAndUpdate : " + err, query, updateData
              );
            }
            else {
              callback(null, {
                physicalResource: docs
              })
              //callback();
            }

          })
        } else {
          callback(
            grpc.sendError(
              gg.status.INVALID_ARGUMENT,
              "User passing INVALID_ARGUMENT."
            ),
            null
          );
        }
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },
  });
}

// start startCategorySchemaService
function startCategorySchemaService(app) {
  // Get current time
  var t0 = new Date();

  let getObjectById = {};
  server.addService(categorys.protos.service.CategorySchema.service, {
    // ReadAll Command
    ReadAll: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var resultMessages = [];
      var valid = grpc.validateJWT(call);
      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");
        app
          .service("v1/category-schema")
          .find(getQueries(call.request))
          .then((messages) => {
            messages.forEach(function (message) {
              resultMessages.push(
                utility.replaceKeyWithoutSpecailSymbelsForParentAndChild(
                  message
                )
              );
            });

            callback(null, {
              categorySchema: resultMessages,
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // Create Command
    Create: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);
      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");
        app
          .service("v1/category-schema")
          .create(
            utility.addingKeyWithoutSpecailSymbelsForParentAndChild(
              call.request.categorySchema
            )
          )
          .then((messages) => {
            logger.applog("debug", t0, JSON.stringify(messages));

            callback(null, {
              id: messages.id,
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // Delete Command
    Delete: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/category-schema")
          .remove({
            _id: call.request.id,
          })
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "deleted record by id: " + JSON.stringify(messages)
            );

            callback(null, {
              result: "deleted record successfully with id " + messages.id,
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // ReadById Command
    ReadById: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/category-schema")
          .get(
            {
              _id: call.request.id,
            },
            getQueries(call.request)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after executing read by id method: " +
              utility.replaceKeyWithoutSpecailSymbelsForParentAndChild(
                JSON.stringify(messages)
              )
            );

            callback(null, {
              categorySchema:
                utility.replaceKeyWithoutSpecailSymbelsForParentAndChild(
                  messages
                ),
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // Patch Command
    Update: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/category-schema")
          .update(
            call.request.categorySchema.id,
            utility.addingKeyWithoutSpecailSymbelsForParentAndChild(
              call.request.categorySchema
            )
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after data updated: " +
              utility.addingKeyWithoutSpecailSymbelsForParentAndChild(
                JSON.stringify(messages)
              )
            );

            callback(null, {
              categorySchema:
                utility.addingKeyWithoutSpecailSymbelsForParentAndChild(
                  messages
                ),
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },
    Patch: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var formattedRequest = {};
      let finalObject = {};
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        app
          .service("v1/category-schema")
          .get(
            {
              _id: call.request.id,
            },
            getQueries(call.request)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after executing read by id method for patch: " +
              JSON.stringify(messages)
            );

            getObjectById = messages;
            var requestWithSpecialSymbles =
              utility.addingKeyWithoutSpecailSymbelsForParentAndChild(
                call.request.categorySchema
              );
            formattedRequest = utility.patchFormateJSON(
              requestWithSpecialSymbles
            );
            var finalObject = utility.deepmerge(
              getObjectById,
              formattedRequest
            );
            app
              .service("v1/category-schema")
              .patch(
                call.request.id,
                finalObject,
                patchQueries(
                  call.request.action === ""
                    ? call.request.action
                    : call.request
                )
              )
              .then((messages) => {
                logger.applog(
                  "debug",
                  t0,
                  "after data updated: " +
                  utility.addingKeyWithoutSpecailSymbelsForParentAndChild(
                    JSON.stringify(messages)
                  )
                );
                callback(null, {
                  categorySchema:
                    utility.addingKeyWithoutSpecailSymbelsForParentAndChild(
                      messages
                    ),
                });
              })
              .catch((error) => {
                logger.applog("error", t0, JSON.stringify(error));
                callback(error, "");
              });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },
  });
}

// start startResourceCategoryService
function startResourceCategoryService(app) {
  let getObjectById = {};
  server.addService(category.protos.service.ResourceCategory.service, {
    // ReadAll Command
    ReadAll: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var resultMessages = [];
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/resource-category")
          .find(getQueries(call.request))
          .then((messages) => {
            messages.forEach(function (message) {
              resultMessages.push(
                utility.replaceKeyWithoutSpecailSymbels(message)
              );
            });
            callback(null, {
              resourceCategory: resultMessages,
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // Create Command
    Create: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/resource-category")
          .create(
            utility.replaceKeyWithSpecialSymble(call.request.resourceCategory)
          )
          .then((messages) => {
            logger.applog("debug", t0, JSON.stringify(messages));

            callback(null, {
              id: messages.id,
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // Delete Command
    Delete: function (call, callback) {
      
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/resource-category")
          .remove({
            _id: call.request.id,
          })
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "deleted record by id: " + JSON.stringify(messages)
            );

            callback(null, {
              result: "deleted record successfully with id " + messages.id,
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // ReadById Command
    ReadById: function (call, callback) {
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/resource-category")
          .get(
            {
              _id: call.request.id,
            },
            getQueries(call.request)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after executing read by id method: " +
              utility.replaceKeyWithoutSpecailSymbels(
                JSON.stringify(messages)
              )
            );

            callback(null, {
              resourceCategory:
                utility.replaceKeyWithoutSpecailSymbels(messages),
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    // Patch Command
    Update: function (call, callback) {
      // Get current time
      var t0 = new Date();
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        logger.applog("debug", t0, "Caller is authorized");

        app
          .service("v1/resource-category")
          .update(
            call.request.resourceCategory.id,
            utility.replaceKeyWithSpecialSymble(call.request.resourceCategory)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after data updated: " +
              utility.replaceKeyWithoutSpecailSymbels(
                JSON.stringify(messages)
              )
            );

            callback(null, {
              resourceCategory:
                utility.replaceKeyWithoutSpecailSymbels(messages),
            });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },

    Patch: function (call, callback) {
      // Get current time
      var t0 = new Date();
      var formattedRequest = {};
      let finalObject = {};
      var valid = grpc.validateJWT(call);

      logger.applog("debug", t0, "validation is.." + valid);
      if (valid) {
        app
          .service("v1/resource-category")
          .get(
            {
              _id: call.request.id,
            },
            getQueries(call.request)
          )
          .then((messages) => {
            logger.applog(
              "debug",
              t0,
              "after executing read by id method for patch: " +
              JSON.stringify(messages)
            );

            getObjectById = messages;
            var requestWithSpecialSymbles = utility.replaceKeyWithSpecialSymble(
              call.request.resourceCategory
            );
            formattedRequest = utility.patchFormateJSON(
              requestWithSpecialSymbles
            );
            var finalObject = utility.deepmerge(
              getObjectById,
              formattedRequest
            );
            app
              .service("v1/resource-category")
              .patch(
                call.request.id,
                finalObject,
                patchQueries(
                  call.request.action === ""
                    ? call.request.action
                    : call.request
                )
              )
              .then((messages) => {
                logger.applog(
                  "debug",
                  t0,
                  "after data updated: " +
                  utility.replaceKeyWithoutSpecailSymbels(
                    JSON.stringify(messages)
                  )
                );
                callback(null, {
                  resourceCategory:
                    utility.replaceKeyWithoutSpecailSymbels(messages),
                });
              })
              .catch((error) => {
                logger.applog("error", t0, JSON.stringify(error));
                callback(error, "");
              });
          })
          .catch((error) => {
            logger.applog("error", t0, JSON.stringify(error));
            callback(error, "");
          });
      } else {
        logger.applog("debug", t0, "unauthorized");
        callback(
          grpc.sendError(
            gg.status.UNAUTHENTICATED,
            "User is UNAUTHENTICATED.."
          ),
          null
        );
      }
    },
  });
}

function getPaginationMax(app) {
  return app.settings.paginate.max;
}

// Start GRPC Services
function startService(app) {
  startLogicalResourceService(app);
  startCategorySchemaService(app);
  startPhysicalicalResourceService(app);
  startResourceCategoryService(app);
}

module.exports = {
  startService,
};
