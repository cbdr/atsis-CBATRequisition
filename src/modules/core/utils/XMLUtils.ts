import { injectable } from 'inversify';
import ObjectUtils from './ObjectUtils';
import * as xml2js from 'xml-js';
import * as xmlReader from 'xml-reader';
import * as xmlQuery from 'xml-query';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';

@injectable()
export default class XMLUtils {
  public constructor(private objUtils: ObjectUtils) {
  }

  public parseXML(xmlResponse: any): any {
    if (this.objUtils.isNull(xmlResponse)) {
      return null;
    }
    const parsedXml: any = xmlReader.parseSync(xmlResponse);
    return parsedXml;
  }

  public xmlQuery(parseXML: any): any {
    if (this.objUtils.isNull(parseXML)) {
      return null;
    }
    const resultsTag: any = xmlQuery(parseXML).find('string').text().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    return resultsTag;
  }

  public xml2Json(xml: string, ignoreAttributes: boolean = false): any {
    if (this.objUtils.isNull(xml) || this.objUtils.isEmptyString(xml)) {
      return null;
    }
    const jsonResponse: string = xml2js.xml2json(xml, { compact: true, spaces: 4, ignoreAttributes });
    return jsonResponse;
  }

  public findValueInXml(xml: string, valueToFind: string): any {
    const json: string = this.xml2Json(xml, true);
    if (isNullOrUndefined(json)) {
      return null;
    }

    return _.get(JSON.parse(json), `${valueToFind}._text`);
  }

  public customizedXmlFormat(xmlFile:any) {
    var result;
    try {
      result = JSON.parse(xml2js.xml2json(xmlFile, { compact: true }));
    } catch (e) {
      return "error in converting";
    }

    //let result_p = _.get(result, 'root.result', {});
    if (_.get(result, 'root.result', false)) {
      result.root.result = this.parseResult(_.get(result, 'root.result', {}));
    }
    return result;
  }

  public parseResult(parse_res:any):any {
    if (Array.isArray(parse_res)) {
      parse_res = parse_res[0];
    }
    if (parse_res && parse_res.item && parse_res.item.constructor.name == "Object") {
      let itemObj = parse_res.item;
      parse_res.item = [];
      parse_res.item.push(itemObj);
    }
    return parse_res;
  }
}
