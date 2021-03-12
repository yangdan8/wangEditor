/**
 * @description code embed conf
 * @author wangfupeng
 */

import { IEmbedConf, IEmbed } from '../../../embed/IEmbed'
import { EMBED_KEY } from './const'
import { DomElement } from '../../../utils/dom-core'
import CodeEmbed from './Code-Embed'

/**
 * 判断 elem 是否符合 formula 的 result html
 * @param $elem elem
 */
function isEmbedElem($elem: DomElement): boolean {
    // 代码块的 resultHtml 是 '<pre><code>xxxx</code></pre>'
    const nodeName = $elem.getNodeName().toLowerCase()
    if (nodeName === 'pre') return true
    return false
}

/**
 * 根据 resultHtml 获取 data 。要和 genResultHtml() 对应好
 * @param $elem elem
 */
function getDataFromElem($elem: DomElement): any {
    return $elem.text()
}

/**
 * 创建 embed 实例
 * @param data data
 * @returns embed instance
 */
function createEmbedInstance(data: any): IEmbed {
    return new CodeEmbed(data)
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
