/**
 * @description code embed conf
 * @author wangfupeng
 */

import { IEmbedConf, IEmbed } from '../../../embed/IEmbed'
import { EMBED_KEY, DEFAULT_LANG } from './const'
import { DomElement } from '../../../utils/dom-core'
import CodeEmbed from './Code-Embed'
import { IData } from './IData'

/**
 * 获取的 pre 下级元素 code
 * @param $pre pre elem
 */
function getCodeElem($pre: DomElement): DomElement | null {
    const $children = $pre.children()
    if ($children == null || $children.length === 0) return null

    const $code = $children.get(0)
    const nodeName = $code.getNodeName().toLowerCase()
    if (nodeName !== 'code') return null

    return $code
}

/**
 * 判断 elem 是否符合 formula 的 result html
 * @param $pre pre elem
 */
function isEmbedElem($pre: DomElement): boolean {
    // 代码块的 resultHtml 是 '<pre><code>xxxx</code></pre>'

    const nodeName = $pre.getNodeName().toLowerCase()
    if (nodeName !== 'pre') return false

    const $code = getCodeElem($pre)
    if ($code == null) return false

    return true
}

/**
 * 根据 resultHtml 获取 data 。要和 genResultHtml() 对应好
 * @param $pre pre elem
 */
function getDataFromElem($pre: DomElement): IData {
    const $code = getCodeElem($pre)
    if ($code == null) {
        return {
            code: '',
            lang: DEFAULT_LANG,
        }
    }
    return {
        code: $code.text(),
        lang: $code.attr('class') || DEFAULT_LANG,
    }
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
