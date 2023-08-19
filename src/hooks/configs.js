const config = require("config");
const {
  configServiceClientdata,
} = require("../services/common/config-service/grpc.client.js");
const logger = require("../logger.js");
const logicalResourceFile = require("../hooks/defaultNoteConfig/logicalResource.json");
const physicalResourceFile = require("../hooks/defaultNoteConfig/physicalResource.json");

//Getting policy, note and resourceType configs
module.exports = async function (app) {
  // Get current date time
  const time = new Date();
  let logicalResourcePolicyResult,
    physicalResourcePolicyResult,
    resourceCategoryPolicyResult,
    noteConfigOfLogicalResource,
    noteConfigOfPhysicalResource,
    resourceTypeResult;

  //Query for getting data of master-config
  const [
    logicalResourcePolicyQuery,
    physicalResourcePolicyQuery,
    resourceCategoryPolicyQuery,
    noteConfigQueryForLogicalRes,
    noteConfigQueryForPhysicalRes,
  ] = [
    { name: "LogicalResource" },
    { name: "PhysicalResource" },
    { name: "ResourceCategory" },
    { name: "LogicalResource", type: "Note" },
    { name: "PhysicalResource", type: "Note" },
  ].map(({ name, type }) => ({
    Query: `type=${type || "Policy"}&name.regex=${name}&limit=1`,
  }));

  const payload = {
    Query: `type=ResourceTypes&baseType=Configuration&limit=1`,
  };
  try {
    [
      logicalResourcePolicyResult,
      physicalResourcePolicyResult,
      resourceCategoryPolicyResult,
      noteConfigOfLogicalResource,
      noteConfigOfPhysicalResource,
      resourceTypeResult,
    ] = await Promise.all([
      configServiceClientdata(
        "ReadAll",
        logicalResourcePolicyQuery,
        "master-config",
        config.configService.gRPCService
      ),
      configServiceClientdata(
        "ReadAll",
        physicalResourcePolicyQuery,
        "master-config",
        config.configService.gRPCService
      ),
      configServiceClientdata(
        "ReadAll",
        resourceCategoryPolicyQuery,
        "master-config",
        config.configService.gRPCService
      ),
      configServiceClientdata(
        "ReadAll",
        noteConfigQueryForLogicalRes,
        "master-config",
        config.configService.gRPCService
      ),
      configServiceClientdata(
        "ReadAll",
        noteConfigQueryForPhysicalRes,
        "master-config",
        config.configService.gRPCService
      ),
      configServiceClientdata(
        "ReadAllResourceTypes",
        payload,
        "master-config",
        config.configService.gRPCService
      ),
    ]);

    logger.applog(
      "info",
      time,
      `configId for policy of LogicalResource is:${JSON.stringify(
        logicalResourcePolicyResult.masterConfig[0].id
      )}`
    );
    logger.applog(
      "info",
      time,
      `configId for policy of PhysicalResource is:${JSON.stringify(
        physicalResourcePolicyResult.masterConfig[0].id
      )}`
    );
    logger.applog(
      "info",
      time,
      `configId for policy of resourceCategory is:${JSON.stringify(
        resourceCategoryPolicyResult.masterConfig[0].id
      )}`
    );
    logger.applog(
      "info",
      time,
      `configId for noteConfig of LogicalResource is:${JSON.stringify(
        noteConfigOfLogicalResource.masterConfig[0].id
      )}`
    );
    logger.applog(
      "info",
      time,
      `configId for noteConfig of PhysicalResource is:${JSON.stringify(
        noteConfigOfPhysicalResource.masterConfig[0].id
      )}`
    );
    logger.applog(
      "info",
      time,
      `configId for resourceTypes is:${JSON.stringify(
        resourceTypeResult.masterConfig[0].id
      )}`
    );

    const thresholdNoteConfigLogical =
      noteConfigOfLogicalResource.masterConfig[0].configCharacteristics[0]
        .configCharacteristicsValues[0].value[0];
    const thresholdNoteConfigPhysical =
      noteConfigOfPhysicalResource.masterConfig[0].configCharacteristics[0]
        .configCharacteristicsValues[0].value[0];
    app.set("logicalResourcePolicy", logicalResourcePolicyResult);
    app.set("physicalResourcePolicy", physicalResourcePolicyResult);
    app.set("resourceCategoryPolicy", resourceCategoryPolicyResult);
    app.set("configNoteForLogicalRes", thresholdNoteConfigLogical);
    app.set("configNoteForPhysicalRes", thresholdNoteConfigPhysical);
    app.set("ResourceTypeConfig", resourceTypeResult);
  } catch (err) {
    logger.applog(
      "error",
      time,
      `Error while getting data from master-config API is:${JSON.stringify(
        err.message
      )}`
    );
    [noteConfigOfLogicalResource, noteConfigOfPhysicalResource] = [
      logicalResourceFile,
      physicalResourceFile,
    ].map(
      (file) =>
        file.configCharacteristics[0].configCharacteristicsValues[0].value
    );
    logger.applog(
      "info",
      time,
      `Received note-config from default hardcode configuration`
    );
  }
};
