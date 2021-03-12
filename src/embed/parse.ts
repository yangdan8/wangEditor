/**
 * @description embed html parse
 * @author wangfupeng
 */

import Editor from '../editor/index'
import HtmlParser, { IAttr } from '../lib/simplehtmlparser'
import { EMPTY_TAGS, getAttrValue, genStartHtml, genEndHtml } from '../lib/simplehtmlparser-helper'
// import { IEmbedConf } from './IEmbed'

/**
 * 是否有符合 embed 的属性 data-we-embed-card
 * @param attrs attrs
 * @returns true/false
 */
function hasEmbedMarkAttr(attrs: IAttr[]): boolean {
    return attrs.some((item: IAttr) => {
        if (item.name === 'data-we-embed-card') return true
        return false
    })
}

/**
 * renderHtml --> resultHtml
 * @param renderHtml renderHtml
 * @param editor editor
 */
export function renderHtml2ResultHtml(renderHtml: string, editor: Editor): string {
    let resultHtmlArr: string[] = []

    let inEmbedFlag = 0 // 是否开始进入 embed 内部

    const htmlParser = new HtmlParser()
    htmlParser.parse(renderHtml, {
        startElement(tag: string, attrs: IAttr[]) {
            const idEmbed = hasEmbedMarkAttr(attrs)
            if (idEmbed) {
                // 开始进入 embed
                inEmbedFlag = inEmbedFlag + 1

                // 获取 embed 实例，获取 resultHtml ，并拼接
                const embedId = getAttrValue(attrs, 'id')
                const embedInstance = editor.embed.getEmbedInstance(embedId)
                if (embedInstance == null) return
                const resultHtml = embedInstance.genResultHtml()
                resultHtmlArr.push(resultHtml)
                return
            }

            // 正常情况下，不是 embed ，则拼接 html
            if (inEmbedFlag === 0) {
                const html = genStartHtml(tag, attrs)
                resultHtmlArr.push(html)
                return
            }

            // embed 内部，继续深入一层。不拼接 html
            if (inEmbedFlag > 0 && EMPTY_TAGS.has(tag) === false) {
                inEmbedFlag = inEmbedFlag + 1
            }
        },
        characters(str: string) {
            // 正常情况下，不是 embed ，则拼接
            if (inEmbedFlag === 0) {
                resultHtmlArr.push(str)
            }
        },
        endElement(tag: string) {
            // 正常情况下，不是 embed ，则拼接 html
            if (inEmbedFlag === 0) {
                const html = genEndHtml(tag)
                resultHtmlArr.push(html)
            }

            // embed 内部，减少一层。不拼接 html
            if (inEmbedFlag > 0) inEmbedFlag = inEmbedFlag - 1
        },
        comment(str: string) {}, // 注释，不做处理
    })

    return resultHtmlArr.join('')
}
