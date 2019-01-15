/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */


const dictionaries = [
  'secrets',
  'strain_action_roots',
  'strain_owners',
  'strain_refs',
  'strain_repos',
  'strain_root_paths',
  'strain_github_static_repos',
  'strain_github_static_owners',
  'strain_github_static_refs',
  'strain_github_static_root',
  'strain_index_files',
  'strain_allow',
  'strain_deny',
];

async function init(fastly, version) {
  return Promise.all(dictionaries.map(dictionary => fastly.writeDictionary(
    version,
    dictionary,
    true,
  )));
}

async function updatestrains(fastly, version, strains) {
  const runtimestrains = strains.getRuntimeStrains();
  const updates = runtimestrains.reduce((p, strain) => {
    p.push(fastly.writeDictValue(version, 'strain_action_roots', strain.name, strain.code));

    p.push(fastly.writeDictValue(version, 'strain_owners', strain.name, strain.content.owner));
    p.push(fastly.writeDictValue(version, 'strain_refs', strain.name, strain.content.ref));
    p.push(fastly.writeDictValue(version, 'strain_repos', strain.name, strain.owner.repo));
    p.push(fastly.writeDictValue(version, 'strain_root_paths', strain.name, strain.owner.path));

    p.push(fastly.writeDictValue(version, 'strain_github_static_repos', strain.name, strain.static.repo));
    p.push(fastly.writeDictValue(version, 'strain_github_static_owners', strain.name, strain.static.owner));
    p.push(fastly.writeDictValue(version, 'strain_github_static_refs', strain.name, strain.static.ref));
    p.push(fastly.writeDictValue(version, 'strain_github_static_root', strain.name, strain.static.path));
    p.push(fastly.writeDictValue(version, 'strain_allow', strain.name, strain.static.allow));
    p.push(fastly.writeDictValue(version, 'strain_deny', strain.name, strain.static.deny));

    return p;
  });

  return Promise.all(updates);
}

module.exports = {
  init, updatestrains,
};