const { values, result } = require('lodash');
const _ = require('lodash');
//Format JSON Object for the Patch Func
function patchFormateJSON(obj) {
  var propNames = Object.getOwnPropertyNames(obj);
  for (var i = 0; i < propNames.length; i++) {
    var propName = propNames[i];
    if (typeof obj[propName] === "object") {
      if (Array.isArray(obj[propName])) {
        if (obj[propName].length == 0) {
          delete obj[propName];
        } else if (obj[propName].length > 0) {
          for (var j = 0; j < obj[propName].length; j++) {
            patchFormateJSON(obj[propName][j]);
          }
        }
      } else if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === ""
      ) {
        delete obj[propName];
      } else {
        patchFormateJSON(obj[propName]);
      }
    } else if (typeof obj[propName] === "string") {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === ""
      ) {
        delete obj[propName];
      }
    } else {
      patchFormateJSON(obj[propName]);
    }
  }
  return obj;
}

//begin
//to Merge the objects if object is Mergeableobject
function isMergeableObject(val) {
  var nonNullObject = val && typeof val === "object";

  return (
    nonNullObject &&
    Object.prototype.toString.call(val) !== "[object RegExp]" &&
    Object.prototype.toString.call(val) !== "[object Date]"
  );
}

//function to check object is type of Array or not
function emptyTarget(val) {
  return Array.isArray(val) ? [] : {};
}

//function to clone objects
function cloneIfNecessary(value, optionsArgument) {
  var clone = optionsArgument && optionsArgument.clone === true;
  return clone && isMergeableObject(value)
    ? deepmerge(emptyTarget(value), value, optionsArgument)
    : value;
}

//function to merge array
function defaultArrayMerge(target, source, optionsArgument) {
  var destination = target.slice();
  source.forEach(function (e, i) {
    if (typeof destination[i] === "undefined") {
      destination[i] = cloneIfNecessary(e, optionsArgument);
    } else if (isMergeableObject(e)) {
      destination[i] = deepmerge(target[i], e, optionsArgument);
    } else if (target.indexOf(e) === -1) {
      destination.push(cloneIfNecessary(e, optionsArgument));
    }
  });
  return destination;
}

//Function to merge source and target objects
function mergeObject(target, source, optionsArgument) {
  var destination = {};
  if (isMergeableObject(target)) {
    Object.keys(target).forEach(function (key) {
      destination[key] = cloneIfNecessary(target[key], optionsArgument);
    });
  }
  Object.keys(source).forEach(function (key) {
    if (!isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneIfNecessary(source[key], optionsArgument);
    } else {
      destination[key] = deepmerge(target[key], source[key], optionsArgument);
    }
  });
  return destination;
}

//Function to merge source and target objects
function deepmerge(target, source, optionsArgument) {
  var array = Array.isArray(source);
  var options = optionsArgument || { arrayMerge: defaultArrayMerge };
  var arrayMerge = options.arrayMerge || defaultArrayMerge;

  if (array) {
    return Array.isArray(target)
      ? arrayMerge(target, source, optionsArgument)
      : cloneIfNecessary(source, optionsArgument);
  } else {
    return mergeObject(target, source, optionsArgument);
  }
}
//end

//to change keyNames in json object with spectial symbels
function iteratingObjectsAddSymbels(obj) {
  if (obj != null) {
    var propNames = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < propNames.length; i++) {
      var propName = propNames[i];
      if (typeof obj[propName] === "object") {
        if (Array.isArray(obj[propName])) {
          for (var j = 0; j < obj[propName].length; j++) {
            replaceKeyWithSpecialSymble(obj[propName][j]);
          }
        } else {
          replaceKeyWithSpecialSymble(obj[propName]);
        }
      } else {
        var key = propName;
        var value = obj[propName];
        addSymblesTokeyName(key, obj, value);
      }
    }
    return obj;
  }
}

function replaceKeyWithSpecialSymble(json) {
  var keys = Object.keys(json);
  for (var j = 0; j < keys.length; j++) {
    if (typeof json[keys[j]] === "string") {
      var key = keys[j];
      var value = json[key];
      addSymblesTokeyName(key, json, value);
    } else {
      iteratingObjectsAddSymbels(json[keys[j]]);
    }
  }

  return json;
}

function addSymblesTokeyName(key, json, value) {
  switch (key) {
    case "type":
      delete json[key];
      key = key.replace(key, "@" + key);
      json[key] = value;
      break;
    case "baseType":
      delete json[key];
      key = key.replace(key, "@" + key);
      json[key] = value;
      break;
    case "schemaLocation":
      delete json[key];
      key = key.replace(key, "@" + key);
      json[key] = value;
      break;
    case "referredType":
      delete json[key];
      key = key.replace(key, "@" + key);
      json[key] = value;
      break;
    default:
      break;
  }
}

//to change keyNames in json object without spectial symbels
function iteratingObjectsRemoveSymbels(obj) {
  if (obj != null) {
    var propNames = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < propNames.length; i++) {
      var propName = propNames[i];
      if (typeof obj[propName] === "object") {
        if (Array.isArray(obj[propName])) {
          for (var j = 0; j < obj[propName].length; j++) {
            replaceKeyWithoutSpecailSymbels(obj[propName][j]);
          }
        } else {
          replaceKeyWithoutSpecailSymbels(obj[propName]);
        }
      } else {
        var key = propName;
        var value = obj[propName];
        removeSymblesFromkeyName(key, obj, value);
      }
    }
    return obj;
  }
}
function replaceKeyWithoutSpecailSymbels(json) {
  //adding for ignore null value in GetByValue method
  if (json !== null) {
    var keys = Object.keys(json);
    for (var j = 0; j < keys.length; j++) {
      if (typeof json[keys[j]] === "string") {
        var key = keys[j];
        var value = json[key];
        removeSymblesFromkeyName(key, json, value);
      } else {
        iteratingObjectsRemoveSymbels(json[keys[j]]);
      }
    }
  }
  return json;
}

//removing '@' Symbel 
function replaceKeyWithoutSpecailSymbelsForParentAndChild(json) {
  var keys = Object.keys(json);
  var dataWithSymbles = ['@type', '@baseType', '@schemaLocation', '@referredType']
  var child_item = ['attachment', 'relatedParty', 'bundledResources']

  //if there is resourceSchema field
  if (!_.isEmpty(json.resourceSchema) && keys.includes('resourceSchema')) {
    //storing data of resourceSchema properties to specify keys and values
    var dataOfProperties = json.resourceSchema.properties;
    var keysOfProperties = Object.keys(dataOfProperties);
    var valuesOfProperties = Object.values(dataOfProperties);

    //removing '@' from keys of resourceSchema properties 
    for (var j = 0; j < keysOfProperties.length; j++) {
      if (dataWithSymbles.includes(keysOfProperties[j])) {
        var key = keysOfProperties[j];
        var value = valuesOfProperties[j];
        removeSymblesFromkeyName(key, dataOfProperties, value);
      }

      /*
      each item of 'child_item' has three property: 1.properties, 2.required, 3.type
      we need to remove '@' from properties/required
      in 'valuesOfProperties[j].items' we have three property of each item 'child_item' array
      */
      if (child_item.includes(keysOfProperties[j]) && JSON.stringify(valuesOfProperties[j].items).includes('properties')) {
        //specifying length of attachment/relatedParty/bundledResources
        var newProperties = valuesOfProperties[j].items;

        //length of attachment/relatedParty/bundledResources
        var len = newProperties.length;
        for (var counter = 0; counter < len; counter++) {

          var keysOfChildItem = Object.keys(newProperties[counter]);
          if (keysOfChildItem.includes('properties')) {

            var propertiesValues = Object.values(newProperties[counter].properties);
            var test = Object.keys(newProperties[counter].properties);


            for (var cont = 0; cont < test.length; cont++) {

              removeSymblesFromkeyName(test[cont], newProperties[counter].properties, propertiesValues[cont]);
            }

          }
          if (keysOfChildItem.includes('required')) {

            var requiredValues = Object.values(newProperties[counter].required);




            for (var k = 0; k < requiredValues.length; k++) {
              // removeSymblesFromkeyName(test1[cont], newProperties[counter].properties);
              if (dataWithSymbles.includes(requiredValues[k])) {
                var res = requiredValues[k].replace("@", "");
                requiredValues[k] = res;
              }
            }
            newProperties[counter].required = requiredValues;

          }

        }

        valuesOfProperties[j].items = newProperties;


      }
    }
  }

  return json;


}


//adding '@' Symbel
function addingKeyWithoutSpecailSymbelsForParentAndChild(json) {

  var keys = Object.keys(json);
  var dataWithSymbles = ['type', 'baseType', 'schemaLocation', 'referredType']
  var child_item = ['attachment', 'relatedParty', 'bundledResources']

  //if there is resourceSchema field
  if (!_.isEmpty(json.resourceSchema) && keys.includes('resourceSchema')) {
    //storing data of resourceSchema properties to specify keys and values
    var dataOfProperties = json.resourceSchema.properties;

    var keysOfProperties = Object.keys(dataOfProperties);
    var valuesOfProperties = Object.values(dataOfProperties);

    //removing '@' from keys of resourceSchema properties 
    for (var j = 0; j < keysOfProperties.length; j++) {
      if (dataWithSymbles.includes(keysOfProperties[j])) {
        var key = keysOfProperties[j];
        var value = valuesOfProperties[j];
        addSymblesTokeyName(key, dataOfProperties, value);
      }

      //each values of resourceSchema properties ,has separate keys and values 
      if (child_item.includes(keysOfProperties[j]) && JSON.stringify(valuesOfProperties[j].items).includes('properties')) {
        var finalResult = "";
        var itemsOfProperties = JSON.stringify(valuesOfProperties[j].items).slice(2, JSON.stringify(valuesOfProperties[j].items).length - 2);

        itemsOfProperties = '{' + itemsOfProperties + '}';
        var finalItemsOfProperties = JSON.parse(itemsOfProperties);

        var keys = Object.keys(finalItemsOfProperties);

        var indexOfPropertiesFieldInArray = keys.indexOf("properties");
        var indexOfRequiredFieldInArray = keys.indexOf("required");

        var values = Object.values(finalItemsOfProperties);
        var newPropertiesField = values[indexOfPropertiesFieldInArray];
        var key = Object.keys(newPropertiesField);
        var value = Object.values(newPropertiesField);

        for (var i = 0; i < key.length; i++) {
          addSymblesTokeyName(key[i], newPropertiesField, value[i]);
        }


        if (!_.isEmpty(values[indexOfRequiredFieldInArray])) {

          for (var k = 0; k < values[indexOfRequiredFieldInArray].length; k++) {
            if (dataWithSymbles.includes(values[indexOfRequiredFieldInArray][k])) {
              var res = values[indexOfRequiredFieldInArray][k].replace(values[indexOfRequiredFieldInArray][k], "@" + values[indexOfRequiredFieldInArray][k]);
              values[indexOfRequiredFieldInArray][k] = res;
            }
          }
        }
        var result = '';
        for (var i = 0; i < values.length; i++) {

          result += JSON.stringify(keys[i]) + ':' + JSON.stringify(values[i]);
          if (i !== values.length - 1) {
            result += ',';
          }

        }


        finalResult = '[{' + result + '}]';

        valuesOfProperties[j].items = JSON.parse(finalResult);
      }
    }
  }
  return json;

}



function removeSymblesFromkeyName(key, json, value) {
  switch (key) {
    case "@type":
      delete json[key];
      key = key.replace(key, key.slice(1));
      json[key] = value;
      break;
    case "@baseType":
      delete json[key];
      key = key.replace(key, key.slice(1));
      json[key] = value;
      break;
    case "@schemaLocation":
      delete json[key];
      key = key.replace(key, key.slice(1));
      json[key] = value;
      break;
    case "@referredType":
      delete json[key];
      key = key.replace(key, key.slice(1));
      json[key] = value;
      break;
    default:
      break;
  }
}
module.exports = {
  patchFormateJSON,
  deepmerge,
  replaceKeyWithSpecialSymble,
  replaceKeyWithoutSpecailSymbels,
  replaceKeyWithoutSpecailSymbelsForParentAndChild,
  addingKeyWithoutSpecailSymbelsForParentAndChild
};
