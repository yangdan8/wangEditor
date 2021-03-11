/**
 * @description code embed conf
 * @author wangfupeng
 */

import { IEmbedConf, IEmbed } from '../../../embed/IEmbed'
import { EMBED_KEY } from './const'
import { IAttr } from '../../../lib/simplehtmlparser'
import $ from '../../../utils/dom-core'
import CodeEmbed from './Code-Embed'

/**
 * 判断 elem 是否符合 formula 的 result html
 * @param tag html tag
 * @param attrs elem attrs
 */
function isEmbedResultHtml(tag: string, attrs: IAttr[]): boolean {
    // 代码块的 resultHtml 是 '<pre><code>xxxx</code></pre>'
    if (tag === 'pre') return true
    return false
}

/**
 * 根据 resultHtml 获取 data 。要和 genResultHtml() 对应好
 * @param resultHtml resultHtml
 */
function getDataByResultHtml(resultHtml: string): any {
    const $elem = $(resultHtml)
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
        isEmbedResultHtml,
        getDataByResultHtml,
        createEmbedInstance,
    }
}

export default createEmbedConf
