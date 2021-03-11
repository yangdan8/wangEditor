/**
 * @description embed html parse
 * @author wangfupeng
 */

import Editor from '../editor/index'
import HtmlParser, { IAttr } from '../lib/simplehtmlparser'
import { EMPTY_TAGS, getAttrValue, genStartHtml, genEndHtml } from '../lib/simplehtmlparser-helper'
import { genEmbedContainerHtml } from './container'
import { IEmbedConf } from './IEmbed'

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

/**
 * 根据 resultHtml tag attrs 获取 embed conf
 * @param tag tag
 * @param attrs attrs
 * @param editor editor
 */
function getEmbedConf(tag: string, attrs: IAttr[], editor: Editor): IEmbedConf | null {
    const embedConfList = editor.embed.getEmbedConfList()
    const filterArr = embedConfList.filter(conf => {
        return conf.isEmbedResultHtml(tag, attrs)
    })
    if (filterArr.length === 0) return null
    return filterArr[0]
}

/**
 * resultHtml --> renderHtml
 * @param resultHtml resultHtml
 */
export function resultHtml2RenderHtml(resultHtml: string, editor: Editor): string {
    let renderHtmlArr: string[] = []

    let embedConf: IEmbedConf | null
    let inEmbedFlag = 0 // 是否开始进入 embed 内部
    let embedHtmlArr: string[] = []

    const htmlParser = new HtmlParser()
    htmlParser.parse(resultHtml, {
        startElement(tag: string, attrs: IAttr[]) {
            // 命中 embed
            const conf = getEmbedConf(tag, attrs, editor)
            if (conf != null) {
                inEmbedFlag = 1 // 开始进入 embed 内部
                // 重新记录 embed 相关数据
                embedConf = conf
                embedHtmlArr = []
                embedHtmlArr.push(genStartHtml(tag, attrs))
                return
            }

            // 不是 embed
            if (inEmbedFlag === 0) {
                const html = genStartHtml(tag, attrs)
                renderHtmlArr.push(html)
                return
            }

            // embed 内部，继续深入一层。不拼接 html
            if (inEmbedFlag > 0 && EMPTY_TAGS.has(tag) === false) {
                embedHtmlArr.push(genStartHtml(tag, attrs))
                inEmbedFlag = inEmbedFlag + 1
            }
        },
        characters(str: string) {
            // 正常情况下，不是 embed ，则拼接
            if (inEmbedFlag === 0) {
                renderHtmlArr.push(str)
                return
            }

            if (inEmbedFlag > 0) {
                embedHtmlArr.push(str)
            }
        },
        endElement(tag: string) {
            // 正常情况下，不是 embed ，则拼接 html
            if (inEmbedFlag === 0) {
                const html = genEndHtml(tag)
                renderHtmlArr.push(html)
                return
            }

            // embed 的结尾
            if (inEmbedFlag === 1) {
                inEmbedFlag = 0 // 接下来回归非 embed 状态

                // 拼接完 embedHtml
                embedHtmlArr.push(genEndHtml(tag))
                const embedHtml = embedHtmlArr.join('')

                // 创建 embed 实例
                if (embedConf == null) return
                const key = embedConf.key
                const data = embedConf.getDataByResultHtml(embedHtml)
                const embed = editor.embed.createEmbedInstance(key, data)
                if (embed == null) return

                // 拼接 embed renderHtml
                const containerHtml = genEmbedContainerHtml(embed)
                renderHtmlArr.push(containerHtml)
                return
            }

            // embed 内部，减少一层。不拼接 html
            if (inEmbedFlag > 0) {
                embedHtmlArr.push(genEndHtml(tag))
                inEmbedFlag = inEmbedFlag - 1
            }
        },
        comment(str: string) {}, // 注释，不做处理
    })

    return renderHtmlArr.join('')
}
