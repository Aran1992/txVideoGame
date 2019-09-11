######导入模块#####
from xml.etree import ElementTree as et;
import json
import glob
import sys
import os

######变量#######
XmlDataPath = sys.argv[1]  # XML表路径 修改项
XmlActivityDataPath = XmlDataPath+'activity\\' #Activity单独整理到一个路径内
if sys.platform.startswith('linux'):
	XmlActivityDataPath = XmlDataPath+'activity/' #Activity单独整理到一个路径内
	
OntJsonPath = sys.argv[2]  # Json的输出路径
OutTsPath = sys.argv[3]  # TS的输出路径

ModelMangerClass = "JsonModelManager"  # 数据结构管理类名称
ModelBaseClass = 'ModelJsonBase'  # 数据结构父类名称

allDict = {};


# 判断是不是可以转成数字类型
def is_number(number):
    try:
        int(number)
    except ValueError:
        return False
    return True


# 从xml文件读取结点 转换为json格式，并保存到文件中
def xml_to_json(file_name, dataPath):
    # print('read node from xmlfile, transfer them to json, and save into jsonFile:')
    f = open("{}{}.json".format(OntJsonPath, file_name), 'w', encoding="utf8")
    f.write('[')
    root = et.parse("{}{}.xml".format(dataPath, file_name));
    index = 0
    for each in root.getroot():
        if index > 0:
            f.write(",")
        tempDict = each.attrib
        for childNode in each.getchildren():
            tempDict[childNode.tag] = childNode.text
        tempJson = json.dumps(tempDict, ensure_ascii=False)
        # print(tempJson)
        f.write(tempJson)
        index = index + 1

    f.write(']')
    f.close()


def xml_to_json_map(file_name, auto, dataPath):
    print('read node from xmlfile, transfer them to json, and save into jsonFile:')
    f = open("{}{}.json".format(OntJsonPath, file_name), 'w', encoding="utf8")
    root = et.parse("{}{}.xml".format(dataPath, file_name));
    index = 0
    tempDict = {};
    for each in root.getroot():
        if auto == '1':
            tempDict[each.get('id')] = each.attrib
        else:
            tempDict[index] = each.attrib
        index = index + 1
    tempJson = json.dumps(tempDict, ensure_ascii=False)
    # print(tempJson)
    # f.write(tempJson)
    # f.close()
    # allDict[file_name] = tempDict
    tempJson = json.dumps(tempDict, ensure_ascii=False)
    f.write(tempJson)
    f.close()

def xml_to_json_all():
    f = open("{}config.json".format(OntJsonPath), 'w', encoding="utf8")
    tempJson = json.dumps(allDict, ensure_ascii=False)
    f.write(tempJson)
    f.close()

# XML转换JSON结束

##前端转换JSON数据表脚本
model_manager = open("{}{}.ts".format(OutTsPath, ModelMangerClass), 'w', encoding="utf8")  # 生成一个管理类TS脚本


# 生成数据结构 读取方法
# 生成DICT
# 如果没有发现ID字段则用数组索引做Key值
# 发现groupID 字典中套字典 或 二维Array
def create_base(json_name):
    modelName = 'Model' + json_name;
    dictName = '_model{json}Dict'.format(json=json_name)
    model_manager.write('\n\t' + 'private {dict};'.format(dict=dictName) + "\n")
    model_manager.write('\t' + 'public get' + modelName + '(): any {' + "\n")
    model_manager.write('\t\t' + 'if (!this.{dict}) {'.replace("{dict}", dictName) + "\n")
    model_manager.write('\t\t\t' + 'this.' + dictName + ' = {};' + "\n")
    model_manager.write('\t\t\t' + 'var json = Tool.readZipToJson("{json}.json");'.replace('{json}', json_name) + "\n")
    model_manager.write('\t\t\t' + 'var groupID:string = ModelManager.getInstance().JOSN_GID["{json}"];'.replace('{json}', json_name) + "\n")
    model_manager.write('\t\t\t' + 'this.Length["{json}"] = groupID ? {} : 0;'.replace('{json}', json_name) + "\n")
    model_manager.write('\t\t\t' + '''var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: ${model} = new ${model}(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this.${dict}[model[groupID]]) {
                        this.${dict}[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this.${dict}[model[groupID]][_dictKey] = model;
					this.Length['${json}'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this.${dict}[_dictKey] = model;
                    _Idx++;
					this.Length['${json}'] = _Idx;
                }
            }
        }
        return this.${dict};
    }'''.replace('${model}', modelName).replace('${dict}', dictName).replace('${json}', json_name) + "\n")


# 读取JSON数据结构并生成对应的TS脚本

def json_to_TSmodel(json_name):
    modelName = 'Model' + json_name
    ts_model_file = open("{}{}.ts".format(OutTsPath, modelName), 'w', encoding="utf8")  # 生成一个管理类TS脚本

    model_class_str = '''/**
* LYJ.2017.11.1
* @数据结构文件
* 自动生成请勿修改；
*/''' + '\n' + r'class #CLASS extends #BASECLASS {' + '\n\n\t' + 'public constructor(json) { super(json); }'
    ts_model_file.write(model_class_str.replace('#CLASS', modelName).replace('#BASECLASS', ModelBaseClass))

    json_file = open(OntJsonPath + json_name + ".json", 'r', encoding='utf8')
    jsonStr = json.loads(json_file.read())[0]
    for key in jsonStr:
        if key == 'id' or key == 'ID' or key == 'Id' or key == "cost" or key == "consume" or key == "costOneKey" or key == "rewards" or key == "reward" or key == "shuxing":
            continue
        if is_number(jsonStr[key]):
            datatype = 'number'
            return_param = 'return parseFloat(this._json["${key}"])'.replace('${key}', key)
        else:
            datatype = 'string'
            return_param = 'if (this._json["${key}"] == "*") { return ""; }'+'\n\t\t'+'return this._json["${key}"]'
            return_param = return_param.replace('${key}', key)

        ts_model_file.write('\n\n\t' + '''private _${key};
	public set ${key}(value){
		this._${key} = value;
	}
	public get ${key}():${datatype}{
		${return};
	}'''.replace('${return}', return_param).replace('${datatype}', datatype).replace('${key}', key))

    ts_model_file.write('\n\n' + '}')
    ts_model_file.close()


def gen(dataPath):
	print('开始解析目录'+dataPath)
	for filename in glob.glob(r'{}*.xml'.format(dataPath)):
	    print('开始读取'+ filename)
	    jsonName = filename.replace('{}'.format(dataPath), "")
	    jsonName = jsonName.replace('.xml', "")
	    xml_to_json(jsonName, dataPath)
	    if not filename.endswith('fighter.xml') and not filename.endswith('mount0.xml') and not filename.endswith('mount1.xml')\
	            and not filename.endswith('mount2.xml') and not filename.endswith('mount3.xml') and not filename.endswith('mount4.xml'):
	    	create_base(jsonName)  # 创建数据管理类
	    if not filename.endswith('mount0.xml') and not filename.endswith('mount1.xml')\
	            and not filename.endswith('mount2.xml') and not filename.endswith('mount3.xml') and not filename.endswith('mount4.xml'):
	        json_to_TSmodel(jsonName)
	    if filename.endswith('fighter.xml') or filename.endswith('mount0.xml') or filename.endswith('mount1.xml')\
	            or filename.endswith('mount2.xml') or filename.endswith('mount3.xml') or filename.endswith('mount4.xml'):
	        xml_to_json_map(jsonName, '1', dataPath)
	    else:
	        xml_to_json_map(jsonName, '0', dataPath)
	    print(filename + '.json生成成功！')

########## 数据结构管理类 （类头）TS脚本
model_manager.write('''/**
* LYJ.2017.11.1
* @数据结构存储管理类
* 注：自动生成请勿修改；
*     配置ID自动为Key值，否则按照数组索引当Key
*     如果需要二级嵌套结构如二维数组，请策划配置上groupID字段
*/''' + '\n' + r'class #CLASS {'.replace("#CLASS",
                                         ModelMangerClass) + '\n\t' + 'private static _instance: #CLASS;'.replace(
    "#CLASS", ModelMangerClass) + '\n\n\t' + 'public constructor() { }' + '\n\n')

model_manager.write("\t" + 'public static get instance(): #CLASS {'.replace("#CLASS", ModelMangerClass) + '\n')
model_manager.write(
    "\t\t" + 'if (this._instance == null) {' + '\n\t\t\t' + 'this._instance = new #CLASS();'.replace("#CLASS",
                                                                                                     ModelMangerClass) + '\n\t\t' + '}' + '\n')
model_manager.write("\t\t" + 'return this._instance;' + '\n\t' + '}' + "\n\n")

model_manager.write("\t" + 'public Length = {};' + "\n")
# 1.将XML转换成JSON
# 2.生成一个Model管理类Ts脚本
# 3.生成每个JSON对应的Ts类

gen(XmlDataPath)
gen(XmlActivityDataPath)

# xml_to_json_all()
# print('config.json生成成功！')

########## 数据结构管理类 （类结尾）TS脚本
model_manager.write('\n' + '}')
model_manager.close()
##导出文件结束####
