const _ = require("lodash");
const logger = require("../logger");
const pascalcase = require("pascalcase");
const camelCase = require("camelcase");
const config = require("config");
const { BadRequest, Forbidden } = require("@feathersjs/errors");

//To read defaultPolicy of json
const logicalResourceFile = require("./defaultPolicy/resourceStateOfLogical.json");
const physicalResourceFile = require("./defaultPolicy/resourceStateOfPhysical.json");
const resourceCategoryFile = require("./defaultPolicy/lifecycleStatusOfResourceCategory.json");

/*
In this function, we are checking permission or access of user, during sending request for (create/remove/find/update) methods
 */
async function checkPermissionMethod(context) {
  // // Get current date time
  // const time = new Date();
  // let shouldCheckExisting;
  // let previous_item, previousItemIsOK;

  // logger.applog("info", time, "Starting check-permission process");
  // try {
  //   if (
  //     context.params.provider !== undefined &&
  //     context.params.provider === "rest" &&
  //     context.path !== "v1/change-resource-access" &&
  //     context.path !== "v1/update-resource"
  //   ) {
  //     // Only check permission for external requests.
  //     const isProduction = process.env.NODE_ENV === "production";
  //     if (!isProduction) {
  //       logger.applog("info", time, `NODE_ENV Is Not 'production'`);
  //       return context;
  //     }

  //     //Checking permission for internal services
  //     if (context.params.user.sub === "drmInternal") {
  //       logger.applog("info", time, `Sub Is 'drmInternal'`);
  //       return context;
  //     }

  //     //Getting requirements variables from 'context'
  //     const {
  //       id,
  //       app,
  //       method,
  //       path,
  //       params: {
  //         url,
  //         user: { permissions },
  //       },
  //     } = context;

  //     /**
  //      * Separating permission format
  //      * Because into the permissions item we have many permission and between them we have comma
  //      * and for checking permissions we need to separate these comma
  //      */
  //     const permissionPath = "drm.resourceInventory.api.";
  //     const formattedPermissions = permissions
  //       .split(",")
  //       .map((permission) => formatString(permission));

  //     /* Converting for example logical-resource to camelCase(logicalResource),without hyphen for check with 'formattedPermissions' */
  //     const camelCasePath = camelCase(path);
  //     const newPath = camelCasePath.replace(/v\d\//, "");
  //     const newIsOK = formattedPermissions.includes(
  //       formatString(`${permissionPath}${newPath}.${method}`)
  //     )
  //       ? true
  //       : false;

  //     // Check permissions for method
  //     if (!newIsOK) {
  //       throw new BadRequest(
  //         `User does not have the necessary permissions for ${method} method`
  //       );
  //     }

  //     //Check policy permissions
  //     if (method !== "find" && path !== "v1/category-schema") {
  //       shouldCheckExisting = ["patch", "update", "remove"].includes(method);

  //       /**
  //        * policyNameField should be 'resourceStatus' or 'lifecycleStatus
  //        * policyNameData is value of 'policyNameField' for example policyNameData can be 'Created'
  //        */
  //       let policyNameData, policyNameField;

  //       if (path === "v1/logical-resource" || path === "v1/physical-resource") {
  //         if (method !== "remove") {
  //           policyNameData = context.data.resourceStatus;
  //         }
  //         policyNameField = "resourceStatus";
  //       } else if (path === "v1/resource-category") {
  //         if (method !== "remove") {
  //           policyNameData = context.data.lifecycleStatus;
  //         }
  //         policyNameField = "lifecycleStatus";
  //       }

  //       //Checking current resourceStatus/lifecycleStatus permission
  //       const currentItemIsOK = formattedPermissions.includes(
  //         formatString(
  //           `drm.resourceInventory.permission.change.${policyNameField}.${policyNameData}`
  //         )
  //       );

  //       /*
  //       In 'patch' or 'update' when 'resourceStatus'/'lifecycleStatus' is not exist on payload, previous permission of 'resourceStatus'/'lifecycleStatus' should be check
  //       In 'remove',for remove resource, previous permission of 'resourceStatus'/'lifecycleStatus' should be check
  //       */
  //       if (shouldCheckExisting) {
  //         const service = app.service(path);
  //         try {
  //           previous_item = await service.get(id, {
  //             url,
  //             provider: undefined,
  //             query: {
  //               $select: [
  //                 path === "v1/resource-category"
  //                   ? "lifecycleStatus"
  //                   : "resourceStatus",
  //                 "isBundle",
  //               ],
  //             },
  //           });

  //           if (previous_item.isBundle) {
  //             throw new BadRequest(
  //               `Cannot edit resource when it is attached to any bundle.`
  //             );
  //           }
  //           previousItemIsOK = formattedPermissions.includes(
  //             formatString(
  //               `drm.resourceInventory.permission.change.${policyNameField}.${previous_item[policyNameField]}`
  //             )
  //           );
  //         } catch (err) {
  //           logger.applog("error", time, JSON.stringify(err));
  //           throw err;
  //         }
  //       }

  //       // Check permissions for items which these items have policy
  //       if (
  //         (method === "create" &&
  //           !_.isEqual(policyNameData, undefined) &&
  //           !currentItemIsOK) ||
  //         (method === "remove" && !previousItemIsOK) ||
  //         (["patch", "update"].includes(method) &&
  //           policyNameData !== "Created" &&
  //           policyNameData !== "Reserved" &&
  //           policyNameData !== "Blocked" &&
  //           ((!currentItemIsOK && policyNameData !== undefined) ||
  //             !previousItemIsOK))
  //       ) {
  //         throw new Forbidden("User does not have the necessary permissions.");
  //       }
  //     }
  //   }
  //   logger.applog("info", time, "End of check-permission process");
    return context;
  // } catch (error) {
  //   logger.applog("error", time, JSON.stringify(error));
  //   throw error;
  // }
}

//Checking policy of 'resourceStatus' or 'lifecycleStatus'
async function checkPolicy(context) {
  // // Get current date time
  // let info, previousField;
  // const time = new Date();

  // logger.applog("info", time, "Starting policy validation");

  // if (context.method === "patch" || context.method === "update") {
  //   context.params.query =
  //     context.params.query === undefined ? {} : context.params.query;
  // }

  // if (
  //   context.path !== "v1/category-schema" &&
  //   context.path !== "v1/change-resource-access" &&
  //   context.path !== "v1/update-resource"
  // ) {
  //   const {
  //     id,
  //     app,
  //     method,
  //     path,
  //     params: { url },
  //   } = context;
  //   let configPolicy = false;

  //   //Convert contex.path to PascalCase for using in policy-query
  //   // const pascalCasePath = pascalcase(path).replace("V1", "");

  //   try {
  //     let result;
  //     switch (path) {
  //       case "v1/logical-resource":
  //         result = app.get("logicalResourcePolicy");

  //         break;
  //       case "v1/physical-resource":
  //         result = app.get("physicalResourcePolicy");

  //         break;
  //       case "v1/resource-category":
  //         result = app.get("resourceCategoryPolicy");
  //         break;
  //     }
  //     //const result = await configServiceClientdata('ReadAll',payload,'master-config',config.configService.gRPCService);
  //     logger.applog(
  //       "info",
  //       time,
  //       `result of configService: ${JSON.stringify(result)}`
  //     );
  //     //If the array did not have length, it means we in config DB does not have any data based on query
  //     if (result !== undefined) {
  //       if (result.masterConfig.length !== 0) {
  //         configPolicy = true;

  //         let configCharacteristics =
  //           result.masterConfig[0].configCharacteristics;
  //         if (configCharacteristics.length === 0) {
  //           throw new BadRequest(
  //             `configCharacteristics in policy-config is empty.`
  //           );
  //         }

  //         //We hold, codes of 'configCharacteristics' as the keys and value,transitionsStatus of 'configCharacteristicsValues' as the values in map.
  //         var map = new Map();
  //         for (
  //           let counter = 0;
  //           counter < configCharacteristics.length;
  //           counter++
  //         ) {
  //           if (configCharacteristics[counter].code !== "transitions") {
  //             const initialOrFinalValues =
  //               configCharacteristics[counter].configCharacteristicsValues[0]
  //                 .value[0];
  //             let str_array = initialOrFinalValues.split(",");
  //             for (let i = 0; i < str_array.length; i++) {
  //               str_array[i] = str_array[i]
  //                 .replace(/^\s*/, "")
  //                 .replace(/\s*$/, "");
  //             }
  //             map.set(configCharacteristics[counter].code, str_array);
  //           } else {
  //             map.set(
  //               configCharacteristics[counter].code,
  //               configCharacteristics[counter].configCharacteristicsValues[0]
  //                 .transitionsStatus
  //             );
  //           }
  //         }

  //         //Checking requirement keys and values of policy-config-
  //         if (
  //           !map.has("initialState") ||
  //           !map.has("finalStates") ||
  //           !map.has("transitions")
  //         ) {
  //           throw new BadRequest(
  //             `Initial or Final or Transitions states are not defined completely in the policy-config.`
  //           );
  //         } else if (
  //           _.isEqual(map.get("initialState"), undefined) ||
  //           _.isEqual(map.get("finalStates"), undefined) ||
  //           _.isEqual(map.get("transitions"), undefined)
  //         ) {
  //           throw new BadRequest(
  //             `Initial or Final or Transitions values are empty in the policy-config.`
  //           );
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     logger.applog("error", time, JSON.stringify(err));
  //     throw err;
  //   }

  //   /*
  //   currentValue -> storing resourceStatus and lifecycleStatus value in 'field' variable
  //   policyNameData -> for which field/item we have policy?, we are storying name of that field in 'policyNameData' variable
  //   */
  //   let currentValue, policyNameData, policyFileName;
  //   let initial,
  //     final,
  //     transition = {};
  //   const service = app.service(path);

  //   if (context.path === "v1/logical-resource") {
  //     policyNameData = "resourceStatus";
  //     if (method !== "remove") {
  //       currentValue = context.data.resourceStatus;
  //     }
  //     policyFileName = logicalResourceFile;
  //   } else if (context.path === "v1/physical-resource") {
  //     policyNameData = "resourceStatus";
  //     if (method !== "remove") {
  //       currentValue = context.data.resourceStatus;
  //     }
  //     policyFileName = physicalResourceFile;
  //   } else if (context.path === "v1/resource-category") {
  //     policyNameData = "lifecycleStatus";
  //     if (method !== "remove") {
  //       currentValue = context.data.lifecycleStatus;
  //     }
  //     policyFileName = resourceCategoryFile;
  //   }

  //   if (configPolicy) {
  //     (initial = map.get("initialState")),
  //       (final = map.get("finalStates")),
  //       (transition = map.get("transitions"));
  //   } else {
  //     (initial = policyFileName.initialState),
  //       (final = policyFileName.finalStates),
  //       (transition = policyFileName.transitions);
  //   }

  //   /*
  //    *For 'remove','update','patch' to check policy, we need to get the some previous data
  //    *we are storing previous value of 'resourceStatus' or 'lifecycleStatus' in 'info[policyNameData]' item
  //    */
  //   if (method !== "create") {
  //     info = await service.get(id, {
  //       url,
  //       provider: undefined,
  //       query: {
  //         $select: [
  //           path === "v1/resource-category"
  //             ? "lifecycleStatus"
  //             : "resourceStatus",
  //           "category",
  //           "endOperatingDate",
  //           "resourceRecycleDate",
  //           "@type",
  //           "value",
  //         ],
  //       },
  //     });

  //     if (
  //       (method === "patch" || method === "remove") &&
  //       context.params.query !== undefined
  //     ) {
  //       // Object.assign(context.data, {'value': info.value });
  //       Object.assign(context.params.query, {
  //         value: info.value,
  //         "@type": info["@type"],
  //       });
  //       if (method === "remove") {
  //         // delete context.id
  //       }
  //       logger.applog("info", time, `'value' passed on the request.`);
  //     } else {
  //       context.params = {
  //         query: {
  //           value: info.value,
  //           "@type": info["@type"],
  //         },
  //       };
  //     }

  //     previousField = info[policyNameData];
  //   }

  //   switch (context.method) {
  //     case "create":
  //       if (!initial.includes(currentValue)) {
  //         throw new BadRequest(
  //           `Invalid '${currentValue}' value as initial state for '${policyNameData}'.'${policyNameData}' should be have '${initial}' as value .`
  //         );
  //       }
  //       //If a category has parentId we need to check lifecycleStatus of parentId also
  //       if (
  //         path === "v1/resource-category" &&
  //         !_.isEqual(context.data.parentId, undefined) &&
  //         !_.isEmpty(context.data.parentId)
  //       ) {
  //         const parentInfo = await service.get(context.data.parentId, {
  //           url,
  //           provider: undefined,
  //           query: {
  //             $select: ["lifecycleStatus"],
  //           },
  //         });
  //         if (!_.isEqual(parentInfo.lifecycleStatus, "Launched")) {
  //           throw new BadRequest(`parentId is not in 'Launched' state.`);
  //         }
  //       }
  //       break;
  //     case "remove":
  //       if (
  //         !final.includes(previousField) &&
  //         context.params.provider !== "DRMSwap" &&
  //         context.params.provider !== "validator"
  //       ) {
  //         throw new BadRequest(
  //           `Invalid '${previousField}' value as final state for '${policyNameData}'.'${policyNameData}' should be have '${final}' as value.`
  //         );
  //       }
  //       if (path === "v1/logical-resource") {
  //         if (previousField === "Retired" && info["@type"] !== "StarterPack") {
  //           throw new BadRequest(
  //             `Just you can remove StarterPack type in 'Retired' Status.`
  //           );
  //         }
  //       }
  //       break;
  //     case "update":
  //     case "patch":
  //       const sameData = currentValue === previousField;
  //       const transitionIsOK = !!transition.find(
  //         ({ from, to }) => from === previousField && to === currentValue
  //       );

  //       if (_.isEqual(currentValue, undefined)) {
  //         /**
  //          If we did not have 'resourceStatus' or 'lifecycleStatus on the payload,it means , they are undefined.
  //          In this case, we should check the previous value of them,
  //          and If previous value of them was 'Created' or 'Initial',we can not do the patch
  //          */
  //         //if (previousField === 'Created' || previousField === 'Initial') {
  //         if (previousField === "Initial") {
  //           throw new BadRequest(
  //             `Cannot edit resource when ${policyNameData} is in ${previousField} state.`
  //           );
  //         } else {
  //           return context;
  //         }
  //       }

  //       if (
  //         !sameData &&
  //         !transitionIsOK &&
  //         context.params.provider !== "DRMSwap" &&
  //         context.params.provider !== "grpc"
  //       ) {
  //         throw new BadRequest(
  //           `Invalid '${previousField}' transition from '${previousField}' to '${currentValue}'.`
  //         );
  //       }

  //       if (path === "v1/logical-resource" || path === "v1/physical-resource") {
  //         if (method === "patch") {
  //           //adding validation for blocking resource
  //           if (currentValue === "Blocked" && previousField !== "Available") {
  //             throw new BadRequest(
  //               `We can block resources that are in the 'Available' state.`
  //             );
  //           }
  //         }

  //         if (
  //           method === "update" ||
  //           currentValue === "Retired" ||
  //           currentValue === "InUse"
  //         ) {
  //           if (method === "update" && _.isEqual(previousField, undefined)) {
  //             if (!_.isEqual(currentValue, "Available")) {
  //               throw new BadRequest(
  //                 `'resourceStatus' field, does not exist on database So 'resourceStatus' should be have 'Available' value.`
  //               );
  //             }
  //           }

  //           //updating endOperatingDate and resourceRecycleDate
  //           if (currentValue === "Retired") {
  //             context.data = updateEndOperatingDate(context.data);
  //           } else if (currentValue === "InUse") {
  //             if (!_.isEqual(context.data.endOperatingDate, undefined)) {
  //               context.data.endOperatingDate = "";
  //             } else {
  //               Object.assign(context.data, {
  //                 endOperatingDate: "",
  //               });
  //             }

  //             if (!_.isEqual(context.data.resourceRecycleDate, undefined)) {
  //               context.data.resourceRecycleDate = "";
  //             } else {
  //               Object.assign(context.data, {
  //                 resourceRecycleDate: "",
  //               });
  //             }
  //           }
  //         }
  //       }
  //       break;
  //   }
  // }

  // logger.applog("info", time, "End of policy validation");
  return context;
}

function formatString(string = "") {
  return string.replace(/\s/g, "").toLowerCase();
}

//For updating endOperatingDate field
function updateEndOperatingDate(json) {
  const time = new Date();
  if (_.isEqual(json.endOperatingDate, undefined)) {
    Object.assign(json, {
      endOperatingDate: time,
    });
    return json;
  } else {
    json.endOperatingDate = time;
    return json;
  }
}

module.exports = {
  formatString,
  checkPermissionMethod,
  checkPolicy,
  updateEndOperatingDate,
};
