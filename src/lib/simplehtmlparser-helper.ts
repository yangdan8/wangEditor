/**
 * @description htmlParser helpers
 * @author wangfupeng
 */

import { IAttr } from './simplehtmlparser'

// 没有子节点或文本的标签
export const EMPTY_TAGS = new Set([
    'area',
    'base',
    'basefont',
    'br',
    'col',
    'hr',
    'img',
    'input',
    'isindex',
    'embed',
])

/**
 * 获取 attr value
 * @param attrs attrs
 * @param name attr name
 */
export function getAttrValue(attrs: IAttr[], name: string): string {
    let value = ''
    const length = attrs.length
    for (let i = 0; i < length; i++) {
        const attr = attrs[i]
        if (attr.name === name) {
            value = attr.value
            break
        }
    }
    return value
}

/**
 * 为 tag 生成 html 字符串，开始部分
 * @param tag tag
 * @param attrs 属性
 */
export function genStartHtml(tag: string, attrs: IAttr[]): string {
    let result = ''

    // tag < 符号
    result = `<${tag}`

    // 拼接属性
    let attrStrArr: string[] = []
    attrs.forEach((attr: IAttr) => {
        attrStrArr.push(`${attr.name}="${attr.value}"`)
    })
    if (attrStrArr.length > 0) {
        result = result + ' ' + attrStrArr.join(' ')
    }

    // tag > 符号
    const isEmpty = EMPTY_TAGS.has(tag) // 没有子节点或文本的标签，如 img
    result = result + (isEmpty ? '/' : '') + '>'

    return result
}

/**
 * 为 tag 生成 html 字符串，结尾部分
 * @param tag tag
 */
export function genEndHtml(tag: string) {
    return `</${tag}>`
}
