import * as fs from "fs";
import { readFile, appendFile, rm } from "fs/promises";
const filtersignal = (data: string) => data.replace(/\n/g, "%n");
const langitem = (type: string, id: string, title: string, desc: string) => {
  // console.log('type',type,id,title,desc);

  return {
    value:
      `# ${type} ${id} \n` +
      `nomifactory.quest.${type}.${id}.title=${title}\n` +
      `nomifactory.quest.${type}.${id}.desc=${filtersignal(desc)}`,
    title: title,
    desc: desc,
    id: id,
  };
};
async function loaddefaultbqjson(path = "./old_zh_cn.json") {
  let defaultbq: string;
  try {
    defaultbq = (await readFile(path)).toString();
    return defaultbq;
  } catch (err) {
    return "";
  }
}
async function save(dbitems: Array<any>, lineitems: Array<any>) {
  await rm("./zh_cn.lang");
  lineitems.forEach(async (item) => {
    await appendFile("./zh_cn.lang", item.value + "\n\n");
  });
  dbitems.forEach(async (item) => {
    await appendFile("./zh_cn.lang", item.value + "\n\n");
  });
}

async function main() {
  let questDatabase = new Map();
  let lineDatabase = new Map();
  let dblangitems = new Array<any>();
  let linelangitems = new Array<any>();
  try {
    let defaultbq = await loaddefaultbqjson();
    let jsonbq = JSON.parse(defaultbq);
    let jsonquestDatabase = jsonbq["questDatabase:9"];
    let jsonlineDatabase = jsonbq["questLines:9"];
    Object.keys(jsonquestDatabase).forEach((item) => {
      questDatabase.set(
        jsonquestDatabase[item]["questID:3"],
        jsonquestDatabase[item]
      );
    });
    Object.keys(jsonlineDatabase).forEach((item) => {
      lineDatabase.set(
        jsonlineDatabase[item]["lineID:3"],
        jsonlineDatabase[item]
      );
      console.log(jsonlineDatabase[item]["lineID:3"], lineDatabase.size);
    });
    questDatabase.forEach((value, key) => {
      let title = value["properties:10"]["betterquesting:10"]["name:8"];
      let desc = value["properties:10"]["betterquesting:10"]["desc:8"];
      dblangitems.push(langitem("db", key, title, desc));
    });
    console.log(lineDatabase.size);
    lineDatabase.forEach((value, key) => {
      let title = value["properties:10"]["betterquesting:10"]["name:8"];
      let desc = value["properties:10"]["betterquesting:10"]["desc:8"];
      linelangitems.push(langitem("line", key, title, desc));
    });
    console.log(lineDatabase.size);
    dblangitems.sort((itema,itemb)=>{
      return parseInt(itema.id)-parseInt(itemb.id)> 0 ? itema:itemb
    })
    save( dblangitems.filter((item) => item.desc != ''), linelangitems);
  } catch (e) {
    console.log(e);
  }
}

console.log("hello world");

main();
