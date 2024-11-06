"use strict";

exports.__esModule = true;
exports.findRelativePath = findRelativePath;
exports.getFileName = getFileName;
exports.makeScriptObject = makeScriptObject;
exports.replaceFields = replaceFields;
var _versions = require("./versions.js");
var _cidtools = require("./cidtools.js");
var _helpers = require("./helpers.js");
// Replaces fields in a previous version with new information, iff newInfo has the same fields
// Is recursive and requires the inputs to have corresponding structure
function replaceFields(previousVersion, newInfo) {
  // Create a deep copy of previousVersion
  let newVersion = JSON.parse(JSON.stringify(previousVersion));

  // Recursive function to update the fields
  function recursiveReplace(prevObj, newObj) {
    for (const key in newObj) {
      if (newObj.hasOwnProperty(key)) {
        // If the value is an object and the key exists in both objects, recurse
        if (typeof newObj[key] === 'object' && newObj[key] !== null && prevObj.hasOwnProperty(key)) {
          recursiveReplace(prevObj[key], newObj[key]);
        } else {
          // Otherwise, replace the value
          prevObj[key] = newObj[key];
        }
      }
    }
  }

  // Perform the replacement
  recursiveReplace(newVersion, newInfo);
  return newVersion;
}

// scriptInfo has the form of a script object, but may have fields missing
// To get a minimal version of a script object with name myName, use:
// {scriptInfo: {script_content: {name: myName}}, increment:null, branch:'main', previous:null}
async function makeScriptObject({
  scriptInfo,
  increment,
  branch,
  previous
}) {
  // console.log(scriptInfo)

  if (!scriptInfo.script_content) {
    scriptInfo.script_content = {};
  }
  if (!scriptInfo.script_content.git_info) {
    scriptInfo.script_content.git_info = {};
  }

  // Construct a default, empty previous version
  let previousVersion = {
    script_content: {
      name: null,
      script_id: null,
      inputs: [],
      outputs: [],
      functions: [],
      connections: [],
      git_info: {
        commit_hash: null,
        diffs: [],
        remote_url: null,
        repo_name: null,
        branch_name: null,
        commit_message: null,
        commit_author: null,
        commit_date: null
      },
      script_path: null,
      entry_point: null,
      execution_method: null,
      execution_params: null,
      environment: null,
      environment_params: null,
      resource_type: 'script',
      protocol_name: 'poplar.network',
      protocol_version: '1.0.1',
      description: null,
      preview_image: {
        img_cid: null,
        mime_type: ''
      },
      author: [],
      timestamp: null
    },
    script_content_string: null,
    cid: null,
    version: {
      major: 0,
      minor: 0,
      patch: 0,
      branch: 'main',
      previous: []
    },
    provenance: [],
    local_path: null,
    increment: 'minor'
  };

  // If we can find a previous version, update from the empty one
  if (previous) {
    previousVersion = previous;
    console.log("Previous version passed to function: ", previous);
  }

  // Now for every field in scriptInfo, replace that field in previousVersion
  console.log("Previous version: ", previousVersion);
  console.log("Script info: ", scriptInfo);
  let newVersion = replaceFields(previousVersion, scriptInfo);

  // Try to find the relative path based on the repo name and local path
  if (newVersion.local_path && newVersion.script_content.git_info.repo_name) {
    newVersion.script_content.script_path = findRelativePath(newVersion.local_path, scriptInfo.script_content.git_info.repo_name);
  }
  if (newVersion.local_path) {
    // If we don't have a name or id, derive them
    if (!newVersion.script_content.name) {
      newVersion.script_content.name = getFileName(newVersion.local_path, true);
      console.log("Deriving name from local path: ", getFileName(newVersion.local_path, true));
    } else {
      console.log("Name provided: ", newVersion.script_content.name);
    }

    // Fill in default entry point and execution method if not provided
    const filename = getFileName(newVersion.local_path, true);
    if (!newVersion.script_content.entry_point && filename.includes('.py')) {
      newVersion.script_content.entry_point = 'python ' + filename;
    }
    if (!newVersion.script_content.execution_method) {
      newVersion.script_content.execution_method = 'child_process';
    }
  }

  // If we have a name but not an id, derive an id
  if (newVersion.script_content.name && !newVersion.script_content.script_id) {
    newVersion.script_content.script_id = '#sc_' + (0, _helpers.processString)(newVersion.script_content.name) + '_' + (0, _helpers.generateRandomString)(8);
  }

  // Figure out the new version
  if (!branch) {
    branch = 'main';
  }
  ;
  if (!previous) {
    increment = 'major';
  }
  ;
  if (increment) {
    newVersion.version = (0, _versions.updateVersion)(newVersion.version, increment, branch, [previous]);
  }

  // Fill in the time if that is empty
  if (!newVersion.script_content.timestamp) {
    newVersion.script_content.timestamp = Date.now();
  }

  // Recalculate the CID and store data, since this will be wrong if we found a previous version
  newVersion.script_content_string = JSON.stringify(newVersion.script_content);
  newVersion.cid = await (0, _cidtools.getCID)(newVersion.script_content_string);
  return newVersion;
}
;
function findRelativePath(filePath, folderName) {
  // Split the file path into parts based on the system-specific path separator
  const pathParts = filePath.split('/');

  // Find the index of the folderName in the path parts
  const folderIndex = pathParts.indexOf(folderName);

  // If folderName is not found, return null or handle the error
  if (folderIndex === -1) {
    return null;
  }

  // Reconstruct the relative path from the folderName onward
  const relativePath = pathParts.slice(folderIndex).join('/');
  return relativePath;
}
function getFileName(filePath, extension = false) {
  // Extract the file name from the path
  const fileNameWithExtension = filePath.split('/').pop();
  if (extension) {
    // If extension should be included, return the file name with the extension
    return fileNameWithExtension;
  } else {
    // Remove the extension from the file name
    const fileName = fileNameWithExtension.split('.').slice(0, -1).join('.');
    return fileName;
  }
}