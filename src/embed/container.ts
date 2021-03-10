/**
 * @description 生成 embed element
 * @author wangfupeng
 */

import $, { DomElement } from '../utils/dom-core'
import { IEmbed } from './IEmbed'

/**
 * 生成 container html
 * @param embedInstance embed 实例
 * @returns html
 */
export function genEmbedContainerHtml(embedInstance: IEmbed): string {
    const id = embedInstance.id
    const contentHtml = embedInstance.getRenderHtml()

    // block
    let tag = 'div'
    let className = 'we-embed-card-block'
    // inline
    if (embedInstance.isBlock === false) {
        tag = 'span'
        className = 'we-embed-card-inline'
    }

    const containerHtml = `<${tag} id="${id}" data-we-embed-card class="${className}" contenteditable="false">
                            ${contentHtml}
                        </${tag}>`

    return containerHtml
}

/**
 * 生成 container elem
 * @param embedInstance embed 实例
 * @returns elem
 */
export function genEmbedContainerElem(embedInstance: IEmbed): DomElement {
    const containerHtml = genEmbedContainerHtml(embedInstance)
    const $container = $(containerHtml)
    return $container
}

/**
 * 绑定事件
 */
export function bindEvent(): void {
    console.log('绑定 embed container 事件。注意，要用委托，因为 embed 是动态的')
}
