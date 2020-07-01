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
    const jsonResponse: string = xml2js.xml2json(xml, {compact: true, spaces: 4, ignoreAttributes });
    return jsonResponse;
  }

  public findValueInXml(xml: string, valueToFind: string): any {
    const json: string = this.xml2Json(xml, true);
    if (isNullOrUndefined(json)) {
      return null;
    }

    return _.get(JSON.parse(json), `${ valueToFind }._text`);
  }
}
