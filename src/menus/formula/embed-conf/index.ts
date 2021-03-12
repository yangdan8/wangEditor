/**
 * @description formula embed conf
 * @author wangfupeng
 */

import { IEmbedConf, IEmbed } from '../../../embed/IEmbed'
import { EMBED_KEY } from './const'
import { DomElement } from '../../../utils/dom-core'
import FormulaEmbed from './Formula-Embed'

/**
 * 判断 elem 是否符合 formula
 * @param $elem elem
 */
function isEmbedElem($elem: DomElement): boolean {
    // 判断 elem 是否符合 'span[data-embed-key="formula"]'
    const nodeName = $elem.getNodeName().toLowerCase()
    if (nodeName === 'span') {
        if ($elem.attr('data-embed-key') === EMBED_KEY) {
            return true
        }
    }

    return false
}

/**
 * 根据 $elem 获取 embed data
 * @param $elem elem
 */
function getDataFromElem($elem: DomElement): any {
    const data = $elem.attr('data-embed-value')
    return data || ''
}

/**
 * 创建 embed 实例
 * @param data data
 * @returns embed instance
 */
function createEmbedInstance(data: any): IEmbed {
    return new FormulaEmbed(data)
}

/**
 * 创建 embed conf
 * @returns embed conf
 */
function createEmbedConf(): IEmbedConf {
    return {
        key: EMBED_KEY,
        isEmbedElem,
        getDataFromElem,
        createEmbedInstance,
    }
}

export default createEmbedConf
